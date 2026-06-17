// ── Advanced FOIR Engine ──────────────────────────────────────────────────────
// Fixed-Obligation-to-Income across all obligation types, current and future
// (with a proposed EMI). Rule-based; R3 §3.2 Rule 1, §6 (FOIR). Pure.

export type FoirRiskBand = "excellent" | "healthy" | "warning" | "critical";

export interface AdvancedFoirInput {
  monthly_income: number;
  existing_emi: number;
  /** Monthly credit-card minimum-due burden. */
  credit_card_burden: number;
  /** Monthly BNPL repayment burden. */
  bnpl_burden: number;
  /** EMI of the loan the borrower is considering. */
  proposed_emi: number;
}

export interface AdvancedFoirResult {
  current_foir: number;
  future_foir: number;
  /** Lender-comfortable ceiling (0–1). */
  safe_foir_limit: number;
  /** future_foir ÷ safe_foir_limit (0–1+; >1 means over the safe ceiling). */
  utilization_of_capacity: number;
  risk_band: FoirRiskBand;
  explanation: string;
}

const round2 = (v: number): number => Math.round(v * 100) / 100;

function bandFor(future: number): FoirRiskBand {
  if (future < 0.35) return "excellent";
  if (future < 0.45) return "healthy";
  if (future < 0.55) return "warning";
  return "critical";
}

export function computeAdvancedFoir(input: AdvancedFoirInput): AdvancedFoirResult {
  const income = Math.max(1, input.monthly_income);
  const currentObligations = input.existing_emi + input.credit_card_burden + input.bnpl_burden;
  const current_foir = round2(currentObligations / income);
  const future_foir = round2((currentObligations + input.proposed_emi) / income);
  const safe_foir_limit = 0.5;
  const utilization_of_capacity = round2(future_foir / safe_foir_limit);
  const risk_band = bandFor(future_foir);

  const pct = (v: number): string => `${Math.round(v * 100)}%`;
  const explanation =
    risk_band === "excellent"
      ? `Even with the new EMI, only ${pct(future_foir)} of your income is committed — well within the ${pct(safe_foir_limit)} lenders are comfortable with. Strong approval position.`
      : risk_band === "healthy"
        ? `With the new EMI you'd be at ${pct(future_foir)} of income — comfortably under the ${pct(safe_foir_limit)} ceiling. Most lenders will be comfortable.`
        : risk_band === "warning"
          ? `The new EMI pushes you to ${pct(future_foir)} of income — close to the ${pct(safe_foir_limit)} ceiling. Consider a smaller amount or longer tenure to lower the EMI.`
          : `At ${pct(future_foir)} of income, the new EMI would exceed the ${pct(safe_foir_limit)} ceiling. Most lenders would decline — reduce existing obligations or the loan amount first.`;

  return { current_foir, future_foir, safe_foir_limit, utilization_of_capacity, risk_band, explanation };
}
