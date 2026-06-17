import React from "react";
import { Check } from "lucide-react";

export type JourneyStepKey = "report" | "leapscore" | "health" | "match" | "apply";

const STEPS: Array<{ key: JourneyStepKey; label: string }> = [
  { key: "report", label: "Credit Report" },
  { key: "leapscore", label: "LeapScore" },
  { key: "health", label: "Credit Health" },
  { key: "match", label: "LeapMatch" },
  { key: "apply", label: "Apply" },
];

/**
 * End-to-end credit journey: Credit Report → LeapScore → Health → Match → Apply.
 * Steps before `current` show complete; `current` is highlighted. Mobile-first:
 * stacks vertically on small screens, horizontal row from sm up.
 */
export function CreditJourneyTimeline({ current }: { current: JourneyStepKey }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0">
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const circle = done
          ? "bg-status-success text-foreground-on-dark"
          : active
            ? "bg-interactive-primary text-foreground-on-dark"
            : "bg-background-page text-foreground-tertiary border border-border-token-default";
        return (
          <li key={step.key} className="flex items-center gap-3 sm:flex-1 sm:flex-col sm:gap-2 sm:text-center">
            <div className="flex items-center gap-3 sm:w-full sm:flex-col">
              <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-body-sm font-semibold ${circle}`}>
                {done ? <Check size={16} /> : i + 1}
              </span>
              <span
                className={[
                  "text-body-sm font-medium",
                  active ? "text-foreground-primary" : done ? "text-foreground-secondary" : "text-foreground-tertiary",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 ? (
              <span className="ml-4 hidden h-px flex-1 bg-border-token-default sm:block sm:w-full" aria-hidden />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
