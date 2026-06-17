// ── Loan finance maths ───────────────────────────────────────────────────────
// Pure functions, no UI. Used by the financial calculators.

/** Format a number as Indian Rupees (no decimals). */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
}

/**
 * Standard reducing-balance EMI.
 * @param principal loan amount (₹)
 * @param annualRatePct annual interest rate, e.g. 10.5
 * @param months tenure in months
 */
export function calculateEmi(
  principal: number,
  annualRatePct: number,
  months: number
): EmiResult {
  if (principal <= 0 || months <= 0) {
    return { emi: 0, totalInterest: 0, totalPayment: 0 };
  }
  const r = annualRatePct / 12 / 100;
  let emi: number;
  if (r === 0) {
    emi = principal / months;
  } else {
    const factor = Math.pow(1 + r, months);
    emi = (principal * r * factor) / (factor - 1);
  }
  const totalPayment = emi * months;
  return {
    emi,
    totalPayment,
    totalInterest: totalPayment - principal,
  };
}

/**
 * Indicative maximum loan based on FOIR (fixed-obligation-to-income ratio).
 * Eligible EMI = (income × foir) − existing obligations, back-solved to principal.
 */
export function calculateEligibleAmount(input: {
  monthlyIncome: number;
  monthlyObligations: number;
  annualRatePct: number;
  months: number;
  foir?: number; // default 0.5
}): { eligibleEmi: number; eligibleAmount: number } {
  const foir = input.foir ?? 0.5;
  const eligibleEmi = Math.max(0, input.monthlyIncome * foir - input.monthlyObligations);
  const r = input.annualRatePct / 12 / 100;
  let eligibleAmount: number;
  if (r === 0) {
    eligibleAmount = eligibleEmi * input.months;
  } else {
    const factor = Math.pow(1 + r, input.months);
    eligibleAmount = (eligibleEmi * (factor - 1)) / (r * factor);
  }
  return { eligibleEmi, eligibleAmount };
}

/**
 * Affordability: given a comfortable monthly EMI budget, what loan can you take?
 */
export function calculateAffordability(input: {
  monthlyBudget: number;
  annualRatePct: number;
  months: number;
}): { affordableAmount: number } {
  const r = input.annualRatePct / 12 / 100;
  let affordableAmount: number;
  if (r === 0) {
    affordableAmount = input.monthlyBudget * input.months;
  } else {
    const factor = Math.pow(1 + r, input.months);
    affordableAmount = (input.monthlyBudget * (factor - 1)) / (r * factor);
  }
  return { affordableAmount };
}
