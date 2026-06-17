// LeapMatch orchestration — eligibility → approval odds → ranking → output
// (R3 §10.1.3 Step 4). Rule-based only; no ML, no live lender APIs.

import type {
  ApprovalOdds,
  EligibilityResult,
  LenderProduct,
  LoanRequest,
  MatchBadge,
  MatchedLender,
  MatchMode,
  MatchResult,
  MatchUserProfile,
  NotMatchedLender,
} from "./types";
import { checkEligibility } from "./eligibility";
import { computeApprovalOdds } from "./approval";
import { type MarketStats, matchScore, rankingMethodology } from "./ranking";
import { calcApr, calcEmi, evaluatedScore, feeDisplay } from "./util";

export interface MatchOptions {
  products?: LenderProduct[];
  mode?: MatchMode;
}

interface Candidate {
  product: LenderProduct;
  odds: ApprovalOdds;
  emi: number;
  apr: number;
  score: number;
}

function buildMatchReason(product: LenderProduct, odds: ApprovalOdds, evaluated: number): string {
  const bureau = product.primary_bureau.toUpperCase();
  const positives = odds.reason_codes.filter((r) => r.code !== "BASE_BAND" && r.delta > 0);
  const lead = positives[0];
  const basis = lead ? ` ${lead.label} also helps.` : "";
  return (
    `Your ${bureau} score of ${evaluated} fits ${product.lender_name}'s approval band, giving ` +
    `${odds.approval_probability}% estimated approval odds.${basis}`
  );
}

function assignBadges(matched: MatchedLender[]): void {
  if (matched.length === 0) return;
  matched[0]!.match_badge = "best_match";
  const byRate = [...matched].sort((a, b) => a.interest_rate_min - b.interest_rate_min)[0];
  const byApproval = [...matched].sort((a, b) => b.approval_probability - a.approval_probability)[0];
  const bySpeed = [...matched].sort((a, b) => a.avg_disbursal_days - b.avg_disbursal_days)[0];
  const tag = (m: MatchedLender | undefined, badge: MatchBadge): void => {
    if (m && m.match_badge === null) m.match_badge = badge;
  };
  tag(byRate, "lowest_rate");
  tag(byApproval, "best_for_score");
  tag(bySpeed, "fastest");
}

/**
 * Run the LeapMatch engine. Returns ranked matched lenders, the ineligible set
 * with reasons (RBI 2025 — all lenders shown), and the ranking methodology.
 */
export function runMatch(
  user: MatchUserProfile,
  request: LoanRequest,
  options: MatchOptions = {},
): MatchResult {
  const products = options.products ?? [];
  const mode: MatchMode = options.mode ?? "standard";
  const softPull = mode === "soft_prequalification";

  const eligible: Array<{ product: LenderProduct; eligibility: EligibilityResult }> = [];
  const notMatched: NotMatchedLender[] = [];

  for (const product of products) {
    if (product.loan_type !== request.loan_type) continue;
    const eligibility = checkEligibility(product, user, request);
    if (eligibility.eligible) {
      eligible.push({ product, eligibility });
    } else {
      const minScore = product.min_score[product.primary_bureau];
      const need =
        eligibility.reason === "score_too_low" && minScore !== undefined
          ? `Need ${product.primary_bureau.toUpperCase()} ${minScore}+; you have ${eligibility.evaluated_score}. ${
              minScore - eligibility.evaluated_score <= 40 ? "Reachable in ~90 days." : "Build over a few months."
            }`
          : (eligibility.reason_display ?? "Not eligible for this product");
      notMatched.push({
        lender_id: product.lender_id,
        product_id: product.id,
        lender_name: product.lender_name,
        reason: eligibility.reason ?? "other",
        reason_display: eligibility.reason_display ?? "Not eligible",
        what_you_need: need,
      });
    }
  }

  // Approval odds + cost for each eligible product.
  const candidates: Candidate[] = eligible.map(({ product, eligibility }) => {
    const odds = computeApprovalOdds(product, user, request, eligibility.evaluated_score);
    const emi = calcEmi(request.loan_amount_requested, product.interest_rate_min, request.tenure_months);
    const apr = calcApr(product, request.loan_amount_requested, product.interest_rate_min, request.tenure_months);
    return { product, odds, emi, apr, score: 0 };
  });

  // Market stats across eligible candidates for rate/speed normalization.
  const market: MarketStats = {
    minRate: Math.min(...candidates.map((c) => c.product.interest_rate_min), Infinity),
    maxRate: Math.max(...candidates.map((c) => c.product.interest_rate_min), 0),
    maxDisbursalDays: Math.max(...candidates.map((c) => c.product.avg_disbursal_days), 0),
  };

  for (const c of candidates) {
    c.score = matchScore(
      {
        approval_probability: c.odds.approval_probability,
        rate: c.product.interest_rate_min,
        avg_disbursal_days: c.product.avg_disbursal_days,
        user_review_score: c.product.user_review_score,
      },
      request.preference,
      market,
    );
  }

  candidates.sort((a, b) => b.score - a.score);

  const matched: MatchedLender[] = candidates.map((c, i) => {
    const evaluated = evaluatedScore(c.product, user);
    return {
      lender_id: c.product.lender_id,
      product_id: c.product.id,
      lender_name: c.product.lender_name,
      rank: i + 1,
      match_badge: null,
      approval_probability: c.odds.approval_probability,
      approval_probability_label: c.odds.approval_probability_label,
      approval_confidence: c.odds.confidence_level,
      reason_codes: c.odds.reason_codes,
      interest_rate_min: c.product.interest_rate_min,
      interest_rate_max: c.product.interest_rate_max,
      emi_estimate: Math.round(c.emi),
      processing_fee_display: feeDisplay(c.product),
      annual_percentage_rate: c.apr,
      tenure_offered: `${c.product.tenure_min_months}–${c.product.tenure_max_months} months`,
      avg_disbursal_days: c.product.avg_disbursal_days,
      user_review_score: c.product.user_review_score,
      review_count: c.product.review_count,
      match_reason: buildMatchReason(c.product, c.odds, evaluated),
      bureau_that_will_be_pulled: c.product.primary_bureau,
      // LeapCheck soft pull never creates a hard inquiry.
      hard_inquiry_warning: !softPull,
      application_type: c.product.api_integration_status,
    };
  });

  assignBadges(matched);

  return {
    match_date: new Date().toISOString(),
    loan_request: request,
    mode,
    matched_lenders: matched,
    not_matched_lenders: notMatched,
    ranking_methodology: rankingMethodology(request.preference),
  };
}
