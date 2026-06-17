import React from "react";
import { Container, Heading, Label, Section } from "@leapmoney/ui";
import type { FaqItem } from "@/data/loans";

interface FaqAccordionProps {
  faqs: FaqItem[];
  heading?: string;
  background?: "page" | "card";
}

export function FaqAccordion({
  faqs,
  heading = "Frequently asked questions",
  background = "page",
}: FaqAccordionProps) {
  return (
    <Section background={background}>
      <Container>
        <div className="mb-8">
          <Label caps className="mb-3 block">FAQ</Label>
          <Heading level={2} size="h1">{heading}</Heading>
        </div>
        <div className="flex max-w-3xl flex-col gap-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-border-token-default bg-background-card p-5"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-body-lg font-semibold text-foreground-primary">
                {faq.question}
                <span className="text-foreground-tertiary transition-transform duration-fast group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-body-md text-foreground-secondary">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
