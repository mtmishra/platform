// Hard eligibility filter — pass/fail (R3 §10.1.3 Step 1).

import type {
  EligibilityResult,
  LenderProduct,
  LoanRequest,
  MatchUserProfile,
} from "./types";
import { calcEmi, evaluatedScore } from "./util";

const SELF_EMPLOYED_NO_DOC = new Set(["self_employed_no_gst", "freelancer"]);

function minIncomeFor(product: LenderProduct, user: MatchUserProfile): number {
  const salaried = user.employment_type.startsWith("salaried");
  return salaried ? product.income_rules.min_income_salaried : product.income_rules.min_income_self_employed;
}

/**
 * Returns whether the borrower passes the lender's hard rules. The first failing
 * rule wins (so the "what you need" guidance is the most actionable one).
 */
export function checkEligibility(
  product: LenderProduct,
  user: MatchUserProfile,
  request: LoanRequest,
): EligibilityResult {
  const score = evaluatedScore(product, user);
  const fail = (reason: EligibilityResult["reason"], display: string): EligibilityResult => ({
    eligible: false,
    reason,
    reason_display: display,
    evaluated_score: score,
  });

  // Amount within product range
  if (
    request.loan_amount_requested < product.loan_amount_min ||
    request.loan_amount_requested > product.loan_amount_max
  ) {
    return fail(
      "amount_out_of_range",
      `Offers ₹${product.loan_amount_min.toLocaleString("en-IN")}–₹${product.loan_amount_max.toLocaleString("en-IN")}`,
    );
  }

  // New-to-credit gate
  const hasNoBureau = user.cibil === null && user.experian === null && user.crif === null;
  if (hasNoBureau && !product.accepts_new_to_credit) {
    return fail("no_credit_history", "Does not lend to new-to-credit borrowers");
  }

  // Self-employed-without-docs gate
  if (SELF_EMPLOYED_NO_DOC.has(user.employment_type) && !product.accepts_self_employed_no_itr) {
    return fail("employment_type", "Requires income proof (ITR/GST) this borrower lacks");
  }

  // Minimum score on the bureau this lender queries
  const minScore = product.min_score[product.primary_bureau];
  if (minScore !== undefined && score < minScore) {
    return fail("score_too_low", `Needs ${product.primary_bureau.toUpperCase()} ${minScore}+`);
  }

  // Income
  const minIncome = minIncomeFor(product, user);
  if (user.monthly_net_income < minIncome) {
    return fail("income_too_low", `Needs ₹${minIncome.toLocaleString("en-IN")}/month income`);
  }

  // FOIR including the new EMI (mid-rate estimate)
  const midRate = (product.interest_rate_min + product.interest_rate_max) / 2;
  const newEmi = calcEmi(request.loan_amount_requested, midRate, request.tenure_months);
  const projectedFoir = user.foir_current + (user.monthly_net_income > 0 ? newEmi / user.monthly_net_income : 1);
  if (projectedFoir > product.foir_rules.max_foir) {
    return fail(
      "foir_too_high",
      `Your obligations would reach ${Math.round(projectedFoir * 100)}% of income (max ${Math.round(product.foir_rules.max_foir * 100)}%)`,
    );
  }

  // Age band (standard 21–65)
  if (user.age < 21 || user.age > 65) {
    return fail("age", "Outside the lender's age range (21–65)");
  }

  // Geography
  if (product.pin_code_blacklist.includes(user.pin_code)) {
    return fail("geography", "Not available in your PIN code");
  }

  return { eligible: true, reason: null, reason_display: null, evaluated_score: score };
}
