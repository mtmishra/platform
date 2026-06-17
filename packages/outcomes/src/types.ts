// ── Outcome Intelligence domain types ─────────────────────────────────────────
// Captures the prediction made at match time (Sprint 8) alongside the realised
// loan outcome, so the two can be compared. This is the data foundation for the
// R3 §10.3 feedback loop (cold-start → outcome accumulation → ML calibration).
// Mirrors supabase/migrations/0007_application_schema.sql.

import type { IneligibilityReason, MatchLoanType, Preference } from "@leapmoney/match";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "disbursed"
  | "withdrawn";

export type OutcomeResult = "pending" | "approved" | "rejected";

/** A single application with its match-time prediction and realised outcome. */
export interface ApplicationOutcome {
  id: string;
  loan_type: MatchLoanType;
  loan_amount_requested: number;
  tenure_months: number;
  preference: Preference;
  status: ApplicationStatus;

  // Match-outcome tracking (lender slugs)
  recommended_lender_id: string | null;
  selected_lender_id: string | null;
  applied_lender_id: string | null;
  approved_lender_id: string | null;

  /** Approval probability predicted at apply time (5–95). */
  predicted_probability: number | null;

  // Realised outcome
  approval_result: OutcomeResult;
  rejection_reason: IneligibilityReason | string | null;
  disbursal_amount: number | null;
  final_rate: number | null;
  processing_fee: number | null;

  created_at: string;
}

// ── Feedback loop ──────────────────────────────────────────────────────────
/** One labelled data point: what we predicted vs what actually happened. */
export interface FeedbackPoint {
  application_id: string;
  predicted_probability: number;
  /** 1 = approved, 0 = rejected. */
  actual_outcome: 0 | 1;
}

export interface CalibrationBucket {
  /** e.g. "70–79%". */
  label: string;
  lower: number;
  upper: number;
  count: number;
  /** Mean predicted probability of points in the bucket. */
  mean_predicted: number;
  /** Realised approval rate of points in the bucket (0–100). */
  actual_rate: number;
  /** |mean_predicted − actual_rate|. */
  gap: number;
}

export interface CalibrationData {
  points: FeedbackPoint[];
  buckets: CalibrationBucket[];
  /** Mean absolute calibration error across decided applications (0–100). */
  mean_abs_error: number;
  /** Brier score (0–1, lower is better). */
  brier_score: number;
  sample_size: number;
}

// ── Analytics ─────────────────────────────────────────────────────────────
export interface AnalyticsSummary {
  total_applications: number;
  /** approved ÷ decided (approved + rejected), as a percentage. */
  approval_rate: number;
  /** Of approved apps, share where the approval came from our top recommendation. */
  match_accuracy: number;
  /** disbursed ÷ submitted-or-beyond, as a percentage. */
  conversion_rate: number;
}
