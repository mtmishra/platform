import { type ReactNode } from "react";
import Link from "next/link";
import { ConfidenceBadge, KpiValue } from "@leapmoney/ui";
import type { AppStatus, LenderApplication, ScoreBand } from "@/lib/lender-demo";

export const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

const STATUS_META: Record<AppStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-interactive-primary/10 text-interactive-primary" },
  under_review: { label: "Under Review", cls: "bg-status-warning/10 text-status-warning" },
  approved: { label: "Approved", cls: "bg-status-success/10 text-status-success" },
  rejected: { label: "Rejected", cls: "bg-status-danger/10 text-status-danger" },
  disbursed: { label: "Disbursed", cls: "bg-status-success text-foreground-on-dark" },
};

const BAND_TONE: Record<ScoreBand, string> = {
  Excellent: "text-status-success",
  Good: "text-status-success",
  Fair: "text-status-warning",
  Poor: "text-status-danger",
};

export function StatusBadge({ status }: { status: AppStatus }) {
  const m = STATUS_META[status];
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider ${m.cls}`}>{m.label}</span>;
}

export function ScoreBandBadge({ band }: { band: ScoreBand }) {
  return <span className={`text-body-sm font-semibold ${BAND_TONE[band]}`}>{band}</span>;
}

export function KpiCard({ icon, label, value, sub, tone = "text-foreground-primary" }: { icon?: ReactNode; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">{icon} {label}</span>
      <KpiValue value={value} className={`block ${tone}`} />
      {sub ? <p className="text-body-sm text-foreground-tertiary">{sub}</p> : null}
    </div>
  );
}

export function ApplicationRow({ app }: { app: LenderApplication }) {
  const updated = new Date(app.last_updated).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return (
    <Link href={`/applications/${app.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1 transition-shadow duration-normal ease-standard hover:shadow-2 sm:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_auto]">
      <div className="min-w-0">
        <p className="truncate text-body-md font-semibold text-foreground-primary">{app.applicant}</p>
        <p className="truncate text-body-sm text-foreground-tertiary">{app.id} · {app.product} · {app.city} · {updated}</p>
      </div>
      <div className="hidden sm:block text-right"><p className="font-mono text-body-md font-medium text-foreground-primary">{inr(app.amount)}</p><p className="text-body-sm text-foreground-tertiary">{app.source}</p></div>
      <div className="hidden text-right sm:block"><p className="font-mono text-body-md font-medium text-foreground-primary">{app.leapscore}</p><p className="text-body-sm"><span className={BAND_TONE[app.score_band]}>{app.score_band}</span></p></div>
      <div className="hidden text-right sm:block"><p className="font-mono text-body-md font-medium text-foreground-primary">{app.approval_probability}%</p><ConfidenceBadge level={app.confidence} /></div>
      <StatusBadge status={app.status} />
    </Link>
  );
}

