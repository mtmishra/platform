// Mock DSA data (Sprint 15). Demo only — no CRM, lender/payout/WhatsApp/telephony
// APIs. Deterministic generator so the dashboard is stable across renders.

export type LeadStatus = "New" | "Qualified" | "Matched" | "Applied" | "Approved" | "Rejected" | "Disbursed";

export const LEAD_STATUSES: LeadStatus[] = ["New", "Qualified", "Matched", "Applied", "Approved", "Rejected", "Disbursed"];

export interface Lead {
  id: string;
  borrower_name: string;
  product: string;
  amount: number;
  status: LeadStatus;
  lender: string | null;
  leapscore: number;
  health_score: number;
  approval_odds: number;
  source: string;
  last_updated: string;
  /** Commission earned/expected on this lead (₹). */
  commission: number;
}

const NAMES = [
  "Priya Sharma", "Rahul Verma", "Anjali Nair", "Vikram Singh", "Sneha Reddy", "Arjun Mehta",
  "Kavya Iyer", "Rohan Gupta", "Meera Joshi", "Aditya Rao", "Pooja Patel", "Karthik Menon",
  "Divya Pillai", "Sanjay Kumar", "Neha Agarwal", "Amit Desai", "Ritu Banerjee", "Suresh Babu",
  "Tanvi Shah", "Manish Tiwari", "Ananya Bose", "Gaurav Malhotra", "Shruti Kulkarni", "Deepak Yadav",
  "Isha Chopra", "Nikhil Saxena",
];
const PRODUCTS = ["Personal Loan", "Home Loan", "Business Loan", "Loan Against Property"];
const LENDERS = ["HDFC Bank", "ICICI Bank", "Bajaj Finance", "Axis Bank", "Tata Capital", "KreditBee", "MoneyView"];
const SOURCES = ["Referral Link", "WhatsApp", "Walk-in", "Social Media", "Existing Client"];
// Distribution of statuses across the 26 leads.
const STATUS_PLAN: LeadStatus[] = [
  "New", "New", "New", "New", "Qualified", "Qualified", "Qualified", "Matched", "Matched", "Matched",
  "Applied", "Applied", "Applied", "Applied", "Approved", "Approved", "Approved", "Rejected", "Rejected",
  "Disbursed", "Disbursed", "Disbursed", "Disbursed", "Disbursed", "Matched", "Applied",
];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length]!;
}

function buildLeads(): Lead[] {
  return STATUS_PLAN.map((status, i) => {
    const amount = 200000 + ((i * 137) % 40) * 25000; // ₹2L–₹12L band
    const matchedOrLater = ["Matched", "Applied", "Approved", "Rejected", "Disbursed"].includes(status);
    const earning = ["Approved", "Disbursed"].includes(status) ? Math.round(amount * 0.015) : 0;
    const leapscore = 660 + ((i * 17) % 200); // 660–860
    return {
      id: `LD-${1000 + i}`,
      borrower_name: pick(NAMES, i),
      product: pick(PRODUCTS, i),
      amount,
      status,
      lender: matchedOrLater ? pick(LENDERS, i) : null,
      leapscore,
      health_score: 55 + ((i * 7) % 40),
      approval_odds: status === "Rejected" ? 28 + (i % 10) : 60 + ((i * 11) % 35),
      source: pick(SOURCES, i),
      last_updated: `2026-06-${String(2 + (i % 16)).padStart(2, "0")}T10:00:00.000Z`,
      commission: earning,
    };
  });
}

const LEADS = buildLeads();

export function getLeads(): Lead[] {
  return LEADS;
}
export function getLead(id: string): Lead | undefined {
  return LEADS.find((l) => l.id === id);
}

// ── Dashboard KPIs ─────────────────────────────────────────────────────────
export interface DsaKpis {
  total_leads: number;
  active_applications: number;
  approved_loans: number;
  total_earnings: number;
}
export function getKpis(): DsaKpis {
  const active = LEADS.filter((l) => ["Applied", "Matched"].includes(l.status)).length;
  const approved = LEADS.filter((l) => ["Approved", "Disbursed"].includes(l.status)).length;
  const earnings = LEADS.reduce((s, l) => s + l.commission, 0);
  return { total_leads: LEADS.length, active_applications: active, approved_loans: approved, total_earnings: earnings };
}

// ── Pipeline ────────────────────────────────────────────────────────────────
export function getPipeline(): Array<{ stage: string; count: number }> {
  const count = (statuses: LeadStatus[]): number => LEADS.filter((l) => statuses.includes(l.status)).length;
  return [
    { stage: "Lead", count: count(["New", "Qualified"]) },
    { stage: "Matched", count: count(["Matched"]) },
    { stage: "Applied", count: count(["Applied"]) },
    { stage: "Approved", count: count(["Approved"]) },
    { stage: "Disbursed", count: count(["Disbursed"]) },
  ];
}

// ── Commissions ───────────────────────────────────────────────────────────
export interface CommissionSummary {
  pending: number;   // approved but not yet disbursed
  approved: number;  // approved this cycle
  paid: number;      // disbursed
  monthly: number;
  yearly: number;
  projected: number;
}
export function getCommissions(): CommissionSummary {
  const pending = LEADS.filter((l) => l.status === "Approved").reduce((s, l) => s + l.commission, 0);
  const paid = LEADS.filter((l) => l.status === "Disbursed").reduce((s, l) => s + l.commission, 0);
  const approved = pending + paid;
  return {
    pending,
    approved,
    paid,
    monthly: paid,
    yearly: paid * 9,
    projected: Math.round((paid + pending) * 1.4),
  };
}

// ── Performance ─────────────────────────────────────────────────────────────
export interface Performance {
  leads_generated: number;
  applications_submitted: number;
  approval_rate: number;
  disbursal_rate: number;
  conversion_rate: number;
  monthly_trend: Array<{ month: string; leads: number }>;
  leaderboard_position: number;
  leaderboard_total: number;
}
export function getPerformance(): Performance {
  const applied = LEADS.filter((l) => ["Applied", "Approved", "Rejected", "Disbursed"].includes(l.status)).length;
  const approved = LEADS.filter((l) => ["Approved", "Disbursed"].includes(l.status)).length;
  const disbursed = LEADS.filter((l) => l.status === "Disbursed").length;
  const pct = (n: number, d: number): number => (d === 0 ? 0 : Math.round((n / d) * 100));
  return {
    leads_generated: LEADS.length,
    applications_submitted: applied,
    approval_rate: pct(approved, applied),
    disbursal_rate: pct(disbursed, approved),
    conversion_rate: pct(disbursed, LEADS.length),
    monthly_trend: [
      { month: "Jan", leads: 12 }, { month: "Feb", leads: 18 }, { month: "Mar", leads: 15 },
      { month: "Apr", leads: 22 }, { month: "May", leads: 24 }, { month: "Jun", leads: LEADS.length },
    ],
    leaderboard_position: 7,
    leaderboard_total: 240,
  };
}

// ── Referral ──────────────────────────────────────────────────────────────
export interface ReferralStats {
  code: string;
  url: string;
  clicks: number;
  registrations: number;
  applications: number;
  conversions: number;
}
export function getReferral(): ReferralStats {
  return {
    code: "dsa001",
    url: "https://app.leapmoney.com/ref/dsa001",
    clicks: 1284,
    registrations: 312,
    applications: 96,
    conversions: 41,
  };
}

// ── Analytics ─────────────────────────────────────────────────────────────
export interface Analytics {
  top_products: Array<{ name: string; count: number }>;
  top_lenders: Array<{ name: string; count: number }>;
  best_sources: Array<{ name: string; conversions: number }>;
  avg_ticket_size: number;
}
export function getAnalytics(): Analytics {
  const tally = (key: (l: Lead) => string | null): Array<{ name: string; count: number }> => {
    const map = new Map<string, number>();
    for (const l of LEADS) {
      const k = key(l);
      if (k) map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 4);
  };
  const avg = Math.round(LEADS.reduce((s, l) => s + l.amount, 0) / LEADS.length);
  return {
    top_products: tally((l) => l.product),
    top_lenders: tally((l) => l.lender),
    best_sources: tally((l) => l.source).map((s) => ({ name: s.name, conversions: s.count })),
    avg_ticket_size: avg,
  };
}

// ── Notifications ───────────────────────────────────────────────────────────
export interface DsaNotification {
  id: string;
  title: string;
  detail: string;
  when: string;
  tone: "info" | "success";
}
export function getNotifications(): DsaNotification[] {
  return [
    { id: "n1", title: "New lead assigned", detail: "Priya Sharma — Personal Loan ₹5,00,000 via Referral Link.", when: "1h ago", tone: "info" },
    { id: "n2", title: "Application approved", detail: "Rahul Verma's HDFC application was approved.", when: "4h ago", tone: "success" },
    { id: "n3", title: "Commission released", detail: "₹9,750 commission moved to Approved.", when: "1d ago", tone: "success" },
    { id: "n4", title: "Disbursal completed", detail: "Anjali Nair's Bajaj loan was disbursed.", when: "2d ago", tone: "success" },
  ];
}
