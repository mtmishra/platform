// Bureau score interpretation, standard 300–900 scale (R3 Appendix E).

export interface ScoreBand {
  label: string;
  min: number;
  max: number;
  summary: string;
}

export const SCORE_BANDS: readonly ScoreBand[] = [
  { label: "Poor", min: 300, max: 549, summary: "Rebuild required" },
  { label: "Below Average", min: 550, max: 649, summary: "Limited options; high cost" },
  { label: "Average", min: 650, max: 699, summary: "Digital lenders and NBFCs; not banks" },
  { label: "Good", min: 700, max: 749, summary: "Most NBFCs; some private banks" },
  { label: "Very Good", min: 750, max: 799, summary: "All banks; competitive rates" },
  { label: "Excellent", min: 800, max: 900, summary: "Pre-approved; best rates; premium products" },
];

export function bandForScore(score: number): ScoreBand {
  const band = SCORE_BANDS.find((b) => score >= b.min && score <= b.max);
  return band ?? SCORE_BANDS[0]!;
}

/**
 * Rough population percentile for a standard score. Anchored to the R3 example
 * (742 ≈ top 28%). Used only as a directional "score_percentile" hint.
 */
export function approximatePercentile(score: number): number {
  // Piecewise-linear anchors across the 300–900 range.
  const anchors: Array<[number, number]> = [
    [550, 95],
    [650, 70],
    [700, 50],
    [742, 28],
    [780, 15],
    [820, 6],
    [900, 1],
  ];
  if (score <= anchors[0]![0]) return anchors[0]![1];
  for (let i = 1; i < anchors.length; i += 1) {
    const [hiScore, hiPct] = anchors[i]!;
    const [loScore, loPct] = anchors[i - 1]!;
    if (score <= hiScore) {
      const ratio = (score - loScore) / (hiScore - loScore);
      return Math.round(loPct + ratio * (hiPct - loPct));
    }
  }
  return 1;
}
