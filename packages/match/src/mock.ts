// Demo inputs for Sprint 8 (no live data). Pairs with the seed lender catalog.

import type { LoanRequest, MatchUserProfile } from "./types";

export const MOCK_MATCH_USER: MatchUserProfile = {
  leapscore: 742,
  cibil: 738,
  experian: 746,
  crif: 731,
  equifax_normalized: 730,
  aa_cash_flow_verified: true,
  monthly_net_income: 90000,
  employment_type: "salaried_mnc",
  employer_category: "mnc",
  years_at_current_employer: 5,
  business_vintage_months: 0,
  city_tier: "metro",
  pin_code: "400001",
  age: 34,
  foir_current: 0.22,
  existing_bank_relationships: ["HDFC Bank"],
  existing_loan_with_lender: [],
  hard_inquiries_last_6m: 1,
  has_settlement_or_writeoff: false,
  months_since_last_delinquency: null,
  gst_registered: false,
};

export const MOCK_LOAN_REQUEST: LoanRequest = {
  loan_type: "personal",
  loan_amount_requested: 1000000,
  tenure_months: 60,
  purpose: "home_renovation",
  urgency: "standard",
  preference: "BALANCED",
};
