import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Container, Heading, Paragraph, Section } from "@leapmoney/ui";

interface FeatureCtaProps {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export function FeatureCta({ heading, body, ctaLabel, ctaHref }: FeatureCtaProps) {
  return (
    <Section background="feature">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          <Heading level={2} size="display-large" color="on-dark">
            {heading}
          </Heading>
          <Paragraph size="lg" color="on-dark" className="max-w-lg opacity-80">
            {body}
          </Paragraph>
          <Button variant="secondary" size="lg">
            <Link href={ctaHref} className="flex items-center gap-2">
              {ctaLabel} <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
