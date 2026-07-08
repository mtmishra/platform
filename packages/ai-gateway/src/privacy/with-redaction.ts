// ── withRedaction ─────────────────────────────────────────────────────────
// Sprint 28 T6 — provider decorator: every ChatRequest is PII-redacted
// before reaching the wrapped provider. Composes with withAudit (T4):
//   withAudit(withRedaction(provider), logger, ctx)
// audits the redacted request path — the audit trail can never leak what
// redaction removed.

import type { AIProvider, ChatDelta, ChatRequest } from "../types";
import { redactRequest } from "./redact";

export function withRedaction(provider: AIProvider): AIProvider {
  return {
    name: provider.name,
    stream(request: ChatRequest): AsyncIterable<ChatDelta> {
      return provider.stream(redactRequest(request));
    },
  };
}
