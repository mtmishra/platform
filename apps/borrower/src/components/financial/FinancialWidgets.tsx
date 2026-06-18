import React from "react";
import { Briefcase, ShieldCheck, Gauge, ArrowLeftRight, Layers, PiggyBank, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { CountUp, FOIRMeter, KpiValue } from "@leapmoney/ui";
import type {
  AdvancedFoirResult,
  BalanceTransferResult,
  ConsolidationResult,
  EmployerIntelligence,
  Finding,
  FindingSeverity,
  IncomeStabilityResult,
  Recommendation,
  RecommendationPriority,
  SavingsOpportunity,
} from "@leapmoney/credit";

const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

const RATING_TONE: Record<string, string> = {
  high: "text-status-success",
  strong: "text-status-success",
  medium: "text-status-warning",
  moderate: "text-status-warning",
  low: "text-status-danger",
  weak: "text-status-danger",
};

const FOIR_TONE: Record<AdvancedFoirResult["risk_band"], string> = {
  excellent: "text-status-success",
  healthy: "text-status-success",
  warning: "text-status-warning",
  critical: "text-status-danger",
};

const PRIORITY_META: Record<RecommendationPriority, { tone: string; label: string }> = {
  critical: { tone: "bg-status-danger text-foreground-on-dark", label: "Critical" },
  high: { tone: "bg-status-warning text-foreground-on-dark", label: "High" },
  medium: { tone: "bg-interactive-primary text-foreground-on-dark", label: "Medium" },
  low: { tone: "bg-background-page text-foreground-secondary", label: "Low" },
};

function Shell({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">
        {icon} {label}
      </span>
      {children}
    </div>
  );
}

// ── Current Position (investor-grade scorecard) ───────────────────────────────
export interface CurrentPosition {
  leapscore: number | null;
  health_score: number;
  cash_flow_score: number;
  foir_pct: number;
}

export function CurrentPositionWidget({ position }: { position: CurrentPosition }) {
  const tiles = [
    { label: "LeapScore", value: position.leapscore === null ? "—" : String(position.leapscore), scale: "/ 900" },
    { label: "Health", value: String(position.health_score), scale: "/ 100" },
    { label: "Cash Flow", value: String(position.cash_flow_score), scale: "/ 100" },
    { label: "FOIR", value: `${position.foir_pct}%`, scale: "committed" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">{t.label}</p>
          <KpiValue value={t.value} className="block" />
          <p className="text-body-sm text-foreground-tertiary">{t.scale}</p>
        </div>
      ))}
    </div>
  );
}

// ── Findings ──────────────────────────────────────────────────────────────────
const FINDING_META: Record<FindingSeverity, { tone: string; icon: React.ReactNode; label: string }> = {
  critical: { tone: "text-status-danger", icon: <AlertTriangle size={16} />, label: "Critical" },
  warning: { tone: "text-status-warning", icon: <AlertCircle size={16} />, label: "Warning" },
  info: { tone: "text-status-success", icon: <Info size={16} />, label: "Info" },
};

export function FindingsList({ findings }: { findings: Finding[] }) {
  if (findings.length === 0) {
    return <p className="text-body-md text-foreground-secondary">No notable findings — your profile looks clean.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {findings.map((f) => {
        const meta = FINDING_META[f.severity];
        return (
          <div key={f.id} className="flex items-start gap-3 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
            <span className={`mt-0.5 flex-shrink-0 ${meta.tone}`}>{meta.icon}</span>
            <div className="flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="text-body-md font-semibold text-foreground-primary">{f.title}</span>
                <span className={`text-label-caps uppercase tracking-wider ${meta.tone}`}>{meta.label}</span>
              </span>
              <p className="text-body-sm text-foreground-secondary">{f.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Savings headline ──────────────────────────────────────────────────────────
export function SavingsWidget({ savings }: { savings: SavingsOpportunity }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-premium/30 bg-premium/5 p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-premium">
        <PiggyBank size={16} /> Potential savings
      </span>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Monthly", value: savings.monthly_savings },
          { label: "Annual", value: savings.annual_savings },
          { label: "Lifetime", value: savings.lifetime_savings },
        ].map((s) => (
          <div key={s.label} className="flex items-baseline justify-between sm:flex-col sm:items-start sm:gap-1">
            <CountUp value={s.value} prefix="₹" className="font-mono text-h1 font-bold text-foreground-primary" />
            <p className="text-body-sm text-foreground-tertiary">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Employer ──────────────────────────────────────────────────────────────────
export function EmployerWidget({ employer }: { employer: EmployerIntelligence }) {
  const tone = RATING_TONE[employer.stability_rating] ?? "text-foreground-primary";
  return (
    <Shell icon={<Briefcase size={15} />} label="Employer intelligence">
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>{employer.employer_score}</span>
        <span className="text-body-sm text-foreground-tertiary">/ 100</span>
      </div>
      <p className={`text-body-md font-semibold capitalize ${tone}`}>{employer.stability_rating} stability</p>
      <p className="text-body-sm text-foreground-secondary">{employer.explanation}</p>
    </Shell>
  );
}

// ── Income stability ──────────────────────────────────────────────────────────
export function IncomeStabilityWidget({ stability }: { stability: IncomeStabilityResult }) {
  const tone = RATING_TONE[stability.stability_band] ?? "text-foreground-primary";
  return (
    <Shell icon={<ShieldCheck size={15} />} label="Income stability">
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>{stability.income_stability_score}</span>
        <span className="text-body-sm text-foreground-tertiary">/ 100</span>
      </div>
      <p className={`text-body-md font-semibold capitalize ${tone}`}>{stability.stability_band}</p>
      <ul className="flex flex-col gap-1.5">
        {stability.insights.map((i) => (
          <li key={i} className="text-body-sm text-foreground-secondary">• {i}</li>
        ))}
      </ul>
    </Shell>
  );
}

// ── Advanced FOIR ─────────────────────────────────────────────────────────────
export function AdvancedFoirWidget({ foir }: { foir: AdvancedFoirResult }) {
  const tone = FOIR_TONE[foir.risk_band];
  return (
    <Shell icon={<Gauge size={15} />} label="FOIR optimization">
      <FOIRMeter foir={Math.round(foir.future_foir * 100)} />
      <div className="flex items-center justify-between text-body-sm">
        <span className="text-foreground-secondary">Now {Math.round(foir.current_foir * 100)}% with the new EMI</span>
        <span className={`font-medium capitalize ${tone}`}>{foir.risk_band}</span>
      </div>
      <p className="text-body-sm text-foreground-secondary">{foir.explanation}</p>
    </Shell>
  );
}

// ── Balance transfer ──────────────────────────────────────────────────────────
export function BalanceTransferWidget({ bt }: { bt: BalanceTransferResult }) {
  return (
    <Shell icon={<ArrowLeftRight size={15} />} label="Balance transfer">
      {bt.possible ? (
        <>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-display-large font-bold tabular-nums text-status-success">{inr(bt.monthly_savings)}</span>
            <span className="text-body-sm text-foreground-tertiary">/mo saved</span>
          </div>
          <div className="flex items-center gap-3 text-body-sm">
            <span className="rounded-md bg-background-page px-2 py-1 text-foreground-secondary">EMI now {inr(bt.current_emi)}</span>
            <span className="text-foreground-tertiary">→</span>
            <span className="rounded-md bg-status-success/10 px-2 py-1 font-medium text-status-success">new rate {bt.estimated_new_rate}%</span>
          </div>
          <p className="text-body-sm text-foreground-secondary">
            Lifetime interest saved ≈ <span className="font-mono font-medium text-foreground-primary">{inr(bt.total_interest_savings)}</span> across {bt.eligible_lenders.length} eligible lender(s).
          </p>
        </>
      ) : (
        <p className="text-body-md text-foreground-secondary">Your current rate is already competitive — no worthwhile transfer right now.</p>
      )}
    </Shell>
  );
}

// ── Consolidation ─────────────────────────────────────────────────────────────
export function ConsolidationWidget({ c }: { c: ConsolidationResult }) {
  return (
    <Shell icon={<Layers size={15} />} label="Debt consolidation">
      {c.consolidation_possible && c.consolidated ? (
        <>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-display-large font-bold tabular-nums text-status-success">{inr(c.estimated_monthly_savings)}</span>
            <span className="text-body-sm text-foreground-tertiary">/mo saved</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-body-sm">
            <div className="rounded-md bg-background-page p-3">
              <p className="text-foreground-tertiary">Now</p>
              <p className="font-medium text-foreground-primary">{c.current.account_count} debts · {c.current.weighted_avg_rate}%</p>
              <p className="font-mono text-foreground-secondary">{inr(c.current.total_monthly_payment)}/mo</p>
            </div>
            <div className="rounded-md bg-status-success/10 p-3">
              <p className="text-foreground-tertiary">Consolidated</p>
              <p className="font-medium text-foreground-primary">1 loan · {c.consolidated.rate}%</p>
              <p className="font-mono text-status-success">{inr(c.consolidated.monthly_payment)}/mo</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-body-md text-foreground-secondary">Your debts are already efficient — consolidation wouldn&apos;t help right now.</p>
      )}
    </Shell>
  );
}

// ── Recommendations ───────────────────────────────────────────────────────────
export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const meta = PRIORITY_META[rec.priority];
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <div className="flex items-center justify-between gap-2">
        <p className="text-body-md font-semibold text-foreground-primary">{rec.title}</p>
        <span className={`rounded-full px-2 py-0.5 text-label-caps font-semibold uppercase tracking-wider ${meta.tone}`}>{meta.label}</span>
      </div>
      <p className="text-body-sm text-foreground-secondary">{rec.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-body-sm">
        {rec.expected_score_impact > 0 ? <span className="text-status-success">+{rec.expected_score_impact} pts</span> : null}
        {rec.expected_approval_impact !== "—" ? <span className="text-interactive-primary">{rec.expected_approval_impact}</span> : null}
        {rec.expected_savings > 0 ? <span className="text-premium">Save {inr(rec.expected_savings)}</span> : null}
      </div>
    </div>
  );
}

export function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  if (recommendations.length === 0) {
    return <p className="text-body-md text-foreground-secondary">No actions needed — your profile is already strong.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {recommendations.map((r) => (
        <RecommendationCard key={r.id} rec={r} />
      ))}
    </div>
  );
}
