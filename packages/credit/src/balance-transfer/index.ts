// ── Balance Transfer Engine ───────────────────────────────────────────────────
// Compares an existing loan against lower-rate options and quantifies savings.
// Lender options are injected (the Sprint 8 catalog lives in @leapmoney/match,
// which depends on this package — so the caller passes options to avoid a cycle).

import { emi, totalInterest } from "../finance";

export interface BalanceTransferInput {
  outstanding_amount: number;
  current_interest_rate: number;
  remaining_tenure_months: number;
}

/** Minimal lender shape the caller maps from the lender catalog. */
export interface BtLenderOption {
  lender_id: string;
  lender_name: string;
  /** Best available annual rate for this borrower at this lender. */
  rate: number;
}

export interface BtEligibleLender {
  lender_id: string;
  lender_name: string;
  rate: number;
  monthly_savings: number;
  total_interest_savings: number;
}

export interface BalanceTransferResult {
  possible: boolean;
  current_emi: number;
  estimated_new_rate: number | null;
  monthly_savings: number;
  total_interest_savings: number;
  eligible_lenders: BtEligibleLender[];
}

export function computeBalanceTransfer(
  input: BalanceTransferInput,
  options: BtLenderOption[],
): BalanceTransferResult {
  const { outstanding_amount: amt, current_interest_rate: rate, remaining_tenure_months: n } = input;
  const current_emi = emi(amt, rate, n);
  const currentInterest = totalInterest(amt, rate, n);

  const eligible: BtEligibleLender[] = options
    .filter((o) => o.rate < rate - 0.25) // meaningful improvement only
    .map((o) => ({
      lender_id: o.lender_id,
      lender_name: o.lender_name,
      rate: o.rate,
      monthly_savings: Math.round(current_emi - emi(amt, o.rate, n)),
      total_interest_savings: Math.round(currentInterest - totalInterest(amt, o.rate, n)),
    }))
    .filter((o) => o.monthly_savings > 0)
    .sort((a, b) => b.total_interest_savings - a.total_interest_savings);

  const best = eligible[0];
  return {
    possible: eligible.length > 0,
    current_emi: Math.round(current_emi),
    estimated_new_rate: best ? best.rate : null,
    monthly_savings: best ? best.monthly_savings : 0,
    total_interest_savings: best ? best.total_interest_savings : 0,
    eligible_lenders: eligible.slice(0, 3),
  };
}
