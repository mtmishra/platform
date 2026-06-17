// ── Credit Intelligence domain types ─────────────────────────────────────────
// Source of truth: R3 Credit Intelligence Report (§1 Bureau Intelligence,
// §9 LeapScore Data Dictionary). These types model bureau pulls, credit-report
// tradelines/inquiries, score factors, and the LeapScore v2 output contract.
// They mirror the SQL in supabase/migrations/0004_credit_schema.sql.

// ── Bureaus (R3 §1) ───────────────────────────────────────────────────────────
// CIBIL / Experian / CRIF use a 300–900 scale. Equifax India uses 1–999 and
// must be normalized before display or weighting (R3 §1.5).
export type BureauName = "cibil" | "experian" | "crif" | "equifax";

export const BUREAUS: readonly BureauName[] = ["cibil", "experian", "crif", "equifax"];

/** Native score range per bureau (R3 §1.6). */
export const BUREAU_RANGE: Record<BureauName, { min: number; max: number }> = {
  cibil: { min: 300, max: 900 },
  experian: { min: 300, max: 900 },
  crif: { min: 300, max: 900 },
  equifax: { min: 1, max: 999 },
};

/** Standard scale all LeapScore math operates on. */
export const STANDARD_RANGE = { min: 300, max: 900 } as const;

export type PullType = "soft" | "hard";

// ── Credit report structures (R3 §1.2, §9.1.1) ────────────────────────────────
export type AccountType =
  | "credit_card"
  | "personal_loan"
  | "home_loan"
  | "auto_loan"
  | "overdraft"
  | "gold_loan"
  | "microfinance"
  | "business_loan";

export type AccountStatus =
  | "standard"
  | "settlement"
  | "write_off"
  | "npa"
  | "closed";

export type OwnershipType = "individual" | "joint" | "guarantor";

export interface Tradeline {
  account_type: AccountType;
  lender_name: string;
  sanctioned_amount: number;
  current_balance: number;
  /** For revolving credit; null for installment loans. */
  credit_limit: number | null;
  amount_overdue: number;
  emi_amount: number;
  account_status: AccountStatus;
  /** Up to 36 entries; 0 = on time, value = days past due (R3 §1.2). */
  dpd_last_36_months: number[];
  date_opened: string;
  date_closed: string | null;
  ownership_type: OwnershipType;
}

export interface Inquiry {
  bureau: BureauName;
  inquiry_date: string;
  lender_name: string;
  loan_type: AccountType;
  amount: number;
  pull_type: PullType;
}

/** Bureau-reported reason code affecting the raw score (R3 §1.2, Section 4). */
export interface ScoreFactor {
  bureau: BureauName;
  code: string;
  description: string;
  /** Positive = helping, negative = hurting. */
  direction: "positive" | "negative";
}

// ── A single bureau pull result ───────────────────────────────────────────────
export interface BureauReport {
  bureau: BureauName;
  /** Score on the bureau's native scale (e.g. Equifax 1–999). null if no history. */
  score: number | null;
  report_date: string;
  pull_type: PullType;
  tradelines: Tradeline[];
  inquiries: Inquiry[];
  score_factors: ScoreFactor[];
}

// ── Cash-flow & behavior inputs (R3 §9.1.1 Layers B & C) ──────────────────────
export type CashFlowTrend = "growing" | "stable" | "declining";
export type IncomeSourceType = "salaried" | "business" | "mixed" | "unclear";

export interface CashFlowData {
  aa_consent_active: boolean;
  bank_account_count: number;
  avg_monthly_credit_6mo: number;
  avg_monthly_debit_6mo: number;
  salary_credit_detected: boolean;
  salary_credit_day: number | null;
  salary_credit_amount: number | null;
  months_with_negative_balance: number;
  months_with_returned_emi: number;
  cash_flow_trend: CashFlowTrend;
  aa_data_months: number;
  income_source_type: IncomeSourceType;
}

export interface PaymentBehaviorData {
  utility_bills_tracked: boolean;
  /** 0.0–1.0 on-time ratio over the last 12 months. */
  utility_payment_on_time_pct: number;
  /** last 12 months; true = paid on time. */
  postpaid_mobile_payment_history: boolean[];
  gst_filed_months: number;
  gst_filing_regular: boolean;
}

export interface AccountHealthData {
  /** total balance ÷ total limit (0.0–1.0+). */
  credit_utilization_overall: number;
  oldest_account_age_months: number;
  hard_inquiries_last_6m: number;
  hard_inquiries_last_12m: number;
}

// ── LeapScore engine I/O (R3 §9) ──────────────────────────────────────────────
export interface LeapScoreInput {
  reports: BureauReport[];
  cashFlow: CashFlowData | null;
  behavior: PaymentBehaviorData | null;
  health: AccountHealthData;
}

export type ConfidenceLevel = "high" | "medium" | "low" | "alternative_data_only";

export type DataSource = BureauName | "aa" | "bbps" | "gst";

export type ImpactLevel = "high" | "medium" | "low";

export type ActionDifficulty = "easy" | "medium" | "hard";

export interface ScoreContributor {
  factor: string;
  impact: ImpactLevel;
  detail: string;
}

export interface ScoreDetractor extends ScoreContributor {
  fix: string;
}

export interface ImprovementAction {
  action: string;
  estimated_point_gain: number;
  difficulty: ActionDifficulty;
  timeline_days: number;
  /** 1 = highest priority. */
  priority: number;
}

export interface CreditCostIndicator {
  current_rate_estimate: number;
  at_750_rate: number;
  monthly_saving_on_10L_5yr: number;
  total_saving_5yr: number;
}

export interface NextMilestone {
  target_score: number;
  days_to_achieve: number;
  what_unlocks: string;
}

export interface BureauBreakdown {
  cibil: number | null;
  experian: number | null;
  crif: number | null;
  /** Equifax score normalized onto the 300–900 scale (R3 §1.5). */
  equifax_normalized: number | null;
}

export interface LeapScoreResult {
  /** 300–900, or null when no data supports a score (R3 §9.1.2 thin-file path). */
  leapscore: number | null;
  leapscore_date: string;
  confidence_level: ConfidenceLevel;
  data_sources_used: DataSource[];
  bureau_breakdown: BureauBreakdown;
  score_band: string;
  score_percentile: number | null;
  what_is_helping: ScoreContributor[];
  what_is_holding_back: ScoreDetractor[];
  score_improvement_actions: ImprovementAction[];
  credit_cost_indicator: CreditCostIndicator | null;
  next_milestone: NextMilestone | null;
  /** Per-component breakdown (each on its own weighted scale) for auditability. */
  component_scores: {
    bureau: number;
    cash_flow: number;
    behavior: number;
    health: number;
  };
}
