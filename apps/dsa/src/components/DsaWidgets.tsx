import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import { ConfidenceBadge, KpiValue, type Confidence } from "@leapmoney/ui";
import type { Lead, LeadStatus } from "@/lib/dsa-demo";

export const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

const STATUS_CLS: Record<LeadStatus, string> = {
  New: "bg-interactive-primary/10 text-interactive-primary",
  Qualified: "bg-interactive-primary/10 text-interactive-primary",
  Matched: "bg-premium/15 text-premium",
  Applied: "bg-status-warning/10 text-status-warning",
  Approved: "bg-status-success/10 text-status-success",
  Rejected: "bg-status-danger/10 text-status-danger",
  Disbursed: "bg-status-success text-foreground-on-dark",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider ${STATUS_CLS[status]}`}>{status}</span>;
}

const confidence = (odds: number): Confidence =>
  odds >= 75 ? "high" : odds >= 55 ? "medium" : "low";

export function StatCard({ icon, label, value, sub, tone = "text-foreground-primary" }: { icon: ReactNode; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">{icon} {label}</span>
      <KpiValue value={value} className={`block ${tone}`} />
      {sub ? <p className="text-body-sm text-foreground-tertiary">{sub}</p> : null}
    </div>
  );
}

export function LeadRow({ lead }: { lead: Lead }) {
  const updated = new Date(lead.last_updated).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return (
    <Link href={`/leads/${lead.id}`} className="group flex items-center gap-4 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1 transition-shadow duration-normal ease-standard hover:shadow-2">
      <div className="flex-1 min-w-0">
        <p className="truncate text-body-md font-semibold text-foreground-primary">{lead.borrower_name}</p>
        <p className="truncate text-body-sm text-foreground-tertiary">{lead.id} · {lead.product} · {inr(lead.amount)} · {updated}</p>
      </div>
      <div className="hidden sm:flex items-center gap-2">
        {lead.lender ? <p className="text-body-sm text-foreground-secondary">{lead.lender}</p> : <p className="text-body-sm text-foreground-tertiary">—</p>}
        <ConfidenceBadge level={confidence(lead.approval_odds)} />
      </div>
      <LeadStatusBadge status={lead.status} />
    </Link>
  );
}

export function Pipeline({ stages }: { stages: Array<{ stage: string; count: number }> }) {
  const max = Math.max(...stages.map((s) => s.count), 1);
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1 sm:flex-row sm:items-center sm:gap-2">
      {stages.map((s, i) => (
        <Fragment key={s.stage}>
          <div className="flex flex-1 flex-col gap-2 p-2">
            <span className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{s.count}</span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-background-page">
              <div className="h-full origin-left rounded-full bg-interactive-primary/70" style={{ transform: `scaleX(${s.count / max})` }} />
            </div>
            <span className="text-body-sm font-medium text-foreground-secondary">{s.stage}</span>
          </div>
          {i < stages.length - 1 ? <span className="hidden self-center text-foreground-tertiary sm:block">→</span> : null}
        </Fragment>
      ))}
    </div>
  );
}
