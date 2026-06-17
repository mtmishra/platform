// Unified dashboard bundle for Borrower Dashboard V1 (Sprint 11). Composes the
// Sprint 7–10 engines on mock inputs — no live bureau/lender integration. Swap
// the mock builders for real data sources to go live.

import { runMatch, SEED_LENDER_PRODUCTS, MOCK_MATCH_USER, MOCK_LOAN_REQUEST, type MatchResult } from "@leapmoney/match";
import { MOCK_OUTCOMES, summarize, type AnalyticsSummary } from "@leapmoney/outcomes";
import { getDemoCreditHealth, type CreditHealthBundle } from "@/lib/health-demo";

export interface DashboardBundle extends CreditHealthBundle {
  match: MatchResult;
  analytics: AnalyticsSummary;
  /** Mock score history for the improvement tracker (oldest → newest). */
  scoreHistory: Array<{ month: string; score: number }>;
}

export function getDashboardData(): DashboardBundle {
  const credit = getDemoCreditHealth();
  const match = runMatch(MOCK_MATCH_USER, MOCK_LOAN_REQUEST, { products: SEED_LENDER_PRODUCTS });
  const analytics = summarize(MOCK_OUTCOMES);

  const current = credit.leapScore.leapscore ?? 742;
  const scoreHistory = [
    { month: "Mar", score: current - 24 },
    { month: "Apr", score: current - 15 },
    { month: "May", score: current - 6 },
    { month: "Jun", score: current },
  ];

  return { ...credit, match, analytics, scoreHistory };
}
