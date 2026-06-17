// ── Credit Health domain types ────────────────────────────────────────────────
// Credit Health is the borrower-facing "how healthy is my credit?" view (0–100),
// distinct from the loan-readiness LeapScore (300–900). Built from the same
// Sprint 7 inputs (LeapScoreInput). Source: R3 §4 (rejection/DPD), §9, Appendix D.

import type { AccountType, ImprovementAction } from "../types";

export type Severity = "low" | "medium" | "high" | "critical";

export type HealthBandLabel = "Excellent" | "Good" | "Fair" | "Poor";

export type HealthCategory =
  | "payment_history"
  | "utilization"
  | "enquiries"
  | "account_age"
  | "derogatory";

// ── Risk + impact ──────────────────────────────────────────────────────────
export interface RiskIndicator {
  id: string;
  title: string;
  severity: Severity;
  detail: string;
  category: HealthCategory;
}

export interface ImpactScore {
  category: HealthCategory;
  label: string;
  /** Points this category currently contributes. */
  points: number;
  /** Maximum points the category can contribute. */
  max: number;
  status: "good" | "watch" | "risk";
}

export interface CreditHealthResult {
  /** 0–100 health score. */
  health_score: number;
  health_band: HealthBandLabel;
  risk_indicators: RiskIndicator[];
  impact_scores: ImpactScore[];
  generated_at: string;
}

// ── DPD translator ───────────────────────────────────────────────────────────
export interface DpdInsight {
  lender: string;
  account_type: AccountType;
  /** Worst days-past-due seen in the 36-month window (0 = always on time). */
  worst_dpd: number;
  status: string;
  plain_english: string;
  severity: Severity;
}

// ── Improvement plan ──────────────────────────────────────────────────────────
export interface ImprovementPlan {
  thirty_day: ImprovementAction[];
  sixty_day: ImprovementAction[];
  ninety_day: ImprovementAction[];
}

// ── Score simulator ───────────────────────────────────────────────────────────
export type SimulationId =
  | "reduce_utilization"
  | "clear_overdue"
  | "no_new_enquiries"
  | "pay_on_time_6m";

export interface SimulationResult {
  id: SimulationId;
  label: string;
  current_score: number;
  estimated_new_score: number;
  estimated_delta: number;
  /** Lending options unlocked by crossing band milestones. */
  unlocked_options: string[];
}
