// ── Database types ───────────────────────────────────────────────────────────
// Mirrors the SQL schema in supabase/migrations. Hand-written (not generated) so
// the foundation type-checks before a live project exists. Keep in sync with the
// migrations.

export type AppRole = "borrower" | "dsa" | "lender" | "admin";

export type OnboardingStep =
  | "registered"
  | "profile"
  | "consent"
  | "complete";

export interface UsersProfileRow {
  id: string;
  auth_user_id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: AppRole;
  profile_completed: boolean;
  onboarding_step: OnboardingStep;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsRow {
  user_id: string;
  notifications_email: boolean;
  notifications_whatsapp: boolean;
  theme: "light" | "dark" | "system";
  updated_at: string;
}

// Bureau/credit enums — mirror supabase/migrations/0004_credit_schema.sql.
export type BureauName = "cibil" | "experian" | "crif" | "equifax";
export type PullType = "soft" | "hard";
export type CreditAccountType =
  | "credit_card"
  | "personal_loan"
  | "home_loan"
  | "auto_loan"
  | "overdraft"
  | "gold_loan"
  | "microfinance"
  | "business_loan";
export type CreditAccountStatus =
  | "standard"
  | "settlement"
  | "write_off"
  | "npa"
  | "closed";
export type OwnershipType = "individual" | "joint" | "guarantor";
export type ConfidenceLevel = "high" | "medium" | "low" | "alternative_data_only";

export interface UserConsentRow {
  id: string;
  user_id: string;
  purpose: string;
  version: string;
  granted: boolean;
  // Sprint 7 consent extensions (DPDP / RBI). Withdrawal is a NEW row that
  // supersedes the prior grant — these columns are immutable once written.
  bureau: BureauName | null;
  pull_type: PullType | null;
  expires_at: string | null;
  revoked_at: string | null;
  supersedes: string | null;
  created_at: string;
}

export interface BureauReportRow {
  id: string;
  user_id: string;
  consent_id: string | null;
  bureau: BureauName;
  score: number | null;
  report_date: string;
  pull_type: PullType;
  created_at: string;
}

export interface TradelineRow {
  id: string;
  bureau_report_id: string;
  account_type: CreditAccountType;
  lender_name: string;
  sanctioned_amount: number;
  current_balance: number;
  credit_limit: number | null;
  amount_overdue: number;
  emi_amount: number;
  account_status: CreditAccountStatus;
  dpd_last_36_months: number[];
  date_opened: string | null;
  date_closed: string | null;
  ownership_type: OwnershipType;
  created_at: string;
}

export interface InquiryRow {
  id: string;
  bureau_report_id: string;
  bureau: BureauName;
  inquiry_date: string;
  lender_name: string;
  loan_type: CreditAccountType;
  amount: number;
  pull_type: PullType;
  created_at: string;
}

export interface ScoreFactorRow {
  id: string;
  bureau_report_id: string;
  bureau: BureauName;
  code: string;
  description: string;
  direction: "positive" | "negative";
  created_at: string;
}

export interface LeapscoreSnapshotRow {
  id: string;
  user_id: string;
  leapscore: number | null;
  confidence_level: ConfidenceLevel;
  data_sources_used: string[];
  bureau_breakdown: Record<string, unknown>;
  score_band: string;
  score_percentile: number | null;
  payload: Record<string, unknown>;
  model_version: string;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  user_id: string | null;
  action: string;
  entity: string | null;
  metadata: Record<string, unknown> | null;
  ip: string | null;
  created_at: string;
}

// ── Lender Intelligence Database (Sprint 8; mirrors 0006_lender_schema.sql) ───
export type LenderTypeName = "psb" | "private_bank" | "sfb" | "nbfc" | "digital_nbfc" | "cooperative";
export type MatchLoanTypeName =
  | "personal"
  | "home"
  | "business"
  | "auto"
  | "education"
  | "gold"
  | "lap"
  | "credit_card";
export type FeeTypeName = "percentage" | "fixed" | "nil";
export type ApiIntegrationStatusName = "full_api" | "partial" | "manual" | "not_integrated";

export interface LenderRow {
  id: string;
  name: string;
  lender_type: LenderTypeName;
  created_at: string;
  updated_at: string;
}

export interface LenderProductRow {
  id: string;
  lender_id: string;
  loan_type: MatchLoanTypeName;
  primary_bureau: BureauName;
  secondary_bureau: BureauName | null;
  min_score: Record<string, number>;
  min_income_salaried: number;
  min_income_self_employed: number;
  max_foir: number;
  min_employment_months: number;
  min_business_vintage_months: number;
  loan_amount_min: number;
  loan_amount_max: number;
  tenure_min_months: number;
  tenure_max_months: number;
  interest_rate_min: number;
  interest_rate_max: number;
  processing_fee_type: FeeTypeName;
  processing_fee_value: number;
  avg_disbursal_days: number;
  approval_rate_by_band: Record<string, number>;
  accepts_new_to_credit: boolean;
  accepts_self_employed_no_itr: boolean;
  pin_code_blacklist: string[];
  employer_blacklist: string[];
  user_review_score: number;
  review_count: number;
  api_integration_status: ApiIntegrationStatusName;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Application & Outcome tracking (Sprint 10; mirrors 0007_application_schema) ─
export type ApplicationStatusName =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "disbursed"
  | "withdrawn";
export type OutcomeResultName = "pending" | "approved" | "rejected";

export interface ApplicationRow {
  id: string;
  user_id: string;
  loan_type: MatchLoanTypeName;
  loan_amount_requested: number;
  tenure_months: number;
  preference: string;
  status: ApplicationStatusName;
  match_session_id: string | null;
  recommended_lender_id: string | null;
  selected_lender_id: string | null;
  applied_lender_id: string | null;
  approved_lender_id: string | null;
  predicted_probability: number | null;
  approval_result: OutcomeResultName;
  rejection_reason: string | null;
  disbursal_amount: number | null;
  final_rate: number | null;
  processing_fee: number | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationEventRow {
  id: string;
  application_id: string;
  event_type: string;
  from_status: ApplicationStatusName | null;
  to_status: ApplicationStatusName | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ── Dashboard snapshots (Sprint 11; mirrors 0009_snapshot_schema.sql) ─────────
export interface ScoreSnapshotRow {
  id: string;
  user_id: string;
  score: number;
  band: string;
  captured_at: string;
}

export interface HealthSnapshotRow {
  id: string;
  user_id: string;
  health_score: number;
  band: string;
  captured_at: string;
}

export interface MatchSnapshotRow {
  id: string;
  user_id: string;
  loan_type: MatchLoanTypeName;
  top_lender_id: string | null;
  top_approval_probability: number | null;
  match_count: number;
  captured_at: string;
}

export interface ReportSnapshotRow {
  id: string;
  user_id: string;
  report_id: string;
  pull_timestamp: string;
  consent_reference: string | null;
  pull_type: PullType;
  created_at: string;
}

export interface IncomeSnapshotRow {
  id: string;
  user_id: string;
  income: number;
  cashflow_score: number;
  foir: number;
  verification_status: string;
  generated_at: string;
  created_at: string;
}

export interface FinancialSnapshotRow {
  id: string;
  user_id: string;
  score: number | null;
  foir: number | null;
  monthly_savings: number;
  annual_savings: number;
  lifetime_savings: number;
  findings: unknown[];
  opportunities: unknown[];
  generated_at: string;
  created_at: string;
}

export interface DsaSnapshotRow {
  id: string;
  user_id: string;
  metrics: Record<string, unknown>;
  earnings: number;
  performance: Record<string, unknown>;
  generated_at: string;
  created_at: string;
}

export interface CommissionSnapshotRow {
  id: string;
  user_id: string;
  pending: number;
  approved: number;
  paid: number;
  generated_at: string;
  created_at: string;
}

export interface LenderSnapshotRow {
  id: string;
  user_id: string;
  lender: string;
  policies: Record<string, unknown>;
  payouts: unknown[];
  metrics: Record<string, unknown>;
  generated_at: string;
  created_at: string;
}

export interface ApplicationSnapshotRow {
  id: string;
  user_id: string;
  application_id: string;
  lender: string | null;
  status: ApplicationStatusName;
  probability: number | null;
  timeline: unknown[];
  created_at: string;
}

export interface RecommendationSnapshotRow {
  id: string;
  user_id: string;
  financial_snapshot_id: string | null;
  recommendation_id: string;
  title: string;
  priority: string;
  expected_score_impact: number;
  expected_savings: number;
  generated_at: string;
  created_at: string;
}

type Insertable<T, Auto extends keyof T> = Omit<T, Auto> & Partial<Pick<T, Auto>>;

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: UsersProfileRow;
        Insert: Insertable<UsersProfileRow, "id" | "created_at" | "updated_at" | "profile_completed" | "onboarding_step" | "role">;
        Update: Partial<UsersProfileRow>;
      };
      user_settings: {
        Row: UserSettingsRow;
        Insert: Insertable<UserSettingsRow, "updated_at" | "notifications_email" | "notifications_whatsapp" | "theme">;
        Update: Partial<UserSettingsRow>;
      };
      user_consent: {
        Row: UserConsentRow;
        Insert: Insertable<
          UserConsentRow,
          "id" | "created_at" | "bureau" | "pull_type" | "expires_at" | "revoked_at" | "supersedes"
        >;
        Update: never;
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: Insertable<AuditLogRow, "id" | "created_at">;
        Update: never;
      };
      bureau_report: {
        Row: BureauReportRow;
        Insert: Insertable<BureauReportRow, "id" | "created_at" | "consent_id" | "score">;
        Update: never;
      };
      tradeline: {
        Row: TradelineRow;
        Insert: Insertable<
          TradelineRow,
          | "id"
          | "created_at"
          | "sanctioned_amount"
          | "current_balance"
          | "credit_limit"
          | "amount_overdue"
          | "emi_amount"
          | "dpd_last_36_months"
          | "date_opened"
          | "date_closed"
          | "ownership_type"
        >;
        Update: never;
      };
      inquiry: {
        Row: InquiryRow;
        Insert: Insertable<InquiryRow, "id" | "created_at" | "amount">;
        Update: never;
      };
      score_factor: {
        Row: ScoreFactorRow;
        Insert: Insertable<ScoreFactorRow, "id" | "created_at">;
        Update: never;
      };
      leapscore_snapshot: {
        Row: LeapscoreSnapshotRow;
        Insert: Insertable<
          LeapscoreSnapshotRow,
          "id" | "created_at" | "leapscore" | "data_sources_used" | "score_percentile" | "model_version"
        >;
        Update: never;
      };
      lender: {
        Row: LenderRow;
        Insert: Insertable<LenderRow, "created_at" | "updated_at">;
        Update: Partial<LenderRow>;
      };
      lender_product: {
        Row: LenderProductRow;
        Insert: Insertable<
          LenderProductRow,
          | "created_at"
          | "updated_at"
          | "secondary_bureau"
          | "min_score"
          | "min_employment_months"
          | "min_business_vintage_months"
          | "processing_fee_value"
          | "accepts_new_to_credit"
          | "accepts_self_employed_no_itr"
          | "pin_code_blacklist"
          | "employer_blacklist"
          | "user_review_score"
          | "review_count"
          | "api_integration_status"
          | "active"
        >;
        Update: Partial<LenderProductRow>;
      };
      application: {
        Row: ApplicationRow;
        Insert: Insertable<
          ApplicationRow,
          | "id"
          | "created_at"
          | "updated_at"
          | "preference"
          | "status"
          | "match_session_id"
          | "recommended_lender_id"
          | "selected_lender_id"
          | "applied_lender_id"
          | "approved_lender_id"
          | "predicted_probability"
          | "approval_result"
          | "rejection_reason"
          | "disbursal_amount"
          | "final_rate"
          | "processing_fee"
        >;
        Update: Partial<ApplicationRow>;
      };
      application_event: {
        Row: ApplicationEventRow;
        Insert: Insertable<
          ApplicationEventRow,
          "id" | "created_at" | "from_status" | "to_status" | "metadata"
        >;
        Update: never;
      };
      score_snapshot: {
        Row: ScoreSnapshotRow;
        Insert: Insertable<ScoreSnapshotRow, "id" | "captured_at">;
        Update: never;
      };
      health_snapshot: {
        Row: HealthSnapshotRow;
        Insert: Insertable<HealthSnapshotRow, "id" | "captured_at">;
        Update: never;
      };
      match_snapshot: {
        Row: MatchSnapshotRow;
        Insert: Insertable<
          MatchSnapshotRow,
          "id" | "captured_at" | "top_lender_id" | "top_approval_probability" | "match_count"
        >;
        Update: never;
      };
      report_snapshot: {
        Row: ReportSnapshotRow;
        Insert: Insertable<
          ReportSnapshotRow,
          "id" | "created_at" | "pull_timestamp" | "consent_reference" | "pull_type"
        >;
        Update: never;
      };
      income_snapshot: {
        Row: IncomeSnapshotRow;
        Insert: Insertable<
          IncomeSnapshotRow,
          "id" | "created_at" | "generated_at" | "verification_status"
        >;
        Update: never;
      };
      financial_snapshot: {
        Row: FinancialSnapshotRow;
        Insert: Insertable<
          FinancialSnapshotRow,
          | "id"
          | "created_at"
          | "generated_at"
          | "score"
          | "foir"
          | "monthly_savings"
          | "annual_savings"
          | "lifetime_savings"
          | "findings"
          | "opportunities"
        >;
        Update: never;
      };
      recommendation_snapshot: {
        Row: RecommendationSnapshotRow;
        Insert: Insertable<
          RecommendationSnapshotRow,
          "id" | "created_at" | "generated_at" | "financial_snapshot_id" | "expected_score_impact" | "expected_savings"
        >;
        Update: never;
      };
      application_snapshot: {
        Row: ApplicationSnapshotRow;
        Insert: Insertable<
          ApplicationSnapshotRow,
          "id" | "created_at" | "lender" | "probability" | "timeline"
        >;
        Update: never;
      };
      dsa_snapshot: {
        Row: DsaSnapshotRow;
        Insert: Insertable<DsaSnapshotRow, "id" | "created_at" | "generated_at" | "metrics" | "earnings" | "performance">;
        Update: never;
      };
      commission_snapshot: {
        Row: CommissionSnapshotRow;
        Insert: Insertable<CommissionSnapshotRow, "id" | "created_at" | "generated_at" | "pending" | "approved" | "paid">;
        Update: never;
      };
      lender_snapshot: {
        Row: LenderSnapshotRow;
        Insert: Insertable<LenderSnapshotRow, "id" | "created_at" | "generated_at" | "policies" | "payouts" | "metrics">;
        Update: never;
      };
    };
  };
}
