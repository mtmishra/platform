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
import { DSALeadForm } from "@/components/forms/DSALeadForm";
import {
  buildMetadata,
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  serviceSchema,
} from "@/lib/seo";

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
          organizationSchema(),
          serviceSchema({
            name: "LeapMoney DSA Suite",
            description:
              "A platform for DSA agents to manage leads, submit applications to 30+ lenders, and track commissions.",
            url: "/dsa",
            serviceType: "DSA partner platform",
          }),
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
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
              <div>
                <Label caps className="mb-4 block">DSA Suite</Label>
                <Heading level={1} size="display-hero" className="mb-4">
                  Earn more. Work smarter.
                </Heading>
                <Paragraph size="lg" color="secondary" className="mb-6">
                  The LeapMoney DSA Suite gives you everything to source, match, and
                  close more loans — a visual lead pipeline, AI matching across 30+
                  lenders, and transparent commission tracking, all in one place.
                </Paragraph>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { stat: "30+", label: "Lenders" },
                    { stat: "₹8,000", label: "Max/loan" },
                    { stat: "₹0", label: "To join" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border border-border-token-default bg-background-card p-3 text-center">
                      <p className="font-mono text-h2 font-bold text-interactive-primary">{s.stat}</p>
                      <p className="text-body-sm text-foreground-tertiary">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <DSALeadForm />
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

        {/* Lead flow */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Lead flow</Label>
              <Heading level={2} size="h1">From first contact to commission</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { step: "Capture", body: "Add a borrower lead in seconds." },
                { step: "Match", body: "LeapMatch™ finds the right lenders." },
                { step: "Submit", body: "Send applications with documents ready." },
                { step: "Track", body: "Follow status to disbursal." },
                { step: "Get paid", body: "Commission credited transparently." },
              ].map((s, i) => (
                <div key={s.step} className="flex flex-col gap-2">
                  <span className="font-mono text-h2 font-bold text-interactive-primary opacity-40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Heading level={3} size="h3">{s.step}</Heading>
                  <Paragraph color="secondary">{s.body}</Paragraph>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Commission model */}
        <Section background="page">
          <Container>
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
              <div>
                <Label caps className="mb-3 block">Commission model</Label>
                <Heading level={2} size="h1" className="mb-3">Transparent, performance-based payouts</Heading>
                <Paragraph size="lg" color="secondary">
                  You earn a commission on every loan you source that gets disbursed.
                  Rates vary by lender and product and are shown clearly for each deal —
                  with projected and paid amounts tracked in real time. No opaque slabs,
                  no surprises.
                </Paragraph>
              </div>
              <Card className="flex flex-col gap-3">
                <Heading level={3} size="h2">What you see per deal</Heading>
                {[
                  "Projected commission before you submit",
                  "Status from submission to disbursal",
                  "Confirmed payout and statement on disbursal",
                ].map((line) => (
                  <p key={line} className="text-body-lg text-foreground-secondary">• {line}</p>
                ))}
              </Card>
            </div>
          </Container>
        </Section>

        {/* Partner onboarding */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Partner onboarding</Label>
              <Heading level={2} size="h1">Up and running in three steps</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { step: "Apply", body: "Submit the partner application form with your details." },
                { step: "Verify", body: "Our team verifies your details and activates your account." },
                { step: "Start earning", body: "Access the DSA Suite and begin sourcing loans." },
              ].map((s, i) => (
                <div key={s.step} className="flex flex-col gap-2">
                  <span className="font-mono text-display-large font-bold text-interactive-primary opacity-30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Heading level={3} size="h2">{s.step}</Heading>
                  <Paragraph color="secondary">{s.body}</Paragraph>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <FaqAccordion faqs={FAQS} heading="DSA Suite — frequently asked questions" />
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
