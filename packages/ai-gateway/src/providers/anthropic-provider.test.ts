import { afterEach, describe, expect, it, vi } from "vitest";
import { AnthropicProvider, ANTHROPIC_MODEL_HAIKU, ANTHROPIC_MODEL_OPUS } from "./anthropic-provider";
import type { AnthropicMessagesClient, AnthropicRawStreamEvent } from "./anthropic-provider";
import type { ChatDelta, ChatRequest, ToolDefinition } from "../types";

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

  // ── MCP-compatibility path: tool-calling ──────────────────────────────────

  it("forwards tool definitions to the client, renamed to Anthropic's input_schema", async () => {
    let seenTools: unknown;
    const client = fakeClient(["ok"], { capture: (p) => (seenTools = (p as { tools?: unknown }).tools) });
    const provider = new AnthropicProvider({ client });
    const tools: ToolDefinition[] = [
      { name: "credit.get_leapscore", description: "Fetch the user's LeapScore", inputSchema: { type: "object" } },
    ];
    await collect(provider.stream({ messages: [{ role: "user", content: "hi" }], tools }));
    expect(seenTools).toEqual([
      { name: "credit.get_leapscore", description: "Fetch the user's LeapScore", input_schema: { type: "object" } },
    ]);
  });

  it("translates a tool role message into a user-role turn (Anthropic has no wire-level tool role)", async () => {
    let seenTurns: unknown;
    const client = fakeClient(["ok"], { capture: (p) => (seenTurns = (p as { messages: unknown }).messages) });
    const provider = new AnthropicProvider({ client });
    await collect(
      provider.stream({
        messages: [
          { role: "user", content: "get my score" },
          {
            role: "tool",
            content: [{ type: "tool_result", tool_use_id: "toolu_1", content: "802" }],
          },
        ],
      }),
    );
    expect(seenTurns).toEqual([
      { role: "user", content: "get my score" },
      { role: "user", content: [{ type: "tool_result", tool_use_id: "toolu_1", content: "802" }] },
    ]);
  });

  it("translates raw tool_use stream events into ChatDelta tool_use_start/delta/stop", async () => {
    async function* rawEvents(): AsyncIterable<AnthropicRawStreamEvent> {
      yield { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } };
      yield { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "Checking " } };
      yield { type: "content_block_stop", index: 0 };
      yield { type: "content_block_start", index: 1, content_block: { type: "tool_use", id: "toolu_1", name: "credit.get_leapscore" } };
      yield { type: "content_block_delta", index: 1, delta: { type: "input_json_delta", partial_json: '{"user' } };
      yield { type: "content_block_delta", index: 1, delta: { type: "input_json_delta", partial_json: '_id":1}' } };
      yield { type: "content_block_stop", index: 1 };
      yield { type: "message_stop" };
    }
    const client: AnthropicMessagesClient = {
      messages: {
        stream: () => ({ textStream: fakeTextStream([]), events: rawEvents() }),
      },
    };
    const provider = new AnthropicProvider({ client });
    const deltas = await collect(provider.stream({ messages: [{ role: "user", content: "hi" }] }));

    expect(deltas).toEqual([
      { type: "text", text: "Checking " },
      { type: "tool_use_start", id: "toolu_1", name: "credit.get_leapscore" },
      { type: "tool_use_delta", id: "toolu_1", partialInputJson: '{"user' },
      { type: "tool_use_delta", id: "toolu_1", partialInputJson: '_id":1}' },
      { type: "tool_use_stop", id: "toolu_1" },
      { type: "done" },
    ]);
  });

  it("falls back to textStream-only translation when the client provides no events (back-compat)", async () => {
    const provider = new AnthropicProvider({ client: fakeClient(["plain", " text"]) });
    const deltas = await collect(provider.stream({ messages: [{ role: "user", content: "hi" }] }));
    expect(deltas.filter((d) => d.type === "tool_use_start")).toHaveLength(0);
    expect(deltas).toEqual([
      { type: "text", text: "plain" },
      { type: "text", text: " text" },
      { type: "done" },
    ]);
  });
});
