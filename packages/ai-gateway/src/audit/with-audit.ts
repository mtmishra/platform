// ── withAudit ─────────────────────────────────────────────────────────────
// Sprint 28 T4 — decorator that makes ANY AIProvider self-auditing without
// the provider knowing. Wraps the stream: logs request start, tool-use
// events, completion (with delta/char counts + duration), and errors —
// then re-yields every delta unchanged. Works for mock, anthropic, and any
// future provider (openai/gemini) because it only speaks ChatDelta.

import type { AIProvider, ChatDelta, ChatRequest } from "../types";
import type { AuditContext, AuditLogger } from "./audit-logger";

function requestSummary(request: ChatRequest): Record<string, unknown> {
  // Metadata only — never message content (DPDP; see audit-logger header).
  return {
    message_count: request.messages.length,
    roles: request.messages.map((m) => m.role),
    model: request.model ?? null,
    tool_count: request.tools?.length ?? 0,
    tool_names: request.tools?.map((t) => t.name) ?? [],
  };
}

export function withAudit(provider: AIProvider, logger: AuditLogger, context: AuditContext): AIProvider {
  return {
    name: provider.name,
    async *stream(request: ChatRequest): AsyncIterable<ChatDelta> {
      const correlationId = logger.createCorrelationId();
      const startedAt = logger.nowMs();
      const base = { correlation_id: correlationId, provider: provider.name };

      // Not awaited: audit writes must never delay the first token.
      void logger.log(context, "ai.request", "ai_gateway", { ...base, ...requestSummary(request) });

      let textDeltas = 0;
      let textChars = 0;
      const toolUses: { id: string; name: string }[] = [];

      try {
        for await (const delta of provider.stream(request)) {
          switch (delta.type) {
            case "text":
              textDeltas += 1;
              textChars += delta.text.length;
              break;
            case "tool_use_start":
              toolUses.push({ id: delta.id, name: delta.name });
              void logger.log(context, "ai.tool_use", delta.name, {
                ...base,
                tool_use_id: delta.id,
              });
              break;
            default:
              break;
          }
          yield delta;
        }

        void logger.log(context, "ai.response", "ai_gateway", {
          ...base,
          model: request.model ?? null,
          duration_ms: logger.nowMs() - startedAt,
          text_deltas: textDeltas,
          text_chars: textChars,
          tool_use_count: toolUses.length,
          tool_names: toolUses.map((t) => t.name),
        });
      } catch (error) {
        void logger.log(context, "ai.error", "ai_gateway", {
          ...base,
          duration_ms: logger.nowMs() - startedAt,
          error_name: error instanceof Error ? error.name : "unknown",
          error_message: error instanceof Error ? error.message : String(error),
          text_deltas_before_error: textDeltas,
        });
        throw error; // audit observes failures; it never hides them
      }
    },
  };
}
