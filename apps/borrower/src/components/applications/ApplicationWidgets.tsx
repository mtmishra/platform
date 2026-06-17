import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, Circle, Clock, ShieldCheck, Upload, Sparkles, Bell } from "lucide-react";
import type { ApplicationStatus } from "@leapmoney/outcomes";
import type { DemoApplication, KycStatus, TimelineStep } from "@/lib/applications-demo";

const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

const STATUS_META: Record<ApplicationStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-background-page text-foreground-secondary" },
  submitted: { label: "Submitted", cls: "bg-interactive-primary/10 text-interactive-primary" },
  under_review: { label: "Under Review", cls: "bg-status-warning/10 text-status-warning" },
  approved: { label: "Approved", cls: "bg-status-success/10 text-status-success" },
  rejected: { label: "Rejected", cls: "bg-status-danger/10 text-status-danger" },
  disbursed: { label: "Disbursed", cls: "bg-status-success text-foreground-on-dark" },
  withdrawn: { label: "Withdrawn", cls: "bg-background-page text-foreground-tertiary" },
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const m = STATUS_META[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider ${m.cls}`}>{m.label}</span>;
}

// ── Application list card ──────────────────────────────────────────────────────
export function ApplicationCard({ app }: { app: DemoApplication }) {
  const updated = new Date(app.last_updated).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return (
    <Link
      href={`/applications/${app.id}`}
      className="group flex items-center gap-4 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1 transition-shadow duration-normal ease-standard hover:shadow-2"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-interactive-primary/10 text-interactive-primary">
        <FileText size={20} />
      </span>
      <div className="flex-1">
        <p className="text-body-md font-semibold text-foreground-primary">{app.lender_name} · {inr(app.amount)}</p>
        <p className="text-body-sm text-foreground-tertiary">{app.id} · {app.loan_type} · Updated {updated}</p>
      </div>
      <StatusBadge status={app.status} />
    </Link>
  );
}

// ── Status timeline ────────────────────────────────────────────────────────────
export function ApplicationTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        const icon = step.status === "done" ? <CheckCircle2 size={18} /> : step.status === "current" ? <Clock size={18} /> : <Circle size={18} />;
        const tone = step.status === "done" ? "text-status-success" : step.status === "current" ? "text-interactive-primary" : "text-foreground-tertiary";
        return (
          <li key={step.key} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={tone}>{icon}</span>
              {!last ? <span className={`my-1 w-px flex-1 ${step.status === "done" ? "bg-status-success/40" : "bg-border-token-default"}`} style={{ minHeight: 24 }} /> : null}
            </div>
            <div className={`pb-6 ${last ? "pb-0" : ""}`}>
              <p className={`text-body-md font-medium ${step.status === "pending" ? "text-foreground-tertiary" : "text-foreground-primary"}`}>{step.label}</p>
              {step.at ? <p className="text-body-sm text-foreground-tertiary">{new Date(step.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ── Document vault ─────────────────────────────────────────────────────────────
export function DocumentVault({ documents }: { documents: DemoApplication["documents"] }) {
  return (
    <div className="flex flex-col gap-2">
      {documents.map((d) => (
        <div key={d.type} className="flex items-center justify-between rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
          <span className="inline-flex items-center gap-2 text-body-md text-foreground-primary">
            <Upload size={16} className="text-foreground-tertiary" /> {d.type}
          </span>
          {d.status === "uploaded" ? (
            <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-status-success"><CheckCircle2 size={15} /> Uploaded</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-background-page px-2.5 py-1 text-body-sm font-medium text-status-warning">Missing · Upload</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── KYC card ───────────────────────────────────────────────────────────────────
const KYC_META: Record<KycStatus, { label: string; tone: string; pct: number }> = {
  pending: { label: "Pending", tone: "text-status-warning", pct: 0.1 },
  in_progress: { label: "In Progress", tone: "text-interactive-primary", pct: 0.55 },
  verified: { label: "Verified", tone: "text-status-success", pct: 1 },
};

export function KycCard({ status }: { status: KycStatus }) {
  const m = KYC_META[status];
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary"><ShieldCheck size={15} /> KYC</span>
        <span className={`text-body-md font-semibold ${m.tone}`}>{m.label}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-background-page">
        <div className={`h-full origin-left rounded-full ${status === "verified" ? "bg-status-success" : status === "in_progress" ? "bg-interactive-primary" : "bg-status-warning"}`} style={{ transform: `scaleX(${m.pct})` }} />
      </div>
      <p className="text-body-sm text-foreground-secondary">
        {status === "verified" ? "Identity verified via video KYC." : status === "in_progress" ? "Your video KYC is being processed." : "Complete KYC to proceed with your application."}
      </p>
    </div>
  );
}

// ── Approval card ──────────────────────────────────────────────────────────────
export function ApprovalCard({ app }: { app: DemoApplication }) {
  const tone = app.approval_probability >= 70 ? "text-status-success" : app.approval_probability >= 40 ? "text-status-warning" : "text-status-danger";
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-foreground-tertiary"><Sparkles size={15} /> Approval simulation</span>
      <div className="flex items-baseline gap-2">
        <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>{app.approval_probability}%</span>
        <span className="text-body-sm text-foreground-tertiary capitalize">{app.confidence} confidence</span>
      </div>
      <p className="text-body-sm text-foreground-secondary">Expected decision in {app.expected_decision_time}.</p>
      <p className="text-body-sm text-foreground-secondary"><span className="font-medium text-foreground-primary">Why this lender:</span> {app.match_reason}</p>
    </div>
  );
}

// ── Notifications ──────────────────────────────────────────────────────────────
export function ApplicationNotifications({ app }: { app: DemoApplication }) {
  const items: Array<{ label: string; done: boolean }> = [
    { label: "Application submitted", done: app.status !== "draft" },
    { label: "Documents verified", done: ["under_review", "approved", "rejected", "disbursed"].includes(app.status) },
    { label: "Under review", done: ["under_review", "approved", "rejected", "disbursed"].includes(app.status) },
    { label: app.status === "rejected" ? "Decision: not approved" : "Approved", done: ["approved", "rejected", "disbursed"].includes(app.status) },
    { label: "Disbursed", done: app.status === "disbursed" },
  ];
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <div className="mb-3 flex items-center gap-2">
        <Bell size={16} className="text-foreground-secondary" />
        <h3 className="text-h3 font-semibold text-foreground-primary">Notifications</h3>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((n) => (
          <li key={n.label} className={`flex items-center gap-2 text-body-sm ${n.done ? "text-foreground-primary" : "text-foreground-tertiary"}`}>
            {n.done ? <CheckCircle2 size={15} className="text-status-success" /> : <Circle size={15} />}
            {n.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
