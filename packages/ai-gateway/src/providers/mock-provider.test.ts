import { describe, expect, it } from "vitest";
import { MockAIProvider } from "./mock-provider";
import type { ChatDelta, ChatRequest } from "../types";

async function collect(deltas: AsyncIterable<ChatDelta>): Promise<ChatDelta[]> {
  const out: ChatDelta[] = [];
  for await (const d of deltas) out.push(d);
  return out;
}

describe("MockAIProvider", () => {
  it("identifies itself as the mock provider", () => {
    expect(new MockAIProvider().name).toBe("mock");
  });

  it("streams deterministic text deltas ending in a done marker", async () => {
    const request: ChatRequest = {
      messages: [{ role: "user", content: "Explain my LeapScore" }],
    };
    const deltas = await collect(new MockAIProvider().stream(request));

    expect(deltas.length).toBeGreaterThan(1);
    expect(deltas[deltas.length - 1]).toEqual({ type: "done" });
    expect(deltas.slice(0, -1).every((d) => d.type === "text")).toBe(true);

    const text = deltas
      .filter((d): d is { type: "text"; text: string } => d.type === "text")
      .map((d) => d.text)
      .join("");
    expect(text).toContain("Explain my LeapScore");
  });

  it("is deterministic — identical input yields identical output", async () => {
    const request: ChatRequest = { messages: [{ role: "user", content: "hi" }] };
    const a = await collect(new MockAIProvider().stream(request));
    const b = await collect(new MockAIProvider().stream(request));
    expect(a).toEqual(b);
  });

  it("falls back gracefully with no user message", async () => {
    const request: ChatRequest = { messages: [{ role: "system", content: "sys" }] };
    const deltas = await collect(new MockAIProvider().stream(request));
    const text = deltas
      .filter((d): d is { type: "text"; text: string } => d.type === "text")
      .map((d) => d.text)
      .join("");
    expect(text.length).toBeGreaterThan(0);
  });

  it("makes no network calls (offline-safe by construction — no fetch/import of a provider SDK)", () => {
    const src = MockAIProvider.toString();
    expect(src).not.toMatch(/fetch\(|http/i);
  });
});
