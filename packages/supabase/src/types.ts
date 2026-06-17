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
    };
  };
}
