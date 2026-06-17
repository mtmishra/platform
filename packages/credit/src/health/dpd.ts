// DPD (Days Past Due) translator — turns bureau tradeline data into plain-English
// insights with severity levels (R3 §1.2 DPD codes, §4 rejection intelligence).

import type { AccountStatus, BureauReport, Tradeline } from "../types";
import type { DpdInsight, Severity } from "./types";

export function worstDpd(tradeline: Tradeline): number {
  return tradeline.dpd_last_36_months.reduce((max, d) => (d > max ? d : max), 0);
}

export function worstDpdAcrossReports(reports: BureauReport[]): number {
  let worst = 0;
  for (const r of reports) {
    for (const t of r.tradelines) {
      const w = worstDpd(t);
      if (w > worst) worst = w;
    }
  }
  return worst;
}

const DEROGATORY: ReadonlySet<AccountStatus> = new Set<AccountStatus>(["settlement", "write_off", "npa"]);

export function hasDerogatory(reports: BureauReport[]): boolean {
  return reports.some((r) => r.tradelines.some((t) => DEROGATORY.has(t.account_status)));
}

function statusPhrase(status: AccountStatus): string | null {
  switch (status) {
    case "settlement":
      return "This account was settled for less than the full amount — lenders treat this as a serious negative for 2–5 years.";
    case "write_off":
      return "This account was written off — a major negative that stays on your report for up to 7 years.";
    case "npa":
      return "This account is classified as non-performing (NPA) — a serious negative that blocks most new credit.";
    case "closed":
    case "standard":
      return null;
  }
}

function dpdPhrase(dpd: number): { text: string; severity: Severity } {
  if (dpd === 0) return { text: "Always paid on time — this is the single strongest signal lenders look for.", severity: "low" };
  if (dpd <= 30) return { text: `A payment was up to ${dpd} days late. Minor, but keep future EMIs on time so it ages out.`, severity: "medium" };
  if (dpd <= 90) return { text: `A payment was ${dpd} days late. This noticeably lowers your score; it recovers over 6–12 months of on-time payments.`, severity: "high" };
  return { text: `A payment was 90+ days late (${dpd}) — treated as a default. Expect a significant, longer-lasting score impact.`, severity: "critical" };
}

/**
 * Translate every tradeline across all bureau reports into a plain-English
 * insight. The most severe signal per account (derogatory status vs DPD) wins.
 */
export function translateDpd(reports: BureauReport[]): DpdInsight[] {
  const insights: DpdInsight[] = [];
  for (const report of reports) {
    for (const t of report.tradelines) {
      const dpd = worstDpd(t);
      const fromDpd = dpdPhrase(dpd);
      const statusText = statusPhrase(t.account_status);

      const severity: Severity = DEROGATORY.has(t.account_status) ? "critical" : fromDpd.severity;
      const plain = statusText ?? fromDpd.text;

      insights.push({
        lender: t.lender_name,
        account_type: t.account_type,
        worst_dpd: dpd,
        status: t.account_status,
        plain_english: plain,
        severity,
      });
    }
  }
  // Most severe first.
  const order: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  return insights.sort((a, b) => order[a.severity] - order[b.severity]);
}
