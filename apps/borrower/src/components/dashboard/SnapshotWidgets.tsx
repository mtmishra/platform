import React from "react";
import Link from "next/link";
import { Gauge, HeartPulse, Sparkles, BarChart3, ArrowRight } from "lucide-react";
import type { CreditHealthResult, LeapScoreResult } from "@leapmoney/credit";
import type { MatchResult } from "@leapmoney/match";
import type { AnalyticsSummary } from "@leapmoney/outcomes";

const BAND_TONE: Record<string, string> = {
  Excellent: "text-status-success",
  "Very Good": "text-status-success",
  Good: "text-status-success",
  Average: "text-status-warning",
  Fair: "text-status-warning",
  "Below Average": "text-status-warning",
  Poor: "text-status-danger",
};

function SnapshotCard({
  icon,
  label,
  href,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1 transition-shadow duration-normal ease-standard hover:shadow-2"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">
          {icon}
          {label}
        </span>
        <ArrowRight size={16} className="text-foreground-tertiary transition-transform duration-fast group-hover:translate-x-0.5" />
      </div>
      {children}
    </Link>
  );
}

export function CreditSnapshot({ score }: { score: LeapScoreResult }) {
  const tone = BAND_TONE[score.score_band] ?? "text-interactive-primary";
  return (
    <SnapshotCard icon={<Gauge size={15} />} label="LeapScore" href="/health">
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>
          {score.leapscore ?? "—"}
        </span>
        <span className="text-body-sm text-foreground-tertiary">/ 900</span>
      </div>
      <p className={`text-body-md font-semibold ${tone}`}>{score.score_band}</p>
      {score.what_is_helping[0] ? (
        <p className="text-body-sm text-foreground-secondary">✓ {score.what_is_helping[0].detail}</p>
      ) : null}
    </SnapshotCard>
  );
}

export function HealthSnapshot({ health }: { health: CreditHealthResult }) {
  const tone = BAND_TONE[health.health_band] ?? "text-interactive-primary";
  const risks = health.risk_indicators.length;
  return (
    <SnapshotCard icon={<HeartPulse size={15} />} label="Credit Health" href="/health">
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>{health.health_score}</span>
        <span className="text-body-sm text-foreground-tertiary">/ 100</span>
      </div>
      <p className={`text-body-md font-semibold ${tone}`}>{health.health_band}</p>
      <p className="text-body-sm text-foreground-secondary">
        {risks === 0 ? "No active risks" : `${risks} risk${risks > 1 ? "s" : ""} to address`}
      </p>
    </SnapshotCard>
  );
}

export function MatchSnapshot({ match }: { match: MatchResult }) {
  const best = match.matched_lenders[0];
  return (
    <SnapshotCard icon={<Sparkles size={15} />} label="LeapMatch" href="/health">
      {best ? (
        <>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-display-large font-bold tabular-nums text-status-success">
              {best.approval_probability}%
            </span>
            <span className="text-body-sm text-foreground-tertiary">best odds</span>
          </div>
          <p className="text-body-md font-semibold text-foreground-primary">{best.lender_name}</p>
          <p className="text-body-sm text-foreground-secondary">
            {match.matched_lenders.length} lenders matched your profile
          </p>
        </>
      ) : (
        <p className="text-body-md text-foreground-secondary">No matches yet — complete your profile.</p>
      )}
    </SnapshotCard>
  );
}

export function OutcomeSnapshot({ analytics }: { analytics: AnalyticsSummary }) {
  return (
    <SnapshotCard icon={<BarChart3 size={15} />} label="Your Outcomes" href="/health">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-display-large font-bold tabular-nums text-interactive-primary">
          {analytics.approval_rate}%
        </span>
        <span className="text-body-sm text-foreground-tertiary">approval rate</span>
      </div>
      <p className="text-body-sm text-foreground-secondary">
        {analytics.total_applications} applications · {analytics.conversion_rate}% disbursed
      </p>
    </SnapshotCard>
  );
}
