import type { BureauName, BureauReport, PullType, Tradeline } from "../types";

// Deterministic mock fixtures for Sprint 7 (no live bureau integration).
// A "good" profile keyed off PAN; deterministic so tests/screens are stable.

function dpdClean(months: number): number[] {
  return Array.from({ length: months }, () => 0);
}

const BASE_TRADELINES: Tradeline[] = [
  {
    account_type: "credit_card",
    lender_name: "HDFC Bank",
    sanctioned_amount: 200000,
    current_balance: 36000,
    credit_limit: 200000,
    amount_overdue: 0,
    emi_amount: 0,
    account_status: "standard",
    dpd_last_36_months: dpdClean(36),
    date_opened: "2019-04-10",
    date_closed: null,
    ownership_type: "individual",
  },
  {
    account_type: "personal_loan",
    lender_name: "Bajaj Finance",
    sanctioned_amount: 500000,
    current_balance: 180000,
    credit_limit: null,
    amount_overdue: 0,
    emi_amount: 14500,
    account_status: "standard",
    // one 30-DPD blemish 14 months ago
    dpd_last_36_months: [...dpdClean(13), 30, ...dpdClean(22)],
    date_opened: "2021-08-01",
    date_closed: null,
    ownership_type: "individual",
  },
];

/** Per-bureau native base score for the default mock profile. */
const MOCK_BASE_SCORE: Record<BureauName, number> = {
  cibil: 738,
  experian: 746,
  crif: 731,
  equifax: 812, // 1–999 scale
};

/**
 * Build a deterministic mock report. A trailing "0" in the PAN simulates a
 * thin-file / no-hit borrower (score null) so the thin-file path is testable.
 */
export function buildMockReport(
  bureau: BureauName,
  pan: string,
  pullType: PullType,
): BureauReport {
  const thinFile = pan.trim().endsWith("0");
  return {
    bureau,
    score: thinFile ? null : MOCK_BASE_SCORE[bureau],
    report_date: "2026-06-17",
    pull_type: pullType,
    tradelines: thinFile ? [] : BASE_TRADELINES,
    inquiries: thinFile
      ? []
      : [
          {
            bureau,
            inquiry_date: "2026-03-02",
            lender_name: "ICICI Bank",
            loan_type: "personal_loan",
            amount: 800000,
            pull_type: "hard",
          },
        ],
    score_factors: thinFile
      ? []
      : [
          {
            bureau,
            code: "PMT_HISTORY",
            description: "Strong on-time payment history",
            direction: "positive",
          },
          {
            bureau,
            code: "UTIL_OK",
            description: "Credit utilization within healthy range",
            direction: "positive",
          },
          {
            bureau,
            code: "RECENT_DPD",
            description: "A late payment in the last 18 months",
            direction: "negative",
          },
        ],
  };
}
