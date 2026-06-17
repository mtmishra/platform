// LeapScore explainability outputs (R3 §9.1.3, Appendix D).
// Plain-English "what's helping / hurting", ranked improvement actions, the
// credit-cost indicator, and the next milestone.

import type {
  AccountHealthData,
  BureauReport,
  CashFlowData,
  CreditCostIndicator,
  ImprovementAction,
  NextMilestone,
  ScoreContributor,
  ScoreDetractor,
} from "../types";

const fmtINR = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;
const pct = (f: number): string => `${Math.round(f * 100)}%`;

/** Worst DPD value seen across a report's tradelines in the window. */
function worstDpd(reports: BureauReport[]): number {
  let worst = 0;
  for (const r of reports) {
    for (const t of r.tradelines) {
      for (const d of t.dpd_last_36_months) {
        if (d > worst) worst = d;
      }
    }
  }
  return worst;
}

function hasDerogatory(reports: BureauReport[]): boolean {
  return reports.some((r) =>
    r.tradelines.some((t) => t.account_status === "settlement" || t.account_status === "write_off" || t.account_status === "npa"),
  );
}

export function splitScoreFactors(
  reports: BureauReport[],
  health: AccountHealthData,
  cashFlow: CashFlowData | null,
): { helping: ScoreContributor[]; holdingBack: ScoreDetractor[] } {
  const helping: ScoreContributor[] = [];
  const holdingBack: ScoreDetractor[] = [];

  const util = health.credit_utilization_overall;
  if (util <= 0.1) {
    helping.push({ factor: "Credit Utilization", impact: "high", detail: `Very low utilization (${pct(util)})` });
  } else if (util <= 0.3) {
    helping.push({ factor: "Credit Utilization", impact: "medium", detail: `Utilization within healthy range (${pct(util)})` });
  } else {
    holdingBack.push({
      factor: "Credit Utilization",
      impact: "high",
      detail: `Utilization is ${pct(util)} of your limit`,
      fix: `Reduce balances below 30% (ideally 10%) for a +15–25 point boost`,
    });
  }

  const dpd = worstDpd(reports);
  if (dpd === 0 && reports.length > 0) {
    helping.push({ factor: "Payment History", impact: "high", detail: "No missed payments on record" });
  } else if (dpd > 0) {
    holdingBack.push({
      factor: "Payment History",
      impact: dpd >= 90 ? "high" : "medium",
      detail: `A payment was ${dpd}+ days late`,
      fix: "Keep every EMI on time; the impact fades as the late entry ages out",
    });
  }

  if (health.hard_inquiries_last_6m >= 3) {
    holdingBack.push({
      factor: "Recent Enquiries",
      impact: "medium",
      detail: `${health.hard_inquiries_last_6m} hard enquiries in the last 6 months`,
      fix: "Avoid new loan applications for 90 days so enquiries age out",
    });
  } else if (health.hard_inquiries_last_6m === 0) {
    helping.push({ factor: "Recent Enquiries", impact: "low", detail: "No recent hard enquiries" });
  }

  if (hasDerogatory(reports)) {
    holdingBack.push({
      factor: "Account Status",
      impact: "high",
      detail: "A settled / written-off / NPA account is on your report",
      fix: "Resolving the account improves the score; the record ages off over 2–7 years",
    });
  }

  if (cashFlow?.salary_credit_detected) {
    helping.push({ factor: "Income Stability", impact: "medium", detail: "Regular salary credit detected via bank data" });
  }

  return { helping, holdingBack };
}

/** Ranked, actionable steps (R3 Appendix D priority matrix). */
export function buildImprovementActions(
  health: AccountHealthData,
  holdingBack: ScoreDetractor[],
): ImprovementAction[] {
  const actions: ImprovementAction[] = [];

  if (holdingBack.some((d) => d.factor === "Account Status")) {
    actions.push({
      action: "Clear or settle the overdue/derogatory account",
      estimated_point_gain: 30,
      difficulty: "hard",
      timeline_days: 60,
      priority: actions.length + 1,
    });
  }
  if (health.credit_utilization_overall > 0.3) {
    actions.push({
      action: "Reduce credit-card utilization below 30%",
      estimated_point_gain: 20,
      difficulty: "medium",
      timeline_days: 30,
      priority: actions.length + 1,
    });
  } else if (health.credit_utilization_overall > 0.1) {
    actions.push({
      action: "Reduce credit-card utilization below 10%",
      estimated_point_gain: 15,
      difficulty: "easy",
      timeline_days: 30,
      priority: actions.length + 1,
    });
  }
  if (health.hard_inquiries_last_6m >= 3) {
    actions.push({
      action: "Pause new loan/card applications for 90 days",
      estimated_point_gain: 12,
      difficulty: "easy",
      timeline_days: 90,
      priority: actions.length + 1,
    });
  }
  actions.push({
    action: "Keep all EMIs and card bills on time",
    estimated_point_gain: 20,
    difficulty: "easy",
    timeline_days: 180,
    priority: actions.length + 1,
  });

  return actions;
}

/**
 * Credit cost indicator: rough rate by band and the saving at a 750 score on a
 * ₹10L / 5-year loan (R3 §9.1.3). Illustrative, clearly an estimate.
 */
export function buildCreditCostIndicator(score: number): CreditCostIndicator {
  const rateForScore = (s: number): number => {
    if (s >= 800) return 10.5;
    if (s >= 750) return 11.5;
    if (s >= 720) return 13.0;
    if (s >= 700) return 14.5;
    if (s >= 650) return 18.0;
    return 24.0;
  };
  const principal = 1_000_000;
  const months = 60;
  const emi = (annualRate: number): number => {
    const r = annualRate / 12 / 100;
    return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  };
  const current = rateForScore(score);
  const target = 11.5;
  const monthlySaving = Math.max(0, Math.round(emi(current) - emi(target)));
  return {
    current_rate_estimate: current,
    at_750_rate: target,
    monthly_saving_on_10L_5yr: monthlySaving,
    total_saving_5yr: monthlySaving * months,
  };
}

/** Next score milestone and what it unlocks (R3 §9.1.3). */
export function buildNextMilestone(score: number): NextMilestone {
  const milestones: Array<[number, string]> = [
    [650, "Qualifies for digital NBFCs (KreditBee, MoneyView)"],
    [700, "Qualifies for major NBFCs like Bajaj Finance"],
    [750, "Unlocks HDFC, ICICI and Axis personal loans at competitive rates"],
    [800, "Pre-approved offers and the best available rates"],
  ];
  const next = milestones.find(([target]) => target > score);
  if (!next) {
    return { target_score: 900, days_to_achieve: 0, what_unlocks: "You are in the top tier — shop for rate, not approval" };
  }
  const gap = next[0] - score;
  // ~1 point of improvement per ~2.5 days as a rough planning estimate.
  return { target_score: next[0], days_to_achieve: Math.max(30, Math.round(gap * 2.5)), what_unlocks: next[1] };
}

export { fmtINR };
