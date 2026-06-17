// ── Cash Flow / Income Intelligence types ─────────────────────────────────────
// Extends LeapScore beyond bureau data using Account-Aggregator-style bank
// cash-flow data (the Sprint 7 CashFlowData model). Source: R3 §8 (alternative
// data), §9 (LeapScore Layer B). Demo only — no live AA integration.

export type IncomeConfidence = "high" | "medium" | "low";
export type CashFlowBand = "strong" | "moderate" | "weak";
export type FoirRisk = "low" | "medium" | "high";
export type VerificationStatus = "verified" | "pending" | "unverified";

export interface IncomeIntelligence {
  /** Detected monthly income (₹). */
  monthly_income: number;
  salary_detected: boolean;
  salary_day: number | null;
  /** 0–100; higher = more consistent month to month. */
  income_consistency: number;
  /** 0–100; higher = more volatile (less stable). */
  income_volatility: number;
  income_confidence: IncomeConfidence;
  income_source: string;
}

export interface CashFlowScoreResult {
  /** 0–100. */
  score: number;
  band: CashFlowBand;
  insights: string[];
}

export interface FoirAnalysis {
  /** Current fixed-obligations-to-income ratio (0–1). */
  current_foir: number;
  /** Recommended ceiling (0–1). */
  recommended_foir: number;
  risk_level: FoirRisk;
  /** Remaining monthly EMI headroom at the recommended ceiling (₹). */
  emi_headroom: number;
}

export interface VerifiedIncome {
  monthly_income: number;
  verification_status: VerificationStatus;
  last_updated: string;
}

export interface CashFlowIntelligence {
  income: IncomeIntelligence;
  cash_flow_score: CashFlowScoreResult;
  foir: FoirAnalysis;
  verified_income: VerifiedIncome;
  generated_at: string;
}
