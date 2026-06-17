// ── LeapScore v2 computation (R3 §9.1.2) ──────────────────────────────────────
// Deterministic, pure function. Layer weights: Bureau 55 / Cash Flow 25 /
// Behavior 15 / Health 5. Output normalized to the familiar 300–900 range.

import { normalizeScore } from "../normalize";
import { approximatePercentile, bandForScore } from "../bands";
import type {
  AccountHealthData,
  BureauBreakdown,
  BureauReport,
  CashFlowData,
  ConfidenceLevel,
  DataSource,
  LeapScoreInput,
  LeapScoreResult,
  PaymentBehaviorData,
} from "../types";
import { STANDARD_RANGE } from "../types";
import { buildCreditCostIndicator, buildImprovementActions, buildNextMilestone, splitScoreFactors } from "./outputs";

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** Latest normalized score per bureau from the available reports. */
function bureauBreakdown(reports: BureauReport[]): BureauBreakdown {
  const find = (name: BureauReport["bureau"]) =>
    reports.find((r) => r.bureau === name && r.score !== null)?.score ?? null;
  return {
    cibil: find("cibil"),
    experian: find("experian"),
    crif: find("crif"),
    equifax_normalized: normalizeScore("equifax", find("equifax")),
  };
}

/** Step 1 — bureau composite on the 300–900 scale (0 when thin-file). */
function bureauComposite(breakdown: BureauBreakdown): number {
  const cibil = breakdown.cibil;
  const experian = breakdown.experian;
  const crif = breakdown.crif;
  const equifax = breakdown.equifax_normalized;

  const present = [cibil, experian, crif, equifax].filter((s): s is number => s !== null);
  if (present.length === 0) return 0;

  // 3+ bureaus → weighted blend (R3 §9.1.2). Re-normalize weights to whichever
  // of CIBIL/Experian/CRIF are present; fall back to a simple average otherwise.
  if (present.length >= 3) {
    const weighted: Array<[number | null, number]> = [
      [cibil, 0.45],
      [experian, 0.35],
      [crif, 0.2],
    ];
    let sum = 0;
    let weight = 0;
    for (const [score, w] of weighted) {
      if (score !== null) {
        sum += score * w;
        weight += w;
      }
    }
    if (weight > 0) return sum / weight;
  }

  // Single bureau: prefer CIBIL, then Experian, else average of present.
  if (cibil !== null) return cibil;
  if (experian !== null) return experian;
  return present.reduce((a, b) => a + b, 0) / present.length;
}

/** Step 2 — cash-flow raw score (0–100) from AA data (R3 §9.1.2). */
function cashFlowRaw(cf: CashFlowData): number {
  const stability = cf.cash_flow_trend === "growing" ? 30 : cf.cash_flow_trend === "stable" ? 20 : 5;
  const health =
    cf.months_with_negative_balance === 0 ? 40 : cf.months_with_negative_balance <= 2 ? 25 : 5;
  const verification = cf.salary_credit_detected
    ? 30
    : cf.income_source_type === "business"
      ? 22
      : 10;
  return stability + health + verification;
}

/** Step 3 — payment-behavior raw score (0–100) (R3 §9.1.2). */
function behaviorRaw(b: PaymentBehaviorData): number {
  const utility = b.utility_payment_on_time_pct * 50;
  const gst = (Math.min(b.gst_filed_months, 12) / 12) * 30;
  const onTimeMobile = b.postpaid_mobile_payment_history.filter(Boolean).length;
  const mobile = (Math.min(onTimeMobile, 12) / 12) * 20;
  return utility + gst + mobile;
}

/** Step 4 — account-health raw score (0–100) (R3 §9.1.2). */
function healthRaw(h: AccountHealthData): number {
  const utilization = clamp(40 * (1 - h.credit_utilization_overall / 0.3), 0, 40);
  const age = Math.min(30, h.oldest_account_age_months * 0.5);
  const inquiry = clamp(30 - h.hard_inquiries_last_6m * 10, 0, 30);
  return utilization + age + inquiry;
}

function toStandardScore(weightedTotal: number): number {
  // weightedTotal is 0–100; map onto 300–900.
  const score = STANDARD_RANGE.min + weightedTotal * 6.0;
  return Math.round(clamp(score, STANDARD_RANGE.min, STANDARD_RANGE.max));
}

function deriveConfidence(
  bureauCount: number,
  hasAa: boolean,
  thinFile: boolean,
): ConfidenceLevel {
  if (thinFile) return "alternative_data_only";
  if (bureauCount >= 3 && hasAa) return "high";
  if (bureauCount >= 1) return "medium";
  return "low";
}

function collectSources(
  reports: BureauReport[],
  cashFlow: CashFlowData | null,
  behavior: PaymentBehaviorData | null,
): DataSource[] {
  const sources: DataSource[] = [];
  for (const r of reports) {
    if (r.score !== null && !sources.includes(r.bureau)) sources.push(r.bureau);
  }
  if (cashFlow?.aa_consent_active) sources.push("aa");
  if (behavior?.utility_bills_tracked) sources.push("bbps");
  if (behavior && behavior.gst_filed_months > 0) sources.push("gst");
  return sources;
}

/**
 * Compute LeapScore v2. Returns leapscore = null with a "Score Unavailable"
 * band when there is neither bureau data nor AA data (R3 §9.1.2 thin-file path).
 */
export function computeLeapScore(input: LeapScoreInput): LeapScoreResult {
  const { reports, cashFlow, behavior, health } = input;
  const breakdown = bureauBreakdown(reports);
  const composite = bureauComposite(breakdown);
  const hasBureau = composite > 0;
  const hasAa = Boolean(cashFlow?.aa_consent_active);
  const date = new Date().toISOString();
  const sources = collectSources(reports, cashFlow, behavior);

  const cfRaw = cashFlow ? cashFlowRaw(cashFlow) : 0;
  const bhRaw = behavior ? behaviorRaw(behavior) : 0;
  const hlRaw = healthRaw(health);

  // ── Thin-file path: no bureau, but AA available ────────────────────────────
  if (!hasBureau) {
    if (!hasAa) {
      return {
        leapscore: null,
        leapscore_date: date,
        confidence_level: "alternative_data_only",
        data_sources_used: sources,
        bureau_breakdown: breakdown,
        score_band: "Score Unavailable",
        score_percentile: null,
        what_is_helping: [],
        what_is_holding_back: [],
        score_improvement_actions: [
          {
            action: "Build a starter credit line (secured/FD-backed card or credit-builder loan)",
            estimated_point_gain: 0,
            difficulty: "medium",
            timeline_days: 180,
            priority: 1,
          },
        ],
        credit_cost_indicator: null,
        next_milestone: null,
        component_scores: { bureau: 0, cash_flow: 0, behavior: 0, health: 0 },
      };
    }

    // Re-weighted alternative-data model: cash flow 50 / behavior 35 / health 15.
    const cashFlowComp = (cfRaw / 100) * 50;
    const behaviorComp = (bhRaw / 100) * 35;
    const healthComp = (hlRaw / 100) * 15;
    const total = cashFlowComp + behaviorComp + healthComp;
    const score = toStandardScore(total);
    const band = bandForScore(score);
    const { helping, holdingBack } = splitScoreFactors(reports, health, cashFlow);

    return {
      leapscore: score,
      leapscore_date: date,
      confidence_level: "alternative_data_only",
      data_sources_used: sources,
      bureau_breakdown: breakdown,
      score_band: band.label,
      score_percentile: approximatePercentile(score),
      what_is_helping: helping,
      what_is_holding_back: holdingBack,
      score_improvement_actions: buildImprovementActions(health, holdingBack),
      credit_cost_indicator: buildCreditCostIndicator(score),
      next_milestone: buildNextMilestone(score),
      component_scores: {
        bureau: 0,
        cash_flow: Math.round(cashFlowComp),
        behavior: Math.round(behaviorComp),
        health: Math.round(healthComp),
      },
    };
  }

  // ── Standard path ──────────────────────────────────────────────────────────
  const bureauComp = (composite / 900) * 55;
  // Cash flow 25% if AA present, else bureau-proxy fallback at 15% (R3 §9.1.2).
  const cashFlowComp = hasAa ? (cfRaw / 100) * 25 : (composite / 900) * 15;
  const behaviorComp = (bhRaw / 100) * 15;
  const healthComp = (hlRaw / 100) * 5;
  const total = bureauComp + cashFlowComp + behaviorComp + healthComp;
  const score = toStandardScore(total);
  const band = bandForScore(score);
  const bureauCount = [breakdown.cibil, breakdown.experian, breakdown.crif, breakdown.equifax_normalized].filter(
    (s) => s !== null,
  ).length;
  const { helping, holdingBack } = splitScoreFactors(reports, health, cashFlow);

  return {
    leapscore: score,
    leapscore_date: date,
    confidence_level: deriveConfidence(bureauCount, hasAa, false),
    data_sources_used: sources,
    bureau_breakdown: breakdown,
    score_band: band.label,
    score_percentile: approximatePercentile(score),
    what_is_helping: helping,
    what_is_holding_back: holdingBack,
    score_improvement_actions: buildImprovementActions(health, holdingBack),
    credit_cost_indicator: buildCreditCostIndicator(score),
    next_milestone: buildNextMilestone(score),
    component_scores: {
      bureau: Math.round(bureauComp),
      cash_flow: Math.round(cashFlowComp),
      behavior: Math.round(behaviorComp),
      health: Math.round(healthComp),
    },
  };
}
