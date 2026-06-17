// Analytics foundation — approval rate, match accuracy, conversion rate.
// All guard against divide-by-zero and return 0 on empty inputs.

import type { AnalyticsSummary, ApplicationOutcome } from "./types";

const pct = (num: number, den: number): number => (den === 0 ? 0 : Math.round((num / den) * 1000) / 10);

const DECIDED = new Set<ApplicationOutcome["approval_result"]>(["approved", "rejected"]);
const SUBMITTED_OR_BEYOND = new Set<ApplicationOutcome["status"]>([
  "submitted",
  "under_review",
  "approved",
  "rejected",
  "disbursed",
]);

/** Approved ÷ decided (approved + rejected). */
export function approvalRate(records: ApplicationOutcome[]): number {
  const decided = records.filter((r) => DECIDED.has(r.approval_result));
  const approved = decided.filter((r) => r.approval_result === "approved");
  return pct(approved.length, decided.length);
}

/**
 * Match accuracy — of applications that were approved, the share where the
 * approving lender was the one LeapMatch recommended (rank 1). Measures how
 * often our top pick was the one that actually worked.
 */
export function matchAccuracy(records: ApplicationOutcome[]): number {
  const approved = records.filter((r) => r.approval_result === "approved" && r.approved_lender_id !== null);
  const onTarget = approved.filter((r) => r.approved_lender_id === r.recommended_lender_id);
  return pct(onTarget.length, approved.length);
}

/** Disbursed ÷ submitted-or-beyond. */
export function conversionRate(records: ApplicationOutcome[]): number {
  const submitted = records.filter((r) => SUBMITTED_OR_BEYOND.has(r.status));
  const disbursed = records.filter((r) => r.status === "disbursed");
  return pct(disbursed.length, submitted.length);
}

export function summarize(records: ApplicationOutcome[]): AnalyticsSummary {
  return {
    total_applications: records.length,
    approval_rate: approvalRate(records),
    match_accuracy: matchAccuracy(records),
    conversion_rate: conversionRate(records),
  };
}
