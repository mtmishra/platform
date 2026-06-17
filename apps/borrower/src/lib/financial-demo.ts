// Financial Intelligence demo bundle (Sprint 13.5). Composes the credit engines
// with the Sprint 8 lender catalog (injected here to avoid a package cycle) and
// mock debts. Rule-based, mock data only — no APIs, no ML.

import {
  computeAdvancedFoir,
  computeBalanceTransfer,
  computeConsolidation,
  computeEmployerIntelligence,
  computeFindings,
  computeIncomeStability,
  computeRecommendations,
  type AdvancedFoirResult,
  type BalanceTransferResult,
  type ConsolidationResult,
  type Debt,
  type EmployerIntelligence,
  type Finding,
  type FinancialGuidance,
  type IncomeStabilityResult,
} from "@leapmoney/credit";
import { SEED_LENDER_PRODUCTS } from "@leapmoney/match";

export interface FinancialIntelligenceBundle {
  employer: EmployerIntelligence;
  incomeStability: IncomeStabilityResult;
  foir: AdvancedFoirResult;
  balanceTransfer: BalanceTransferResult;
  consolidation: ConsolidationResult;
  findings: Finding[];
  guidance: FinancialGuidance;
}

const MONTHLY_INCOME = 90000;

// Demo debt structure (mirrors the mock bureau tradelines).
const DEMO_DEBTS: Debt[] = [
  { type: "personal_loan", outstanding: 180000, rate: 16, monthly_payment: 14500 },
  { type: "credit_card", outstanding: 36000, rate: 42, monthly_payment: 3600 },
];

export function getFinancialIntelligence(): FinancialIntelligenceBundle {
  const employer = computeEmployerIntelligence("mnc");
  const incomeStability = computeIncomeStability({
    monthly_income: MONTHLY_INCOME,
    salary_variance: 0.08,
    job_tenure_months: 60,
    employer_category: "mnc",
  });

  const foir = computeAdvancedFoir({
    monthly_income: MONTHLY_INCOME,
    existing_emi: 14500,
    credit_card_burden: 1800,
    bnpl_burden: 0,
    proposed_emi: 21740,
  });

  const btOptions = SEED_LENDER_PRODUCTS.map((p) => ({
    lender_id: p.lender_id,
    lender_name: p.lender_name,
    rate: p.interest_rate_min,
  }));
  const balanceTransfer = computeBalanceTransfer(
    { outstanding_amount: 180000, current_interest_rate: 16, remaining_tenure_months: 36 },
    btOptions,
  );

  const consolidation = computeConsolidation(DEMO_DEBTS);

  const findings = computeFindings({
    utilization: 0.18,
    foir_risk: foir.risk_band,
    has_derogatory: false,
    hard_inquiries_6m: 1,
    highest_loan_rate: Math.max(...DEMO_DEBTS.map((d) => d.rate)),
    employer_rating: employer.stability_rating,
    job_tenure_months: 60,
    income_stability_band: incomeStability.stability_band,
  });

  const guidance = computeRecommendations({
    utilization: 0.18,
    hard_inquiries_6m: 1,
    has_derogatory: false,
    foir_risk: foir.risk_band,
    balance_transfer: {
      possible: balanceTransfer.possible,
      monthly_savings: balanceTransfer.monthly_savings,
      total_interest_savings: balanceTransfer.total_interest_savings,
    },
    consolidation: {
      possible: consolidation.consolidation_possible,
      estimated_monthly_savings: consolidation.estimated_monthly_savings,
      estimated_interest_savings: consolidation.estimated_interest_savings,
    },
    inactive_cards: 1,
    low_salary_balance: false,
  });

  return { employer, incomeStability, foir, balanceTransfer, consolidation, findings, guidance };
}
