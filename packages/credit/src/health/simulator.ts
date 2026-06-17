// Score Simulator — estimates the score impact of a planned action and the
// lending options it would unlock (R3 §9 score simulator, Appendix D deltas).

import { STANDARD_RANGE } from "../types";
import type { SimulationId, SimulationResult } from "./types";

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

interface ScenarioDef {
  id: SimulationId;
  label: string;
  delta: number;
}

const SCENARIOS: ScenarioDef[] = [
  { id: "clear_overdue", label: "Clear your overdue / derogatory account", delta: 30 },
  { id: "pay_on_time_6m", label: "Pay every EMI on time for 6 months", delta: 25 },
  { id: "reduce_utilization", label: "Reduce credit-card utilization below 10%", delta: 20 },
  { id: "no_new_enquiries", label: "Avoid new loan applications for 90 days", delta: 12 },
];

// Lending milestones on the 300–900 scale (R3 §9 / Appendix E).
const MILESTONES: Array<[number, string]> = [
  [650, "Digital NBFCs (KreditBee, MoneyView)"],
  [700, "Major NBFCs like Bajaj Finance"],
  [750, "HDFC, ICICI and Axis personal loans at competitive rates"],
  [800, "Pre-approved offers and the best available rates"],
];

function unlockedBetween(current: number, next: number): string[] {
  return MILESTONES.filter(([m]) => m > current && m <= next).map(([, label]) => label);
}

function simulateOne(currentScore: number, scenario: ScenarioDef): SimulationResult {
  const estimated_new_score = clamp(currentScore + scenario.delta, STANDARD_RANGE.min, STANDARD_RANGE.max);
  return {
    id: scenario.id,
    label: scenario.label,
    current_score: currentScore,
    estimated_new_score,
    estimated_delta: estimated_new_score - currentScore,
    unlocked_options: unlockedBetween(currentScore, estimated_new_score),
  };
}

/** Estimate the impact of a single scenario. */
export function simulateScenario(currentScore: number, id: SimulationId): SimulationResult {
  const scenario = SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0]!;
  return simulateOne(currentScore, scenario);
}

/** Estimate all scenarios at once (for the simulator panel). */
export function simulateAll(currentScore: number): SimulationResult[] {
  return SCENARIOS.map((s) => simulateOne(currentScore, s));
}
