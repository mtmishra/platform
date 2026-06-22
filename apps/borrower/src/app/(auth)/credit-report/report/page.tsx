"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  CreditCard,
  Search,
  Calendar,
  Activity,
  Shield,
} from "lucide-react";
import { buildCreditReport, type CreditReportSummary } from "@/lib/credit-report-demo";

// ── Types ────────────────────────────────────────────────────────────────────

type BureauTab = "CIBIL" | "EXPERIAN" | "EQUIFAX" | "CRIF";
type InsightTab = "all-accounts" | "cc-utilisation" | "enquiries" | "payment-history" | "credit-age";

// ── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score: number | null): string {
  if (!score) return "#94A3B8";
  if (score >= 750) return "#16A34A";
  if (score >= 700) return "#65A30D";
  if (score >= 650) return "#CA8A04";
  if (score >= 600) return "#EA580C";
  return "#DC2626";
}

function scoreBand(score: number | null): string {
  if (!score) return "No Score";
  if (score >= 750) return "Excellent";
  if (score >= 700) return "Good";
  if (score >= 650) return "Fair";
  if (score >= 600) return "Poor";
  return "Very Poor";
}

function formatAmount(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
}

function monthLabel(i: number): string {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i] ?? "";
}

// ── Score Gauge (SVG arc) ────────────────────────────────────────────────────

function ScoreGauge({ score, min = 300, max = 900 }: { score: number | null; min?: number; max?: number }) {
  const pct = score !== null ? Math.max(0, Math.min(1, (score - min) / (max - min))) : 0;
  const r = 80;
  const cx = 100;
  const cy = 100;
  const startAngle = -210;
  const sweepAngle = 240;
  const toRad = (d: number) => (d * Math.PI) / 180;

  function arcPath(from: number, to: number) {
    const s = toRad(from);
    const e = toRad(to);
    const x1 = cx + r * Math.cos(s);
    const y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e);
    const y2 = cy + r * Math.sin(e);
    const large = to - from > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const needleAngle = startAngle + pct * sweepAngle;
  const nx = cx + (r - 10) * Math.cos(toRad(needleAngle));
  const ny = cy + (r - 10) * Math.sin(toRad(needleAngle));

  const segments = [
    { color: "#DC2626", from: startAngle, to: startAngle + sweepAngle * 0.2 },
    { color: "#EA580C", from: startAngle + sweepAngle * 0.2, to: startAngle + sweepAngle * 0.4 },
    { color: "#CA8A04", from: startAngle + sweepAngle * 0.4, to: startAngle + sweepAngle * 0.6 },
    { color: "#65A30D", from: startAngle + sweepAngle * 0.6, to: startAngle + sweepAngle * 0.8 },
    { color: "#16A34A", from: startAngle + sweepAngle * 0.8, to: startAngle + sweepAngle },
  ];

  return (
    <svg viewBox="0 0 200 160" className="w-full max-w-[220px]" aria-label={`Score gauge: ${score}`}>
      {/* track */}
      <path d={arcPath(startAngle, startAngle + sweepAngle)} stroke="#E2E8F0" strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* colored segments */}
      {segments.map((seg, i) => (
        <path key={i} d={arcPath(seg.from, seg.to)} stroke={seg.color} strokeWidth="12" fill="none" strokeLinecap={i === 0 ? "round" : i === segments.length - 1 ? "round" : "butt"} />
      ))}
      {/* needle */}
      {score !== null && (
        <>
          <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r="5" fill="#0F172A" />
          <circle cx={nx} cy={ny} r="3.5" fill="#0F172A" />
        </>
      )}
      {/* score text */}
      <text x={cx} y={cy + 22} textAnchor="middle" fontSize="32" fontWeight="800" fontFamily="monospace" fill={scoreColor(score)}>
        {score ?? "—"}
      </text>
      <text x={cx} y={cy + 38} textAnchor="middle" fontSize="10" fill="#64748B">
        {scoreBand(score)}
      </text>
      <text x={cx - r + 6} y={cy + 20} textAnchor="middle" fontSize="9" fill="#94A3B8">{min}</text>
      <text x={cx + r - 6} y={cy + 20} textAnchor="middle" fontSize="9" fill="#94A3B8">{max}</text>
    </svg>
  );
}

// ── Monthly payment calendar ─────────────────────────────────────────────────

function PaymentCalendar({ dpd, year = 2026 }: { dpd: number[]; year?: number }) {
  const months = Array.from({ length: 12 }, (_, i) => ({ label: monthLabel(i), dpd: dpd[i] ?? -1 }));
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-gray-500">{year}</div>
      <div className="grid grid-cols-6 gap-1">
        {months.map((m, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] text-gray-400">{m.label}</span>
            {m.dpd === -1 ? (
              <span className="text-[10px] text-gray-300">—</span>
            ) : m.dpd === 0 ? (
              <CheckCircle2 size={14} className="text-green-500" />
            ) : m.dpd <= 30 ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-100 text-[8px] font-bold text-amber-700">{m.dpd}</span>
            ) : (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[8px] font-bold text-red-700">{m.dpd}</span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 text-[9px] text-gray-400">
        <span className="flex items-center gap-1"><CheckCircle2 size={9} className="text-green-500" /> Paid on time</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> 1–89 days late</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> 90+ days late</span>
        <span className="flex items-center gap-1"><span className="text-gray-300">—</span> Not Reported</span>
      </div>
    </div>
  );
}

// ── Account row ──────────────────────────────────────────────────────────────

function AccountRow({ t, onClick }: { t: CreditReportSummary["tradelines"][0]; onClick: () => void }) {
  const onTime = t.dpd_last_36_months.filter((d) => d === 0).length;
  const total = t.dpd_last_36_months.length;
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3 text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
          <CreditCard size={16} className="text-blue-600" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{t.lender_name}</p>
          <p className="text-xs text-gray-500">{t.account_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-right">
        <div className="hidden sm:block">
          <p className="text-xs text-gray-400">Opened</p>
          <p className="text-xs font-medium text-gray-700">{new Date(t.date_opened).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">On Time</p>
          <p className="text-xs font-medium text-gray-700">{onTime}/{total}</p>
        </div>
        <ChevronRight size={15} className="text-gray-300" />
      </div>
    </button>
  );
}

// ── Payment History modal ────────────────────────────────────────────────────

function PaymentHistoryModal({ t, onClose }: { t: CreditReportSummary["tradelines"][0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 inline-block px-2 py-0.5 rounded mb-2">
              Last updated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                <CreditCard size={15} className="text-blue-600" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">{t.lender_name}</p>
                <p className="text-xs text-gray-500">{t.account_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
            <X size={14} />
          </button>
        </div>
        <div className="p-5">
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Loan Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatAmount(t.sanctioned_amount)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Outstanding</p>
              <p className="text-xl font-bold text-gray-900">{formatAmount(t.current_balance)}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold text-gray-700">Payment history</p>
            <PaymentCalendar dpd={t.dpd_last_36_months} />
          </div>
          <button className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            Get Full Report
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Left sidebar navigation (PaisaBazaar style) ──────────────────────────────

function CreditSidebar({ active, onChange }: { active: InsightTab; onChange: (t: InsightTab) => void }) {
  return (
    <aside className="hidden w-56 flex-shrink-0 lg:block">
      <div className="sticky top-4 rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Credit Score section */}
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Activity size={15} className="text-blue-600" /> Credit Score
          </p>
          <div className="mt-2 flex flex-col gap-0.5 pl-5">
            <button className="text-left text-xs text-gray-500 hover:text-blue-600 py-0.5">Score Predictor</button>
            <button className="text-left text-xs text-gray-500 hover:text-blue-600 py-0.5">Download Report</button>
          </div>
        </div>
        {/* Report Insights */}
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Report Insights</p>
          {(
            [
              { key: "all-accounts", label: "All Accounts", icon: <BarChart3 size={12} /> },
              { key: "cc-utilisation", label: "Credit Card Utilisation", icon: <CreditCard size={12} /> },
              { key: "enquiries", label: "Credit Enquiries", icon: <Search size={12} /> },
              { key: "payment-history", label: "Payment History", icon: <Calendar size={12} /> },
              { key: "credit-age", label: "Credit Age", icon: <Clock size={12} /> },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs font-medium transition-colors ${
                active === item.key ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
        {/* Products */}
        <div className="px-4 py-3">
          <p className="mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Apply</p>
          {["Personal Loan", "Home Loan", "Business Loan", "Credit Card"].map((p) => (
            <Link
              key={p}
              href={`/matches?type=${p.toLowerCase().replace(/ /g, "-")}`}
              className="flex items-center justify-between py-1 text-xs text-gray-600 hover:text-blue-600"
            >
              {p} <ChevronRight size={10} />
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function CreditReportReadyPage() {
  const searchParams = useSearchParams();
  const pan = searchParams.get("pan") ?? undefined;
  const report = buildCreditReport(pan);

  const [bureau, setBureau] = useState<BureauTab>("CIBIL");
  const [insightTab, setInsightTab] = useState<InsightTab>("all-accounts");
  const [selectedAccount, setSelectedAccount] = useState<CreditReportSummary["tradelines"][0] | null>(null);

  const bureauTabs: BureauTab[] = ["CIBIL", "EXPERIAN", "EQUIFAX", "CRIF"];
  const bureauScoreMap: Record<BureauTab, number | null> = {
    CIBIL: report.bureauScores.cibil,
    EXPERIAN: report.bureauScores.experian,
    EQUIFAX: report.bureauScores.equifax,
    CRIF: report.bureauScores.crif,
  };

  const currentScore = bureauScoreMap[bureau];
  const scoreChange = 14; // mock delta

  const activeAccts = report.tradelines.filter((t) => t.account_status === "standard");
  const closedAccts = report.tradelines.filter((t) => t.account_status !== "standard");

  // ── Bureau comparison table data ──────────────────────────────────────────
  const bureauTableRows = bureauTabs.map((b) => ({
    bureau: b,
    score: bureauScoreMap[b],
    refreshDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" }),
    onTime: "100%",
    utilization: `${report.utilizationPct}%`,
    change: b === "CIBIL" ? -29 : null,
  }));

  // ── Quick Report Summary ──────────────────────────────────────────────────
  const summaryItems = [
    { label: "Payment History", value: "100%", sub: "% of On Time Payments", good: true },
    { label: "Credit Card Utilization", value: `${report.utilizationPct}%`, sub: "% of Credit Limit Used", good: report.utilizationPct <= 30 },
    { label: "Credit Enquiries", value: String(report.enquiries6m), sub: "All Loans & Credit Cards", good: report.enquiries6m <= 3 },
    { label: "Credit Mix", value: String(report.tradelines.length), sub: "All Credit Accounts", good: true },
    { label: "Credit Age", value: `${Math.floor(report.creditAgeMonths / 12)} y, ${report.creditAgeMonths % 12} m`, sub: "Oldest Credit Account", good: report.creditAgeMonths >= 24 },
  ];

  // ── Insight content ───────────────────────────────────────────────────────
  function InsightContent() {
    if (insightTab === "cc-utilisation") {
      const ccAccounts = report.tradelines.filter((t) => t.account_type === "credit_card");
      return (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-gray-700">Credit Card Utilisation</p>
            {ccAccounts.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center text-gray-400">
                <CreditCard size={32} className="opacity-30" />
                <p className="text-sm">No credit cards on record</p>
              </div>
            ) : (
              ccAccounts.map((cc, i) => {
                const util = cc.credit_limit ? Math.round((cc.current_balance / cc.credit_limit) * 100) : 0;
                return (
                  <div key={i} className="mb-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium text-gray-700">{cc.lender_name}</span>
                      <span className={util > 30 ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>{util}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div className={`h-full rounded-full ${util > 60 ? "bg-red-500" : util > 30 ? "bg-amber-400" : "bg-green-500"}`} style={{ width: `${util}%` }} />
                    </div>
                    <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                      <span>Used: {formatAmount(cc.current_balance)}</span>
                      <span>Limit: {formatAmount(cc.credit_limit ?? 0)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-800">💡 Keep utilization below 30% to maintain a healthy credit score.</p>
          </div>
        </div>
      );
    }

    if (insightTab === "enquiries") {
      return (
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Credit Enquiries (Last 6 months)</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${report.enquiries6m <= 3 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {report.enquiries6m} enquiries
            </span>
          </div>
          {report.enquiries6m === 0 ? (
            <p className="text-sm text-green-600">No hard enquiries in the last 6 months.</p>
          ) : (
            Array.from({ length: Math.min(report.enquiries6m, 7) }, (_, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 py-2 last:border-0">
                <div className="flex items-center gap-2">
                  <Search size={12} className="text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">{["HDFC Bank", "Bajaj Finance", "Kotak Bank", "ICICI Bank", "Axis Bank", "SBI", "IDFC First"][i]}</p>
                    <p className="text-[10px] text-gray-400">Personal Loan enquiry</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400">{new Date(Date.now() - i * 12 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </div>
            ))
          )}
          <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs text-blue-700">Each hard enquiry can lower your score by 5–10 points. Avoid multiple loan applications in a short period.</p>
          </div>
        </div>
      );
    }

    if (insightTab === "credit-age") {
      const years = Math.floor(report.creditAgeMonths / 12);
      const months = report.creditAgeMonths % 12;
      return (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-4 text-sm font-semibold text-gray-700">Credit Age</p>
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <Clock size={40} className="mx-auto mb-2 text-blue-500 opacity-70" />
                <p className="text-3xl font-bold text-gray-900">{years} yr, {months} mo</p>
                <p className="mt-1 text-sm text-gray-500">Oldest credit account age</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(100, (report.creditAgeMonths / 120) * 100)}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-gray-400">
              <span>0 yr</span><span>5 yr</span><span>10 yr+</span>
            </div>
          </div>
          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-semibold text-green-800">💡 Keeping your oldest account open improves your credit age and score over time.</p>
          </div>
        </div>
      );
    }

    // payment-history + all-accounts (default)
    return (
      <div className="flex flex-col gap-3">
        {/* Active accounts */}
        {activeAccts.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Active ({activeAccts.length})</p>
            </div>
            <div className="flex flex-col gap-2">
              {activeAccts.map((t, i) => (
                <AccountRow key={i} t={t} onClick={() => setSelectedAccount(t)} />
              ))}
            </div>
          </div>
        )}
        {/* Closed accounts */}
        {closedAccts.length > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Closed ({closedAccts.length})</p>
            </div>
            <div className="flex flex-col gap-2">
              {closedAccts.map((t, i) => (
                <AccountRow key={i} t={t} onClick={() => setSelectedAccount(t)} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal */}
      {selectedAccount && (
        <PaymentHistoryModal t={selectedAccount} onClose={() => setSelectedAccount(null)} />
      )}

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-6">
          {/* Left sidebar */}
          <CreditSidebar active={insightTab} onChange={setInsightTab} />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Bureau tabs */}
            <div className="mb-4 flex gap-0 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              {bureauTabs.map((b) => (
                <button
                  key={b}
                  onClick={() => setBureau(b)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
                    bureau === b
                      ? "border-blue-600 bg-white text-blue-700"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Score header card */}
            <div className="mb-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                {/* Score gauge */}
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs text-gray-400">As of {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "2-digit" })}</p>
                  <div className="relative">
                    <ScoreGauge score={currentScore} />
                    {currentScore !== null && (
                      <div className="absolute -top-1 -right-2 flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 shadow-sm">
                        <TrendingUp size={9} /> +{scoreChange} Points
                        <button className="ml-0.5 text-green-600 underline">See Why?</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex-1">
                  <div className="mb-3">
                    <p className="text-lg font-bold text-gray-900">
                      {currentScore === null ? "No credit history found" : `You are doing ${scoreBand(currentScore)}!`}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {currentScore !== null && currentScore >= 700
                        ? "You're just a few points away from an excellent Credit Score. A few small steps can help you qualify for top loan and Credit Card offers from leading banks."
                        : "Build your credit history to access better loan offers and lower interest rates."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                      <RefreshCw size={12} /> Refresh Score
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                      <Download size={12} /> Download Report
                    </button>
                    <Link href="/matches" className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                      <BarChart3 size={12} /> View Offers
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Bureau comparison table */}
            <div className="mb-4 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-50 px-5 py-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Compare your Credit Report across 4 Bureau(s)</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Bureau</th>
                      {bureauTableRows.map((b) => (
                        <th key={b.bureau} className="px-4 py-2 text-center text-xs font-bold text-blue-700">{b.bureau}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="px-4 py-2 text-xs text-gray-500">Last Refresh Date</td>
                      {bureauTableRows.map((b) => (
                        <td key={b.bureau} className="px-4 py-2 text-center text-xs text-gray-700">{b.refreshDate}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-xs text-gray-500">Score</td>
                      {bureauTableRows.map((b) => (
                        <td key={b.bureau} className="px-4 py-2 text-center">
                          <span className="text-sm font-bold" style={{ color: scoreColor(b.score) }}>{b.score ?? "—"}</span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-xs text-gray-500">Score Change</td>
                      {bureauTableRows.map((b) => (
                        <td key={b.bureau} className="px-4 py-2 text-center text-xs">
                          {b.change !== null ? (
                            <span className={`flex items-center justify-center gap-0.5 font-semibold ${b.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                              {b.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                              {Math.abs(b.change)}
                            </span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-xs text-gray-500">On Time Payments</td>
                      {bureauTableRows.map((b) => (
                        <td key={b.bureau} className="px-4 py-2 text-center text-xs text-gray-600">{b.onTime}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-xs text-gray-500">Credit Utilization</td>
                      {bureauTableRows.map((b) => (
                        <td key={b.bureau} className="px-4 py-2 text-center text-xs text-gray-600">{b.utilization}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Credit Score Insights</p>
                  <p className="text-xs text-gray-400">A deeper look into the factors behind your score</p>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">
                  <Download size={12} /> Download Full Report
                </button>
              </div>
            </div>

            {/* Insight tabs (mobile) */}
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {(
                [
                  { key: "all-accounts", label: "All Accounts" },
                  { key: "payment-history", label: "Payment History" },
                  { key: "cc-utilisation", label: "CC Utilisation" },
                  { key: "enquiries", label: "Enquiries" },
                  { key: "credit-age", label: "Credit Age" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setInsightTab(tab.key)}
                  className={`flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    insightTab === tab.key ? "bg-blue-600 text-white" : "border border-gray-200 bg-white text-gray-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Two-column: insight content + quick summary */}
            <div className="flex gap-4">
              {/* Insight content */}
              <div className="flex-1 min-w-0">
                <InsightContent />
              </div>

              {/* Quick Report Summary (right panel) */}
              <div className="hidden w-56 flex-shrink-0 xl:block">
                <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Quick Report Summary</p>
                  <div className="flex flex-col gap-3">
                    {summaryItems.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                          <p className="text-[10px] text-gray-400">{item.sub}</p>
                        </div>
                        <span className={`text-sm font-bold ${item.good ? "text-green-600" : "text-amber-600"}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="#"
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Download Full Report <Download size={11} />
                  </Link>
                </div>

                {/* LeapScore upgrade card */}
                <div className="mt-3 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-white">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Shield size={13} />
                    <p className="text-xs font-bold">LeapScore™</p>
                  </div>
                  <p className="text-2xl font-black font-mono">{report.leapScore.leapscore ?? "—"}</p>
                  <p className="text-xs opacity-70 mb-3">AI-Powered · 47 Parameters</p>
                  <Link href="/matches" className="flex w-full items-center justify-center gap-1 rounded-lg bg-white/20 px-2 py-2 text-xs font-semibold hover:bg-white/30">
                    View Matched Lenders <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Pre-approved offers */}
            <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-4 text-sm font-bold text-gray-800">Pre-Approved &amp; Pre-Qualified Offers</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { bank: "HDFC", color: "#004C97", product: "Personal Loan", rate: "10.8%", amount: "₹5L–25L", approval: 87 },
                  { bank: "Kotak", color: "#ED1C24", product: "Credit Card", rate: "Lifetime free", amount: "Limit: ₹2L", approval: 74 },
                  { bank: "Bajaj", color: "#0033A0", product: "Home Loan", rate: "8.7%", amount: "Up to ₹1.5Cr", approval: 68 },
                ].map((o) => (
                  <div key={o.bank} className="rounded-lg border border-gray-100 p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ background: o.color }}>
                        {o.bank}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{o.product}</p>
                        <p className="text-[10px] text-gray-400">{o.amount}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{o.rate} p.a.</span>
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">{o.approval}% approval</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-gray-400">By clicking on the offers above, I agree to be contacted by a LeapMoney product expert</p>
            </div>

            {/* Go to dashboard */}
            <div className="mt-4 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline">
                ← Back to Dashboard
              </Link>
              <Link href="/matches" className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                View All Loan Matches <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
