// Repository — derives the typed sub-records from the seed and exposes getters.
// This is the canonical access layer for LeapMatch / DSA / Lender / Admin.

import { PRODUCT_RANGES, REJECTION_REASONS, SEED_LENDERS, type FullLender } from "./seed";
import type {
  LenderApprovalProfile,
  LenderCreditPolicy,
  LenderMaster,
  LenderMatchProfile,
  LenderPayout,
  LenderProductMaster,
  LenderProfile,
  LenderType,
  RejectionReason,
} from "./types";

const toMaster = (l: FullLender): LenderMaster => ({
  lender_id: l.id,
  lender_name: l.name,
  lender_type: l.type,
  website: l.website,
  support_email: l.support_email,
  region_coverage: l.region_coverage,
  active: true,
});

const toPolicy = (l: FullLender): LenderCreditPolicy => ({
  lender_id: l.id,
  primary_bureau: l.primary_bureau,
  secondary_bureau: l.secondary_bureau,
  min_score: l.min_score,
  preferred_score: l.preferred_score,
  min_income: l.min_income,
  max_foir: l.max_foir,
  min_age: l.min_age,
  max_age: l.max_age,
  employment_types: l.employment_types,
});

const toApproval = (l: FullLender): LenderApprovalProfile => ({
  lender_id: l.id,
  approval_rate: l.approval_rate,
  avg_tat_days: l.avg_tat_days,
  avg_disbursal_days: l.avg_disbursal_days,
  band: l.band,
});

const toMatch = (l: FullLender): LenderMatchProfile => ({
  lender_id: l.id,
  best_for: l.best_for,
  match_strength: l.match_strength,
});

const toProducts = (l: FullLender): LenderProductMaster[] =>
  l.products.map((p) => ({ lender_id: l.id, product: p, ...PRODUCT_RANGES[p] }));

const toPayouts = (l: FullLender): LenderPayout[] =>
  l.products.map((p) => ({
    lender_id: l.id,
    product: p,
    payout_type: l.payout_type,
    // Home/LAP carry a lower payout %; personal/business the headline rate.
    payout_value: p === "home" || p === "lap" ? Math.max(0.4, l.payout_value - 0.4) : l.payout_value,
    max_cap: l.max_cap,
  }));

export function getLenders(filter?: { type?: LenderType }): LenderMaster[] {
  return SEED_LENDERS.filter((l) => !filter?.type || l.type === filter.type).map(toMaster);
}

export function getLenderCount(): { total: number; banks: number; nbfcs: number; fintechs: number } {
  return {
    total: SEED_LENDERS.length,
    banks: SEED_LENDERS.filter((l) => l.type === "bank").length,
    nbfcs: SEED_LENDERS.filter((l) => l.type === "nbfc").length,
    fintechs: SEED_LENDERS.filter((l) => l.type === "fintech").length,
  };
}

export function getLenderProfile(id: string): LenderProfile | undefined {
  const l = SEED_LENDERS.find((x) => x.id === id);
  if (!l) return undefined;
  return {
    master: toMaster(l),
    products: toProducts(l),
    policy: toPolicy(l),
    approval: toApproval(l),
    payouts: toPayouts(l),
    match: toMatch(l),
  };
}

export function getRejectionReasons(): RejectionReason[] {
  return REJECTION_REASONS.map((r) => ({ ...r }));
}
