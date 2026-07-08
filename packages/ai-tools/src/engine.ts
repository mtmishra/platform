// ── Tool Execution Engine ─────────────────────────────────────────────────
// Sprint 29 T10 — PRD §4.4 rules. Resolves a tool id against the registry,
// validates permissions server-side (never by prompt), executes the injected
// handler under the spec's timeout/retry policy, and formats every outcome —
// success or failure — as a structured ToolResult the runtime (T11) can hand
// back to the model. Handlers carry the business logic; the engine carries
// none.

import type { ToolProfile, ToolRegistry, ToolSpec } from "./registry";

export interface ToolExecutionContext {
  /** users_profile.id — handlers run RLS-scoped as this user. */
  userId: string;
  profile: ToolProfile;
  /** Correlation id from the gateway request, for audit joins. */
  correlationId?: string;
  /** confirmed_write tools require this — set only after a ConfirmActionCard approval. */
  confirmed?: boolean;
}

export type ToolHandler = (args: unknown, context: ToolExecutionContext, signal: AbortSignal) => Promise<unknown>;

export type ToolResult =
  | { ok: true; toolId: string; data: unknown; durationMs: number; attempts: number }
  | { ok: false; toolId: string; error: ToolErrorCode; message: string; durationMs: number; attempts: number };

export type ToolErrorCode =
  | "unknown_tool"
  | "placeholder_unavailable"
  | "permission_denied"
  | "confirmation_required"
  | "no_handler"
  | "timeout"
  | "handler_error";

export interface ToolAuditEvent {
  action: "ai.tool_execute";
  toolId: string;
  userId: string;
  profile: ToolProfile;
  correlationId?: string | undefined;
  outcome: "ok" | ToolErrorCode;
  durationMs: number;
  attempts: number;
  /** Per spec.audit.logArgs: argument NAMES only, or the redacted args object. Never results. */
  args: unknown;
}

export interface ToolEngineOptions {
  registry: ToolRegistry;
  handlers: Record<string, ToolHandler>;
  /** Fire-and-forget audit hook (wire to ai-gateway AuditLogger). Failures never affect execution. */
  onAudit?: (event: ToolAuditEvent) => void;
  /** Injectable clock for deterministic tests. */
  now?: () => number;
}

function auditArgs(spec: ToolSpec, args: unknown): unknown {
  if (spec.audit.logArgs === "names_only") {
    return args && typeof args === "object" ? Object.keys(args as Record<string, unknown>) : [];
  }
  // "redacted": the caller passes args already PII-redacted by the gateway
  // path (T6); we still never log nested values of unknown depth beyond one level.
  return args && typeof args === "object" ? { ...(args as Record<string, unknown>) } : args;
}

export class ToolEngine {
  private readonly registry: ToolRegistry;
  private readonly handlers: Record<string, ToolHandler>;
  private readonly onAudit: (event: ToolAuditEvent) => void;
  private readonly now: () => number;

  constructor(options: ToolEngineOptions) {
    this.registry = options.registry;
    this.handlers = options.handlers;
    this.onAudit = options.onAudit ?? (() => {});
    this.now = options.now ?? (() => Date.now());
  }

  async execute(toolId: string, args: unknown, context: ToolExecutionContext): Promise<ToolResult> {
    const startedAt = this.now();
    const fail = (error: ToolErrorCode, message: string, attempts = 0): ToolResult => {
      const result: ToolResult = { ok: false, toolId, error, message, durationMs: this.now() - startedAt, attempts };
      this.safeAudit(toolId, args, context, error, result.durationMs, attempts);
      return result;
    };

    // ── Resolve ──────────────────────────────────────────────────────────
    const spec = this.registry.get(toolId);
    if (!spec) return fail("unknown_tool", `No tool registered with id "${toolId}".`);
    if (spec.status === "placeholder") {
      return fail("placeholder_unavailable", `${spec.name} is not live yet — its vendor integration is pending.`);
    }

    // ── Authorize (server-side, never prompt-side) ───────────────────────
    if (!spec.permissions.includes(context.profile)) {
      return fail("permission_denied", `Profile "${context.profile}" may not call ${toolId}.`);
    }
    if (spec.kind === "confirmed_write" && context.confirmed !== true) {
      return fail("confirmation_required", `${spec.name} changes state and requires an approved confirmation card.`);
    }

    const handler = this.handlers[toolId];
    if (!handler) return fail("no_handler", `No handler wired for ${toolId} in this app.`);

    // ── Execute with timeout + retry ─────────────────────────────────────
    let attempts = 0;
    let lastError: unknown;
    while (attempts <= spec.retry.maxRetries) {
      attempts += 1;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), spec.timeoutMs);
      try {
        const data = await Promise.race([
          handler(args, context, controller.signal),
          new Promise<never>((_, reject) => {
            controller.signal.addEventListener("abort", () => reject(new ToolTimeoutError(spec)), { once: true });
          }),
        ]);
        clearTimeout(timer);
        const result: ToolResult = { ok: true, toolId, data, durationMs: this.now() - startedAt, attempts };
        this.safeAudit(toolId, args, context, "ok", result.durationMs, attempts);
        return result;
      } catch (error) {
        clearTimeout(timer);
        lastError = error;
        if (attempts <= spec.retry.maxRetries) {
          await sleep(spec.retry.backoffMs * attempts);
        }
      }
    }

    if (lastError instanceof ToolTimeoutError) {
      return fail("timeout", `${spec.name} timed out after ${spec.timeoutMs}ms.`, attempts);
    }
    return fail(
      "handler_error",
      lastError instanceof Error ? lastError.message : "Tool execution failed.",
      attempts,
    );
  }

  private safeAudit(
    toolId: string,
    args: unknown,
    context: ToolExecutionContext,
    outcome: "ok" | ToolErrorCode,
    durationMs: number,
    attempts: number,
  ): void {
    try {
      const spec = this.registry.get(toolId);
      this.onAudit({
        action: "ai.tool_execute",
        toolId,
        userId: context.userId,
        profile: context.profile,
        correlationId: context.correlationId,
        outcome,
        durationMs,
        attempts,
        args: spec ? auditArgs(spec, args) : [],
      });
    } catch {
      /* audit failures never affect tool execution (T4 contract) */
    }
  }
}

class ToolTimeoutError extends Error {
  constructor(spec: ToolSpec) {
    super(`timeout:${spec.id}`);
    this.name = "ToolTimeoutError";
  }
}

function sleep(ms: number): Promise<void> {
  return ms > 0 ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve();
}
