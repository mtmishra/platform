import { describe, expect, it } from "vitest";
import { buildTurnMessages, runConversationTurn } from "./conversation-runtime";
import type { RuntimeEvent, ToolExecutor } from "./conversation-runtime";
import type { AIProvider, ChatDelta, ChatRequest } from "../types";

async function collect(events: AsyncIterable<RuntimeEvent>): Promise<RuntimeEvent[]> {
  const out: RuntimeEvent[] = [];
  for await (const e of events) out.push(e);
  return out;
}

/** Provider that requests a tool on call 1, answers with text on call 2. */
function toolThenTextProvider(): AIProvider {
  let call = 0;
  return {
    name: "mock",
    async *stream(req: ChatRequest): AsyncIterable<ChatDelta> {
      call += 1;
      if (call === 1) {
        yield { type: "text", text: "Checking… " };
        yield { type: "tool_use_start", id: "t1", name: "credit.get_leapscore" };
        yield { type: "tool_use_delta", id: "t1", partialInputJson: "{}" };
        yield { type: "tool_use_stop", id: "t1" };
        yield { type: "done" };
      } else {
        // The runtime must have appended the tool_result before this call.
        const last = req.messages[req.messages.length - 1];
        const hasResult = typeof last?.content !== "string" && last?.content.some((b) => b.type === "tool_result");
        yield { type: "text", text: hasResult ? "Your LeapScore is 802." : "MISSING RESULT" };
        yield { type: "done" };
      }
    },
  };
}

const okExecutor: ToolExecutor = async (toolId) =>
  toolId === "credit.get_leapscore"
    ? { ok: true, data: { score: 802 } }
    : { ok: false, error: "unknown_tool", message: "no such tool" };

const request: ChatRequest = { messages: [{ role: "user", content: "what's my score?" }] };

describe("runConversationTurn (T11)", () => {
  it("streams text, tool events, tool results, then the grounded continuation", async () => {
    const events = await collect(runConversationTurn(request, { provider: toolThenTextProvider(), executeTool: okExecutor }));
    const types = events.map((e) => e.type);
    expect(types).toEqual([
      "text",
      "tool_use_start",
      "tool_use_delta",
      "tool_use_stop",
      "tool_result",
      "text",
      "done",
    ]);
    const final = events.filter((e) => e.type === "text").map((e) => (e as { text: string }).text).join("");
    expect(final).toContain("Your LeapScore is 802."); // proves tool_result reached call 2
  });

  it("feeds tool failures back to the model as is_error results, still completing the turn", async () => {
    const failingExecutor: ToolExecutor = async () => ({ ok: false, error: "timeout", message: "tool timed out" });
    const events = await collect(
      runConversationTurn(request, { provider: toolThenTextProvider(), executeTool: failingExecutor }),
    );
    const toolResult = events.find((e) => e.type === "tool_result");
    expect(toolResult).toMatchObject({ ok: false, message: "tool timed out" });
    expect(events[events.length - 1]).toEqual({ type: "done" });
  });

  it("plain text turns pass through untouched with a single done", async () => {
    const textOnly: AIProvider = {
      name: "mock",
      async *stream(): AsyncIterable<ChatDelta> {
        yield { type: "text", text: "hello" };
        yield { type: "done" };
      },
    };
    const events = await collect(runConversationTurn(request, { provider: textOnly, executeTool: okExecutor }));
    expect(events).toEqual([{ type: "text", text: "hello" }, { type: "done" }]);
  });

  it("stops at the iteration cap with an honest turn_limit event (no silent loops)", async () => {
    const alwaysTools: AIProvider = {
      name: "mock",
      async *stream(): AsyncIterable<ChatDelta> {
        yield { type: "tool_use_start", id: "t", name: "credit.get_leapscore" };
        yield { type: "tool_use_stop", id: "t" };
        yield { type: "done" };
      },
    };
    const events = await collect(
      runConversationTurn(request, { provider: alwaysTools, executeTool: okExecutor, maxIterations: 2 }),
    );
    expect(events.filter((e) => e.type === "tool_result")).toHaveLength(2);
    expect(events.find((e) => e.type === "turn_limit")).toMatchObject({ iterations: 2 });
    expect(events[events.length - 1]).toEqual({ type: "done" });
  });

  it("invokes memory onTurnComplete with the accumulated assistant text", async () => {
    let captured = "";
    await collect(
      runConversationTurn(request, {
        provider: toolThenTextProvider(),
        executeTool: okExecutor,
        memory: { onTurnComplete: async (t) => void (captured = t) },
      }),
    );
    expect(captured).toBe("Checking… Your LeapScore is 802.");
  });
});

describe("buildTurnMessages (session resume + context)", () => {
  const newestFirst = [
    { role: "assistant", content: "a2", created_at: "3" },
    { role: "user", content: "u2", created_at: "2" },
    { role: "user", content: "u1", created_at: "1" },
  ];

  it("assembles system + chronological history + current message", async () => {
    const messages = await buildTurnMessages({
      systemPrompt: "SYS",
      newestFirstHistory: newestFirst,
      historyLimit: 20,
      userMessage: "next question",
    });
    expect(messages.map((m) => m.content)).toEqual(["SYS", "u1", "u2", "a2", "next question"]);
  });

  it("does not duplicate the current message when history already ends with it", async () => {
    const messages = await buildTurnMessages({
      systemPrompt: "SYS",
      newestFirstHistory: [{ role: "user", content: "same", created_at: "1" }],
      historyLimit: 20,
      userMessage: "same",
    });
    expect(messages.filter((m) => m.content === "same")).toHaveLength(1);
  });

  it("appends memory facts to the system prompt when hooks provide them", async () => {
    const messages = await buildTurnMessages({
      systemPrompt: "SYS",
      newestFirstHistory: [],
      historyLimit: 20,
      userMessage: "hi",
      memory: { loadFacts: async () => ["wants home loan by Dec"] },
    });
    expect(messages[0]?.content).toContain("wants home loan by Dec");
  });
});
