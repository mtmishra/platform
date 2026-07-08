import { describe, expect, it } from "vitest";
import { AuditLogger } from "./audit-logger";
import type { AuditRecord, AuditSink } from "./audit-logger";
import { withAudit } from "./with-audit";
import { MockAIProvider } from "../providers/mock-provider";
import type { AIProvider, ChatDelta, ChatRequest } from "../types";

function memorySink(): AuditSink & { records: AuditRecord[] } {
  const records: AuditRecord[] = [];
  return {
    records,
    insert(record) {
      records.push(record);
      return Promise.resolve();
    },
  };
}

function failingSink(): AuditSink {
  return {
    insert() {
      return Promise.reject(new Error("db down"));
    },
  };
}

function makeLogger(sink: AuditSink) {
  let seq = 0;
  return new AuditLogger({
    sink,
    onSinkError: () => {},
    newCorrelationId: () => `corr-${++seq}`,
  });
}

async function collect(deltas: AsyncIterable<ChatDelta>): Promise<ChatDelta[]> {
  const out: ChatDelta[] = [];
  for await (const d of deltas) out.push(d);
  return out;
}

const ctx = { userId: "user-1", agentProfile: "borrower" };
const request: ChatRequest = { messages: [{ role: "user", content: "Explain my LeapScore" }] };

/** Wait for fire-and-forget log() promises queued on the microtask queue. */
const settle = () => new Promise((r) => setTimeout(r, 0));

describe("AuditLogger", () => {
  it("stamps context and writes through the sink", async () => {
    const sink = memorySink();
    const logger = makeLogger(sink);
    await logger.log(ctx, "ai.request", "ai_gateway", { a: 1 });
    expect(sink.records).toEqual([
      {
        user_id: "user-1",
        action: "ai.request",
        entity: "ai_gateway",
        metadata: { a: 1, agent_profile: "borrower" },
      },
    ]);
  });

  it("never throws when the sink fails", async () => {
    const logger = makeLogger(failingSink());
    await expect(logger.log(ctx, "ai.request", null, {})).resolves.toBeUndefined();
  });

  it("issues unique correlation ids", () => {
    const logger = makeLogger(memorySink());
    expect(logger.createCorrelationId()).not.toBe(logger.createCorrelationId());
  });

  it("accepts open-set event names (future MCP events need no code change)", async () => {
    const sink = memorySink();
    const logger = makeLogger(sink);
    await logger.log(ctx, "ai.mcp.tool_call", "credit.get_leapscore", { via: "mcp" });
    expect(sink.records[0]?.action).toBe("ai.mcp.tool_call");
  });
});

describe("withAudit", () => {
  it("re-yields the wrapped provider's deltas unchanged (streaming preserved)", async () => {
    const sink = memorySink();
    const audited = withAudit(new MockAIProvider(), makeLogger(sink), ctx);
    const deltas = await collect(audited.stream(request));
    const plain = await collect(new MockAIProvider().stream(request));
    expect(deltas).toEqual(plain);
  });

  it("logs ai.request then ai.response with metadata only — no message content", async () => {
    const sink = memorySink();
    const audited = withAudit(new MockAIProvider(), makeLogger(sink), ctx);
    await collect(audited.stream(request));
    await settle();

    const actions = sink.records.map((r) => r.action);
    expect(actions).toEqual(["ai.request", "ai.response"]);

    const serialized = JSON.stringify(sink.records);
    expect(serialized).not.toContain("Explain my LeapScore"); // DPDP: no content in audit
    expect(sink.records[1]?.metadata).toMatchObject({
      provider: "mock",
      text_deltas: expect.any(Number),
      text_chars: expect.any(Number),
      duration_ms: expect.any(Number),
      correlation_id: "corr-1",
    });
  });

  it("shares one correlation id across all events of a request", async () => {
    const sink = memorySink();
    const audited = withAudit(new MockAIProvider(), makeLogger(sink), ctx);
    await collect(audited.stream(request));
    await collect(audited.stream(request));
    await settle();

    const ids = sink.records.map((r) => r.metadata["correlation_id"]);
    expect(ids).toEqual(["corr-1", "corr-1", "corr-2", "corr-2"]);
  });

  it("logs each tool_use event with tool name and id", async () => {
    const toolProvider: AIProvider = {
      name: "mock",
      async *stream(): AsyncIterable<ChatDelta> {
        yield { type: "tool_use_start", id: "toolu_1", name: "credit.get_leapscore" };
        yield { type: "tool_use_delta", id: "toolu_1", partialInputJson: "{}" };
        yield { type: "tool_use_stop", id: "toolu_1" };
        yield { type: "text", text: "802" };
        yield { type: "done" };
      },
    };
    const sink = memorySink();
    const audited = withAudit(toolProvider, makeLogger(sink), ctx);
    await collect(audited.stream(request));
    await settle();

    const toolEvent = sink.records.find((r) => r.action === "ai.tool_use");
    expect(toolEvent).toMatchObject({ entity: "credit.get_leapscore" });
    const response = sink.records.find((r) => r.action === "ai.response");
    expect(response?.metadata).toMatchObject({ tool_use_count: 1, tool_names: ["credit.get_leapscore"] });
  });

  it("logs ai.error and rethrows when the provider stream fails", async () => {
    const broken: AIProvider = {
      name: "mock",
      // eslint-disable-next-line require-yield
      async *stream(): AsyncIterable<ChatDelta> {
        throw new Error("provider exploded");
      },
    };
    const sink = memorySink();
    const audited = withAudit(broken, makeLogger(sink), ctx);
    await expect(collect(audited.stream(request))).rejects.toThrow("provider exploded");
    await settle();

    const error = sink.records.find((r) => r.action === "ai.error");
    expect(error?.metadata).toMatchObject({ error_message: "provider exploded" });
  });

  it("a failing sink never disturbs the user stream", async () => {
    const audited = withAudit(new MockAIProvider(), makeLogger(failingSink()), ctx);
    const deltas = await collect(audited.stream(request));
    expect(deltas[deltas.length - 1]).toEqual({ type: "done" });
  });
});
