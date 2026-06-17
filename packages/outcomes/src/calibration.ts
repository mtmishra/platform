// Feedback loop / calibration — compares predicted approval probability against
// realised outcomes. This is the dataset the matching model will eventually be
// trained and validated on (R3 §10.3 phases 2–3). Rule-based + descriptive only.

import type { ApplicationOutcome, CalibrationBucket, CalibrationData, FeedbackPoint } from "./types";

/** Turn decided applications (with a prediction) into labelled feedback points. */
export function toFeedbackPoints(records: ApplicationOutcome[]): FeedbackPoint[] {
  const points: FeedbackPoint[] = [];
  for (const r of records) {
    if (r.predicted_probability === null) continue;
    if (r.approval_result === "approved") {
      points.push({ application_id: r.id, predicted_probability: r.predicted_probability, actual_outcome: 1 });
    } else if (r.approval_result === "rejected") {
      points.push({ application_id: r.id, predicted_probability: r.predicted_probability, actual_outcome: 0 });
    }
  }
  return points;
}

/** Bucket feedback points into 10-point bands and measure calibration. */
export function buildCalibration(records: ApplicationOutcome[]): CalibrationData {
  const points = toFeedbackPoints(records);

  const buckets: CalibrationBucket[] = [];
  for (let lower = 0; lower < 100; lower += 10) {
    const upper = lower + 10;
    // Top bucket is inclusive of 100; others are [lower, upper).
    const inBucket = points.filter((p) =>
      upper === 100 ? p.predicted_probability >= lower : p.predicted_probability >= lower && p.predicted_probability < upper,
    );
    if (inBucket.length === 0) continue;

    const meanPredicted =
      inBucket.reduce((s, p) => s + p.predicted_probability, 0) / inBucket.length;
    const approved = inBucket.filter((p) => p.actual_outcome === 1).length;
    const actualRate = (approved / inBucket.length) * 100;

    buckets.push({
      label: `${lower}–${upper - 1}%`,
      lower,
      upper,
      count: inBucket.length,
      mean_predicted: Math.round(meanPredicted * 10) / 10,
      actual_rate: Math.round(actualRate * 10) / 10,
      gap: Math.round(Math.abs(meanPredicted - actualRate) * 10) / 10,
    });
  }

  const meanAbsError =
    points.length === 0
      ? 0
      : Math.round(
          (points.reduce((s, p) => s + Math.abs(p.predicted_probability - p.actual_outcome * 100), 0) / points.length) * 10,
        ) / 10;

  const brier =
    points.length === 0
      ? 0
      : Math.round(
          (points.reduce((s, p) => s + Math.pow(p.predicted_probability / 100 - p.actual_outcome, 2), 0) / points.length) * 1000,
        ) / 1000;

  return {
    points,
    buckets,
    mean_abs_error: meanAbsError,
    brier_score: brier,
    sample_size: points.length,
  };
}
