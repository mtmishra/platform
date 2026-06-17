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
import { JourneyStrip } from "@/components/feature/JourneyStrip";
import { FaqAccordion } from "@/components/feature/FaqAccordion";
import { FeatureCta } from "@/components/feature/FeatureCta";
import { MatchPreviewCard } from "@/components/feature/MatchPreviewCard";
import { StickyMobileCta } from "@/components/feature/StickyMobileCta";
import {
  buildMetadata,
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  serviceSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LeapMatch™ — AI Loan Matching in India | LeapMoney",
  description:
    "LeapMatch™ screens you against 30+ lenders and shows the ones most likely to approve you, with an approval probability for each. Free, no credit score impact.",
  path: "/leapmatch",
});

const STEPS = [
  { title: "Share your profile", body: "Tell us about your income, employment, and the loan you need — in about 2 minutes." },
  { title: "We screen 30+ lenders", body: "LeapMatch™ applies each lender's eligibility rules to your profile instantly." },
  { title: "See your approval odds", body: "Every match comes with an approval probability — e.g. 72% — so you know where you stand." },
  { title: "Apply with confidence", body: "Apply only where you're likely to be approved, avoiding needless rejections." },
];

const FAQS = [
  { question: "What is approval probability?", answer: "It's an estimate — for example 72% — of how likely a specific lender is to approve your application, based on how your profile fits their policy. It helps you apply where you're most likely to succeed." },
  { question: "How is this different from a loan comparison site?", answer: "Comparison sites show you everyone's advertised rates. LeapMatch™ shows the lenders likely to approve you specifically, ranked by approval probability and true cost — so you don't waste applications." },
  { question: "Does using LeapMatch affect my credit score?", answer: "No. LeapMatch™ uses a soft inquiry, which has no impact on your CIBIL or bureau score." },
  { question: "Is LeapMatch free?", answer: "Yes. Getting your matches is free and there's no obligation to apply." },
];

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={[
          organizationSchema(),
          serviceSchema({
            name: "LeapMatch™",
            description:
              "AI loan matching that screens you against 30+ lenders and ranks those most likely to approve you, with a confidence band for each.",
            url: "/leapmatch",
            serviceType: "Loan matching",
          }),
          faqPageSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "LeapMatch", path: "/leapmatch" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="LeapMatch™" />

        <Section background="page" className="py-10 lg:py-16">
          <Container>
            <div className="max-w-2xl">
              <Label caps className="mb-4 block">LeapMatch™</Label>
              <Heading level={1} size="display-hero" className="mb-4">
                AI that matches you to the right lender
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-6">
                Stop guessing which lender will approve you. LeapMatch™ screens you
                against 30+ lenders and ranks the ones most likely to say yes — each
                with an approval probability. Free, with no credit score impact.
              </Paragraph>
            </div>
          </Container>
        </Section>

        {/* 4 steps */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">How LeapMatch works</Label>
              <Heading level={2} size="h1">Four steps to your matches</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <div key={s.title} className="flex flex-col gap-3">
                  <span className="text-display-large font-bold text-interactive-primary opacity-30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Heading level={3} size="h2">{s.title}</Heading>
                  <Paragraph color="secondary">{s.body}</Paragraph>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Sample output */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">What you&apos;ll see</Label>
              <Heading level={2} size="h1">A clear, ranked shortlist</Heading>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <MatchPreviewCard lender="HDFC Bank" approvalPct={87} confidence="high" rate="11.0% p.a." emi="₹21,740/mo" bestMatch />
              <MatchPreviewCard lender="Bajaj Finance" approvalPct={72} confidence="medium" rate="13.5% p.a." emi="₹22,850/mo" />
              <MatchPreviewCard lender="Tata Capital" approvalPct={34} confidence="low" rate="16.0% p.a." emi="₹24,320/mo" />
            </div>
            <p className="mt-4 text-body-sm text-foreground-tertiary">
              Illustrative example. Your real matches depend on your profile and live lender policies.
              Every offer shows its APR, fees and approval odds before you apply — all eligible
              lenders are shown (RBI Digital Lending Directions 2025).
            </p>
          </Container>
        </Section>

        {/* Match confidence concept */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Match confidence</Label>
              <Heading level={2} size="h1">Every match gets a confidence band</Heading>
              <Paragraph color="secondary" className="mt-3 max-w-xl">
                We translate each lender&apos;s approval probability into a simple band,
                so you instantly know which matches are worth pursuing.
              </Paragraph>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { band: "HIGH", body: "You comfortably exceed the lender's thresholds — strong chance of approval.", tone: "text-status-success" },
                { band: "MEDIUM", body: "You meet the criteria but with less headroom — approval is possible.", tone: "text-status-warning" },
                { band: "LOW", body: "You're close to the limits — consider improving your profile first.", tone: "text-status-danger" },
              ].map((c) => (
                <Card key={c.band} className="flex flex-col gap-2">
                  <span className={`font-mono text-h2 font-bold ${c.tone}`}>{c.band}</span>
                  <Paragraph color="secondary">{c.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Eligibility intelligence */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Eligibility intelligence</Label>
              <Heading level={2} size="h1">Smarter than a rate comparison</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: "Hard eligibility filters", body: "We first remove any lender whose basic criteria you don't meet — no false hope." },
                { title: "Approval probability", body: "For each remaining lender we estimate how well your profile fits their policy." },
                { title: "Ranked by real value", body: "Matches are ordered by approval odds and true cost — not just the lowest rate." },
              ].map((c) => (
                <Card key={c.title} className="flex flex-col gap-2">
                  <Heading level={3} size="h3">{c.title}</Heading>
                  <Paragraph color="secondary">{c.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <JourneyStrip activeKey="leapmatch" />
        <FaqAccordion faqs={FAQS} heading="LeapMatch — frequently asked questions" />
        <FeatureCta
          heading="See your matching banks"
          body="Find the lenders most likely to approve you — free, with no credit score impact."
          ctaLabel="See matching banks"
          ctaHref="/register"
        />
      </main>
      <StickyMobileCta label="See matching banks" href="/register" note="Free · No credit score impact" />
      <Footer />
    </>
  );
}
