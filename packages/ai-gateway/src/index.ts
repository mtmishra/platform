// ── @leapmoney/ai-gateway ─────────────────────────────────────────────────
// PRD §4.2 / §7.1. Public surface: provider contract + providers.

export type {
  AIProvider,
  ChatDelta,
  ChatMessage,
  ChatRequest,
  ChatRole,
  ProviderName,
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
} from "./providers/anthropic-provider";
