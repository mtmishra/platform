// @leapmoney/outcomes — Outcome Intelligence Foundation (Sprint 10)
// Application/outcome tracking model + feedback loop + analytics. Source: R3 §10.3.

export type {
  ApplicationStatus,
  OutcomeResult,
  ApplicationOutcome,
  FeedbackPoint,
  CalibrationBucket,
  CalibrationData,
  AnalyticsSummary,
} from "./types";

export { approvalRate, matchAccuracy, conversionRate, summarize } from "./analytics";
export { toFeedbackPoints, buildCalibration } from "./calibration";
export { MOCK_OUTCOMES } from "./mock";
