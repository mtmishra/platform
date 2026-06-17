// Build a LeapMatch user profile from a LeapScore result plus the borrower
// attributes LeapMatch needs that the score itself does not carry.

import type { LeapScoreResult } from "@leapmoney/credit";
import type { MatchUserProfile } from "./types";

export type MatchProfileAttributes = Omit<
  MatchUserProfile,
  "leapscore" | "cibil" | "experian" | "crif" | "equifax_normalized" | "aa_cash_flow_verified"
>;

/**
 * Compose a MatchUserProfile. The score fields come straight from the LeapScore
 * result (single source of truth); the rest are loan-application attributes.
 * Throws if the score is unavailable (thin-file) — caller should route such
 * users to the starter/rehabilitation path, not the matcher.
 */
export function profileFromLeapScore(
  score: LeapScoreResult,
  attributes: MatchProfileAttributes,
): MatchUserProfile {
  if (score.leapscore === null) {
    throw new Error("LeapScore unavailable — route to starter path, not LeapMatch");
  }
  return {
    leapscore: score.leapscore,
    cibil: score.bureau_breakdown.cibil,
    experian: score.bureau_breakdown.experian,
    crif: score.bureau_breakdown.crif,
    equifax_normalized: score.bureau_breakdown.equifax_normalized,
    aa_cash_flow_verified: score.data_sources_used.includes("aa"),
    ...attributes,
  };
}
