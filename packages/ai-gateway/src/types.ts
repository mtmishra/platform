// ── LeapAI Gateway — core types ──────────────────────────────────────────────
// PRD §4.2. The gateway is the ONLY component allowed to talk to a model
// provider — apps never import a provider SDK directly. This file defines the
// provider contract every implementation (mock, anthropic, ...) must satisfy.

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** Model id, provider-specific. Providers fall back to their own default when omitted. */
  model?: string;
}

export type ChatDelta =
  | { type: "text"; text: string }
  | { type: "done" };

export type ProviderName = "mock" | "anthropic";

// PRD §4.2 — same swap pattern as the existing MockBureauAdapter seam.
export interface AIProvider {
  readonly name: ProviderName;
  stream(request: ChatRequest): AsyncIterable<ChatDelta>;
}
