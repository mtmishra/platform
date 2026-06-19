// Mock Admin Control Tower data (Sprint 17). Demo only — no APIs/CRM/integrations.
// Aggregates across borrower, DSA, lender, application, outcome, and lender-
// repository surfaces. Uses @leapmoney/demo-data for canonical platform-wide
// constants — all portals share the same aggregate numbers.

import { getLenderCount, getRejectionReasons } from "@leapmoney/lenders";
import {
  PLATFORM,
  PLATFORM_FINANCIALS,
  LENDER_NAMES,
  PRODUCT_NAMES,
  LEAD_SOURCE_NAMES,
  FIRST_NAMES,
  LAST_NAMES,
  inr,
  pick,
} from "@leapmoney/demo-data";

export { inr };

export type AppStatus = "new" | "under_review" | "approved" | "rejected" | "disbursed";
export type LeadSource = (typeof LEAD_SOURCE_NAMES)[number];
export type ScoreBand = "Excellent" | "Good" | "Fair" | "Poor";
export type UserRole = "Borrower" | "DSA" | "Lender";

// ── Platform totals ───────────────────────────────────────────────────────────
export interface AdminKpis {
  total_borrowers: number;
  total_dsas: number;
  total_lenders: number;
  total_applications: number;
  total_disbursals: number;
  revenue: number;
  commission: number;
}

export function getKpis(): AdminKpis {
  return {
    total_borrowers: PLATFORM.total_borrowers,
    total_dsas: PLATFORM.total_dsas,
    total_lenders: getLenderCount().total,
    total_applications: PLATFORM.total_applications,
    total_disbursals: PLATFORM.total_disbursals,
    revenue: PLATFORM_FINANCIALS.platform_revenue,
    commission: PLATFORM_FINANCIALS.commission_pool,
  };
}

// ── User management ────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  detail: string;
  status: "Active" | "Pending" | "Suspended";
  joined: string;
}

function buildUsers(): AdminUser[] {
  const users: AdminUser[] = [];
  const plan: Array<{ role: UserRole; count: number; prefix: string }> = [
    { role: "Borrower", count: 10, prefix: "BR" },
    { role: "DSA", count: 8, prefix: "DS" },
    { role: "Lender", count: 7, prefix: "LN" },
  ];
  const LENDER_ORG = ["HDFC Bank", "ICICI Bank", "Bajaj Finance", "Tata Capital", "MoneyView", "KreditBee", "Axis Bank"];
  let n = 0;
  for (const p of plan) {
    for (let i = 0; i < p.count; i++) {
      const name = p.role === "Lender"
        ? LENDER_ORG[i % LENDER_ORG.length]!
        : `${pick(FIRST_NAMES, n)} ${pick(LAST_NAMES, n)}`;
      const status: AdminUser["status"] = n % 9 === 0 ? "Pending" : n % 13 === 0 ? "Suspended" : "Active";
      const detail =
        p.role === "Borrower" ? `LeapScore ${680 + ((n * 17) % 200)}`
          : p.role === "DSA" ? `${20 + ((n * 7) % 80)} leads · #${1 + (n % 50)} rank`
            : `${getLenderCount().total} products · ${50 + (n % 40)}% approval`;
      users.push({
        id: `${p.prefix}-${1000 + i}`,
        name,
        role: p.role,
        detail,
        status,
        joined: `2026-0${1 + (n % 5)}-${String(1 + (n % 27)).padStart(2, "0")}`,
      });
      n++;
    }
  }
  return users;
}
const USERS = buildUsers();
export function getUsers(role?: UserRole): AdminUser[] {
  return role ? USERS.filter((u) => u.role === role) : USERS;
}
export function statusCount(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const u of USERS) m[u.status] = (m[u.status] ?? 0) + 1;
  return m;
}

// ── Application management ────────────────────────────────────────────────────
export interface AdminApplication {
  id: string;
  applicant: string;
  product: string;
  amount: number;
  lender: string;
  source: LeadSource;
  status: AppStatus;
  score_band: ScoreBand;
  updated: string;
}

const STATUSES: AppStatus[] = ["new", "under_review", "approved", "rejected", "disbursed"];

function buildApplications(): AdminApplication[] {
  return Array.from({ length: 40 }, (_, i) => {
    const score = 580 + ((i * 31) % 290);
    const band: ScoreBand = score >= 780 ? "Excellent" : score >= 700 ? "Good" : score >= 640 ? "Fair" : "Poor";
    return {
      id: `AP-${30000 + i}`,
      applicant: `${pick(FIRST_NAMES, i)} ${pick(LAST_NAMES, i + 3)}`,
      product: pick(PRODUCT_NAMES, i),
      amount: 200000 + ((i * 137) % 40) * 50000,
      lender: pick(LENDER_NAMES, i),
      source: pick(LEAD_SOURCE_NAMES, i),
      status: pick(STATUSES, i),
      score_band: band,
      updated: `2026-06-${String(1 + (i % 17)).padStart(2, "0")}`,
    };
  });
}
const ADMIN_APPS = buildApplications();
export function getApplications(): AdminApplication[] { return ADMIN_APPS; }

export function sourceCount(): Record<string, number> {
  const m: Record<string, number> = {};
  for (const a of ADMIN_APPS) m[a.source] = (m[a.source] ?? 0) + 1;
  return m;
}

// ── Commission management ─────────────────────────────────────────────────────
export interface CommissionSummary {
  pending: number;
  approved: number;
  paid: number;
  by_dsa: Array<{ dsa: string; pending: number; paid: number }>;
}
export function getCommissions(): CommissionSummary {
  const pool = PLATFORM_FINANCIALS.commission_pool;
  return {
    pending: Math.round(pool * 0.22),
    approved: Math.round(pool * 0.35),
    paid: Math.round(pool * 0.43),
    by_dsa: Array.from({ length: 6 }, (_, i) => ({
      dsa: `${pick(FIRST_NAMES, i)} ${pick(LAST_NAMES, i)}`,
      pending: 8000 + i * 2400,
      paid: 22000 + i * 5200,
    })).sort((a, b) => b.paid - a.paid),
  };
}

// ── Risk dashboard ────────────────────────────────────────────────────────────
export interface RiskDashboard {
  score_bands: Array<{ band: ScoreBand; count: number }>;
  approval_rate_by_band: Array<{ band: ScoreBand; rate: number }>;
  rejection_reasons: Array<{ label: string; count: number }>;
}
export function getRisk(): RiskDashboard {
  const bandCount = (b: ScoreBand): number => ADMIN_APPS.filter((a) => a.score_band === b).length;
  const reasons = getRejectionReasons();
  return {
    score_bands: (["Excellent", "Good", "Fair", "Poor"] as ScoreBand[]).map((b) => ({ band: b, count: bandCount(b) })),
    approval_rate_by_band: [
      { band: "Excellent", rate: 92 },
      { band: "Good", rate: 78 },
      { band: "Fair", rate: 54 },
      { band: "Poor", rate: 26 },
    ],
    rejection_reasons: reasons.map((r, i) => ({ label: r.label, count: 34 - i * 5 })),
  };
}

// ── Revenue dashboard ─────────────────────────────────────────────────────────
export interface RevenueDashboard {
  revenue: number;
  disbursal_volume: number;
  conversion_rate: number;
  monthly: Array<{ month: string; revenue: number }>;
}
export function getRevenue(): RevenueDashboard {
  return {
    revenue: PLATFORM_FINANCIALS.platform_revenue,
    disbursal_volume: PLATFORM_FINANCIALS.disbursal_volume,
    conversion_rate: Math.round((PLATFORM.total_disbursals / PLATFORM.total_applications) * 100),
    monthly: [
      { month: "Feb", revenue: 2800000 },
      { month: "Mar", revenue: 3200000 },
      { month: "Apr", revenue: 3600000 },
      { month: "May", revenue: 3900000 },
      { month: "Jun", revenue: Math.round(PLATFORM_FINANCIALS.platform_revenue / 4) },
    ],
  };
}

// ── Compliance dashboard ──────────────────────────────────────────────────────
export interface ComplianceDashboard {
  consents: { granted: number; active: number; withdrawn: number };
  audit_logs: Array<{ when: string; actor: string; action: string }>;
  bureau_pulls: { total: number; soft: number; hard: number; consented: number };
}
export function getCompliance(): ComplianceDashboard {
  return {
    consents: { granted: 9120, active: 8744, withdrawn: 376 },
    audit_logs: [
      { when: "2026-06-18 14:22", actor: "ops@leapmoney.net", action: "Approved lender policy update — Bajaj Finance" },
      { when: "2026-06-18 12:05", actor: "system", action: "Bureau pull (soft) — CIBIL for BR-1004" },
      { when: "2026-06-18 09:41", actor: "ops@leapmoney.net", action: "Suspended DSA account DS-1007 (KYC lapse)" },
      { when: "2026-06-17 18:30", actor: "system", action: "Consent withdrawn — BR-1002 (right to erasure)" },
      { when: "2026-06-17 11:12", actor: "admin@leapmoney.net", action: "Exported audit log (compliance review)" },
    ],
    bureau_pulls: { total: 9430, soft: 8120, hard: 1310, consented: 9430 },
  };
}

// ── Notifications ─────────────────────────────────────────────────────────────
export interface AdminNotification {
  id: string;
  title: string;
  detail: string;
  when: string;
  tone: "info" | "success" | "warning" | "danger";
}
export function getNotifications(): AdminNotification[] {
  return [
    { id: "n1", title: "Disbursal milestone", detail: `Platform crossed ${inr(PLATFORM_FINANCIALS.disbursal_volume)} in disbursed volume.`, when: "30m ago", tone: "success" },
    { id: "n2", title: "DSA onboarding spike", detail: "18 new DSA partners pending KYC approval.", when: "2h ago", tone: "info" },
    { id: "n3", title: "High-risk cohort", detail: "Sub-640 applications up 6% week-on-week.", when: "5h ago", tone: "warning" },
    { id: "n4", title: "Consent withdrawals", detail: "12 erasure requests require processing within SLA.", when: "1d ago", tone: "danger" },
    { id: "n5", title: "New lender live", detail: "InCred Finance policies published to the repository.", when: "2d ago", tone: "info" },
  ];
}
