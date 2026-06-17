// Credit Health engine (0–100). Built from the Sprint 7 LeapScoreInput so the
// dashboard reuses exactly the data the score engine consumes. R3 §3–§4, §9.

import type { LeapScoreInput } from "../types";
import type {
  CreditHealthResult,
  HealthBandLabel,
  ImpactScore,
  RiskIndicator,
} from "./types";
import { hasDerogatory, worstDpdAcrossReports } from "./dpd";

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

// Category point budgets (sum = 100).
const MAX = {
  payment_history: 35,
  utilization: 25,
  enquiries: 15,
  account_age: 15,
  derogatory: 10,
} as const;

function paymentHistoryPoints(worstDpd: number): number {
  if (worstDpd === 0) return MAX.payment_history;
  if (worstDpd <= 30) return 24;
  if (worstDpd <= 90) return 12;
  return 4;
}

function utilizationPoints(util: number): number {
  if (util <= 0.1) return MAX.utilization;
  if (util <= 0.3) return 18;
  if (util <= 0.5) return 10;
  return 3;
}

function enquiriesPoints(inq6m: number): number {
  if (inq6m === 0) return MAX.enquiries;
  if (inq6m <= 2) return 11;
  if (inq6m <= 4) return 6;
  return 2;
}

function accountAgePoints(months: number): number {
  return Math.round(clamp(months * 0.18, 0, MAX.account_age));
}

function bandFor(score: number): HealthBandLabel {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Fair";
  return "Poor";
}

function statusFor(points: number, max: number): ImpactScore["status"] {
  const ratio = max === 0 ? 1 : points / max;
  if (ratio >= 0.8) return "good";
  if (ratio >= 0.5) return "watch";
  return "risk";
}

/**
 * Compute the Credit Health snapshot. Pure and deterministic.
 */
export function computeCreditHealth(input: LeapScoreInput): CreditHealthResult {
  const worstDpd = worstDpdAcrossReports(input.reports);
  const derogatory = hasDerogatory(input.reports);
  const util = input.health.credit_utilization_overall;
  const inq6m = input.health.hard_inquiries_last_6m;
  const oldest = input.health.oldest_account_age_months;

  const points = {
    payment_history: paymentHistoryPoints(worstDpd),
    utilization: utilizationPoints(util),
    enquiries: enquiriesPoints(inq6m),
    account_age: accountAgePoints(oldest),
    derogatory: derogatory ? 0 : MAX.derogatory,
  };

  const health_score = Object.values(points).reduce((a, b) => a + b, 0);

  const impact_scores: ImpactScore[] = [
    { category: "payment_history", label: "Payment history", points: points.payment_history, max: MAX.payment_history, status: statusFor(points.payment_history, MAX.payment_history) },
    { category: "utilization", label: "Credit utilization", points: points.utilization, max: MAX.utilization, status: statusFor(points.utilization, MAX.utilization) },
    { category: "enquiries", label: "Recent enquiries", points: points.enquiries, max: MAX.enquiries, status: statusFor(points.enquiries, MAX.enquiries) },
    { category: "account_age", label: "Credit age", points: points.account_age, max: MAX.account_age, status: statusFor(points.account_age, MAX.account_age) },
    { category: "derogatory", label: "Account standing", points: points.derogatory, max: MAX.derogatory, status: statusFor(points.derogatory, MAX.derogatory) },
  ];

  // Risk indicators — only surface what is not already healthy.
  const risk_indicators: RiskIndicator[] = [];
  if (derogatory) {
    risk_indicators.push({
      id: "derogatory_account",
      title: "Derogatory account on file",
      severity: "critical",
      detail: "A settled, written-off, or NPA account is dragging your profile down. Resolving it is the highest-impact action you can take.",
      category: "derogatory",
    });
  }
  if (worstDpd > 90) {
    risk_indicators.push({
      id: "serious_dpd",
      title: "Serious late payment (90+ days)",
      severity: "critical",
      detail: "A payment was 90+ days overdue. Keep every future EMI on time — the impact eases over 12–24 months.",
      category: "payment_history",
    });
  } else if (worstDpd > 0) {
    risk_indicators.push({
      id: "late_payment",
      title: "Late payment on record",
      severity: worstDpd > 30 ? "high" : "medium",
      detail: `A payment was up to ${worstDpd} days late. On-time payments from here will steadily repair this.`,
      category: "payment_history",
    });
  }
  if (util > 0.3) {
    risk_indicators.push({
      id: "high_utilization",
      title: "High credit-card utilization",
      severity: util > 0.5 ? "high" : "medium",
      detail: `You're using ${Math.round(util * 100)}% of your limit. Bringing this below 30% (ideally 10%) is the fastest score boost.`,
      category: "utilization",
    });
  }
  if (inq6m >= 3) {
    risk_indicators.push({
      id: "many_enquiries",
      title: "Multiple recent enquiries",
      severity: "medium",
      detail: `${inq6m} hard enquiries in 6 months signals credit hunger. Pause new applications for 90 days.`,
      category: "enquiries",
    });
  }

  return {
    health_score,
    health_band: bandFor(health_score),
    risk_indicators,
    impact_scores,
    generated_at: new Date().toISOString(),
  };
}
