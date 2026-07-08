// ── Tool Registry ─────────────────────────────────────────────────────────
// Sprint 29 T9 — PRD §4.4, Conversation OS §8. REGISTRY ONLY: declares what
// tools exist, who may call them, and how they behave operationally. Zero
// business logic — implementations are handlers injected into the execution
// engine (T10) at app wiring time.
//
// Provider-agnostic + MCP-ready by construction: inputSchema/outputSchema are
// plain JSON Schema; toToolDefinitions() feeds Anthropic native tool-calling
// via ai-gateway, toMcpTools() feeds a future MCP server (Sprint 33 T30) —
// same specs, two projections, no translation layer.

/** Mirrors ai_agent_profile (migration 0021). */
export type ToolProfile = "borrower" | "dsa" | "sales" | "credit" | "operations" | "founder";

export type ToolCategory =
  | "credit"
  | "match"
  | "lenders"
  | "crm"
  | "application"
  | "documents"
  | "knowledge"
  | "notification"
  | "analytics"
  | "metrics"
  | "external";

export type JsonSchema = Record<string, unknown>;

export interface RetryPolicy {
  maxRetries: number;
  /** Base backoff in ms, doubled per attempt. */
  backoffMs: number;
}

export interface AuditPolicy {
  /** Log the (redacted) argument object, or names-only. Results are never logged (metadata-only rule, T4). */
  logArgs: "redacted" | "names_only";
}

export interface ToolSpec {
  /** Stable id, dot-namespaced — also the MCP tool name. */
  id: string;
  /** Human-readable display name. */
  name: string;
  category: ToolCategory;
  description: string;
  inputSchema: JsonSchema;
  outputSchema: JsonSchema;
  /** Profiles allowed to invoke — enforced server-side by the engine (T10), never by prompt. */
  permissions: ToolProfile[];
  timeoutMs: number;
  retry: RetryPolicy;
  audit: AuditPolicy;
  /** Writes require a human-confirmed card (UX §3.13); the model never executes them. */
  kind: "read" | "confirmed_write";
  /**
   * placeholder = vendor/dependency not live (Conversation OS §9): registered
   * so schemas/permissions are designed now, but the engine refuses execution.
   */
  status: "active" | "placeholder";
}

const NO_RETRY: RetryPolicy = { maxRetries: 0, backoffMs: 0 };
const READ_RETRY: RetryPolicy = { maxRetries: 2, backoffMs: 250 };
const AUDIT_DEFAULT: AuditPolicy = { logArgs: "names_only" };

const obj = (properties: Record<string, unknown>, required: string[] = []): JsonSchema => ({
  type: "object",
  properties,
  required,
  additionalProperties: false,
});

// ── Specs (Conversation OS §8 tool table) ────────────────────────────────────
const SPECS: ToolSpec[] = [
  // LeapScore / credit intelligence
  {
    id: "credit.get_leapscore",
    name: "Get LeapScore",
    category: "credit",
    description: "Fetch the user's current LeapScore with band and delta. Grounded in the latest computed snapshot.",
    inputSchema: obj({}),
    outputSchema: obj({ score: { type: "integer" }, band: { type: "string" }, delta: { type: "integer" }, computed_at: { type: "string" } }, ["score", "band"]),
    permissions: ["borrower", "dsa", "credit", "founder"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "credit.explain_factors",
    name: "Explain Score Factors",
    category: "credit",
    description: "List the factors driving the user's LeapScore with weights and impact direction.",
    inputSchema: obj({}),
    outputSchema: obj({ factors: { type: "array" } }, ["factors"]),
    permissions: ["borrower", "credit"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "credit.get_report",
    name: "Get Bureau Report",
    category: "credit",
    description: "Fetch the user's consented bureau report summary (accounts, inquiries, DPD).",
    inputSchema: obj({ bureau: { type: "string", enum: ["cibil", "experian", "crif", "equifax"] } }),
    outputSchema: obj({ bureau: { type: "string" }, score: { type: "integer" }, accounts: { type: "array" } }, ["bureau"]),
    permissions: ["borrower", "credit"],
    timeoutMs: 10_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  // LeapMatch
  {
    id: "match.get_matches",
    name: "Run LeapMatch",
    category: "match",
    description: "Rank lenders for the user's requirement with approval odds. Fit-ordered, never commission-ordered (RBI DLG).",
    inputSchema: obj({ loan_type: { type: "string" }, amount: { type: "integer" }, tenure_months: { type: "integer" } }, ["loan_type"]),
    outputSchema: obj({ matches: { type: "array" } }, ["matches"]),
    permissions: ["borrower", "dsa", "sales"],
    timeoutMs: 8_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "match.explain_match",
    name: "Explain Match",
    category: "match",
    description: "Explain why a lender ranks for this user, citing the data points (score fit, FOIR headroom, policy match).",
    inputSchema: obj({ lender_id: { type: "string" } }, ["lender_id"]),
    outputSchema: obj({ reasons: { type: "array" } }, ["reasons"]),
    permissions: ["borrower", "dsa"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "match.check_eligibility",
    name: "Check Eligibility",
    category: "match",
    description: "Cheap policy-only pre-screen (age/income/geography) before any bureau pull.",
    inputSchema: obj({ loan_type: { type: "string" }, monthly_income: { type: "integer" }, age: { type: "integer" } }, ["loan_type"]),
    outputSchema: obj({ eligible: { type: "boolean" }, criteria: { type: "array" } }, ["eligible"]),
    permissions: ["borrower", "dsa", "sales"],
    timeoutMs: 3_000,
    retry: NO_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "lenders.get_products",
    name: "Get Lender Products",
    category: "lenders",
    description: "Look up lender products, rate bands and fees from the lender intelligence database.",
    inputSchema: obj({ loan_type: { type: "string" }, lender_id: { type: "string" } }),
    outputSchema: obj({ products: { type: "array" } }, ["products"]),
    permissions: ["borrower", "dsa", "sales", "credit"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  // CRM
  {
    id: "crm.get_profile",
    name: "Get Profile",
    category: "crm",
    description: "Read the user's profile fields (already-known data is confirmed, never re-asked — Conversation OS §6).",
    inputSchema: obj({}),
    outputSchema: obj({ profile: { type: "object" } }, ["profile"]),
    permissions: ["borrower", "dsa", "sales", "operations"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "crm.update_profile",
    name: "Update Profile",
    category: "crm",
    description: "Update profile fields collected in conversation. Human confirms via card before write.",
    inputSchema: obj({ fields: { type: "object" } }, ["fields"]),
    outputSchema: obj({ updated: { type: "boolean" } }, ["updated"]),
    permissions: ["borrower"],
    timeoutMs: 5_000,
    retry: NO_RETRY,
    audit: { logArgs: "redacted" },
    kind: "confirmed_write",
    status: "active",
  },
  // Applications
  {
    id: "application.list",
    name: "List Applications",
    category: "application",
    description: "List the user's loan applications with statuses.",
    inputSchema: obj({}),
    outputSchema: obj({ applications: { type: "array" } }, ["applications"]),
    permissions: ["borrower", "dsa", "operations"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "application.status",
    name: "Application Status",
    category: "application",
    description: "Current status + timeline for one application.",
    inputSchema: obj({ application_id: { type: "string" } }, ["application_id"]),
    outputSchema: obj({ status: { type: "string" }, timeline: { type: "array" } }, ["status"]),
    permissions: ["borrower", "dsa", "operations", "credit"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "application.next_steps",
    name: "Application Next Steps",
    category: "application",
    description: "What the user must do next for an application (outcomes model).",
    inputSchema: obj({ application_id: { type: "string" } }, ["application_id"]),
    outputSchema: obj({ steps: { type: "array" } }, ["steps"]),
    permissions: ["borrower", "dsa", "operations"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  {
    id: "application.create_draft",
    name: "Create Draft Application",
    category: "application",
    description: "Create a draft application to a chosen lender. Nothing is sent to the lender; human confirms via card.",
    inputSchema: obj({ lender_id: { type: "string" }, amount: { type: "integer" }, tenure_months: { type: "integer" } }, ["lender_id", "amount"]),
    outputSchema: obj({ application_id: { type: "string" } }, ["application_id"]),
    permissions: ["borrower", "dsa"],
    timeoutMs: 8_000,
    retry: NO_RETRY,
    audit: { logArgs: "redacted" },
    kind: "confirmed_write",
    status: "active",
  },
  // Knowledge base
  {
    id: "kb.search",
    name: "Search Knowledge Base",
    category: "knowledge",
    description: "Retrieve cited passages from the LeapMoney knowledge base. Low confidence → honest refusal (PRD O2).",
    inputSchema: obj({ query: { type: "string" }, top_k: { type: "integer" } }, ["query"]),
    outputSchema: obj({ chunks: { type: "array" } }, ["chunks"]),
    permissions: ["borrower", "dsa", "sales", "credit", "operations", "founder"],
    timeoutMs: 5_000,
    retry: READ_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "active",
  },
  // Notifications
  {
    id: "notify.send",
    name: "Send Notification",
    category: "notification",
    description: "Send a template-locked notification (SMS/email; WhatsApp when live). Recipients always visible in the confirm card.",
    inputSchema: obj({ template: { type: "string" }, channel: { type: "string", enum: ["sms", "email", "whatsapp"] }, recipient_ids: { type: "array" } }, ["template", "channel", "recipient_ids"]),
    outputSchema: obj({ queued: { type: "integer" } }, ["queued"]),
    permissions: ["operations"],
    timeoutMs: 8_000,
    retry: NO_RETRY,
    audit: { logArgs: "redacted" },
    kind: "confirmed_write",
    status: "active",
  },
  // ── Placeholders — vendor not live (Conversation OS §9 registry rule) ──────
  {
    id: "whatsapp.send",
    name: "WhatsApp Message",
    category: "external",
    description: "PLACEHOLDER — WhatsApp BSP not integrated. Fallback: SMS/email via notify.send.",
    inputSchema: obj({ template: { type: "string" }, recipient_ids: { type: "array" } }, ["template", "recipient_ids"]),
    outputSchema: obj({ queued: { type: "integer" } }),
    permissions: ["operations"],
    timeoutMs: 8_000,
    retry: NO_RETRY,
    audit: { logArgs: "redacted" },
    kind: "confirmed_write",
    status: "placeholder",
  },
  {
    id: "digilocker.fetch",
    name: "DigiLocker Fetch",
    category: "external",
    description: "PLACEHOLDER — DigiLocker not integrated. Fallback: manual document upload.",
    inputSchema: obj({ document_type: { type: "string", enum: ["pan", "aadhaar"] } }, ["document_type"]),
    outputSchema: obj({ document_id: { type: "string" } }),
    permissions: ["borrower"],
    timeoutMs: 15_000,
    retry: NO_RETRY,
    audit: { logArgs: "redacted" },
    kind: "confirmed_write",
    status: "placeholder",
  },
  {
    id: "ckyc.verify",
    name: "CKYC Verify",
    category: "external",
    description: "PLACEHOLDER — CKYC registry not integrated. Fallback: PAN-based dedupe only.",
    inputSchema: obj({}),
    outputSchema: obj({ verified: { type: "boolean" } }),
    permissions: ["operations", "credit"],
    timeoutMs: 15_000,
    retry: NO_RETRY,
    audit: AUDIT_DEFAULT,
    kind: "read",
    status: "placeholder",
  },
  {
    id: "esign.request",
    name: "eSign Request",
    category: "external",
    description: "PLACEHOLDER — eSign not integrated. Fallback: wet-signature flow messaging.",
    inputSchema: obj({ application_id: { type: "string" } }, ["application_id"]),
    outputSchema: obj({ esign_url: { type: "string" } }),
    permissions: ["borrower"],
    timeoutMs: 15_000,
    retry: NO_RETRY,
    audit: { logArgs: "redacted" },
    kind: "confirmed_write",
    status: "placeholder",
  },
  {
    id: "payment.collect",
    name: "Collect Payment",
    category: "external",
    description: "PLACEHOLDER — payment gateway not integrated. No payment promises in scripts (Conversation OS §9).",
    inputSchema: obj({ purpose: { type: "string" }, amount_paise: { type: "integer" } }, ["purpose", "amount_paise"]),
    outputSchema: obj({ payment_link: { type: "string" } }),
    permissions: ["borrower"],
    timeoutMs: 15_000,
    retry: NO_RETRY,
    audit: { logArgs: "redacted" },
    kind: "confirmed_write",
    status: "placeholder",
  },
];

// ── Registry ──────────────────────────────────────────────────────────────────
export class ToolRegistry {
  private readonly byId = new Map<string, ToolSpec>();

  constructor(specs: ToolSpec[] = SPECS) {
    for (const spec of specs) {
      if (this.byId.has(spec.id)) {
        throw new Error(`Duplicate tool id registered: ${spec.id}`);
      }
      this.byId.set(spec.id, spec);
    }
  }

  get(id: string): ToolSpec | undefined {
    return this.byId.get(id);
  }

  list(): ToolSpec[] {
    return [...this.byId.values()];
  }

  /** Active tools this profile may call — the ONLY set ever offered to a model. */
  listForProfile(profile: ToolProfile): ToolSpec[] {
    return this.list().filter((t) => t.status === "active" && t.permissions.includes(profile));
  }

  /** Projection → ai-gateway ChatRequest.tools (Anthropic native tool-calling). */
  toToolDefinitions(profile: ToolProfile): { name: string; description: string; inputSchema: JsonSchema }[] {
    return this.listForProfile(profile).map((t) => ({
      name: t.id,
      description: t.description,
      inputSchema: t.inputSchema,
    }));
  }

  /** Projection → MCP tool listing (Sprint 33 T30). Identical shape by design. */
  toMcpTools(profile: ToolProfile): { name: string; description: string; inputSchema: JsonSchema }[] {
    return this.toToolDefinitions(profile);
  }
}

/** Default registry with the platform tool set. */
export function createDefaultRegistry(): ToolRegistry {
  return new ToolRegistry();
}
