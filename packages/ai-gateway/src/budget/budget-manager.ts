// ── BudgetManager ─────────────────────────────────────────────────────────
// Sprint 28 T5 — PRD §4.2 / §9-R5 cost control. Per-user daily token budget
// backed by the ai_usage table (migration 0023: unique (user_id, day),
// integer counters). Storage is injected (UsageStore) — T8's route provides
// the Supabase-backed implementation; tests use memory.
//
// Check BEFORE the provider call; record AFTER it completes. A denial is a
// structured result, not an exception — the orchestrator renders it as the
// friendly refusal defined in Conversation OS (never a raw error).

export interface DailyUsage {
  tokensIn: number;
  tokensOut: number;
  costMicros: number;
}

export interface UsageStore {
  /** Usage accumulated for this user on this ISO date (YYYY-MM-DD); zeros if no row. */
  getUsage(userId: string, day: string): Promise<DailyUsage>;
  /** Atomically add to the user's counters for the day (upsert on (user_id, day)). */
  incrementUsage(userId: string, day: string, delta: DailyUsage): Promise<void>;
}

export interface BudgetPolicy {
  /** Max tokens (in + out) per user per day. */
  dailyTokenLimit: number;
}

export type BudgetDecision =
  | { allowed: true; remainingTokens: number }
  | { allowed: false; reason: "daily_token_budget_exhausted"; remainingTokens: 0; resetsAt: string };

const DEFAULT_DAILY_TOKEN_LIMIT = 200_000;

/** Reads AI_DAILY_TOKEN_BUDGET_USER; falls back to a safe default. */
export function budgetPolicyFromEnv(env: Record<string, string | undefined> = process.env): BudgetPolicy {
  const raw = env["AI_DAILY_TOKEN_BUDGET_USER"];
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return { dailyTokenLimit: Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_DAILY_TOKEN_LIMIT };
}

export class BudgetManager {
  constructor(
    private readonly store: UsageStore,
    private readonly policy: BudgetPolicy,
    private readonly today: () => string = () => new Date().toISOString().slice(0, 10),
  ) {}

  async check(userId: string): Promise<BudgetDecision> {
    const day = this.today();
    const usage = await this.store.getUsage(userId, day);
    const used = usage.tokensIn + usage.tokensOut;
    const remaining = this.policy.dailyTokenLimit - used;

    if (remaining <= 0) {
      // Budget resets at the next UTC midnight (day column is a date).
      const resetsAt = `${nextUtcDay(day)}T00:00:00Z`;
      return { allowed: false, reason: "daily_token_budget_exhausted", remainingTokens: 0, resetsAt };
    }
    return { allowed: true, remainingTokens: remaining };
  }

  async record(userId: string, delta: DailyUsage): Promise<void> {
    await this.store.incrementUsage(userId, this.today(), delta);
  }
}

function nextUtcDay(isoDay: string): string {
  const d = new Date(`${isoDay}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}
