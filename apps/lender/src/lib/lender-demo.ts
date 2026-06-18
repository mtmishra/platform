// Mock lender-portal data (Sprint 16). Demo only — no LOS/LMS/CRM/bureau/bank
// APIs. Deterministic generator: 54 applications across products, score bands,
// sources, and statuses, each carrying full borrower intelligence (LeapScore,
// credit health, cash flow, FOIR, employer, recommendations, approval odds).

export type AppStatus = "new" | "under_review" | "approved" | "rejected" | "disbursed";
export type LoanProduct = "Personal Loan" | "Home Loan" | "Business Loan" | "LAP" | "Credit Card";
export type LeadSource = "Borrower Direct" | "DSA" | "Referral" | "Organic";
export type ScoreBand = "Excellent" | "Good" | "Fair" | "Poor";
export type Decision = "approve" | "reject" | "conditional";

export const APP_STATUSES: AppStatus[] = ["new", "under_review", "approved", "rejected", "disbursed"];
export const REASON_CODES = [
  { code: "low_score", label: "Low Score" },
  { code: "high_foir", label: "High FOIR" },
  { code: "income_risk", label: "Income Risk" },
  { code: "employer_risk", label: "Employer Risk" },
  { code: "policy_mismatch", label: "Policy Mismatch" },
] as const;

export interface Recommendation {
  title: string;
  detail: string;
}

export interface LenderApplication {
  id: string;
  applicant: string;
  product: LoanProduct;
  amount: number;
  city: string;
  source: LeadSource;
  status: AppStatus;
  // Borrower intelligence
  leapscore: number;
  score_band: ScoreBand;
  credit_health: number;
  cash_flow_score: number;
  foir_pct: number;
  verified_income: number;
  employer_category: string;
  employer_stability: "High" | "Medium" | "Low";
  job_tenure_months: number;
  approval_probability: number;
  confidence: "high" | "medium" | "low";
  recommendations: Recommendation[];
  documents: Array<{ type: string; status: "uploaded" | "missing" }>;
  rate: number;
  tenure_months: number;
  // Decision (if any)
  decision: Decision | null;
  reason_codes: string[];
  applied_at: string;
  last_updated: string;
}

const NAMES = [
  "Priya Sharma", "Rahul Verma", "Anjali Nair", "Vikram Singh", "Sneha Reddy", "Arjun Mehta",
  "Kavya Iyer", "Rohan Gupta", "Meera Joshi", "Aditya Rao", "Pooja Patel", "Karthik Menon",
  "Divya Pillai", "Sanjay Kumar", "Neha Agarwal", "Amit Desai", "Ritu Banerjee", "Suresh Babu",
  "Tanvi Shah", "Manish Tiwari", "Ananya Bose", "Gaurav Malhotra", "Shruti Kulkarni", "Deepak Yadav",
  "Isha Chopra", "Nikhil Saxena", "Aarti Menon", "Vivek Nair", "Lakshmi Rao", "Harish Pillai",
  "Sonal Jain", "Rajat Khanna", "Preeti Sinha", "Akash Reddy", "Nidhi Verma", "Varun Kapoor",
  "Swati Mishra", "Yash Agarwal", "Riya Sharma", "Mohit Bansal", "Komal Gupta", "Siddharth Rao",
  "Pallavi Nair", "Tarun Mehta", "Anushka Das", "Kunal Joshi", "Smita Patel", "Rohit Saxena",
  "Bhavna Iyer", "Naveen Kumar", "Ishita Roy", "Aryan Malhotra", "Megha Singh", "Dhruv Shah",
];
const PRODUCTS: LoanProduct[] = ["Personal Loan", "Home Loan", "Business Loan", "LAP", "Credit Card"];
const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Ahmedabad", "Kolkata", "Jaipur", "Surat"];
const SOURCES: LeadSource[] = ["Borrower Direct", "DSA", "Referral", "Organic"];
const EMPLOYERS = ["Government", "PSU", "MNC", "Listed", "Startup", "SME", "Self-Employed", "Professional"];

// Status distribution across 54 applications.
const STATUS_PLAN: AppStatus[] = [
  ...Array<AppStatus>(12).fill("new"),
  ...Array<AppStatus>(11).fill("under_review"),
  ...Array<AppStatus>(11).fill("approved"),
  ...Array<AppStatus>(8).fill("rejected"),
  ...Array<AppStatus>(12).fill("disbursed"),
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}
function bandFor(score: number): ScoreBand {
  if (score >= 780) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 640) return "Fair";
  return "Poor";
}

function buildApplication(status: AppStatus, i: number): LenderApplication {
  const leapscore = status === "rejected" ? 580 + ((i * 23) % 90) : 660 + ((i * 29) % 230);
  const score_band = bandFor(leapscore);
  const amount = 200000 + ((i * 137) % 48) * 50000; // ₹2L–₹26L
  const foir_pct = status === "rejected" ? 55 + ((i * 7) % 25) : 22 + ((i * 11) % 30);
  const employer_category = pick(EMPLOYERS, i);
  const stability: LenderApplication["employer_stability"] =
    ["Government", "PSU", "MNC", "Listed"].includes(employer_category) ? "High" : employer_category === "SME" || employer_category === "Self-Employed" ? "Low" : "Medium";
  const approval_probability =
    status === "rejected" ? 18 + ((i * 5) % 18)
      : status === "approved" || status === "disbursed" ? 75 + ((i * 7) % 20)
        : 55 + ((i * 13) % 35);
  const confidence: LenderApplication["confidence"] = approval_probability >= 70 ? "high" : approval_probability >= 45 ? "medium" : "low";

  const recommendations: Recommendation[] = [];
  if (foir_pct > 50) recommendations.push({ title: "Reduce FOIR before disbursal", detail: "Borrower's obligations exceed 50% of income — consider a lower ticket or longer tenure." });
  if (leapscore < 680) recommendations.push({ title: "Thin / low score — verify income", detail: "Score below preferred band; cash-flow verification strengthens the file." });
  if (stability === "High") recommendations.push({ title: "Stable employer — positive signal", detail: `${employer_category} employment lifts approval confidence.` });
  if (recommendations.length === 0) recommendations.push({ title: "Clean profile", detail: "No material risk flags; within policy on score, FOIR, and income." });

  const reason_codes: string[] =
    status === "rejected"
      ? (leapscore < 640 ? ["low_score"] : []).concat(foir_pct > 55 ? ["high_foir"] : []).concat(stability === "Low" ? ["employer_risk"] : [])
      : [];
  const decision: Decision | null =
    status === "approved" || status === "disbursed" ? "approve" : status === "rejected" ? "reject" : null;

  const docs = ["PAN", "Aadhaar", "Salary Slip", "Bank Statement", "ITR"];
  const uploadedCount = status === "new" ? 2 + (i % 2) : status === "under_review" ? 4 : 5;

  return {
    id: `LA-${20000 + i}`,
    applicant: pick(NAMES, i),
    product: pick(PRODUCTS, i),
    amount,
    city: pick(CITIES, i),
    source: pick(SOURCES, i),
    status,
    leapscore,
    score_band,
    credit_health: 50 + ((i * 9) % 48),
    cash_flow_score: 55 + ((i * 13) % 44),
    foir_pct,
    verified_income: 40000 + ((i * 17) % 40) * 5000,
    employer_category,
    employer_stability: stability,
    job_tenure_months: 12 + ((i * 7) % 96),
    approval_probability: Math.min(95, approval_probability),
    confidence,
    recommendations,
    documents: docs.map((t, di) => ({ type: t, status: di < uploadedCount ? "uploaded" : "missing" })),
    rate: 10.5 + ((i * 3) % 18) * 0.5,
    tenure_months: pick([12, 24, 36, 48, 60, 84], i),
    decision,
    reason_codes,
    applied_at: `2026-06-${String(1 + (i % 17)).padStart(2, "0")}T09:00:00.000Z`,
    last_updated: `2026-06-${String(2 + (i % 16)).padStart(2, "0")}T15:30:00.000Z`,
  };
}

const APPLICATIONS: LenderApplication[] = STATUS_PLAN.map((s, i) => buildApplication(s, i));

export function getApplications(): LenderApplication[] {
  return APPLICATIONS;
}
export function getApplication(id: string): LenderApplication | undefined {
  return APPLICATIONS.find((a) => a.id === id);
}

// ── Dashboard KPIs ───────────────────────────────────────────────────────────
export function getStatusCounts(): Record<AppStatus, number> {
  const base: Record<AppStatus, number> = { new: 0, under_review: 0, approved: 0, rejected: 0, disbursed: 0 };
  for (const a of APPLICATIONS) base[a.status] += 1;
  return base;
}

// ── Underwriting analytics ─────────────────────────────────────────────────────
export interface Underwriting {
  risk_distribution: Array<{ label: string; count: number; tone: string }>;
  score_bands: Array<{ band: ScoreBand; count: number }>;
  approval_prob_distribution: Array<{ bucket: string; count: number }>;
  approval_trend: Array<{ month: string; approved: number; rejected: number }>;
}
export function getUnderwriting(): Underwriting {
  const decided = APPLICATIONS.filter((a) => a.decision);
  const risk = (lo: number, hi: number): number => APPLICATIONS.filter((a) => a.approval_probability >= lo && a.approval_probability < hi).length;
  const band = (b: ScoreBand): number => APPLICATIONS.filter((a) => a.score_band === b).length;
  const probBucket = (lo: number, hi: number): number => APPLICATIONS.filter((a) => a.approval_probability >= lo && a.approval_probability < hi).length;
  return {
    risk_distribution: [
      { label: "Low risk", count: risk(70, 101), tone: "bg-status-success" },
      { label: "Medium risk", count: risk(45, 70), tone: "bg-status-warning" },
      { label: "High risk", count: risk(0, 45), tone: "bg-status-danger" },
    ],
    score_bands: (["Excellent", "Good", "Fair", "Poor"] as ScoreBand[]).map((b) => ({ band: b, count: band(b) })),
    approval_prob_distribution: [
      { bucket: "0–40%", count: probBucket(0, 40) },
      { bucket: "40–60%", count: probBucket(40, 60) },
      { bucket: "60–80%", count: probBucket(60, 80) },
      { bucket: "80–100%", count: probBucket(80, 101) },
    ],
    approval_trend: [
      { month: "Feb", approved: 14, rejected: 5 },
      { month: "Mar", approved: 18, rejected: 6 },
      { month: "Apr", approved: 21, rejected: 7 },
      { month: "May", approved: 24, rejected: 6 },
      { month: "Jun", approved: decided.filter((a) => a.decision === "approve").length, rejected: decided.filter((a) => a.decision === "reject").length },
    ],
  };
}

// ── Portfolio ──────────────────────────────────────────────────────────────────
export interface Portfolio {
  total_exposure: number;
  avg_ticket: number;
  avg_leapscore: number;
  disbursed_loans: number;
  portfolio_quality: number; // % in Good/Excellent band
  portfolio_health: "Healthy" | "Watch" | "Stressed";
}
export function getPortfolio(): Portfolio {
  const disbursed = APPLICATIONS.filter((a) => a.status === "disbursed");
  const exposure = disbursed.reduce((s, a) => s + a.amount, 0);
  const avgTicket = disbursed.length ? Math.round(exposure / disbursed.length) : 0;
  const avgScore = disbursed.length ? Math.round(disbursed.reduce((s, a) => s + a.leapscore, 0) / disbursed.length) : 0;
  const quality = disbursed.length ? Math.round((disbursed.filter((a) => a.score_band === "Good" || a.score_band === "Excellent").length / disbursed.length) * 100) : 0;
  return {
    total_exposure: exposure,
    avg_ticket: avgTicket,
    avg_leapscore: avgScore,
    disbursed_loans: disbursed.length,
    portfolio_quality: quality,
    portfolio_health: quality >= 75 ? "Healthy" : quality >= 55 ? "Watch" : "Stressed",
  };
}

// ── Lead-source analytics ───────────────────────────────────────────────────────
export interface SourceMetric {
  source: LeadSource;
  applications: number;
  approvals: number;
  conversion: number;
}
export function getSourceAnalytics(): SourceMetric[] {
  return SOURCES.map((source) => {
    const apps = APPLICATIONS.filter((a) => a.source === source);
    const approvals = apps.filter((a) => a.decision === "approve").length;
    return { source, applications: apps.length, approvals, conversion: apps.length ? Math.round((approvals / apps.length) * 100) : 0 };
  });
}

// ── Product analytics ────────────────────────────────────────────────────────────
export interface ProductAnalytics {
  top_products: Array<{ name: string; count: number }>;
  top_amounts: Array<{ range: string; count: number }>;
  top_cities: Array<{ name: string; count: number }>;
  top_score_bands: Array<{ name: string; count: number }>;
}
export function getProductAnalytics(): ProductAnalytics {
  const tally = (key: (a: LenderApplication) => string): Array<{ name: string; count: number }> => {
    const m = new Map<string, number>();
    for (const a of APPLICATIONS) m.set(key(a), (m.get(key(a)) ?? 0) + 1);
    return [...m.entries()].map(([name, count]) => ({ name, count })).sort((x, y) => y.count - x.count).slice(0, 5);
  };
  const amountRange = (a: LenderApplication): string => {
    if (a.amount < 500000) return "< ₹5L";
    if (a.amount < 1000000) return "₹5L–₹10L";
    if (a.amount < 1500000) return "₹10L–₹15L";
    return "> ₹15L";
  };
  return {
    top_products: tally((a) => a.product),
    top_amounts: tally(amountRange).map((x) => ({ range: x.name, count: x.count })),
    top_cities: tally((a) => a.city),
    top_score_bands: tally((a) => a.score_band),
  };
}

// ── Notifications ─────────────────────────────────────────────────────────────────
export interface LenderNotification {
  id: string;
  title: string;
  detail: string;
  when: string;
  tone: "info" | "success" | "warning" | "danger";
}
export function getNotifications(): LenderNotification[] {
  return [
    { id: "n1", title: "New application", detail: "Priya Sharma — Personal Loan ₹8,00,000 (LeapScore 762).", when: "12m ago", tone: "info" },
    { id: "n2", title: "Approval required", detail: "Rahul Verma's file is queued for underwriter sign-off.", when: "1h ago", tone: "warning" },
    { id: "n3", title: "Conditional approval", detail: "Sanjay Kumar approved subject to income verification.", when: "3h ago", tone: "info" },
    { id: "n4", title: "Disbursal completed", detail: "Anjali Nair — ₹5,00,000 disbursed.", when: "1d ago", tone: "success" },
    { id: "n5", title: "High risk alert", detail: "Deepak Yadav — FOIR 68% with sub-640 score.", when: "1d ago", tone: "danger" },
  ];
}
