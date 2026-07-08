import { describe, expect, it } from "vitest";
import { BudgetManager, budgetPolicyFromEnv } from "./budget-manager";
import type { DailyUsage, UsageStore } from "./budget-manager";

function memoryStore(): UsageStore & { rows: Map<string, DailyUsage> } {
  const rows = new Map<string, DailyUsage>();
  return {
    rows,
    getUsage(userId, day) {
      return Promise.resolve(rows.get(`${userId}|${day}`) ?? { tokensIn: 0, tokensOut: 0, costMicros: 0 });
    },
    incrementUsage(userId, day, delta) {
      const key = `${userId}|${day}`;
      const cur = rows.get(key) ?? { tokensIn: 0, tokensOut: 0, costMicros: 0 };
      rows.set(key, {
        tokensIn: cur.tokensIn + delta.tokensIn,
        tokensOut: cur.tokensOut + delta.tokensOut,
        costMicros: cur.costMicros + delta.costMicros,
      });
      return Promise.resolve();
    },
  };
}

const FIXED_DAY = () => "2026-07-08";

describe("budgetPolicyFromEnv", () => {
  it("reads AI_DAILY_TOKEN_BUDGET_USER", () => {
    expect(budgetPolicyFromEnv({ AI_DAILY_TOKEN_BUDGET_USER: "5000" })).toEqual({ dailyTokenLimit: 5000 });
  });
  it("falls back to a safe default on missing/garbage values", () => {
    expect(budgetPolicyFromEnv({}).dailyTokenLimit).toBeGreaterThan(0);
    expect(budgetPolicyFromEnv({ AI_DAILY_TOKEN_BUDGET_USER: "-3" }).dailyTokenLimit).toBeGreaterThan(0);
    expect(budgetPolicyFromEnv({ AI_DAILY_TOKEN_BUDGET_USER: "lots" }).dailyTokenLimit).toBeGreaterThan(0);
  });
});

describe("BudgetManager", () => {
  it("allows a fresh user with full remaining budget", async () => {
    const manager = new BudgetManager(memoryStore(), { dailyTokenLimit: 1000 }, FIXED_DAY);
    expect(await manager.check("u1")).toEqual({ allowed: true, remainingTokens: 1000 });
  });

  it("counts recorded usage against the same user and day", async () => {
    const store = memoryStore();
    const manager = new BudgetManager(store, { dailyTokenLimit: 1000 }, FIXED_DAY);
    await manager.record("u1", { tokensIn: 300, tokensOut: 200, costMicros: 42 });
    expect(await manager.check("u1")).toEqual({ allowed: true, remainingTokens: 500 });
  });

  it("denies with a structured reason and UTC reset time once exhausted", async () => {
    const manager = new BudgetManager(memoryStore(), { dailyTokenLimit: 100 }, FIXED_DAY);
    await manager.record("u1", { tokensIn: 60, tokensOut: 40, costMicros: 0 });
    expect(await manager.check("u1")).toEqual({
      allowed: false,
      reason: "daily_token_budget_exhausted",
      remainingTokens: 0,
      resetsAt: "2026-07-09T00:00:00Z",
    });
  });

  it("budgets are per-user — one user exhausting never affects another", async () => {
    const store = memoryStore();
    const manager = new BudgetManager(store, { dailyTokenLimit: 100 }, FIXED_DAY);
    await manager.record("heavy", { tokensIn: 100, tokensOut: 0, costMicros: 0 });
    expect((await manager.check("heavy")).allowed).toBe(false);
    expect((await manager.check("light")).allowed).toBe(true);
  });

  it("a new day resets the budget (day key changes)", async () => {
    const store = memoryStore();
    let day = "2026-07-08";
    const manager = new BudgetManager(store, { dailyTokenLimit: 100 }, () => day);
    await manager.record("u1", { tokensIn: 100, tokensOut: 0, costMicros: 0 });
    expect((await manager.check("u1")).allowed).toBe(false);
    day = "2026-07-09";
    expect((await manager.check("u1")).allowed).toBe(true);
  });

  it("accumulates cost_micros as integers (no float drift)", async () => {
    const store = memoryStore();
    const manager = new BudgetManager(store, { dailyTokenLimit: 10_000 }, FIXED_DAY);
    for (let i = 0; i < 100; i++) await manager.record("u1", { tokensIn: 1, tokensOut: 1, costMicros: 3 });
    expect(store.rows.get("u1|2026-07-08")).toEqual({ tokensIn: 100, tokensOut: 100, costMicros: 300 });
  });
});
