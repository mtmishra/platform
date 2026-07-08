import { afterEach, describe, expect, it, vi } from "vitest";
import { AnthropicProvider, ANTHROPIC_MODEL_HAIKU, ANTHROPIC_MODEL_OPUS } from "./anthropic-provider";
import type { AnthropicMessagesClient } from "./anthropic-provider";
import type { ChatDelta, ChatRequest } from "../types";

async function collect(deltas: AsyncIterable<ChatDelta>): Promise<ChatDelta[]> {
  const out: ChatDelta[] = [];
  for await (const d of deltas) out.push(d);
  return out;
}

async function* fakeTextStream(words: string[]): AsyncIterable<string> {
  for (const w of words) yield w;
}

function fakeClient(
  words: string[],
  opts?: { failTimes?: number; capture?: (params: unknown, options: unknown) => void },
): AnthropicMessagesClient {
  let calls = 0;
  return {
    messages: {
      stream: (params, options) => {
        calls += 1;
        opts?.capture?.(params, options);
        if (opts?.failTimes && calls <= opts.failTimes) {
          throw new Error("transient failure");
        }
        return { textStream: fakeTextStream(words) };
      },
    },
  };
}

describe("AnthropicProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("identifies itself as the anthropic provider", () => {
    expect(new AnthropicProvider({ client: fakeClient(["hi"]) }).name).toBe("anthropic");
  });

  it("streams text deltas from the injected client, ending in done — no network call", async () => {
    const request: ChatRequest = { messages: [{ role: "user", content: "hello" }] };
    const provider = new AnthropicProvider({ client: fakeClient(["Hi", " there"]) });
    const deltas = await collect(provider.stream(request));

    expect(deltas).toEqual([
      { type: "text", text: "Hi" },
      { type: "text", text: " there" },
      { type: "done" },
    ]);
  });

  it("defaults to the haiku model when request.model is omitted", async () => {
    let seenModel = "";
    const client = fakeClient(["ok"], { capture: (p) => (seenModel = (p as { model: string }).model) });
    const provider = new AnthropicProvider({ client });
    await collect(provider.stream({ messages: [{ role: "user", content: "hi" }] }));
    expect(seenModel).toBe(ANTHROPIC_MODEL_HAIKU);
  });

  it("routes to the requested model when request.model is set (e.g. opus for reasoning profiles)", async () => {
    let seenModel = "";
    const client = fakeClient(["ok"], { capture: (p) => (seenModel = (p as { model: string }).model) });
    const provider = new AnthropicProvider({ client });
    await collect(
      provider.stream({ messages: [{ role: "user", content: "hi" }], model: ANTHROPIC_MODEL_OPUS }),
    );
    expect(seenModel).toBe(ANTHROPIC_MODEL_OPUS);
  });

  it("passes system messages separately from the turn history", async () => {
    let seenSystem: string | undefined;
    let seenTurns: unknown;
    const client = fakeClient(["ok"], {
      capture: (p) => {
        const params = p as { system?: string; messages: unknown };
        seenSystem = params.system;
        seenTurns = params.messages;
      },
    });
    const provider = new AnthropicProvider({ client });
    await collect(
      provider.stream({
        messages: [
          { role: "system", content: "You are LeapAI" },
          { role: "user", content: "hi" },
        ],
      }),
    );
    expect(seenSystem).toBe("You are LeapAI");
    expect(seenTurns).toEqual([{ role: "user", content: "hi" }]);
  });

  it("retries on start-up failure and succeeds within maxRetries", async () => {
    const client = fakeClient(["recovered"], { failTimes: 1 });
    const provider = new AnthropicProvider({ client, maxRetries: 2 });
    const deltas = await collect(provider.stream({ messages: [{ role: "user", content: "hi" }] }));
    expect(deltas[0]).toEqual({ type: "text", text: "recovered" });
  });

  it("throws a clear error when retries are exhausted", async () => {
    const client = fakeClient(["never"], { failTimes: 5 });
    const provider = new AnthropicProvider({ client, maxRetries: 1 });
    await expect(collect(provider.stream({ messages: [{ role: "user", content: "hi" }] }))).rejects.toThrow(
      "transient failure",
    );
  });

  it("wires an AbortSignal for the configured timeout", async () => {
    let sawSignal = false;
    const client = fakeClient(["ok"], { capture: (_p, o) => (sawSignal = Boolean((o as { signal?: AbortSignal })?.signal)) });
    const provider = new AnthropicProvider({ client, timeoutMs: 5_000 });
    await collect(provider.stream({ messages: [{ role: "user", content: "hi" }] }));
    expect(sawSignal).toBe(true);
  });

  it("throws immediately if no API key and no injected client are available", async () => {
    const provider = new AnthropicProvider({});
    await expect(collect(provider.stream({ messages: [{ role: "user", content: "hi" }] }))).rejects.toThrow(
      /ANTHROPIC_API_KEY/,
    );
  });

  it("refuses to construct when a browser `window` global is present (server-only guard)", () => {
    vi.stubGlobal("window", {});
    expect(() => new AnthropicProvider({ client: fakeClient(["x"]) })).toThrow(/server-only/i);
  });
});
