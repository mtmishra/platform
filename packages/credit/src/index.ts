// @leapmoney/credit — Credit Intelligence Foundation (Sprint 7)
// Bureau abstraction layer + LeapScore v2 engine. Source of truth: R3.

// ── Domain types ──────────────────────────────────────────────────────────────
export type {
  BureauName,
  PullType,
  AccountType,
  AccountStatus,
  OwnershipType,
  Tradeline,
  Inquiry,
  ScoreFactor,
  BureauReport,
  CashFlowTrend,
  IncomeSourceType,
  CashFlowData,
  PaymentBehaviorData,
  AccountHealthData,
  LeapScoreInput,
  ConfidenceLevel,
  DataSource,
  ImpactLevel,
  ActionDifficulty,
  ScoreContributor,
  ScoreDetractor,
  ImprovementAction,
  CreditCostIndicator,
  NextMilestone,
  BureauBreakdown,
  LeapScoreResult,
} from "./types";
export { BUREAUS, BUREAU_RANGE, STANDARD_RANGE } from "./types";

// ── Bureau layer ────────────────────────────────────────────────────────────
export type {
  BureauAdapter,
  BureauPullRequest,
  BureauPullResponse,
  BureauPullStatus,
} from "./bureau/adapter";
export {
  CibilAdapter,
  ExperianAdapter,
  CrifAdapter,
  EquifaxAdapter,
} from "./bureau/adapters";
export { BureauRegistry, createDefaultBureauRegistry } from "./bureau/registry";
export { buildMockReport } from "./bureau/mock-data";

// ── Scoring ─────────────────────────────────────────────────────────────────
export { normalizeScore } from "./normalize";
export { SCORE_BANDS, bandForScore, approximatePercentile, type ScoreBand } from "./bands";
export { computeLeapScore } from "./leapscore/engine";
export {
  splitScoreFactors,
  buildImprovementActions,
  buildCreditCostIndicator,
  buildNextMilestone,
} from "./leapscore/outputs";

// ── Demo inputs ───────────────────────────────────────────────────────────────
export { MOCK_CASH_FLOW, MOCK_BEHAVIOR, MOCK_HEALTH } from "./mock";
