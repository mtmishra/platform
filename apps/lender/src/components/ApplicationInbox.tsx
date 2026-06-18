"use client";

import { useState } from "react";
import { StaggerContainer } from "@leapmoney/ui";
import { ApplicationRow } from "@/components/LenderWidgets";
import type { LenderApplication, AppStatus, LoanProduct, ScoreBand } from "@/lib/lender-demo";

const PRODUCTS: Array<LoanProduct | "All"> = ["All", "Personal Loan", "Home Loan", "Business Loan", "LAP", "Credit Card"];
const STATUSES: Array<AppStatus | "all"> = ["all", "new", "under_review", "approved", "rejected", "disbursed"];
const STATUS_LABEL: Record<string, string> = { all: "All", new: "New", under_review: "Under Review", approved: "Approved", rejected: "Rejected", disbursed: "Disbursed" };
const BANDS: Array<ScoreBand | "All"> = ["All", "Excellent", "Good", "Fair", "Poor"];

function Select<T extends string>({ label, value, options, render, onChange }: { label: string; value: T; options: T[]; render?: (o: T) => string; onChange: (v: T) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-border-token-default bg-background-card px-3 py-2 text-body-md text-foreground-primary"
      >
        {options.map((o) => <option key={o} value={o}>{render ? render(o) : o}</option>)}
      </select>
    </label>
  );
}

export function ApplicationInbox({ applications }: { applications: LenderApplication[] }) {
  const [product, setProduct] = useState<LoanProduct | "All">("All");
  const [status, setStatus] = useState<AppStatus | "all">("all");
  const [band, setBand] = useState<ScoreBand | "All">("All");

  const filtered = applications.filter(
    (a) => (product === "All" || a.product === product) && (status === "all" || a.status === status) && (band === "All" || a.score_band === band),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Select label="Product" value={product} options={PRODUCTS} onChange={setProduct} />
        <Select label="Status" value={status} options={STATUSES} render={(o) => STATUS_LABEL[o] ?? o} onChange={setStatus} />
        <Select label="Score Band" value={band} options={BANDS} onChange={setBand} />
      </div>

      <p className="text-body-sm text-foreground-tertiary">{filtered.length} application{filtered.length === 1 ? "" : "s"}</p>

      <StaggerContainer className="flex flex-col gap-3">
        {filtered.map((a) => <ApplicationRow key={a.id} app={a} />)}
        {filtered.length === 0 ? <p className="rounded-lg border border-border-token-default bg-background-card p-6 text-center text-body-md text-foreground-tertiary">No applications match these filters.</p> : null}
      </StaggerContainer>
    </div>
  );
}
