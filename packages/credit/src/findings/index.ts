// ── Financial Findings Engine ─────────────────────────────────────────────────
// Turns the borrower's analysed profile into a list of findings (problems and
// strengths) with severity. Rule-based; pure. Feeds the Financial Analysis
// report and the recommendation engine.

import type { FoirRiskBand } from "../foir";

export type FindingSeverity = "critical" | "warning" | "info";

export interface Finding {
  id: string;
  title: string;
  detail: string;
  severity: FindingSeverity;
}

export interface FindingsInput {
  utilization: number;
  foir_risk: FoirRiskBand;
  has_derogatory: boolean;
  hard_inquiries_6m: number;
  /** Highest interest rate across active loans (%). */
  highest_loan_rate: number;
  employer_rating: "high" | "medium" | "low";
  job_tenure_months: number;
  income_stability_band: "strong" | "moderate" | "weak";
}

const ORDER: Record<FindingSeverity, number> = { critical: 0, warning: 1, info: 2 };

export function computeFindings(input: FindingsInput): Finding[] {
  const findings: Finding[] = [];

  if (input.has_derogatory) {
    findings.push({ id: "derogatory", title: "Derogatory account detected", detail: "A settled / written-off / NPA account is on your report — the biggest blocker to approval.", severity: "critical" });
  }
  if (input.foir_risk === "critical") {
    findings.push({ id: "foir_critical", title: "FOIR is critical", detail: "Your obligations would exceed the safe ceiling with a new EMI — most lenders would decline.", severity: "critical" });
  } else if (input.foir_risk === "warning") {
    findings.push({ id: "foir_elevated", title: "FOIR elevated", detail: "A new EMI would push your obligations close to the safe ceiling.", severity: "warning" });
  }
  if (input.utilization > 0.3) {
    findings.push({ id: "high_utilization", title: "High credit utilization detected", detail: `You're using ${Math.round(input.utilization * 100)}% of your credit limit — above the 30% lenders prefer.`, severity: "warning" });
  }
  if (input.highest_loan_rate >= 18) {
    findings.push({ id: "expensive_loan", title: "Expensive loan detected", detail: `One of your active loans is at ${input.highest_loan_rate}% — a balance transfer could cut this materially.`, severity: "warning" });
  }
  if (input.hard_inquiries_6m >= 3) {
    findings.push({ id: "many_enquiries", title: "Multiple recent enquiries", detail: `${input.hard_inquiries_6m} hard enquiries in 6 months signal credit hunger to lenders.`, severity: "warning" });
  }
  if (input.employer_rating === "high") {
    findings.push({ id: "strong_salary", title: "Strong salary profile", detail: "Your employer profile is seen as highly stable — a positive signal that lifts approval odds.", severity: "info" });
  }
  if (input.job_tenure_months >= 24) {
    findings.push({ id: "stable_employment", title: "Stable employment", detail: `${(input.job_tenure_months / 12).toFixed(1)} years at your employer — well past what lenders want to see.`, severity: "info" });
  }
  if (input.income_stability_band === "strong") {
    findings.push({ id: "stable_income", title: "Strong, consistent income", detail: "Your verified income is steady month to month — a strong repayment signal.", severity: "info" });
  }

  return findings.sort((a, b) => ORDER[a.severity] - ORDER[b.severity]);
}
