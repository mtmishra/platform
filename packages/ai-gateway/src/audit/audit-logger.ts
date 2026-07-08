// ── AuditLogger ───────────────────────────────────────────────────────────
// Sprint 28 T4 — PRD §1.2-O3: every AI interaction is auditable (DPDP/RBI).
// Writes to the EXISTING public.audit_log table (migration 0001) via an
// injected sink — this package stays dependency-free; the API route (T8)
// supplies a sink backed by its server-side Supabase client.
//
// Hard rules:
// 1. Logging never blocks or breaks a user response — sink failures are
//    swallowed (reported via onSinkError) and the stream continues.
// 2. No message content, no PII in audit payloads — metadata only
//    (counts, ids, models, durations). Conversation content belongs in
//    ai_message; audit_log records THAT something happened, not WHAT was said.
// 3. Event names are an open set ("ai.*") so future MCP events
//    ("ai.mcp.tool_call") and future providers (openai/gemini) need no
//    changes here.

/** Row shape for public.audit_log (columns from migration 0001). */
export interface AuditRecord {
  user_id: string | null;
  action: string; // e.g. "ai.request" | "ai.response" | "ai.tool_use" | "ai.error" | "ai.mcp.tool_call"
  entity: string | null; // e.g. "ai_gateway" | tool name
  metadata: Record<string, unknown>;
}

/** Persistence seam. T8 implements this with the server Supabase client. */
export interface AuditSink {
  insert(record: AuditRecord): Promise<void>;
}

export interface AuditContext {
  /** users_profile.id of the acting user; null for system events. */
  userId: string | null;
  /** Which LeapAI experience/profile the call ran as (Conversation OS §2.2). */
  agentProfile?: string;
  /** Conversation this turn belongs to, when known. */
  conversationId?: string;
}

export interface AuditLoggerOptions {
  sink: AuditSink;
  /** Observability for the observer: called when the sink itself fails. Defaults to console.warn. */
  onSinkError?: (error: unknown, record: AuditRecord) => void;
  /** Injectable clock/id for deterministic tests. */
  now?: () => number;
  newCorrelationId?: () => string;
}

export class AuditLogger {
  private readonly sink: AuditSink;
  private readonly onSinkError: (error: unknown, record: AuditRecord) => void;
  readonly nowMs: () => number;
  private readonly newId: () => string;

  constructor(options: AuditLoggerOptions) {
    this.sink = options.sink;
    this.onSinkError =
      options.onSinkError ??
      ((error, record) => {
        // eslint-disable-next-line no-console
        console.warn("[ai-gateway] audit sink failed (user response unaffected)", record.action, error);
      });
    this.nowMs = options.now ?? (() => Date.now());
    this.newId = options.newCorrelationId ?? (() => globalThis.crypto.randomUUID());
  }

  /** One correlation id per user request; stamped on every event of that request. */
  createCorrelationId(): string {
    return this.newId();
  }

  /**
   * Fire-and-forget by contract: resolves when the write settles, but callers
   * are free NOT to await it — a rejected sink can never propagate.
   */
  async log(context: AuditContext, action: string, entity: string | null, metadata: Record<string, unknown>): Promise<void> {
    const record: AuditRecord = {
      user_id: context.userId,
      action,
      entity,
      metadata: {
        ...metadata,
        ...(context.agentProfile !== undefined ? { agent_profile: context.agentProfile } : {}),
        ...(context.conversationId !== undefined ? { conversation_id: context.conversationId } : {}),
      },
    };
    try {
      await this.sink.insert(record);
    } catch (error) {
      try {
        this.onSinkError(error, record);
      } catch {
        /* the error handler itself may never throw into the caller */
      }
    }
  }
}
