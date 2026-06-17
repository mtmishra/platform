// Cash Flow / Income Intelligence engine. Pure + deterministic. Consumes the
// Sprint 7 CashFlowData (AA-style bank data) and produces income intelligence,
// a 0–100 cash-flow score, FOIR analysis, and a verified-income summary.

import type { CashFlowData } from "../types";
import type {
  CashFlowBand,
  CashFlowIntelligence,
  CashFlowScoreResult,
  FoirAnalysis,
  FoirRisk,
  IncomeConfidence,
  IncomeIntelligence,
  VerifiedIncome,
} from "./types";

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

function buildIncome(cf: CashFlowData): IncomeIntelligence {
  const monthly = cf.salary_credit_amount ?? cf.avg_monthly_credit_6mo;

  // Consistency: salary detection + trend + clean balance history.
  let consistency = 50;
  if (cf.salary_credit_detected) consistency += 25;
  if (cf.cash_flow_trend === "growing" || cf.cash_flow_trend === "stable") consistency += 15;
  consistency -= cf.months_with_negative_balance * 6;
  consistency = clamp(consistency, 0, 100);

  const volatility = clamp(100 - consistency, 0, 100);

  const confidence: IncomeConfidence =
    cf.salary_credit_detected && cf.aa_data_months >= 6 && cf.months_with_returned_emi === 0
      ? "high"
      : cf.aa_data_months >= 3
        ? "medium"
        : "low";

  return {
    monthly_income: monthly,
    salary_detected: cf.salary_credit_detected,
    salary_day: cf.salary_credit_day,
    income_consistency: Math.round(consistency),
    income_volatility: Math.round(volatility),
    income_confidence: confidence,
    income_source: cf.income_source_type,
  };
}

function bandFor(score: number): CashFlowBand {
  if (score >= 75) return "strong";
  if (score >= 50) return "moderate";
  return "weak";
}

function buildCashFlowScore(cf: CashFlowData): CashFlowScoreResult {
  const stability = cf.cash_flow_trend === "growing" ? 35 : cf.cash_flow_trend === "stable" ? 25 : 8;
  const balanceHealth = cf.months_with_negative_balance === 0 ? 35 : cf.months_with_negative_balance <= 2 ? 20 : 5;
  const obligations = clamp(30 - cf.months_with_returned_emi * 10, 0, 30);
  const score = clamp(stability + balanceHealth + obligations, 0, 100);

  const insights: string[] = [];
  insights.push(
    cf.cash_flow_trend === "growing"
      ? "Your inflows are trending up over the last 6 months."
      : cf.cash_flow_trend === "stable"
        ? "Your inflows are steady month to month."
        : "Your inflows have been declining — lenders watch this closely.",
  );
  insights.push(
    cf.months_with_negative_balance === 0
      ? "No negative-balance months — strong account conduct."
      : `${cf.months_with_negative_balance} month(s) ended in the red — keep a buffer to improve this.`,
  );
  if (cf.months_with_returned_emi > 0) {
    insights.push(`${cf.months_with_returned_emi} bounced EMI(s) detected — these hurt approval odds.`);
  }
  const savingsRate = cf.avg_monthly_credit_6mo > 0
    ? Math.round(((cf.avg_monthly_credit_6mo - cf.avg_monthly_debit_6mo) / cf.avg_monthly_credit_6mo) * 100)
    : 0;
  if (savingsRate > 0) insights.push(`You retain about ${savingsRate}% of your inflows each month.`);

  return { score, band: bandFor(score), insights };
}

function buildFoir(monthlyIncome: number, currentFoir: number): FoirAnalysis {
  const recommended = 0.4;
  const risk_level: FoirRisk = currentFoir < 0.35 ? "low" : currentFoir <= 0.5 ? "medium" : "high";
  const emi_headroom = Math.max(0, Math.round((recommended - currentFoir) * monthlyIncome));
  return {
    current_foir: Math.round(currentFoir * 100) / 100,
    recommended_foir: recommended,
    risk_level,
    emi_headroom,
  };
}

/**
 * Compute the full Cash Flow Intelligence bundle from AA-style bank data.
 * `currentFoir` is the borrower's existing fixed-obligation ratio (0–1).
 */
export function computeCashFlowIntelligence(cf: CashFlowData, currentFoir: number): CashFlowIntelligence {
  const income = buildIncome(cf);
  const cash_flow_score = buildCashFlowScore(cf);
  const foir = buildFoir(income.monthly_income, currentFoir);

  const verified_income: VerifiedIncome = {
    monthly_income: income.monthly_income,
    verification_status: cf.aa_consent_active && income.salary_detected ? "verified" : "pending",
    last_updated: new Date().toISOString(),
  };

  return { income, cash_flow_score, foir, verified_income, generated_at: new Date().toISOString() };
}
