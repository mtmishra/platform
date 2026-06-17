// ── Lender Intelligence Repository types ──────────────────────────────────────
// The single source of truth for lender credit policies, products, payouts,
// approval intelligence, and match intelligence — consumed by LeapMatch, DSA,
// Lender, Admin, and the Commission engine. Demo data only (no APIs/LOS/LMS).
// Source: R3 §2–§3 (bureau mapping, approval), Sprint 8 LeapMatch.

import type { BureauName } from "@leapmoney/credit";

export type LenderType = "bank" | "nbfc" | "fintech";
export type LoanProduct = "personal" | "home" | "business" | "lap" | "credit_card";
export type ApprovalBand = "excellent" | "good" | "moderate" | "difficult";
export type PayoutType = "percentage" | "fixed";
export type EmploymentType = "salaried" | "self_employed" | "professional";
export type MatchTag =
  | "low_score"
  | "high_score"
  | "self_employed"
  | "salaried"
  | "balance_transfer"
  | "debt_consolidation"
  | "new_to_credit";

// 1. Lender Master
export interface LenderMaster {
  lender_id: string;
  lender_name: string;
  lender_type: LenderType;
  website: string;
  support_email: string;
  region_coverage: string;
  active: boolean;
}

// 2. Lender Products
export interface LenderProductMaster {
  lender_id: string;
  product: LoanProduct;
  min_amount: number;
  max_amount: number;
  min_tenure: number;
  max_tenure: number;
}

// 3. Credit Policy
export interface LenderCreditPolicy {
  lender_id: string;
  primary_bureau: BureauName;
  secondary_bureau: BureauName | null;
  min_score: number;
  preferred_score: number;
  min_income: number;
  max_foir: number;
  min_age: number;
  max_age: number;
  employment_types: EmploymentType[];
}

// 4. Approval Intelligence
export interface LenderApprovalProfile {
  lender_id: string;
  approval_rate: number;
  avg_tat_days: number;
  avg_disbursal_days: number;
  band: ApprovalBand;
}

// 5. Payout
export interface LenderPayout {
  lender_id: string;
  product: LoanProduct;
  payout_type: PayoutType;
  payout_value: number;
  max_cap: number;
}

// 6. Match Intelligence
export interface LenderMatchProfile {
  lender_id: string;
  best_for: MatchTag[];
  /** 0–100 — how strong a match this lender is for the typical LeapMoney borrower. */
  match_strength: number;
}

// 7. Rejection Intelligence
export interface RejectionReason {
  code: string;
  label: string;
}

// Composed profile (lender profile page / comparison).
export interface LenderProfile {
  master: LenderMaster;
  products: LenderProductMaster[];
  policy: LenderCreditPolicy;
  approval: LenderApprovalProfile;
  payouts: LenderPayout[];
  match: LenderMatchProfile;
}

// Comparison row (compareLenders output).
export interface LenderComparisonRow {
  lender_id: string;
  lender_name: string;
  lender_type: LenderType;
  min_score: number;
  min_income: number;
  max_foir: number;
  approval_rate: number;
  avg_tat_days: number;
  payout_display: string;
}
