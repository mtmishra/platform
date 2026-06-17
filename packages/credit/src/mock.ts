// Demo non-bureau inputs (AA cash flow, payment behavior, account health) for
// Sprint 7. Deterministic; pairs with the mock bureau reports so a full
// LeapScore can be computed without any live integration.

import type { AccountHealthData, CashFlowData, PaymentBehaviorData } from "./types";

export const MOCK_CASH_FLOW: CashFlowData = {
  aa_consent_active: true,
  bank_account_count: 2,
  avg_monthly_credit_6mo: 95000,
  avg_monthly_debit_6mo: 71000,
  salary_credit_detected: true,
  salary_credit_day: 1,
  salary_credit_amount: 90000,
  months_with_negative_balance: 0,
  months_with_returned_emi: 0,
  cash_flow_trend: "growing",
  aa_data_months: 6,
  income_source_type: "salaried",
};

export const MOCK_BEHAVIOR: PaymentBehaviorData = {
  utility_bills_tracked: true,
  utility_payment_on_time_pct: 0.95,
  postpaid_mobile_payment_history: Array.from({ length: 12 }, () => true),
  gst_filed_months: 0,
  gst_filing_regular: false,
};

export const MOCK_HEALTH: AccountHealthData = {
  credit_utilization_overall: 0.18,
  oldest_account_age_months: 86,
  hard_inquiries_last_6m: 1,
  hard_inquiries_last_12m: 1,
};
