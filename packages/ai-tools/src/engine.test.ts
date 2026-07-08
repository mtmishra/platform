import { describe, expect, it, vi } from "vitest";
import { ToolEngine } from "./engine";
import type { ToolAuditEvent, ToolExecutionContext } from "./engine";
import { createDefaultRegistry } from "./registry";

const registry = createDefaultRegistry();
const borrower: ToolExecutionContext = { userId: "u1", profile: "borrower", correlationId: "corr-1" };

function engine(handlers: ConstructorParameters<typeof ToolEngine>[0]["handlers"], onAudit?: (e: ToolAuditEvent) => void) {
  return new ToolEngine({ registry, handlers, ...(onAudit ? { onAudit } : {}) });
}

describe("ToolEngine (T10)", () => {
  it("executes a permitted read tool and formats the result", async () => {
    const e = engine({ "credit.get_leapscore": async () => ({ score: 802, band: "excellent" }) });
    const result = await e.execute("credit.get_leapscore", {}, borrower);
    expect(result).toMatchObject({ ok: true, toolId: "credit.get_leapscore", data: { score: 802 }, attempts: 1 });
  });

  it("rejects unknown tools", async () => {
    const result = await engine({}).execute("nope.tool", {}, borrower);
    expect(result).toMatchObject({ ok: false, error: "unknown_tool" });
  });

  it("refuses placeholder tools with an honest message", async () => {
    const result = await engine({ "payment.collect": async () => ({}) }).execute(
      "payment.collect",
      { purpose: "fee", amount_paise: 100 },
      { ...borrower, confirmed: true },
    );
    expect(result).toMatchObject({ ok: false, error: "placeholder_unavailable" });
  });

  it("denies profiles outside the spec permissions (server-side, not prompt)", async () => {
    const e = engine({ "notify.send": async () => ({ queued: 1 }) });
    const result = await e.execute("notify.send", {}, { ...borrower, confirmed: true }); // borrower not permitted
    expect(result).toMatchObject({ ok: false, error: "permission_denied" });
  });

  it("blocks confirmed_write tools without an approved confirmation", async () => {
    const e = engine({ "application.create_draft": async () => ({ application_id: "AP-1" }) });
    const denied = await e.execute("application.create_draft", { lender_id: "hdfc", amount: 100 }, borrower);
    expect(denied).toMatchObject({ ok: false, error: "confirmation_required" });

    const allowed = await e.execute(
      "application.create_draft",
      { lender_id: "hdfc", amount: 100 },
      { ...borrower, confirmed: true },
    );
    expect(allowed).toMatchObject({ ok: true, data: { application_id: "AP-1" } });
  });

  it("reports missing handlers as a wiring error, not a crash", async () => {
    const result = await engine({}).execute("kb.search", { query: "emi" }, borrower);
    expect(result).toMatchObject({ ok: false, error: "no_handler" });
  });

  it("times out per the spec and reports attempts", async () => {
    vi.useFakeTimers();
    const e = engine({ "credit.get_leapscore": () => new Promise(() => {}) }); // never resolves
    const pending = e.execute("credit.get_leapscore", {}, borrower);
    await vi.runAllTimersAsync();
    const result = await pending;
    vi.useRealTimers();
    expect(result).toMatchObject({ ok: false, error: "timeout", attempts: 3 }); // 1 + 2 retries
  });

  it("retries per policy and succeeds on a later attempt", async () => {
    let calls = 0;
    const e = engine({
      "kb.search": async () => {
        calls += 1;
        if (calls < 2) throw new Error("transient");
        return { chunks: [] };
      },
    });
    const result = await e.execute("kb.search", { query: "x" }, borrower);
    expect(result).toMatchObject({ ok: true, attempts: 2 });
  });

  it("does not retry no-retry tools", async () => {
    let calls = 0;
    const e = engine({
      "match.check_eligibility": async () => {
        calls += 1;
        throw new Error("boom");
      },
    });
    const result = await e.execute("match.check_eligibility", { loan_type: "personal" }, borrower);
    expect(result).toMatchObject({ ok: false, error: "handler_error", attempts: 1 });
    expect(calls).toBe(1);
  });

  it("audits every execution with names-only args by default — never result data", async () => {
    const events: ToolAuditEvent[] = [];
    const e = engine({ "credit.get_leapscore": async () => ({ score: 802 }) }, (ev) => events.push(ev));
    await e.execute("credit.get_leapscore", { verbose: true }, borrower);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      action: "ai.tool_execute",
      toolId: "credit.get_leapscore",
      outcome: "ok",
      correlationId: "corr-1",
      args: ["verbose"],
    });
    expect(JSON.stringify(events[0])).not.toContain("802"); // results never audited
  });

  it("audit hook failures never affect the tool result (T4 contract)", async () => {
    const e = engine({ "credit.get_leapscore": async () => ({ score: 1 }) }, () => {
      throw new Error("audit down");
    });
    const result = await e.execute("credit.get_leapscore", {}, borrower);
    expect(result.ok).toBe(true);
  });
});
