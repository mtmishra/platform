// Mock DSA data (Sprint 15). Demo only — no CRM, lender/payout/WhatsApp/telephony
// APIs. Uses @leapmoney/demo-data for canonical constants — aggregate numbers
// stay consistent with Admin Control Tower and Lender portal views.

import {
  PLATFORM,
  PLATFORM_FINANCIALS,
  LENDER_NAMES,
  PRODUCT_NAMES,
  BORROWER_NAMES,
  pick,
} from "@leapmoney/demo-data";

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
  commission: number;
}

const SOURCES = ["Referral Link", "WhatsApp", "Walk-in", "Social Media", "Existing Client"] as const;

const STATUS_PLAN: LeadStatus[] = [
  "New", "New", "New", "New", "Qualified", "Qualified", "Qualified", "Matched", "Matched", "Matched",
  "Applied", "Applied", "Applied", "Applied", "Approved", "Approved", "Approved", "Rejected", "Rejected",
  "Disbursed", "Disbursed", "Disbursed", "Disbursed", "Disbursed", "Matched", "Applied",
];

function buildLeads(): Lead[] {
  return STATUS_PLAN.map((status, i) => {
    const amount = 200000 + ((i * 137) % 40) * 25000;
    const matchedOrLater = ["Matched", "Applied", "Approved", "Rejected", "Disbursed"].includes(status);
    const earning = ["Approved", "Disbursed"].includes(status) ? Math.round(amount * PLATFORM.dsa_commission_rate) : 0;
    const leapscore = 660 + ((i * 17) % 200);
    return {
      id: `LD-${1000 + i}`,
      borrower_name: pick(BORROWER_NAMES, i),
      product: pick(PRODUCT_NAMES, i),
      amount,
      status,
      lender: matchedOrLater ? pick(LENDER_NAMES, i) : null,
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

export function getLeads(): Lead[] { return LEADS; }
export function getLead(id: string): Lead | undefined { return LEADS.find((l) => l.id === id); }

// ── Dashboard KPIs ─────────────────────────────────────────────────────────────
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

// ── Pipeline ────────────────────────────────────────────────────────────────────
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

// ── Commissions ──────────────────────────────────────────────────────────────────
export interface CommissionSummary {
  pending: number;
  approved: number;
  paid: number;
  monthly: number;
  yearly: number;
  projected: number;
}
export function getCommissions(): CommissionSummary {
  const pending = LEADS.filter((l) => l.status === "Approved").reduce((s, l) => s + l.commission, 0);
  const paid = LEADS.filter((l) => l.status === "Disbursed").reduce((s, l) => s + l.commission, 0);
  return {
    pending,
    approved: pending + paid,
    paid,
    monthly: paid,
    yearly: paid * 9,
    projected: Math.round((paid + pending) * 1.4),
  };
}

// ── Performance ───────────────────────────────────────────────────────────────────
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
    leaderboard_total: PLATFORM.total_dsas,
  };
}

// ── Referral ─────────────────────────────────────────────────────────────────────
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

// ── Analytics ──────────────────────────────────────────────────────────────────
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
  return {
    top_products: tally((l) => l.product),
    top_lenders: tally((l) => l.lender),
    best_sources: tally((l) => l.source).map((s) => ({ name: s.name, conversions: s.count })),
    avg_ticket_size: Math.round(LEADS.reduce((s, l) => s + l.amount, 0) / LEADS.length),
  };
}

// ── Notifications ──────────────────────────────────────────────────────────────
export interface DsaNotification {
  id: string;
  title: string;
  detail: string;
  when: string;
  tone: "info" | "success";
}
export function getNotifications(): DsaNotification[] {
  const platformCommission = PLATFORM_FINANCIALS.commission_pool;
  return [
    { id: "n1", title: "New lead assigned", detail: `${BORROWER_NAMES[0]} — Personal Loan ₹5,00,000 via Referral Link.`, when: "1h ago", tone: "info" },
    { id: "n2", title: "Application approved", detail: `${BORROWER_NAMES[1]}'s HDFC application was approved.`, when: "4h ago", tone: "success" },
    { id: "n3", title: "Commission released", detail: `₹${Math.round(platformCommission * 0.0002).toLocaleString("en-IN")} commission moved to Approved.`, when: "1d ago", tone: "success" },
    { id: "n4", title: "Disbursal completed", detail: `${BORROWER_NAMES[2]}'s Bajaj loan was disbursed.`, when: "2d ago", tone: "success" },
  ];
}
