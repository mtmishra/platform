import { type ReactNode } from "react";
import { inr } from "@/lib/admin-demo";

export { inr };

export function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
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
