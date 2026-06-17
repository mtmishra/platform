// Improvement Plan engine — buckets ranked actions into 30 / 60 / 90-day
// horizons (R3 Appendix D priority matrix). Reuses the LeapScore action builder.

import type { LeapScoreInput } from "../types";
import { buildImprovementActions } from "../leapscore/outputs";
import { splitScoreFactors } from "../leapscore/outputs";
import type { ImprovementPlan } from "./types";

/**
 * Build a 30/60/90-day improvement plan from the same inputs the score uses.
 * Actions are bucketed by their realistic timeline (R3 Appendix D).
 */
export function buildImprovementPlan(input: LeapScoreInput): ImprovementPlan {
  const { holdingBack } = splitScoreFactors(input.reports, input.health, input.cashFlow);
  const actions = buildImprovementActions(input.health, holdingBack);

  const plan: ImprovementPlan = { thirty_day: [], sixty_day: [], ninety_day: [] };
  for (const action of actions) {
    if (action.timeline_days <= 30) plan.thirty_day.push(action);
    else if (action.timeline_days <= 60) plan.sixty_day.push(action);
    else plan.ninety_day.push(action);
  }
  return plan;
}
