// ── LeapMatch domain types ────────────────────────────────────────────────────
// Source of truth: R3 Credit Intelligence Report §10 (LeapMatch Data Dictionary).
// Mirrors supabase/migrations/0006_lender_schema.sql.

import type { BureauName } from "@leapmoney/credit";

// ── Lender Intelligence Database (R3 §10.1.2) ─────────────────────────────────
export type LenderType =
  | "psb"
  | "private_bank"
  | "sfb"
  | "nbfc"
  | "digital_nbfc"
  | "cooperative";

export type MatchLoanType =
  | "personal"
  | "home"
  | "business"
  | "auto"
  | "education"
  | "gold"
  | "lap"
  | "credit_card";

/** CIBIL-banding used for approval-rate tables (R3 §10.1.2). */
export type ScoreBandKey = "750_plus" | "700_749" | "650_699" | "600_649" | "below_600";

export type ApprovalRateByBand = Record<ScoreBandKey, number>;

export type ApiIntegrationStatus = "full_api" | "partial" | "manual" | "not_integrated";

export type FeeType = "percentage" | "fixed" | "nil";

export interface IncomeRules {
  min_income_salaried: number;
  min_income_self_employed: number;
}

export interface FoirRules {
  /** Maximum acceptable FOIR (fixed obligations ÷ income), 0.0–1.0. */
  max_foir: number;
}

export interface Lender {
  id: string;
  name: string;
  lender_type: LenderType;
}

export interface LenderProduct {
  id: string;
  lender_id: string;
  lender_name: string;
  lender_type: LenderType;
  loan_type: MatchLoanType;

  // Bureau strategy (R3 §2 — e.g. Bajaj Finance primary = Experian)
  primary_bureau: BureauName;
  secondary_bureau: BureauName | null;
  /** Minimum score per bureau the lender queries. */
  min_score: Partial<Record<BureauName, number>>;

  income_rules: IncomeRules;
  foir_rules: FoirRules;
  min_employment_months: number;
  min_business_vintage_months: number;

  loan_amount_min: number;
  loan_amount_max: number;
  tenure_min_months: number;
  tenure_max_months: number;

  interest_rate_min: number;
  interest_rate_max: number;
  processing_fee_type: FeeType;
  processing_fee_value: number;

  avg_disbursal_days: number;
  approval_rate_by_band: ApprovalRateByBand;

  accepts_new_to_credit: boolean;
  accepts_self_employed_no_itr: boolean;
  pin_code_blacklist: string[];
  employer_blacklist: string[];

  user_review_score: number;
  review_count: number;
  api_integration_status: ApiIntegrationStatus;
}

// ── Borrower inputs (R3 §10.1.1) ──────────────────────────────────────────────
export type EmploymentType =
  | "salaried_mnc"
  | "salaried_sme"
  | "salaried_govt"
  | "self_employed_gst"
  | "self_employed_no_gst"
  | "professional"
  | "freelancer";

export type EmployerCategory = "listed_company" | "mnc" | "govt" | "psu" | "sme" | "unknown";

export type CityTier = "metro" | "tier_1" | "tier_2" | "tier_3";

export type LoanPurpose =
  | "medical"
  | "wedding"
  | "travel"
  | "home_renovation"
  | "debt_consolidation"
  | "education"
  | "business"
  | "other";

export type Urgency = "immediate" | "standard" | "flexible";

export type Preference = "BALANCED" | "LOWEST_RATE" | "HIGHEST_APPROVAL" | "FASTEST";

export interface MatchUserProfile {
  /** LeapScore (300–900); used as a fallback when a bureau-specific score is absent. */
  leapscore: number;
  cibil: number | null;
  experian: number | null;
  crif: number | null;
  equifax_normalized: number | null;
  /** True when the LeapScore was derived from bank cash-flow data (AA). */
  aa_cash_flow_verified: boolean;

  monthly_net_income: number;
  employment_type: EmploymentType;
  employer_category: EmployerCategory;
  years_at_current_employer: number;
  business_vintage_months: number;
  city_tier: CityTier;
  pin_code: string;
  age: number;
  /** Existing fixed obligations ÷ income, before the new loan EMI. */
  foir_current: number;
  existing_bank_relationships: string[];
  existing_loan_with_lender: string[];
  hard_inquiries_last_6m: number;
  has_settlement_or_writeoff: boolean;
  months_since_last_delinquency: number | null;
  gst_registered: boolean;
}

export interface LoanRequest {
  loan_type: MatchLoanType;
  loan_amount_requested: number;
  tenure_months: number;
  purpose: LoanPurpose;
  urgency: Urgency;
  preference: Preference;
}

// ── Eligibility (R3 §10.1.3 Step 1) ───────────────────────────────────────────
export type IneligibilityReason =
  | "score_too_low"
  | "income_too_low"
  | "foir_too_high"
  | "amount_out_of_range"
  | "employment_type"
  | "geography"
  | "age"
  | "no_credit_history"
  | "other";

export interface EligibilityResult {
  eligible: boolean;
  reason: IneligibilityReason | null;
  reason_display: string | null;
  /** Score on the bureau this lender actually queries (post-fallback). */
  evaluated_score: number;
}

// ── Approval Odds (R3 §10.1.3 Step 2) ─────────────────────────────────────────
export type ApprovalConfidence = "high" | "medium" | "low";

export interface ApprovalReasonCode {
  code: string;
  label: string;
  /** Signed contribution to the probability (points). */
  delta: number;
}

export interface ApprovalOdds {
  /** Clamped to 5–95; never 0 or 100. */
  approval_probability: number;
  approval_probability_label: string;
  confidence_level: ApprovalConfidence;
  reason_codes: ApprovalReasonCode[];
}

// ── Output (R3 §10.1.4) ───────────────────────────────────────────────────────
export type MatchBadge =
  | "best_match"
  | "lowest_rate"
  | "fastest"
  | "best_for_score"
  | "easiest_docs";

export interface MatchedLender {
  lender_id: string;
  product_id: string;
  lender_name: string;
  rank: number;
  match_badge: MatchBadge | null;

  approval_probability: number;
  approval_probability_label: string;
  approval_confidence: ApprovalConfidence;
  reason_codes: ApprovalReasonCode[];

  interest_rate_min: number;
  interest_rate_max: number;
  emi_estimate: number;
  processing_fee_display: string;
  annual_percentage_rate: number;

  tenure_offered: string;
  avg_disbursal_days: number;

  user_review_score: number;
  review_count: number;

  match_reason: string;
  bureau_that_will_be_pulled: BureauName;
  /** Soft pull (LeapCheck) never creates a hard inquiry. */
  hard_inquiry_warning: boolean;
  application_type: ApiIntegrationStatus;
}

export interface NotMatchedLender {
  lender_id: string;
  product_id: string;
  lender_name: string;
  reason: IneligibilityReason;
  reason_display: string;
  what_you_need: string;
}

export type MatchMode = "soft_prequalification" | "standard";

export interface MatchResult {
  match_date: string;
  loan_request: LoanRequest;
  mode: MatchMode;
  matched_lenders: MatchedLender[];
  not_matched_lenders: NotMatchedLender[];
  /** RBI 2025 requirement: explain how ranking works (R3 §10.1.3 Step 4). */
  ranking_methodology: string;
}
