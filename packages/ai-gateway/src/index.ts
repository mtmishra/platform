// ── @leapmoney/ai-gateway ─────────────────────────────────────────────────
// PRD §4.2 / §7.1. Public surface: provider contract + Mock provider.
// AnthropicProvider ships in Sprint 28 task T2 — not yet wired here.

export type {
  AIProvider,
  ChatDelta,
  ChatMessage,
  ChatRequest,
  ChatRole,
  ProviderName,
} from "./types";

export { MockAIProvider } from "./providers/mock-provider";
