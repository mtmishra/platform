// ── Debt Consolidation Engine ─────────────────────────────────────────────────
// Detects fragmented debt and models rolling it into one lower-rate loan.
// Rule-based; debts are injected by the caller. Pure.

import { emi, totalInterest } from "../finance";

export type DebtType = "personal_loan" | "credit_card" | "consumer_loan" | "bnpl";

export interface Debt {
  type: DebtType;
  outstanding: number;
  /** Annual interest rate (%). */
  rate: number;
  /** Current monthly outgo on this debt. */
  monthly_payment: number;
}

export interface DebtStructure {
  total_outstanding: number;
  total_monthly_payment: number;
  weighted_avg_rate: number;
  account_count: number;
}

export interface ConsolidationResult {
  consolidation_possible: boolean;
  current: DebtStructure;
  consolidated: {
    outstanding: number;
    rate: number;
    tenure_months: number;
    monthly_payment: number;
  } | null;
  estimated_monthly_savings: number;
  estimated_interest_savings: number;
}

const round2 = (v: number): number => Math.round(v * 100) / 100;

export function computeConsolidation(debts: Debt[], consolidationRate = 13.5, tenureMonths = 48): ConsolidationResult {
  const totalOutstanding = debts.reduce((s, d) => s + d.outstanding, 0);
  const totalMonthly = debts.reduce((s, d) => s + d.monthly_payment, 0);
  const weightedRate =
    totalOutstanding === 0 ? 0 : debts.reduce((s, d) => s + d.rate * d.outstanding, 0) / totalOutstanding;

  const current: DebtStructure = {
    total_outstanding: Math.round(totalOutstanding),
    total_monthly_payment: Math.round(totalMonthly),
    weighted_avg_rate: round2(weightedRate),
    account_count: debts.length,
  };

  // Worth consolidating only with 2+ debts and a rate improvement.
  const possible = debts.length >= 2 && consolidationRate < weightedRate - 0.5;
  if (!possible) {
    return {
      consolidation_possible: false,
      current,
      consolidated: null,
      estimated_monthly_savings: 0,
      estimated_interest_savings: 0,
    };
  }

  const newMonthly = emi(totalOutstanding, consolidationRate, tenureMonths);
  // Approx current total interest using each debt's implied remaining tenure.
  const currentInterest = debts.reduce((s, d) => {
    const months = d.monthly_payment > 0 ? Math.max(1, Math.round(d.outstanding / d.monthly_payment)) : tenureMonths;
    return s + totalInterest(d.outstanding, d.rate, months);
  }, 0);
  const newInterest = totalInterest(totalOutstanding, consolidationRate, tenureMonths);

  return {
    consolidation_possible: true,
    current,
    consolidated: {
      outstanding: Math.round(totalOutstanding),
      rate: consolidationRate,
      tenure_months: tenureMonths,
      monthly_payment: Math.round(newMonthly),
    },
    estimated_monthly_savings: Math.max(0, Math.round(totalMonthly - newMonthly)),
    estimated_interest_savings: Math.max(0, Math.round(currentInterest - newInterest)),
  };
}
