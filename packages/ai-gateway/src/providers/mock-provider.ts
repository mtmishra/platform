// ── MockAIProvider ────────────────────────────────────────────────────────
// PRD §4.2, §9 recommendation 2: the whole system must run in CI with no API
// keys. This provider yields deterministic deltas from the last user message —
// no network calls, no randomness, no timers left running after completion.

import type { AIProvider, ChatDelta, ChatRequest } from "../types";

const FALLBACK_REPLY =
  "I don't have a message to respond to. Ask me something to get started.";

export class MockAIProvider implements AIProvider {
  readonly name = "mock" as const;

  async *stream(request: ChatRequest): AsyncIterable<ChatDelta> {
    const lastUser = [...request.messages].reverse().find((m) => m.role === "user");
    const reply = lastUser
      ? `Mock reply to: ${lastUser.content}`
      : FALLBACK_REPLY;

    for (const word of reply.split(" ")) {
      yield { type: "text", text: `${word} ` };
    }
    yield { type: "done" };
  }
}
