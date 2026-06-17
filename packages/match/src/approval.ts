// Approval Odds Engine — rule-based (R3 §10.1.3 Step 2). Base rate from the
// lender's per-band approval table, adjusted by signed modifiers, clamped 5–95.
// Never returns 0% or 100%.

import type {
  ApprovalOdds,
  ApprovalReasonCode,
  LenderProduct,
  LoanRequest,
  MatchUserProfile,
} from "./types";
import { clamp, scoreBandKey } from "./util";

function label(probability: number): string {
  if (probability >= 80) return "Very High";
  if (probability >= 60) return "High";
  if (probability >= 40) return "Moderate";
  if (probability >= 20) return "Low";
  return "Very Low";
}

export function computeApprovalOdds(
  product: LenderProduct,
  user: MatchUserProfile,
  request: LoanRequest,
  evaluated_score: number,
): ApprovalOdds {
  const reasons: ApprovalReasonCode[] = [];
  const add = (code: string, lbl: string, delta: number): void => {
    if (delta !== 0) reasons.push({ code, label: lbl, delta });
  };

  // Base from the lender's approval-rate table for the borrower's score band.
  const band = scoreBandKey(evaluated_score);
  const base = product.approval_rate_by_band[band];
  reasons.push({ code: "BASE_BAND", label: `Base approval rate for ${band.replace(/_/g, " ")}`, delta: base });

  // Existing relationship (R3 Rule 2)
  if (user.existing_bank_relationships.includes(product.lender_name)) {
    add("RELATIONSHIP_BANK", "Existing account with this lender", 15);
  }
  if (user.existing_loan_with_lender.includes(product.lender_name)) {
    add("RELATIONSHIP_LOAN", "Existing well-served loan with this lender", 10);
  }

  // Employer quality (R3 Rule 3)
  const employerBonus: Record<MatchUserProfile["employer_category"], number> = {
    govt: 10,
    mnc: 8,
    listed_company: 5,
    psu: 8,
    sme: 0,
    unknown: -5,
  };
  add("EMPLOYER_QUALITY", `Employer category: ${user.employer_category}`, employerBonus[user.employer_category]);

  // Inquiry recency (R3 Rule 5)
  const inq = user.hard_inquiries_last_6m;
  const inqPenalty = inq === 0 ? 0 : inq <= 2 ? -5 : inq <= 4 ? -15 : -30;
  add("INQUIRIES", `${inq} hard enquiries in last 6 months`, inqPenalty);

  // FOIR (R3 Rule 1)
  const foir = user.foir_current;
  const foirMod = foir < 0.35 ? 8 : foir <= 0.45 ? 3 : foir <= 0.55 ? -5 : -15;
  add("FOIR", `Current obligations at ${Math.round(foir * 100)}% of income`, foirMod);

  // AA-verified income
  if (user.aa_cash_flow_verified) {
    add("AA_VERIFIED", "Income verified via bank cash-flow data", 7);
  }

  // Delinquency history
  if (user.has_settlement_or_writeoff) {
    add("DEROGATORY", "Settlement / write-off on record", -20);
  }
  if (user.months_since_last_delinquency !== null && user.months_since_last_delinquency < 12) {
    add("RECENT_DELINQUENCY", "Delinquency within the last 12 months", -15);
  }

  // Purpose (R3 Rule 4)
  if (request.purpose === "debt_consolidation") add("PURPOSE", "Debt consolidation signals existing stress", -10);
  if (request.purpose === "medical") add("PURPOSE", "Medical purpose viewed sympathetically", 5);

  // Urgency vs disbursal speed
  if (request.urgency === "immediate" && product.avg_disbursal_days > 3) {
    add("URGENCY_FIT", "Lender slower than your stated urgency", -10);
  }

  const total = reasons.reduce((sum, r) => sum + r.delta, 0);
  const probability = clamp(Math.round(total), 5, 95);

  // Confidence in the estimate itself: stronger when we have the lender's own
  // bureau + AA-verified income, weaker on proxy/thin data.
  const haveBureauScore =
    (product.primary_bureau === "cibil" && user.cibil !== null) ||
    (product.primary_bureau === "experian" && user.experian !== null) ||
    (product.primary_bureau === "crif" && user.crif !== null) ||
    (product.primary_bureau === "equifax" && user.equifax_normalized !== null);
  const confidence_level = haveBureauScore && user.aa_cash_flow_verified ? "high" : haveBureauScore ? "medium" : "low";

  return {
    approval_probability: probability,
    approval_probability_label: label(probability),
    confidence_level,
    reason_codes: reasons,
  };
}
