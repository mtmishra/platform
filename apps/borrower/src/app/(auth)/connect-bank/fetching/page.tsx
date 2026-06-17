"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heading, Paragraph } from "@leapmoney/ui";
import { Check, Loader2 } from "lucide-react";
import { BankFlowSteps } from "@/components/connect-bank/BankFlowSteps";

const STEPS = [
  "Connecting to Account Aggregator",
  "Fetching bank statements",
  "Analyzing cash flow",
  "Calculating FOIR",
  "Updating your LeapScore",
] as const;

const STEP_MS = 800;

export default function ConnectBankFetchingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= STEPS.length; i += 1) {
      timers.push(setTimeout(() => active && setStep(i), STEP_MS * i));
    }
    timers.push(
      setTimeout(() => {
        if (active) router.replace("/cash-flow");
      }, STEP_MS * (STEPS.length + 1)),
    );
    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
  }, [router]);

  const progress = Math.round((step / STEPS.length) * 100);

  return (
    <div className="mx-auto max-w-card-md">
      <BankFlowSteps current="fetching" />
      <Heading level={1} size="display-large" className="mb-2">Connecting your bank</Heading>
      <Paragraph color="secondary" className="mb-8">
        Securely fetching and analysing your bank cash-flow via the Account Aggregator. This takes a few seconds.
      </Paragraph>

      <div className="rounded-xl border border-border-token-default bg-background-card p-6 shadow-1">
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-background-page">
          <div
            className="h-full origin-left rounded-full bg-interactive-primary"
            style={{ transform: `scaleX(${progress / 100})`, transition: "transform 500ms cubic-bezier(0,0,0.2,1)" }}
          />
        </div>
        <ul className="flex flex-col gap-4">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                    done ? "bg-status-success text-foreground-on-dark" : active ? "bg-interactive-primary/10 text-interactive-primary" : "bg-background-page text-foreground-tertiary",
                  ].join(" ")}
                >
                  {done ? <Check size={15} /> : active ? <Loader2 size={15} className="animate-spin" /> : i + 1}
                </span>
                <span className={done || active ? "text-body-md font-medium text-foreground-primary" : "text-body-md text-foreground-tertiary"}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
