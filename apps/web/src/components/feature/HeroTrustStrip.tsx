import React from "react";
import { ShieldCheck, BellOff, Landmark } from "lucide-react";

const BUREAUS = ["CIBIL", "Experian", "CRIF", "Equifax"] as const;

/**
 * Above-the-fold trust strip: bureau logo placeholders + the three headline
 * promises (no spam, encryption, RBI-regulated). R1 §13 — proof above the fold.
 */
export function HeroTrustStrip() {
  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">
          Bureau data from
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {BUREAUS.map((name) => (
            <span
              key={name}
              className="rounded-md border border-border-token-default bg-background-card px-2.5 py-1 text-body-sm font-semibold text-foreground-secondary"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-body-sm text-foreground-secondary">
        <span className="inline-flex items-center gap-1.5">
          <BellOff size={15} className="text-interactive-primary" />
          No spam calls. Ever.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={15} className="text-interactive-primary" />
          Bank-grade 256-bit encryption
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Landmark size={15} className="text-interactive-primary" />
          RBI-regulated lenders
        </span>
      </div>
    </div>
  );
}
