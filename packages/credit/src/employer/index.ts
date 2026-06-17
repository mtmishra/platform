// ── Employer & Income Stability Intelligence ──────────────────────────────────
// Rule-based. Employer profile is a strong, lender-weighted approval signal
// (R3 §3.2 Rule 3 — employment quality multiplier). Pure functions, no deps.

export type EmployerCategory =
  | "government"
  | "psu"
  | "mnc"
  | "listed_company"
  | "startup"
  | "sme"
  | "self_employed"
  | "professional";

export type StabilityBand = "high" | "medium" | "low";
export type IncomeStabilityBand = "strong" | "moderate" | "weak";

export interface EmployerIntelligence {
  category: EmployerCategory;
  /** 0–100. */
  employer_score: number;
  income_confidence: StabilityBand;
  stability_rating: StabilityBand;
  explanation: string;
}

const EMPLOYER_SCORE: Record<EmployerCategory, number> = {
  government: 95,
  psu: 90,
  mnc: 85,
  listed_company: 80,
  professional: 72,
  sme: 55,
  startup: 50,
  self_employed: 45,
};

const LABEL: Record<EmployerCategory, string> = {
  government: "government employee",
  psu: "PSU employee",
  mnc: "MNC employee",
  listed_company: "listed-company employee",
  professional: "self-employed professional",
  sme: "SME employee",
  startup: "startup employee",
  self_employed: "self-employed individual",
};

function band(score: number): StabilityBand {
  if (score >= 80) return "high";
  if (score >= 60) return "medium";
  return "low";
}

export function computeEmployerIntelligence(category: EmployerCategory): EmployerIntelligence {
  const employer_score = EMPLOYER_SCORE[category];
  const rating = band(employer_score);
  const explanation =
    rating === "high"
      ? `As a ${LABEL[category]}, lenders see your income as highly stable — this typically adds 8–15% to approval odds and can unlock lower rates.`
      : rating === "medium"
        ? `As a ${LABEL[category]}, your income is seen as reasonably stable. Strong banking conduct and low FOIR will strengthen approvals further.`
        : `As a ${LABEL[category]}, lenders apply extra scrutiny to income proof. Verified bank cash-flow (Account Aggregator) materially improves how lenders view you.`;

  return {
    category,
    employer_score,
    income_confidence: rating,
    stability_rating: rating,
    explanation,
  };
}

// ── Income Stability ──────────────────────────────────────────────────────────
export interface IncomeStabilityInput {
  monthly_income: number;
  /** Coefficient of variation of monthly income, 0 (flat) – 1 (highly variable). */
  salary_variance: number;
  job_tenure_months: number;
  employer_category: EmployerCategory;
}

export interface IncomeStabilityResult {
  income_stability_score: number;
  stability_band: IncomeStabilityBand;
  insights: string[];
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

export function computeIncomeStability(input: IncomeStabilityInput): IncomeStabilityResult {
  const employerComponent = (EMPLOYER_SCORE[input.employer_category] / 100) * 40; // 0–40
  const tenureComponent = clamp(input.job_tenure_months / 36, 0, 1) * 30; // 0–30 (36m+ = full)
  const varianceComponent = clamp(1 - input.salary_variance, 0, 1) * 30; // 0–30
  const score = Math.round(clamp(employerComponent + tenureComponent + varianceComponent, 0, 100));

  const stability_band: IncomeStabilityBand = score >= 75 ? "strong" : score >= 50 ? "moderate" : "weak";

  const insights: string[] = [];
  insights.push(
    input.job_tenure_months >= 24
      ? `${(input.job_tenure_months / 12).toFixed(1)} years at your employer — well past the 1-year threshold most lenders want.`
      : `Only ${input.job_tenure_months} months at your current employer — lenders prefer 12+ months.`,
  );
  insights.push(
    input.salary_variance <= 0.1
      ? "Your monthly income is highly consistent — a strong stability signal."
      : "Your income varies month to month — steadier inflows would lift this score.",
  );
  if (stability_band === "strong") insights.push("This stability supports higher loan amounts and better rates.");

  return { income_stability_score: score, stability_band, insights };
}
