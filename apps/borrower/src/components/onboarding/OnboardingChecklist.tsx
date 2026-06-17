import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { OnboardingStep } from "@leapmoney/supabase";

const STEPS: { key: OnboardingStep; label: string; description: string }[] = [
  { key: "registered", label: "Create your account", description: "Sign in with email — done." },
  { key: "profile", label: "Complete your profile", description: "Add your personal and employment details." },
  { key: "consent", label: "Provide consent", description: "Review and accept data-processing consent (DPDP)." },
  { key: "complete", label: "You're ready", description: "Explore your dashboard and check your eligibility." },
];

const ORDER: OnboardingStep[] = ["registered", "profile", "consent", "complete"];

export function OnboardingChecklist({ current }: { current: OnboardingStep }) {
  const currentIndex = ORDER.indexOf(current);

  return (
    <ol className="flex flex-col gap-3">
      {STEPS.map((step, index) => {
        const done = index < currentIndex || current === "complete";
        return (
          <li
            key={step.key}
            className="flex items-start gap-3 rounded-lg border border-border-token-default bg-background-card p-4"
          >
            {done ? (
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-status-success" />
            ) : (
              <Circle size={20} className="mt-0.5 shrink-0 text-foreground-tertiary" />
            )}
            <div>
              <p className="text-body-lg font-medium text-foreground-primary">{step.label}</p>
              <p className="text-body-sm text-foreground-tertiary">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
