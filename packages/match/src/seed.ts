// Seed lender catalog for Sprint 8 (mock data; no live lender APIs).
// Bureau mapping, score floors, and approval bands sourced from R3 §2–§3.
// Personal-loan products only for the foundation; other loan types added later.

import type { ApprovalRateByBand, LenderProduct } from "./types";

interface SeedSpec {
  lender_id: string;
  name: string;
  lender_type: LenderProduct["lender_type"];
  primary_bureau: LenderProduct["primary_bureau"];
  secondary_bureau: LenderProduct["secondary_bureau"];
  min_score: LenderProduct["min_score"];
  min_income_salaried: number;
  min_income_self_employed: number;
  max_foir: number;
  loan_amount_min: number;
  loan_amount_max: number;
  rate_min: number;
  rate_max: number;
  fee_type: LenderProduct["processing_fee_type"];
  fee_value: number;
  avg_disbursal_days: number;
  bands: ApprovalRateByBand;
  accepts_ntc: boolean;
  accepts_se_no_itr: boolean;
  review: number;
  review_count: number;
  api: LenderProduct["api_integration_status"];
}

const SPECS: SeedSpec[] = [
  {
    lender_id: "hdfc", name: "HDFC Bank", lender_type: "private_bank",
    primary_bureau: "cibil", secondary_bureau: "experian", min_score: { cibil: 730, experian: 720 },
    min_income_salaried: 25000, min_income_self_employed: 400000, max_foir: 0.5,
    loan_amount_min: 50000, loan_amount_max: 4000000, rate_min: 10.75, rate_max: 16,
    fee_type: "percentage", fee_value: 1, avg_disbursal_days: 2,
    bands: { "750_plus": 85, "700_749": 55, "650_699": 15, "600_649": 5, below_600: 5 },
    accepts_ntc: false, accepts_se_no_itr: false, review: 4.3, review_count: 2847, api: "full_api",
  },
  {
    lender_id: "icici", name: "ICICI Bank", lender_type: "private_bank",
    primary_bureau: "cibil", secondary_bureau: "experian", min_score: { cibil: 700, experian: 700 },
    min_income_salaried: 25000, min_income_self_employed: 400000, max_foir: 0.5,
    loan_amount_min: 50000, loan_amount_max: 5000000, rate_min: 10.85, rate_max: 16.5,
    fee_type: "percentage", fee_value: 1, avg_disbursal_days: 1,
    bands: { "750_plus": 84, "700_749": 60, "650_699": 18, "600_649": 6, below_600: 5 },
    accepts_ntc: false, accepts_se_no_itr: false, review: 4.2, review_count: 2100, api: "full_api",
  },
  {
    lender_id: "axis", name: "Axis Bank", lender_type: "private_bank",
    primary_bureau: "cibil", secondary_bureau: "experian", min_score: { cibil: 720 },
    min_income_salaried: 15000, min_income_self_employed: 300000, max_foir: 0.5,
    loan_amount_min: 50000, loan_amount_max: 4000000, rate_min: 10.99, rate_max: 18,
    fee_type: "percentage", fee_value: 1.5, avg_disbursal_days: 2,
    bands: { "750_plus": 82, "700_749": 58, "650_699": 16, "600_649": 5, below_600: 5 },
    accepts_ntc: false, accepts_se_no_itr: false, review: 4.0, review_count: 1500, api: "partial",
  },
  {
    lender_id: "sbi", name: "State Bank of India", lender_type: "psb",
    primary_bureau: "cibil", secondary_bureau: "crif", min_score: { cibil: 700 },
    min_income_salaried: 15000, min_income_self_employed: 300000, max_foir: 0.5,
    loan_amount_min: 50000, loan_amount_max: 2000000, rate_min: 10.5, rate_max: 15,
    fee_type: "percentage", fee_value: 1, avg_disbursal_days: 5,
    bands: { "750_plus": 80, "700_749": 50, "650_699": 12, "600_649": 5, below_600: 5 },
    accepts_ntc: false, accepts_se_no_itr: false, review: 3.6, review_count: 3200, api: "manual",
  },
  {
    lender_id: "bajaj", name: "Bajaj Finance", lender_type: "nbfc",
    // R3 §2.4 Insight 1: Bajaj uses Experian as PRIMARY.
    primary_bureau: "experian", secondary_bureau: "cibil", min_score: { experian: 650, cibil: 650 },
    min_income_salaried: 15000, min_income_self_employed: 250000, max_foir: 0.55,
    loan_amount_min: 30000, loan_amount_max: 4000000, rate_min: 11, rate_max: 31,
    fee_type: "percentage", fee_value: 2, avg_disbursal_days: 1,
    bands: { "750_plus": 90, "700_749": 72, "650_699": 50, "600_649": 25, below_600: 8 },
    accepts_ntc: false, accepts_se_no_itr: false, review: 4.1, review_count: 5400, api: "full_api",
  },
  {
    lender_id: "tata", name: "Tata Capital", lender_type: "nbfc",
    primary_bureau: "cibil", secondary_bureau: "experian", min_score: { cibil: 750 },
    min_income_salaried: 20000, min_income_self_employed: 250000, max_foir: 0.55,
    loan_amount_min: 75000, loan_amount_max: 3500000, rate_min: 11.99, rate_max: 24,
    fee_type: "percentage", fee_value: 1.5, avg_disbursal_days: 3,
    bands: { "750_plus": 88, "700_749": 40, "650_699": 12, "600_649": 5, below_600: 5 },
    accepts_ntc: false, accepts_se_no_itr: true, review: 4.0, review_count: 1800, api: "partial",
  },
  {
    lender_id: "kreditbee", name: "KreditBee", lender_type: "digital_nbfc",
    primary_bureau: "experian", secondary_bureau: "cibil", min_score: { experian: 600, cibil: 600 },
    min_income_salaried: 8000, min_income_self_employed: 150000, max_foir: 0.65,
    loan_amount_min: 6000, loan_amount_max: 1000000, rate_min: 16, rate_max: 36,
    fee_type: "percentage", fee_value: 3, avg_disbursal_days: 1,
    bands: { "750_plus": 90, "700_749": 80, "650_699": 65, "600_649": 40, below_600: 20 },
    accepts_ntc: true, accepts_se_no_itr: true, review: 3.8, review_count: 9000, api: "full_api",
  },
  {
    lender_id: "moneyview", name: "MoneyView", lender_type: "digital_nbfc",
    primary_bureau: "cibil", secondary_bureau: "experian", min_score: { cibil: 600 },
    min_income_salaried: 13500, min_income_self_employed: 150000, max_foir: 0.65,
    loan_amount_min: 10000, loan_amount_max: 1000000, rate_min: 15.96, rate_max: 36,
    fee_type: "percentage", fee_value: 2.5, avg_disbursal_days: 1,
    bands: { "750_plus": 88, "700_749": 78, "650_699": 60, "600_649": 38, below_600: 18 },
    accepts_ntc: true, accepts_se_no_itr: true, review: 4.2, review_count: 7200, api: "full_api",
  },
];

function toProduct(s: SeedSpec): LenderProduct {
  return {
    id: `${s.lender_id}-personal`,
    lender_id: s.lender_id,
    lender_name: s.name,
    lender_type: s.lender_type,
    loan_type: "personal",
    primary_bureau: s.primary_bureau,
    secondary_bureau: s.secondary_bureau,
    min_score: s.min_score,
    income_rules: { min_income_salaried: s.min_income_salaried, min_income_self_employed: s.min_income_self_employed },
    foir_rules: { max_foir: s.max_foir },
    min_employment_months: 12,
    min_business_vintage_months: 24,
    loan_amount_min: s.loan_amount_min,
    loan_amount_max: s.loan_amount_max,
    tenure_min_months: 12,
    tenure_max_months: 60,
    interest_rate_min: s.rate_min,
    interest_rate_max: s.rate_max,
    processing_fee_type: s.fee_type,
    processing_fee_value: s.fee_value,
    avg_disbursal_days: s.avg_disbursal_days,
    approval_rate_by_band: s.bands,
    accepts_new_to_credit: s.accepts_ntc,
    accepts_self_employed_no_itr: s.accepts_se_no_itr,
    pin_code_blacklist: [],
    employer_blacklist: [],
    user_review_score: s.review,
    review_count: s.review_count,
    api_integration_status: s.api,
  };
}

/** Mock personal-loan lender catalog for Sprint 8. */
export const SEED_LENDER_PRODUCTS: LenderProduct[] = SPECS.map(toProduct);

export const SEED_LENDERS = SPECS.map((s) => ({
  id: s.lender_id,
  name: s.name,
  lender_type: s.lender_type,
}));
