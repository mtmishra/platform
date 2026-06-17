// @leapmoney/match — LeapMatch Engine Foundation (Sprint 8)
// Rule-based eligibility + approval odds + ranking + LeapCheck. Source: R3 §10.

// ── Types ───────────────────────────────────────────────────────────────────
export type {
  LenderType,
  MatchLoanType,
  ScoreBandKey,
  ApprovalRateByBand,
  ApiIntegrationStatus,
  FeeType,
  IncomeRules,
  FoirRules,
  Lender,
  LenderProduct,
  EmploymentType,
  EmployerCategory,
  CityTier,
  LoanPurpose,
  Urgency,
  Preference,
  MatchUserProfile,
  LoanRequest,
  IneligibilityReason,
  EligibilityResult,
  ApprovalConfidence,
  ApprovalReasonCode,
  ApprovalOdds,
  MatchBadge,
  MatchedLender,
  NotMatchedLender,
  MatchMode,
  MatchResult,
} from "./types";

// ── Engine ──────────────────────────────────────────────────────────────────
export { checkEligibility } from "./eligibility";
export { computeApprovalOdds } from "./approval";
export {
  RANKING_WEIGHTS,
  rateCompetitiveness,
  disbursalSpeedScore,
  matchScore,
  rankingMethodology,
  type RankingWeights,
  type MarketStats,
  type RankInputs,
} from "./ranking";
export { runMatch, type MatchOptions } from "./engine";
export { leapCheck } from "./leapcheck";

// ── Utilities ─────────────────────────────────────────────────────────────────
export { calcEmi, calcApr, processingFeeAmount, feeDisplay, scoreBandKey, evaluatedScore } from "./util";

// ── Lender catalog + profile helpers ──────────────────────────────────────────
export { SEED_LENDERS, SEED_LENDER_PRODUCTS } from "./seed";
export { profileFromLeapScore, type MatchProfileAttributes } from "./profile";
export { MOCK_MATCH_USER, MOCK_LOAN_REQUEST } from "./mock";
