// ── @leapmoney/ai-gateway ─────────────────────────────────────────────────
// PRD §4.2 / §7.1. Public surface: provider contract + providers.

export type {
  AIProvider,
  ChatContentBlock,
  ChatDelta,
  ChatMessage,
  ChatRequest,
  ChatRole,
  ProviderName,
  ToolDefinition,
} from "./types";

export { MockAIProvider } from "./providers/mock-provider";
export {
  AnthropicProvider,
  ANTHROPIC_MODEL_HAIKU,
  ANTHROPIC_MODEL_OPUS,
} from "./providers/anthropic-provider";
export type {
  AnthropicMessagesClient,
  AnthropicMessageStream,
  AnthropicProviderOptions,
  AnthropicRawStreamEvent,
} from "./providers/anthropic-provider";

export { AuditLogger } from "./audit/audit-logger";
export type { AuditContext, AuditLoggerOptions, AuditRecord, AuditSink } from "./audit/audit-logger";
export { withAudit } from "./audit/with-audit";

export { BudgetManager, budgetPolicyFromEnv } from "./budget/budget-manager";
export type { BudgetDecision, BudgetPolicy, DailyUsage, UsageStore } from "./budget/budget-manager";

export { redactPII, redactRequest } from "./privacy/redact";
export { withRedaction } from "./privacy/with-redaction";

export { toChronologicalWindow } from "./conversation/history";
export type { HistoryTurn } from "./conversation/history";
