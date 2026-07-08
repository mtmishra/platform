// ── MockAIProvider ────────────────────────────────────────────────────────
// PRD §4.2, §9 recommendation 2: the whole system must run in CI with no API
// keys. This provider yields deterministic deltas from the last user message —
// no network calls, no randomness, no timers left running after completion.
//
// Intentionally never emits tool_use deltas — it echoes text only. The
// ChatDelta type supports tool_use (MCP compatibility review, Sprint 28) but
// exercising that path is a real provider's job; keeping the mock text-only
// keeps it simple and its output trivially deterministic to assert on.

import type { AIProvider, ChatContentBlock, ChatDelta, ChatRequest } from "../types";

const FALLBACK_REPLY =
  "I don't have a message to respond to. Ask me something to get started.";

function contentToText(content: string | ChatContentBlock[]): string {
  if (typeof content === "string") return content;
  return content.map((block) => (block.type === "text" ? block.text : `[${block.type}]`)).join(" ");
}

export class MockAIProvider implements AIProvider {
  readonly name = "mock" as const;

  async *stream(request: ChatRequest): AsyncIterable<ChatDelta> {
    const lastUser = [...request.messages].reverse().find((m) => m.role === "user");
    const reply = lastUser
      ? `Mock reply to: ${contentToText(lastUser.content)}`
      : FALLBACK_REPLY;

    for (const word of reply.split(" ")) {
      yield { type: "text", text: `${word} ` };
    }
    yield { type: "done" };
  }
}
