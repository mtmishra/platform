// Credit-report demo data (Sprint 12). Builds a bureau report summary from the
// Sprint 7 MOCK bureau framework for a given PAN — no live bureau API. A PAN
// ending in "0" simulates a thin-file / no-hit borrower (see buildMockReport).

import {
  buildMockReport,
  computeCreditHealth,
  computeLeapScore,
  translateDpd,
  worstDpdAcrossReports,
  MOCK_BEHAVIOR,
  MOCK_CASH_FLOW,
  MOCK_HEALTH,
  type BureauName,
  type CreditHealthResult,
  type DpdInsight,
  type LeapScoreResult,
  type Tradeline,
} from "@leapmoney/credit";

const BUREAUS: BureauName[] = ["cibil", "experian", "crif", "equifax"];

export interface CreditReportSummary {
  pan: string;
  pull_timestamp: string;
  leapScore: LeapScoreResult;
  health: CreditHealthResult;
  bureauScores: { cibil: number | null; experian: number | null; crif: number | null; equifax: number | null };
  activeAccounts: number;
  tradelines: Tradeline[];
  utilizationPct: number;
  enquiries6m: number;
  creditAgeMonths: number;
  worstDpd: number;
  accountsWithDpd: number;
  dpdInsights: DpdInsight[];
}

export function buildCreditReport(panRaw?: string): CreditReportSummary {
  const pan = (panRaw && panRaw.trim().length > 0 ? panRaw.trim().toUpperCase() : "ABCDE1234F");
  const reports = BUREAUS.map((b) => buildMockReport(b, pan, "soft"));
  const input = { reports, cashFlow: MOCK_CASH_FLOW, behavior: MOCK_BEHAVIOR, health: MOCK_HEALTH };

  const leapScore = computeLeapScore(input);
  const health = computeCreditHealth(input);
  const tradelines = reports[0]?.tradelines ?? [];
  const activeAccounts = tradelines.filter((t) => t.account_status === "standard").length;
  const accountsWithDpd = tradelines.filter((t) => t.dpd_last_36_months.some((d) => d > 0)).length;

  const score = (b: BureauName): number | null => reports.find((r) => r.bureau === b)?.score ?? null;

  return {
    pan,
    pull_timestamp: new Date().toISOString(),
    leapScore,
    health,
    bureauScores: { cibil: score("cibil"), experian: score("experian"), crif: score("crif"), equifax: score("equifax") },
    activeAccounts,
    tradelines,
    utilizationPct: Math.round(MOCK_HEALTH.credit_utilization_overall * 100),
    enquiries6m: MOCK_HEALTH.hard_inquiries_last_6m,
    creditAgeMonths: MOCK_HEALTH.oldest_account_age_months,
    worstDpd: worstDpdAcrossReports(reports),
    accountsWithDpd,
    dpdInsights: translateDpd(reports),
  };
}
