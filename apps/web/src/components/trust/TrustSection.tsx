import React from "react";
import { ShieldCheck, Lock, FileCheck, Landmark } from "lucide-react";
import { Container, Heading, Label, Paragraph, Section } from "@leapmoney/ui";

const INDICATORS = [
  {
    icon: <Landmark size={24} className="text-interactive-primary" />,
    title: "RBI-aligned",
    body: "We operate in line with RBI Digital Lending Guidelines 2022 and work only with regulated lenders.",
  },
  {
    icon: <Lock size={24} className="text-interactive-primary" />,
    title: "Bank-grade security",
    body: "Your data is encrypted in transit and at rest, and stored in India (AWS Mumbai).",
  },
  {
    icon: <FileCheck size={24} className="text-interactive-primary" />,
    title: "DPDP compliant",
    body: "Explicit consent, data minimisation, and your rights under the DPDP Act 2023.",
  },
  {
    icon: <ShieldCheck size={24} className="text-interactive-primary" />,
    title: "No credit impact",
    body: "Eligibility checks use a soft inquiry — they never affect your CIBIL score.",
  },
] as const;

export function TrustSection() {
  return (
    <Section background="card">
      <Container>
        <div className="mb-8 text-center">
          <Label caps className="mb-3 block">Trust &amp; Security</Label>
          <Heading level={2} size="h1">Built on trust and compliance</Heading>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INDICATORS.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              {item.icon}
              <Heading level={3} size="h2">{item.title}</Heading>
              <Paragraph color="secondary">{item.body}</Paragraph>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
