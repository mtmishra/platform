// ── LeapAI Gateway — core types ──────────────────────────────────────────────
// PRD §4.2. The gateway is the ONLY component allowed to talk to a model
// provider — apps never import a provider SDK directly. This file defines the
// provider contract every implementation (mock, anthropic, ...) must satisfy.
//
// MCP compatibility (reviewed before T4): ChatMessage content, ChatRequest.tools
// and ChatDelta are shaped to match Anthropic's native tool-calling wire format
// AND the Model Context Protocol's tool-listing shape at the same time — a
// ToolDefinition here is exactly what T9's tool registry will produce and what
// T30's MCP server (Sprint 33) will expose. No redesign needed when either lands.

export type ChatRole = "system" | "user" | "assistant" | "tool";

// Anthropic's Messages API content-block shapes, reused verbatim rather than
// invented — this is what lets ChatMessage.content pass straight through to
// the provider with no translation layer.
export type ChatContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string; is_error?: boolean };

export interface ChatMessage {
  role: ChatRole;
  /** Plain text for ordinary turns; content blocks once tool calls are involved. */
  content: string | ChatContentBlock[];
}

/**
 * Tool definition shape shared by Anthropic native tool-calling AND MCP tool
 * listings. `inputSchema` is plain JSON Schema — both consumers accept it
 * (Anthropic's `input_schema`, MCP's `inputSchema`); the gateway does the
 * one-field rename per target, never a structural translation.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface ChatRequest {
  messages: ChatMessage[];
  /** Model id, provider-specific. Providers fall back to their own default when omitted. */
  model?: string;
  /** Tools available for this turn. Empty/omitted = plain chat, unchanged from Sprint 28 T1/T2 behavior. */
  tools?: ToolDefinition[];
}

export type ChatDelta =
  | { type: "text"; text: string }
  | { type: "tool_use_start"; id: string; name: string }
  | { type: "tool_use_delta"; id: string; partialInputJson: string }
  | { type: "tool_use_stop"; id: string }
  | { type: "done" };

export type ProviderName = "mock" | "anthropic";

// PRD §4.2 — same swap pattern as the existing MockBureauAdapter seam.
export interface AIProvider {
  readonly name: ProviderName;
  stream(request: ChatRequest): AsyncIterable<ChatDelta>;
}
