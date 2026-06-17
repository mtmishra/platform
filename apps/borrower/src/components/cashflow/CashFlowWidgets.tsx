import React from "react";
import { BadgeCheck, Wallet, TrendingUp, Gauge } from "lucide-react";
import type {
  CashFlowBand,
  CashFlowScoreResult,
  FoirAnalysis,
  IncomeIntelligence,
  VerifiedIncome,
} from "@leapmoney/credit";

const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

const BAND_TONE: Record<CashFlowBand, string> = {
  strong: "text-status-success",
  moderate: "text-status-warning",
  weak: "text-status-danger",
};

const RISK_TONE: Record<FoirAnalysis["risk_level"], string> = {
  low: "text-status-success",
  medium: "text-status-warning",
  high: "text-status-danger",
};

// ── Verified Income badge ─────────────────────────────────────────────────────
export function VerifiedIncomeBadge({ verified }: { verified: VerifiedIncome }) {
  const isVerified = verified.verification_status === "verified";
  const updated = new Date(verified.last_updated).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return (
    <div className="flex items-center gap-4 rounded-lg border border-status-success/30 bg-status-success/5 p-5 shadow-1">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-status-success/15 text-status-success">
        <BadgeCheck size={22} />
      </span>
      <div className="flex-1">
        <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Verified income</p>
        <p className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{inr(verified.monthly_income)}/mo</p>
        <p className="text-body-sm text-foreground-secondary">
          {isVerified ? "Bank-verified" : "Verification pending"} · Updated {updated}
        </p>
      </div>
    </div>
  );
}

// ── Income Intelligence ───────────────────────────────────────────────────────
export function IncomeIntelligenceWidget({ income }: { income: IncomeIntelligence }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">
        <Wallet size={15} /> Income intelligence
      </span>
      <p className="font-mono text-display-large font-bold tabular-nums text-foreground-primary">{inr(income.monthly_income)}</p>
      <div className="grid grid-cols-2 gap-3 text-body-sm">
        <div>
          <p className="text-foreground-tertiary">Salary detected</p>
          <p className="font-medium text-foreground-primary">{income.salary_detected ? `Yes · day ${income.salary_day ?? "—"}` : "No"}</p>
        </div>
        <div>
          <p className="text-foreground-tertiary">Confidence</p>
          <p className="font-medium capitalize text-foreground-primary">{income.income_confidence}</p>
        </div>
        <div>
          <p className="text-foreground-tertiary">Consistency</p>
          <p className="font-mono font-medium text-status-success">{income.income_consistency}/100</p>
        </div>
        <div>
          <p className="text-foreground-tertiary">Volatility</p>
          <p className="font-mono font-medium text-foreground-primary">{income.income_volatility}/100</p>
        </div>
      </div>
    </div>
  );
}

// ── Cash Flow Score ───────────────────────────────────────────────────────────
export function CashFlowScoreWidget({ score }: { score: CashFlowScoreResult }) {
  const tone = BAND_TONE[score.band];
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">
        <TrendingUp size={15} /> Cash flow score
      </span>
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>{score.score}</span>
        <span className="text-body-sm text-foreground-tertiary">/ 100</span>
      </div>
      <p className={`text-body-md font-semibold capitalize ${tone}`}>{score.band}</p>
      <ul className="flex flex-col gap-1.5">
        {score.insights.map((ins) => (
          <li key={ins} className="text-body-sm text-foreground-secondary">• {ins}</li>
        ))}
      </ul>
    </div>
  );
}

// ── FOIR ──────────────────────────────────────────────────────────────────────
export function FoirWidget({ foir }: { foir: FoirAnalysis }) {
  const currentPct = Math.round(foir.current_foir * 100);
  const recPct = Math.round(foir.recommended_foir * 100);
  const tone = RISK_TONE[foir.risk_level];
  const fill = Math.min(1, foir.current_foir / Math.max(foir.recommended_foir, foir.current_foir, 0.6));

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">
        <Gauge size={15} /> FOIR analysis
      </span>
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>{currentPct}%</span>
        <span className="text-body-sm text-foreground-tertiary">of income committed</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-background-page">
        <div className={`h-full origin-left rounded-full ${foir.risk_level === "low" ? "bg-status-success" : foir.risk_level === "medium" ? "bg-status-warning" : "bg-status-danger"}`} style={{ transform: `scaleX(${fill})` }} />
      </div>
      <div className="flex items-center justify-between text-body-sm text-foreground-secondary">
        <span>Recommended ≤ {recPct}%</span>
        <span className={`font-medium capitalize ${tone}`}>{foir.risk_level} risk</span>
      </div>
      <p className="text-body-sm text-foreground-secondary">
        EMI headroom: <span className="font-mono font-medium text-foreground-primary">{inr(foir.emi_headroom)}/mo</span> before you hit the recommended ceiling.
      </p>
    </div>
  );
}
