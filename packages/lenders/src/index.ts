// @leapmoney/lenders — Lender Intelligence Repository (Sprint 14.5)
// Single source of truth for credit policies, products, payouts, approval &
// match intelligence. Powers LeapMatch, DSA, Lender, Admin, and Commission.

export type {
  LenderType,
  LoanProduct,
  ApprovalBand,
  PayoutType,
  EmploymentType,
  MatchTag,
  LenderMaster,
  LenderProductMaster,
  LenderCreditPolicy,
  LenderApprovalProfile,
  LenderPayout,
  LenderMatchProfile,
  RejectionReason,
  LenderProfile,
  LenderComparisonRow,
} from "./types";

export {
  getLenders,
  getLenderCount,
  getLenderProfile,
  getRejectionReasons,
} from "./repository";
export { estimatedCommission, payoutDisplay } from "./commission";
export { compareLenders } from "./compare";
