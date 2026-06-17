// Demo Credit Health bundle for the dashboard (Sprint 9). Assembled entirely
// from the Sprint 7 engine + mock inputs — no live bureau integration. Replace
// `buildDemoInput()` with a real LeapScoreInput once bureau pulls are wired.

import {
  buildImprovementPlan,
  buildMockReport,
  computeCreditHealth,
  computeLeapScore,
  simulateAll,
  translateDpd,
  MOCK_BEHAVIOR,
  MOCK_CASH_FLOW,
  MOCK_HEALTH,
  type BureauName,
  type CreditHealthResult,
  type DpdInsight,
  type ImprovementPlan,
  type LeapScoreInput,
  type LeapScoreResult,
  type SimulationResult,
} from "@leapmoney/credit";

const BUREAUS: BureauName[] = ["cibil", "experian", "crif", "equifax"];

function buildDemoInput(): LeapScoreInput {
  return {
    reports: BUREAUS.map((b) => buildMockReport(b, "ABCDE1234F", "soft")),
    cashFlow: MOCK_CASH_FLOW,
    behavior: MOCK_BEHAVIOR,
    health: MOCK_HEALTH,
  };
}

export interface CreditHealthBundle {
  leapScore: LeapScoreResult;
  health: CreditHealthResult;
  dpdInsights: DpdInsight[];
  improvementPlan: ImprovementPlan;
  simulations: SimulationResult[];
}

export function getDemoCreditHealth(): CreditHealthBundle {
  const input = buildDemoInput();
  const leapScore = computeLeapScore(input);
  const health = computeCreditHealth(input);
  const baseScore = leapScore.leapscore ?? 700;
  return {
    leapScore,
    health,
    dpdInsights: translateDpd(input.reports),
    improvementPlan: buildImprovementPlan(input),
    simulations: simulateAll(baseScore),
  };
}
