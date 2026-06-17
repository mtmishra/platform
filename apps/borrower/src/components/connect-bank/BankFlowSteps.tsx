import React from "react";
import { Check } from "lucide-react";

export type BankFlowStepKey = "select" | "consent" | "fetching";

const STEPS: Array<{ key: BankFlowStepKey; label: string }> = [
  { key: "select", label: "Select bank" },
  { key: "consent", label: "Consent" },
  { key: "fetching", label: "Connecting" },
];

/** Compact progress indicator across the bank-connection (AA) flow. Mobile-first. */
export function BankFlowSteps({ current }: { current: BankFlowStepKey }) {
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
