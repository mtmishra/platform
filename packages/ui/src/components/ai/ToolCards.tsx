"use client";

// ── Tool result components ────────────────────────────────────────────────
// Sprint 29 T14 — UX §3.06–3.10. ToolResultCard is the AI's "receipt of
// truth": every number in chat lives inside one of these frames or carries a
// citation. Score/Match slots WRAP the existing LeapScoreCard/LeapMatchCard
// (Design QA rule — no redraw, no duplicate components).

import React from "react";
import { ExternalLink, FileText, Lightbulb, RotateCcw } from "lucide-react";
import { LeapScoreCard, type LeapScoreCardProps } from "../LeapScoreCard";
import { LeapMatchCard, type LeapMatchCardProps } from "../LeapMatchCard";
import { StatusBadge, type StatusBadgeProps } from "../badges";

// ── ToolResultCard — generic frame (UX §3.06) ────────────────────────────────
export interface ToolResultCardProps {
  /** label-caps eyebrow, e.g. "LEAPSCORE™ · LIVE DATA" */
  eyebrow: string;
  timestamp?: string;
  state?: "success" | "loading" | "error";
  errorMessage?: string;
  onRetry?: () => void;
  /** "Open in app →" deep link into an existing route */
  href?: string;
  hrefLabel?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ToolResultCard({
  eyebrow,
  timestamp,
  state = "success",
  errorMessage,
  onRetry,
  href,
  hrefLabel = "Open in app",
  children,
  className = "",
}: ToolResultCardProps) {
  return (
    <div className={`w-full rounded-lg border border-border-token-default border-l-[3px] border-l-teal-accent bg-background-card p-3.5 shadow-1 ${className}`}>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="text-label-caps font-bold uppercase text-teal-accent">{eyebrow}</span>
        {timestamp && <span className="text-label-caps uppercase text-foreground-tertiary">{timestamp}</span>}
      </div>

      {state === "loading" && (
        <div className="space-y-2" aria-label="Loading tool result">
          <div className="h-3 w-3/5 animate-pulse rounded bg-teal-accent/10 motion-reduce:animate-none" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-teal-accent/10 motion-reduce:animate-none" />
        </div>
      )}
      {state === "error" && (
        <div className="flex items-center gap-2 text-body-md text-foreground-primary" role="alert">
          {errorMessage ?? "Couldn't fetch this — the data source didn't respond."}
          {onRetry && (
            <button type="button" onClick={onRetry} className="inline-flex items-center gap-1 font-semibold text-interactive-primary hover:underline">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Retry
            </button>
          )}
        </div>
      )}
      {state === "success" && children}

      {state === "success" && href && (
        <a href={href} className="mt-2.5 inline-flex items-center gap-1 text-body-sm font-semibold text-interactive-primary hover:underline">
          {hrefLabel} <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      )}
    </div>
  );
}

// ── CitationCard — source chip (UX §3.10) ────────────────────────────────────
export function CitationCard({ source, className = "" }: { source: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-border-token-default bg-background-page px-2.5 py-0.5 text-body-sm text-foreground-secondary ${className}`}>
      <FileText className="h-3 w-3 text-teal-accent" aria-hidden />
      {source}
    </span>
  );
}

// ── RecommendationCard — AI-synthesized advice (UX §3.09) ────────────────────
export interface RecommendationItem {
  text: string;
  /** e.g. "+9–14 pts" or "Save ₹12,252" */
  impact?: string;
  impactTone?: "positive" | "negative";
}

export interface RecommendationCardProps {
  title: string;
  items: RecommendationItem[];
  citations?: string[];
  className?: string;
}

export function RecommendationCard({ title, items, citations = [], className = "" }: RecommendationCardProps) {
  return (
    <div className={`w-full rounded-lg border border-border-token-default bg-teal-accent/[0.08] p-3.5 ${className}`}>
      <h4 className="mb-2 flex items-center gap-1.5 text-h3 font-semibold text-foreground-primary">
        <Lightbulb className="h-4 w-4 text-teal-accent" aria-hidden /> {title}
      </h4>
      <ul className="ml-4 list-disc space-y-1.5 text-body-md text-foreground-primary">
        {items.map((item, i) => (
          <li key={i}>
            {item.text}{" "}
            {item.impact && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 font-mono text-body-sm font-bold ${
                  item.impactTone === "negative" ? "bg-status-danger/10 text-status-danger" : "bg-status-success/10 text-status-success"
                }`}
              >
                {item.impact}
              </span>
            )}
          </li>
        ))}
      </ul>
      {citations.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {citations.map((c) => (
            <CitationCard key={c} source={c} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── AIScoreSlot — wraps the EXISTING LeapScoreCard (UX §3.07) ────────────────
export interface AIScoreSlotProps extends LeapScoreCardProps {
  timestamp?: string;
  href?: string;
}

export function AIScoreSlot({ timestamp, href = "/credit-report/report", ...scoreProps }: AIScoreSlotProps) {
  return (
    <ToolResultCard eyebrow="LeapScore™ · Live data" {...(timestamp !== undefined ? { timestamp } : {})} href={href} hrefLabel="Full report">
      <LeapScoreCard {...scoreProps} />
    </ToolResultCard>
  );
}

// ── AIMatchSlot — wraps the EXISTING LeapMatchCard (UX §3.08) ────────────────
export interface AIMatchSlotProps extends Omit<LeapMatchCardProps, "documents"> {
  documents?: LeapMatchCardProps["documents"];
  timestamp?: string;
}

export function AIMatchSlot({ timestamp, documents = [], ...matchProps }: AIMatchSlotProps) {
  return (
    <ToolResultCard eyebrow="LeapMatch · Fit-ranked" {...(timestamp !== undefined ? { timestamp } : {})} href="/matches" hrefLabel="All matches">
      <LeapMatchCard {...matchProps} documents={documents} />
    </ToolResultCard>
  );
}

// ── StatusCard — application status in chat (UX LM/status patterns) ─────────
export interface StatusStep {
  label: string;
  state: "done" | "current" | "pending";
}

export interface StatusCardProps {
  applicationRef: string;
  lenderName: string;
  status: StatusBadgeProps["status"];
  steps: StatusStep[];
  note?: string;
  className?: string;
}

export function StatusCard({ applicationRef, lenderName, status, steps, note, className = "" }: StatusCardProps) {
  const glyph = { done: "✅", current: "🕑", pending: "○" } as const;
  return (
    <ToolResultCard eyebrow={`Application · ${applicationRef}`} timestamp={lenderName} className={className} href={`/applications`} hrefLabel="Open application">
      <div className="mb-2"><StatusBadge status={status} /></div>
      <div className="space-y-1 text-body-md leading-relaxed text-foreground-primary">
        {steps.map((step) => (
          <div key={step.label} className={step.state === "pending" ? "text-foreground-tertiary" : step.state === "current" ? "font-semibold" : ""}>
            <span aria-hidden>{glyph[step.state]}</span> {step.label}
          </div>
        ))}
      </div>
      {note && <p className="mt-2 text-body-sm text-foreground-secondary">{note}</p>}
    </ToolResultCard>
  );
}
