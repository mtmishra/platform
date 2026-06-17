// Mock application-outcome dataset for Sprint 10 (no live lender data). Spans
// approved / rejected / disbursed / pending so analytics and calibration produce
// meaningful numbers. Replace with real `application` rows once outcomes accrue.

import type { ApplicationOutcome, ApplicationStatus, OutcomeResult } from "./types";

interface Spec {
  id: string;
  recommended: string;
  applied: string;
  approved: string | null;
  predicted: number;
  status: ApplicationStatus;
  result: OutcomeResult;
  rejection?: string;
  disbursal?: number;
  rate?: number;
  fee?: number;
}

const SPECS: Spec[] = [
  { id: "a01", recommended: "hdfc", applied: "hdfc", approved: "hdfc", predicted: 87, status: "disbursed", result: "approved", disbursal: 1000000, rate: 11.0, fee: 10000 },
  { id: "a02", recommended: "bajaj", applied: "bajaj", approved: "bajaj", predicted: 72, status: "disbursed", result: "approved", disbursal: 500000, rate: 13.5, fee: 10000 },
  { id: "a03", recommended: "icici", applied: "icici", approved: "icici", predicted: 80, status: "approved", result: "approved" },
  { id: "a04", recommended: "hdfc", applied: "hdfc", approved: null, predicted: 55, status: "rejected", result: "rejected", rejection: "foir_too_high" },
  { id: "a05", recommended: "kreditbee", applied: "kreditbee", approved: "kreditbee", predicted: 65, status: "disbursed", result: "approved", disbursal: 150000, rate: 22.0, fee: 4500 },
  { id: "a06", recommended: "axis", applied: "axis", approved: null, predicted: 45, status: "rejected", result: "rejected", rejection: "score_too_low" },
  { id: "a07", recommended: "tata", applied: "bajaj", approved: "bajaj", predicted: 40, status: "approved", result: "approved" },
  { id: "a08", recommended: "moneyview", applied: "moneyview", approved: "moneyview", predicted: 78, status: "disbursed", result: "approved", disbursal: 300000, rate: 17.0, fee: 7500 },
  { id: "a09", recommended: "sbi", applied: "sbi", approved: null, predicted: 30, status: "rejected", result: "rejected", rejection: "income_too_low" },
  { id: "a10", recommended: "bajaj", applied: "bajaj", approved: "bajaj", predicted: 90, status: "approved", result: "approved" },
  { id: "a11", recommended: "hdfc", applied: "hdfc", approved: null, predicted: 25, status: "under_review", result: "pending" },
  { id: "a12", recommended: "icici", applied: "icici", approved: null, predicted: 60, status: "submitted", result: "pending" },
];

function toRecord(s: Spec, i: number): ApplicationOutcome {
  return {
    id: s.id,
    loan_type: "personal",
    loan_amount_requested: s.disbursal ?? 800000,
    tenure_months: 60,
    preference: "BALANCED",
    status: s.status,
    recommended_lender_id: s.recommended,
    selected_lender_id: s.recommended,
    applied_lender_id: s.applied,
    approved_lender_id: s.approved,
    predicted_probability: s.predicted,
    approval_result: s.result,
    rejection_reason: s.rejection ?? null,
    disbursal_amount: s.disbursal ?? null,
    final_rate: s.rate ?? null,
    processing_fee: s.fee ?? null,
    created_at: `2026-0${(i % 5) + 1}-1${i % 9}T10:00:00.000Z`,
  };
}

export const MOCK_OUTCOMES: ApplicationOutcome[] = SPECS.map(toRecord);
