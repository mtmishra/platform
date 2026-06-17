import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, Heading, Label, Section } from "@leapmoney/ui";
import { JOURNEY } from "@/data/journey";

interface JourneyStripProps {
  /** Highlight the step matching this key. */
  activeKey?: string;
}

export function JourneyStrip({ activeKey }: JourneyStripProps) {
  return (
    <Section background="card">
      <Container>
        <div className="mb-6 text-center">
          <Label caps className="mb-3 block">How It Fits Together</Label>
          <Heading level={2} size="h1">Your journey, end to end</Heading>
        </div>

        <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
          {JOURNEY.map((step, index) => {
            const active = step.key === activeKey;
            const inner = (
              <div
                className={[
                  "flex h-full flex-col gap-1 rounded-lg border p-4 transition-colors duration-fast",
                  active
                    ? "border-interactive-primary bg-background-page"
                    : "border-border-token-default bg-background-card",
                  step.href ? "hover:border-interactive-primary" : "",
                ].join(" ")}
              >
                <span className="text-label-caps font-semibold uppercase tracking-wider text-foreground-tertiary">
                  Step {index + 1}
                </span>
                <span
                  className={[
                    "text-body-lg font-semibold",
                    active ? "text-interactive-primary" : "text-foreground-primary",
                  ].join(" ")}
                >
                  {step.label}
                </span>
                <span className="text-body-sm text-foreground-tertiary">{step.blurb}</span>
              </div>
            );

            return (
              <li key={step.key} className="flex flex-1 items-center gap-2">
                {step.href ? (
                  <Link href={step.href} className="w-full" aria-current={active ? "page" : undefined}>
                    {inner}
                  </Link>
                ) : (
                  <div className="w-full">{inner}</div>
                )}
                {index < JOURNEY.length - 1 && (
                  <ChevronRight
                    size={18}
                    className="hidden shrink-0 text-foreground-tertiary lg:block"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
