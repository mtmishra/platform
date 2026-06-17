import { BUREAU_RANGE, STANDARD_RANGE, type BureauName } from "./types";

/**
 * Normalize a bureau's native score onto the standard 300–900 scale.
 * Only Equifax (1–999) actually differs; the others pass through. R3 §1.5.
 */
export function normalizeScore(bureau: BureauName, score: number | null): number | null {
  if (score === null) return null;
  const range = BUREAU_RANGE[bureau];
  if (range.min === STANDARD_RANGE.min && range.max === STANDARD_RANGE.max) {
    return score;
  }
  const ratio = (score - range.min) / (range.max - range.min);
  const normalized =
    STANDARD_RANGE.min + ratio * (STANDARD_RANGE.max - STANDARD_RANGE.min);
  return Math.round(normalized);
}
