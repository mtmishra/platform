// LeapCheck — soft-pull prequalification (R3 §10, R2 Gap 8).
// Shows matched offers WITHOUT any hard inquiry. Identical engine, run in
// soft_prequalification mode so every result carries hard_inquiry_warning=false.
// The actual hard pull happens only at application time, behind explicit consent.

import { runMatch, type MatchOptions } from "./engine";
import type { LoanRequest, MatchResult, MatchUserProfile } from "./types";

/**
 * Run a no-footprint prequalification. The caller supplies a profile derived
 * from a SOFT bureau pull (or cached LeapScore); this function guarantees the
 * result is flagged as a soft prequalification with no hard-inquiry warnings.
 */
export function leapCheck(
  user: MatchUserProfile,
  request: LoanRequest,
  options: Omit<MatchOptions, "mode"> = {},
): MatchResult {
  return runMatch(user, request, { ...options, mode: "soft_prequalification" });
}
