import type { BureauName } from "@leapmoney/credit";
import type { LenderProduct, MatchUserProfile, ScoreBandKey } from "./types";

export const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Map a 300–900 score to the CIBIL band key used by approval-rate tables. */
export function scoreBandKey(score: number): ScoreBandKey {
  if (score >= 750) return "750_plus";
  if (score >= 700) return "700_749";
  if (score >= 650) return "650_699";
  if (score >= 600) return "600_649";
  return "below_600";
}

/**
 * The score a lender will actually see: its primary bureau if we have it, else
 * its secondary bureau, else the LeapScore as a proxy (R3 §2.4 / §10.1.3).
 */
export function evaluatedScore(product: LenderProduct, user: MatchUserProfile): number {
  const byBureau = (b: BureauName): number | null => {
    switch (b) {
      case "cibil":
        return user.cibil;
      case "experian":
        return user.experian;
      case "crif":
        return user.crif;
      case "equifax":
        return user.equifax_normalized;
    }
  };
  const primary = byBureau(product.primary_bureau);
  if (primary !== null) return primary;
  if (product.secondary_bureau) {
    const secondary = byBureau(product.secondary_bureau);
    if (secondary !== null) return secondary;
  }
  return user.leapscore;
}

/** Standard reducing-balance EMI (R3 §10.2). */
export function calcEmi(principal: number, annualRate: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

export function processingFeeAmount(product: LenderProduct, principal: number): number {
  switch (product.processing_fee_type) {
    case "percentage":
      return (product.processing_fee_value / 100) * principal;
    case "fixed":
      return product.processing_fee_value;
    case "nil":
      return 0;
  }
}

/**
 * Effective APR including the processing fee: solve for the rate on the net
 * amount actually received (R3 §10.2). Bisection — deterministic, no deps.
 */
export function calcApr(
  product: LenderProduct,
  principal: number,
  annualRate: number,
  months: number,
): number {
  const fee = processingFeeAmount(product, principal);
  const net = principal - fee;
  if (net <= 0 || months <= 0) return annualRate;
  const emi = calcEmi(principal, annualRate, months);

  // Find annual rate where PV of EMIs over `net` equals the schedule.
  let lo = annualRate;
  let hi = annualRate + 40;
  const pv = (rateAnnual: number): number => {
    const r = rateAnnual / 12 / 100;
    if (r === 0) return emi * months;
    return (emi * (1 - Math.pow(1 + r, -months))) / r;
  };
  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (pv(mid) > net) lo = mid;
    else hi = mid;
  }
  return Math.round(((lo + hi) / 2) * 100) / 100;
}

export function feeDisplay(product: LenderProduct): string {
  switch (product.processing_fee_type) {
    case "percentage":
      return `${product.processing_fee_value}% of loan amount`;
    case "fixed":
      return `₹${product.processing_fee_value.toLocaleString("en-IN")}`;
    case "nil":
      return "No processing fee";
  }
}
