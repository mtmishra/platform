import React from "react";
import { Check } from "lucide-react";

export type FlowStepKey = "details" | "consent" | "fetching" | "report";

const STEPS: Array<{ key: FlowStepKey; label: string }> = [
  { key: "details", label: "Details" },
  { key: "consent", label: "Consent" },
  { key: "fetching", label: "Fetching" },
  { key: "report", label: "Report" },
];

/** Compact progress indicator across the credit-pull flow. Mobile-first. */
export function FlowSteps({ current }: { current: FlowStepKey }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <ol className="mb-8 flex items-center gap-2">
      {STEPS.map((step, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={step.key} className="flex flex-1 items-center gap-2">
            <span
              className={[
                "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-body-sm font-semibold",
                done
                  ? "bg-status-success text-foreground-on-dark"
                  : active
                    ? "bg-interactive-primary text-foreground-on-dark"
                    : "border border-border-token-default bg-background-card text-foreground-tertiary",
              ].join(" ")}
            >
              {done ? <Check size={14} /> : i + 1}
            </span>
            <span className={`hidden text-body-sm font-medium sm:inline ${active ? "text-foreground-primary" : "text-foreground-tertiary"}`}>
              {step.label}
            </span>
            {i < STEPS.length - 1 ? <span className="h-px flex-1 bg-border-token-default" aria-hidden /> : null}
          </li>
        );
      })}
    </ol>
  );
}
