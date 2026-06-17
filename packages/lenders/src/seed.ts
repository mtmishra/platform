// Seed lender intelligence data (Sprint 14.5). 65 lenders: 25 banks, 25 NBFCs,
// 15 fintechs. Demo only. Deterministic — attributes derive from type + index
// with marquee overrides, so the repository is stable and realistic.

import type { BureauName } from "@leapmoney/credit";
import type {
  ApprovalBand,
  EmploymentType,
  LenderType,
  LoanProduct,
  MatchTag,
} from "./types";

export interface FullLender {
  id: string;
  name: string;
  type: LenderType;
  website: string;
  support_email: string;
  region_coverage: string;
  products: LoanProduct[];
  primary_bureau: BureauName;
  secondary_bureau: BureauName | null;
  min_score: number;
  preferred_score: number;
  min_income: number;
  max_foir: number;
  min_age: number;
  max_age: number;
  employment_types: EmploymentType[];
  approval_rate: number;
  avg_tat_days: number;
  avg_disbursal_days: number;
  band: ApprovalBand;
  payout_type: "percentage" | "fixed";
  payout_value: number;
  max_cap: number;
  best_for: MatchTag[];
  match_strength: number;
}

const BANKS = [
  "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "IndusInd Bank",
  "State Bank of India", "Punjab National Bank", "Bank of Baroda", "IDFC First Bank", "Yes Bank",
  "Federal Bank", "RBL Bank", "IDBI Bank", "Canara Bank", "Union Bank of India",
  "Bank of India", "Bank of Maharashtra", "Karnataka Bank", "South Indian Bank", "Karur Vysya Bank",
  "City Union Bank", "DCB Bank", "Bandhan Bank", "AU Small Finance Bank", "Ujjivan Small Finance Bank",
];
const NBFCS = [
  "Bajaj Finance", "Tata Capital", "SMFG India Credit", "Aditya Birla Finance", "L&T Finance",
  "Mahindra Finance", "Poonawalla Fincorp", "HDB Financial Services", "Shriram Finance", "Muthoot Finance",
  "Cholamandalam", "Hero FinCorp", "Piramal Finance", "IIFL Finance", "Fullerton India",
  "PNB Housing Finance", "LIC Housing Finance", "Bajaj Housing Finance", "Home First Finance", "Aadhar Housing Finance",
  "Sundaram Finance", "Manappuram Finance", "InCred Finance", "Capital India Finance", "Aavas Financiers",
];
const FINTECHS = [
  "MoneyView", "KreditBee", "CASHe", "Fibe", "Navi", "PaySense", "StashFin", "LazyPay",
  "Slice", "OneCard", "Lendingkart", "FlexiLoans", "Indifi", "NeoGrowth", "Kissht",
];

// Marquee bureau overrides (R3 §2.4 — e.g. Bajaj/KreditBee/StashFin use Experian primary).
const EXPERIAN_PRIMARY = new Set(["Bajaj Finance", "KreditBee", "StashFin", "Slice"]);

const PRODUCTS_BY_TYPE: Record<LenderType, LoanProduct[]> = {
  bank: ["personal", "home", "lap", "credit_card"],
  nbfc: ["personal", "business", "lap"],
  fintech: ["personal"],
};

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function bandFor(rate: number): ApprovalBand {
  if (rate >= 80) return "excellent";
  if (rate >= 60) return "good";
  if (rate >= 40) return "moderate";
  return "difficult";
}

function build(name: string, type: LenderType, i: number): FullLender {
  const id = slug(name);
  const experianPrimary = EXPERIAN_PRIMARY.has(name);

  // Type baselines, varied deterministically by index.
  const base = type === "bank"
    ? { min: 720, pref: 760, income: 25000, foir: 0.5, rate: 56, tat: 3, disb: 4, payout: 0.8, cap: 25000 }
    : type === "nbfc"
      ? { min: 680, pref: 720, income: 18000, foir: 0.55, rate: 66, tat: 2, disb: 2, payout: 1.3, cap: 40000 }
      : { min: 620, pref: 680, income: 12000, foir: 0.65, rate: 80, tat: 1, disb: 1, payout: 2.5, cap: 15000 };

  const jitter = (i * 7) % 9; // 0–8 spread
  const min_score = base.min + (jitter - 4) * 3;
  const approval_rate = Math.min(95, Math.max(25, base.rate + (jitter - 4) * 3));

  const primary_bureau: BureauName = experianPrimary ? "experian" : type === "fintech" ? "experian" : "cibil";
  const secondary_bureau: BureauName | null = primary_bureau === "cibil" ? "experian" : "cibil";

  const employment_types: EmploymentType[] =
    type === "bank" ? ["salaried", "self_employed", "professional"]
      : type === "nbfc" ? ["salaried", "self_employed", "professional"]
        : ["salaried", "self_employed"];

  const best_for: MatchTag[] =
    type === "bank" ? ["high_score", "salaried", "balance_transfer"]
      : type === "nbfc" ? ["self_employed", "debt_consolidation", (i % 2 === 0 ? "high_score" : "balance_transfer")]
        : ["low_score", "new_to_credit", "self_employed"];

  const match_strength = Math.min(95, (type === "fintech" ? 82 : type === "nbfc" ? 80 : 74) + (jitter - 4) * 2);

  // A few regional banks/HFCs are not pan-India.
  const regional = ["South Indian Bank", "Karur Vysya Bank", "City Union Bank", "Karnataka Bank", "Aavas Financiers"];
  const region_coverage = regional.includes(name) ? "South & West India" : "Pan-India";

  return {
    id,
    name,
    type,
    website: `https://www.${id.replace(/-/g, "")}.com`,
    support_email: `support@${id.replace(/-/g, "")}.com`,
    region_coverage,
    products: PRODUCTS_BY_TYPE[type],
    primary_bureau,
    secondary_bureau,
    min_score,
    preferred_score: base.pref + (jitter - 4) * 2,
    min_income: base.income,
    max_foir: base.foir,
    min_age: 21,
    max_age: type === "bank" ? 60 : 65,
    employment_types,
    approval_rate,
    avg_tat_days: base.tat,
    avg_disbursal_days: base.disb,
    band: bandFor(approval_rate),
    payout_type: "percentage",
    payout_value: base.payout,
    max_cap: base.cap,
    best_for,
    match_strength,
  };
}

export const SEED_LENDERS: FullLender[] = [
  ...BANKS.map((n, i) => build(n, "bank", i)),
  ...NBFCS.map((n, i) => build(n, "nbfc", i + 25)),
  ...FINTECHS.map((n, i) => build(n, "fintech", i + 50)),
];

export const REJECTION_REASONS = [
  { code: "low_score", label: "Credit score below minimum" },
  { code: "high_foir", label: "FOIR too high (over-leveraged)" },
  { code: "income_mismatch", label: "Income mismatch / insufficient income" },
  { code: "bureau_issues", label: "Bureau issues (DPD, settlement, write-off)" },
  { code: "employer_risk", label: "Employer / occupation risk" },
] as const;

// Amount/tenure ranges per product (₹ / months).
export const PRODUCT_RANGES: Record<LoanProduct, { min_amount: number; max_amount: number; min_tenure: number; max_tenure: number }> = {
  personal: { min_amount: 50000, max_amount: 4000000, min_tenure: 12, max_tenure: 60 },
  home: { min_amount: 500000, max_amount: 50000000, min_tenure: 60, max_tenure: 360 },
  business: { min_amount: 100000, max_amount: 20000000, min_tenure: 12, max_tenure: 84 },
  lap: { min_amount: 500000, max_amount: 30000000, min_tenure: 24, max_tenure: 240 },
  credit_card: { min_amount: 25000, max_amount: 1500000, min_tenure: 0, max_tenure: 0 },
};
