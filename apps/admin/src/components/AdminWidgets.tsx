import React from "react";
import { inr } from "@/lib/admin-demo";

export { inr };

export function KpiCard({ icon, label, value, sub, tone = "text-foreground-primary" }: { icon?: React.ReactNode; label: string; value: string; sub?: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">{icon} {label}</span>
      <p className={`break-words font-mono text-h1 font-bold tabular-nums sm:text-display-large ${tone}`}>{value}</p>
      {sub ? <p className="text-body-sm text-foreground-tertiary">{sub}</p> : null}
    </div>
  );
}

export function Panel({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-h3 font-semibold text-foreground-primary">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function BarList({ rows, max, colorClass }: { rows: Array<{ label: string; count: number; tone?: string }>; max?: number; colorClass?: string }) {
  const m = max ?? Math.max(...rows.map((r) => r.count), 1);
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-32 flex-shrink-0 text-body-sm text-foreground-secondary">{r.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-background-page">
            <div className={`h-full origin-left rounded-full ${r.tone ?? colorClass ?? "bg-interactive-primary"}`} style={{ transform: `scaleX(${r.count / m})` }} />
          </div>
          <span className="w-10 flex-shrink-0 text-right font-mono text-body-sm tabular-nums text-foreground-primary">{r.count}</span>
        </div>
      ))}
    </div>
  );
}

export function ColumnChart({ data, format }: { data: Array<{ label: string; value: number }>; format?: (n: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-4 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
          <span className="font-mono text-label-caps tabular-nums text-foreground-secondary">{format ? format(d.value) : d.value}</span>
          <div className="flex h-28 w-full items-end justify-center">
            <div className="w-8 rounded-t-md bg-interactive-primary/70" style={{ height: `${15 + (d.value / max) * 85}%` }} />
          </div>
          <span className="text-label-caps uppercase text-foreground-tertiary">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const STATUS_CLS: Record<string, string> = {
  new: "bg-interactive-primary/10 text-interactive-primary",
  under_review: "bg-status-warning/10 text-status-warning",
  approved: "bg-status-success/10 text-status-success",
  rejected: "bg-status-danger/10 text-status-danger",
  disbursed: "bg-status-success text-foreground-on-dark",
  Active: "bg-status-success/10 text-status-success",
  Pending: "bg-status-warning/10 text-status-warning",
  Suspended: "bg-status-danger/10 text-status-danger",
};
const STATUS_LABEL: Record<string, string> = { new: "New", under_review: "Under Review", approved: "Approved", rejected: "Rejected", disbursed: "Disbursed" };

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider ${STATUS_CLS[status] ?? "bg-background-page text-foreground-secondary"}`}>{STATUS_LABEL[status] ?? status}</span>;
}
