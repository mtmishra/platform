// ── Recommendation + Savings Engine ───────────────────────────────────────────
// Aggregates signals from the credit, cash-flow, FOIR, balance-transfer and
// consolidation engines into prioritised, actionable recommendations and a
// consolidated savings view. Rule-based; pure; no ML.

import type { FoirRiskBand } from "../foir";

export type RecommendationPriority = "critical" | "high" | "medium" | "low";

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
  /** Estimated LeapScore points if actioned (0 = not score-related). */
  expected_score_impact: number;
  /** Plain-English approval-odds impact, e.g. "+8% approval odds". */
  expected_approval_impact: string;
  /** Estimated rupee savings if actioned (0 = not savings-related). */
  expected_savings: number;
}

export interface SavingsOpportunity {
  monthly_savings: number;
  annual_savings: number;
  lifetime_savings: number;
}

export interface RecommendationInput {
  /** Credit-card utilization 0–1. */
  utilization: number;
  hard_inquiries_6m: number;
  has_derogatory: boolean;
  foir_risk: FoirRiskBand;
  balance_transfer: { possible: boolean; monthly_savings: number; total_interest_savings: number };
  consolidation: { possible: boolean; estimated_monthly_savings: number; estimated_interest_savings: number };
  inactive_cards: number;
  low_salary_balance: boolean;
}

const PRIORITY_ORDER: Record<RecommendationPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

export interface FinancialGuidance {
  recommendations: Recommendation[];
  savings: SavingsOpportunity;
}

export function computeRecommendations(input: RecommendationInput): FinancialGuidance {
  const recs: Recommendation[] = [];

  if (input.has_derogatory) {
    recs.push({
      id: "resolve_derogatory",
      title: "Resolve your overdue / settled account",
      description: "A derogatory account is the biggest drag on your profile. Clearing it is the highest-impact action you can take.",
      priority: "critical",
      expected_score_impact: 30,
      expected_approval_impact: "+15% approval odds",
      expected_savings: 0,
    });
  }

  if (input.foir_risk === "critical" || input.foir_risk === "warning") {
    recs.push({
      id: "lower_foir",
      title: "Lower your FOIR before applying",
      description: "Too much of your income is committed to existing obligations. Reduce them or pick a smaller amount / longer tenure to bring the EMI down.",
      priority: input.foir_risk === "critical" ? "critical" : "high",
      expected_score_impact: 0,
      expected_approval_impact: "+12% approval odds",
      expected_savings: 0,
    });
  }

  if (input.utilization > 0.3) {
    recs.push({
      id: "reduce_utilization",
      title: "Reduce credit-card utilization below 30%",
      description: `You're using ${Math.round(input.utilization * 100)}% of your limit. Bringing it under 30% (ideally 10%) is the fastest score boost available.`,
      priority: "high",
      expected_score_impact: 20,
      expected_approval_impact: "+8% approval odds",
      expected_savings: 0,
    });
  }

  if (input.balance_transfer.possible) {
    recs.push({
      id: "balance_transfer",
      title: "Transfer your loan to a lower rate",
      description: `A balance transfer to a lower-rate lender could save you about ₹${input.balance_transfer.monthly_savings.toLocaleString("en-IN")}/month.`,
      priority: "high",
      expected_score_impact: 0,
      expected_approval_impact: "—",
      expected_savings: input.balance_transfer.total_interest_savings,
    });
  }

  if (input.consolidation.possible) {
    recs.push({
      id: "consolidate_debt",
      title: "Consolidate your debts",
      description: `Rolling your debts into one lower-rate loan could cut your monthly outgo by about ₹${input.consolidation.estimated_monthly_savings.toLocaleString("en-IN")}.`,
      priority: "high",
      expected_score_impact: 5,
      expected_approval_impact: "—",
      expected_savings: input.consolidation.estimated_interest_savings,
    });
  }

  if (input.hard_inquiries_6m >= 3) {
    recs.push({
      id: "wait_before_applying",
      title: "Wait 60–90 days before applying",
      description: `${input.hard_inquiries_6m} recent enquiries signal credit hunger. Pausing new applications lets them age out.`,
      priority: "medium",
      expected_score_impact: 12,
      expected_approval_impact: "+10% approval odds",
      expected_savings: 0,
    });
  }

  if (input.low_salary_balance) {
    recs.push({
      id: "improve_balance",
      title: "Improve your salary account balance",
      description: "A healthier average balance in your salary account reassures lenders about repayment capacity.",
      priority: "medium",
      expected_score_impact: 0,
      expected_approval_impact: "+5% approval odds",
      expected_savings: 0,
    });
  }

  if (input.inactive_cards > 0) {
    recs.push({
      id: "close_inactive_card",
      title: "Review inactive credit cards",
      description: "An unused card can be closed to simplify your profile — but keep your oldest card open to preserve credit age.",
      priority: "low",
      expected_score_impact: 5,
      expected_approval_impact: "—",
      expected_savings: 0,
    });
  }

  recs.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const monthly = input.balance_transfer.monthly_savings + input.consolidation.estimated_monthly_savings;
  const lifetime = input.balance_transfer.total_interest_savings + input.consolidation.estimated_interest_savings;
  const savings: SavingsOpportunity = {
    monthly_savings: Math.round(monthly),
    annual_savings: Math.round(monthly * 12),
    lifetime_savings: Math.round(lifetime),
  };

  return { recommendations: recs, savings };
}
