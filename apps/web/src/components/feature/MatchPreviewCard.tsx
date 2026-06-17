import React from "react";

export type MatchConfidence = "high" | "medium" | "low";

export interface MatchPreviewCardProps {
  lender: string;
  /** Approval probability percentage (5–95 per the Sprint 8 engine). */
  approvalPct: number;
  confidence: MatchConfidence;
  rate: string;
  emi: string;
  /** Highlights the top-ranked offer with the premium gold "Best Match" badge. */
  bestMatch?: boolean;
  /** Render on a dark feature surface (adjusts text colors). */
  onDark?: boolean;
}

const CONFIDENCE_META: Record<MatchConfidence, { label: string; tone: string; dot: string }> = {
  high: { label: "High", tone: "text-status-success", dot: "bg-status-success" },
  medium: { label: "Medium", tone: "text-status-warning", dot: "bg-status-warning" },
  low: { label: "Low", tone: "text-status-danger", dot: "bg-status-danger" },
};

/**
 * Sample matched-lender card: approval probability, confidence indicator, rate,
 * EMI, and the premium "Best Match" badge. Illustrative marketing component.
 */
export function MatchPreviewCard({
  lender,
  approvalPct,
  confidence,
  rate,
  emi,
  bestMatch = false,
  onDark = false,
}: MatchPreviewCardProps) {
  const meta = CONFIDENCE_META[confidence];
  const surface = onDark
    ? "bg-white/5 border-white/10"
    : "bg-background-card border-border-token-default";
  const heading = onDark ? "text-foreground-on-dark" : "text-foreground-primary";
  const muted = onDark ? "text-white/60" : "text-foreground-tertiary";

  return (
    <div
      className={[
        "relative flex flex-col gap-3 rounded-lg border p-5 shadow-1 transition-shadow duration-normal ease-standard hover:shadow-2",
        surface,
        bestMatch ? "ring-1 ring-premium/50" : "",
      ].join(" ")}
    >
      {bestMatch ? (
        <span className="absolute -top-2.5 left-5 inline-flex items-center rounded-full bg-premium px-2.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider text-navy-deep">
          Best Match
        </span>
      ) : null}

      <div className="flex items-center justify-between">
        <p className={`text-h3 font-semibold ${heading}`}>{lender}</p>
        <span className={`inline-flex items-center gap-1.5 text-body-sm font-medium ${meta.tone}`}>
          <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      <div>
        <span className={`font-mono text-display-large font-bold tabular-nums ${meta.tone}`}>{approvalPct}%</span>
        <span className={`ml-2 text-body-sm ${muted}`}>approval odds</span>
      </div>

      <div className={`flex items-center justify-between text-body-sm ${muted}`}>
        <span>Rate {rate}</span>
        <span>EMI {emi}</span>
      </div>
    </div>
  );
}
