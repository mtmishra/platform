"use client";

import React from "react";
import { StatusBadge, inr } from "@/components/AdminWidgets";
import type { AdminApplication, AppStatus, LeadSource } from "@/lib/admin-demo";

const STATUSES: Array<AppStatus | "all"> = ["all", "new", "under_review", "approved", "rejected", "disbursed"];
const STATUS_LABEL: Record<string, string> = { all: "All", new: "New", under_review: "Under Review", approved: "Approved", rejected: "Rejected", disbursed: "Disbursed" };
const SOURCES: Array<LeadSource | "All"> = ["All", "Borrower Direct", "DSA", "Referral", "Organic"];

export function ApplicationsTable({ applications }: { applications: AdminApplication[] }) {
  const [status, setStatus] = React.useState<AppStatus | "all">("all");
  const [source, setSource] = React.useState<LeadSource | "All">("All");
  const filtered = applications.filter((a) => (status === "all" || a.status === status) && (source === "All" || a.source === source));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as AppStatus | "all")} className="rounded-md border border-border-token-default bg-background-card px-3 py-2 text-body-md text-foreground-primary">
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Source</span>
          <select value={source} onChange={(e) => setSource(e.target.value as LeadSource | "All")} className="rounded-md border border-border-token-default bg-background-card px-3 py-2 text-body-md text-foreground-primary">
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
      </div>

      <p className="text-body-sm text-foreground-tertiary">{filtered.length} application{filtered.length === 1 ? "" : "s"}</p>

      <div className="flex flex-col gap-2">
        {filtered.map((a) => (
          <div key={a.id} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1 sm:grid-cols-[1.4fr_1fr_0.9fr_auto]">
            <div className="min-w-0"><p className="truncate text-body-md font-semibold text-foreground-primary">{a.applicant}</p><p className="truncate text-body-sm text-foreground-tertiary">{a.id} · {a.product} · {a.updated}</p></div>
            <div className="hidden text-right sm:block"><p className="font-mono text-body-md font-medium text-foreground-primary">{inr(a.amount)}</p><p className="text-body-sm text-foreground-tertiary">{a.lender}</p></div>
            <span className="hidden text-right text-body-sm text-foreground-secondary sm:block">{a.source}</span>
            <StatusBadge status={a.status} />
          </div>
        ))}
        {filtered.length === 0 ? <p className="rounded-lg border border-border-token-default bg-background-card p-6 text-center text-body-md text-foreground-tertiary">No applications match these filters.</p> : null}
      </div>
    </div>
  );
}
