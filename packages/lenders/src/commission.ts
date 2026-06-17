// Commission engine — estimates DSA payout for a disbursed loan from a payout rule.

import type { LenderPayout } from "./types";

/**
 * Estimated commission for a given loan amount under a payout rule.
 * Percentage payouts are capped at max_cap; fixed payouts are the flat value
 * (also capped, defensively).
 */
export function estimatedCommission(payout: LenderPayout, loanAmount: number): number {
  const raw = payout.payout_type === "percentage" ? (payout.payout_value / 100) * loanAmount : payout.payout_value;
  const capped = payout.max_cap > 0 ? Math.min(raw, payout.max_cap) : raw;
  return Math.round(capped);
}

export function payoutDisplay(payout: LenderPayout): string {
  return payout.payout_type === "percentage"
    ? `${payout.payout_value}% (cap ₹${payout.max_cap.toLocaleString("en-IN")})`
    : `₹${payout.payout_value.toLocaleString("en-IN")} flat`;
}
