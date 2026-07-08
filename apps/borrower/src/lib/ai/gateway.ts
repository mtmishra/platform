// ── LeapAI wiring for the borrower app ───────────────────────────────────
// Sprint 28 T8 — composes the ai-gateway pieces (T1–T7) with this app's
// server Supabase client. All policy/logic lives in packages; this file is
// wiring only. Server-only: imported exclusively from /api/ai/* routes.

import type { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  AnthropicProvider,
  AuditLogger,
  BudgetManager,
  budgetPolicyFromEnv,
  MockAIProvider,
  withAudit,
  withRedaction,
  type AIProvider,
  type AuditSink,
  type UsageStore,
} from "@leapmoney/ai-gateway";

// Type derived from the app's own factory so the generics always match the
// installed @supabase/ssr version exactly.
type Supabase = ReturnType<typeof createSupabaseServerClient>;

// Audit sink → EXISTING audit_log table (RLS: insert own). Failures are
// swallowed by AuditLogger by contract — never block the user response.
export function createAuditSink(supabase: Supabase, profileId: string): AuditSink {
  return {
    async insert(record) {
      const { error } = await supabase.from("audit_log").insert({
        user_id: record.user_id ?? profileId,
        action: record.action,
        entity: record.entity,
        metadata: record.metadata as never,
        ip: null,
      });
      if (error) throw new Error(error.message);
    },
  };
}

// Usage store → ai_usage table (migration 0023; RLS: own rows).
export function createUsageStore(supabase: Supabase): UsageStore {
  return {
    async getUsage(userId, day) {
      const { data } = await supabase
        .from("ai_usage")
        .select("tokens_in, tokens_out, cost_micros")
        .eq("user_id", userId)
        .eq("day", day)
        .maybeSingle();
      return {
        tokensIn: data?.tokens_in ?? 0,
        tokensOut: data?.tokens_out ?? 0,
        costMicros: data?.cost_micros ?? 0,
      };
    },
    async incrementUsage(userId, day, delta) {
      const current = await this.getUsage(userId, day);
      const { error } = await supabase.from("ai_usage").upsert(
        {
          user_id: userId,
          day,
          tokens_in: current.tokensIn + delta.tokensIn,
          tokens_out: current.tokensOut + delta.tokensOut,
          cost_micros: current.costMicros + delta.costMicros,
        },
        { onConflict: "user_id,day" },
      );
      if (error) throw new Error(error.message);
    },
  };
}

export function createBudgetManager(supabase: Supabase): BudgetManager {
  return new BudgetManager(createUsageStore(supabase), budgetPolicyFromEnv());
}

/** AI_PROVIDER=anthropic for live calls; anything else = deterministic mock. */
export function createBaseProvider(): AIProvider {
  return process.env["AI_PROVIDER"] === "anthropic" ? new AnthropicProvider() : new MockAIProvider();
}

/** Full pipeline: redaction (T6) innermost-out, audited (T4) around it. */
export function createAuditedProvider(
  supabase: Supabase,
  profileId: string,
  agentProfile: string,
  conversationId: string,
): AIProvider {
  const logger = new AuditLogger({ sink: createAuditSink(supabase, profileId) });
  return withAudit(withRedaction(createBaseProvider()), logger, {
    userId: profileId,
    agentProfile,
    conversationId,
  });
}

/** Rough token estimate for budget accounting until providers report usage. */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}
