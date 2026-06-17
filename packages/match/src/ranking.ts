// Ranking engine — preference-weighted match score (R3 §10.1.3 Step 3).

import type { Preference } from "./types";
import { clamp } from "./util";

export interface RankingWeights {
  approval: number;
  rate: number;
  speed: number;
  review: number;
}

/** Weight vectors per preference (R3 §10.1.3 Step 3). */
export const RANKING_WEIGHTS: Record<Preference, RankingWeights> = {
  BALANCED: { approval: 0.4, rate: 0.3, speed: 0.15, review: 0.15 },
  LOWEST_RATE: { approval: 0.2, rate: 0.6, speed: 0.1, review: 0.1 },
  HIGHEST_APPROVAL: { approval: 0.7, rate: 0.15, speed: 0.1, review: 0.05 },
  FASTEST: { approval: 0.3, rate: 0.1, speed: 0.5, review: 0.1 },
};

export interface MarketStats {
  minRate: number;
  maxRate: number;
  maxDisbursalDays: number;
}

export interface RankInputs {
  approval_probability: number;
  rate: number;
  avg_disbursal_days: number;
  user_review_score: number;
}

/** 0–100 sub-scores; higher rate / slower disbursal score lower. */
export function rateCompetitiveness(rate: number, market: MarketStats): number {
  if (market.maxRate === market.minRate) return 100;
  return clamp(100 * (1 - (rate - market.minRate) / (market.maxRate - market.minRate)), 0, 100);
}

export function disbursalSpeedScore(days: number, market: MarketStats): number {
  if (market.maxDisbursalDays === 0) return 100;
  return clamp(100 * (1 - days / market.maxDisbursalDays), 0, 100);
}

export function matchScore(inputs: RankInputs, preference: Preference, market: MarketStats): number {
  const w = RANKING_WEIGHTS[preference];
  const rate = rateCompetitiveness(inputs.rate, market);
  const speed = disbursalSpeedScore(inputs.avg_disbursal_days, market);
  const review = (inputs.user_review_score / 5) * 100;
  return (
    inputs.approval_probability * w.approval +
    rate * w.rate +
    speed * w.speed +
    review * w.review
  );
}

export function rankingMethodology(preference: Preference): string {
  const w = RANKING_WEIGHTS[preference];
  const pct = (n: number): string => `${Math.round(n * 100)}%`;
  return (
    `Lenders are ranked by a transparent score combining approval likelihood (${pct(w.approval)}), ` +
    `interest-rate competitiveness (${pct(w.rate)}), disbursal speed (${pct(w.speed)}), and borrower ` +
    `reviews (${pct(w.review)}), weighted for your "${preference}" preference. All eligible and ` +
    `ineligible lenders are shown; ranking is never influenced by commission (RBI Digital Lending ` +
    `Directions 2025).`
  );
}
