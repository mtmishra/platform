import type { Metadata } from "next";
import {
  Card,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { FeatureBreadcrumb } from "@/components/feature/FeatureBreadcrumb";
import { FaqAccordion } from "@/components/feature/FaqAccordion";
import { FeatureCta } from "@/components/feature/FeatureCta";
import { buildMetadata, breadcrumbSchema, faqPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "DSA Suite — Earn More, Work Smarter | LeapMoney",
  description:
    "Join the LeapMoney DSA Suite. Manage leads, submit applications to 30+ lenders, and track commissions — all in one place. Become a LeapMoney DSA partner.",
  path: "/dsa",
});

const MODULES = [
  { name: "Lead Pipeline", body: "Capture, organise, and track every lead through a visual pipeline." },
  { name: "Smart Matching", body: "Use LeapMatch™ to route each borrower to lenders likely to approve." },
  { name: "Application Manager", body: "Submit and track applications across 30+ lenders from one dashboard." },
  { name: "Document Vault", body: "Collect and store borrower documents securely, ready to submit." },
  { name: "Commission Tracker", body: "See projected and paid commissions for every deal in real time." },
  { name: "Analytics", body: "Understand your conversion, payouts, and pipeline health at a glance." },
  { name: "Notifications", body: "Stay updated on status changes via portal and WhatsApp." },
  { name: "Payouts", body: "Transparent, on-time commission payouts with a clear statement." },
];

const FAQS = [
  { question: "Who can become a LeapMoney DSA?", answer: "Individual agents and agencies who source loan borrowers can join the DSA Suite. Apply through the form and our team will onboard you." },
  { question: "How do commissions work?", answer: "You earn a commission on disbursed loans you source. Rates depend on the lender and product, and are tracked transparently in your dashboard." },
  { question: "Does it cost anything to join?", answer: "There's no cost to apply. The DSA Suite is built to help you earn more, not to charge you." },
  { question: "Which lenders can I submit to?", answer: "You can submit applications to 30+ partner banks and NBFCs directly from the DSA Suite." },
];

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={[
          faqPageSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "For DSAs", path: "/dsa" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="For DSAs" />

        <Section background="page" className="py-10 lg:py-16">
          <Container>
            <div className="max-w-2xl">
              <Label caps className="mb-4 block">DSA Suite</Label>
              <Heading level={1} size="display-hero" className="mb-4">
                Earn more. Work smarter.
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-6">
                The LeapMoney DSA Suite gives you everything to source, match, and
                close more loans — a visual lead pipeline, AI matching across 30+
                lenders, and transparent commission tracking, all in one place.
              </Paragraph>
            </div>
          </Container>
        </Section>

        {/* 8-module showcase */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">The Suite</Label>
              <Heading level={2} size="h1">Eight tools, one workflow</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {MODULES.map((m) => (
                <Card key={m.name} className="flex flex-col gap-2">
                  <Heading level={3} size="h3">{m.name}</Heading>
                  <Paragraph color="secondary">{m.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Why join */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Why partner with LeapMoney</Label>
              <Heading level={2} size="h1">Built to grow your earnings</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { stat: "30+", label: "Lenders to submit to" },
                { stat: "Higher", label: "Approval rates via LeapMatch™" },
                { stat: "Real-time", label: "Commission visibility" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-display-large font-bold text-interactive-primary">{item.stat}</p>
                  <p className="mt-1 text-body-md text-foreground-secondary">{item.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <FaqAccordion faqs={FAQS} heading="DSA Suite — frequently asked questions" background="card" />
        <FeatureCta
          heading="Join the DSA Suite"
          body="Apply to become a LeapMoney DSA partner and start closing more loans."
          ctaLabel="Become a partner"
          ctaHref="/partners"
        />
      </main>
      <Footer />
    </>
  );
}
