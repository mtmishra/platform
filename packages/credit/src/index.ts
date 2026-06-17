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

// ── Credit Health (Sprint 9) ──────────────────────────────────────────────────
export type {
  Severity,
  HealthBandLabel,
  HealthCategory,
  RiskIndicator,
  ImpactScore,
  CreditHealthResult,
  DpdInsight,
  ImprovementPlan,
  SimulationId,
  SimulationResult,
} from "./health/types";
export { computeCreditHealth } from "./health/engine";
export { translateDpd, worstDpd, worstDpdAcrossReports, hasDerogatory } from "./health/dpd";
export { buildImprovementPlan } from "./health/improvement";
export { simulateScenario, simulateAll } from "./health/simulator";

// ── Cash Flow / Income Intelligence (Sprint 13) ───────────────────────────────
export type {
  IncomeConfidence,
  CashFlowBand,
  FoirRisk,
  VerificationStatus,
  IncomeIntelligence,
  CashFlowScoreResult,
  FoirAnalysis,
  VerifiedIncome,
  CashFlowIntelligence,
} from "./cashflow/types";
export { computeCashFlowIntelligence } from "./cashflow/engine";

// ── Financial Intelligence (Sprint 13.5) ──────────────────────────────────────
export { emi, totalInterest } from "./finance";
export type {
  EmployerCategory,
  StabilityBand,
  IncomeStabilityBand,
  EmployerIntelligence,
  IncomeStabilityInput,
  IncomeStabilityResult,
} from "./employer";
export { computeEmployerIntelligence, computeIncomeStability } from "./employer";
export type { FoirRiskBand, AdvancedFoirInput, AdvancedFoirResult } from "./foir";
export { computeAdvancedFoir } from "./foir";
export type {
  BalanceTransferInput,
  BtLenderOption,
  BtEligibleLender,
  BalanceTransferResult,
} from "./balance-transfer";
export { computeBalanceTransfer } from "./balance-transfer";
export type { DebtType, Debt, DebtStructure, ConsolidationResult } from "./consolidation";
export { computeConsolidation } from "./consolidation";
export type {
  RecommendationPriority,
  Recommendation,
  SavingsOpportunity,
  RecommendationInput,
  FinancialGuidance,
} from "./recommendations";
export { computeRecommendations } from "./recommendations";
export type { FindingSeverity, Finding, FindingsInput } from "./findings";
export { computeFindings } from "./findings";
