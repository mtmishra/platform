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
import {
  buildMetadata,
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  serviceSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Credit Health Dashboard — Improve Your Score | LeapMoney",
  description:
    "Understand and improve your credit health across 7 factors — utilisation, repayment, credit mix and more. Get a personalised improvement plan with LeapMoney.",
  path: "/credit-health",
});

const MODULES = [
  { name: "Credit Utilisation", body: "How much of your available credit you're using. Lower is better." },
  { name: "Active Loans", body: "Your current loans and how they affect your borrowing capacity." },
  { name: "Days Past Due (DPD)", body: "Any late payments and how recent and severe they were." },
  { name: "Bureau Scores", body: "Your CIBIL and other bureau scores, tracked over time." },
  { name: "Credit Age", body: "How long you've held credit — longer histories help." },
  { name: "Credit Mix", body: "The balance of secured and unsecured credit you hold." },
  { name: "Credit Health Rating (CHR)", body: "A single rating summarising your overall credit health." },
];

const FAQS = [
  { question: "What is a Credit Health Dashboard?", answer: "It's a single view of every factor that affects your creditworthiness — utilisation, repayment history, credit age, mix and more — with personalised tips to improve each one." },
  { question: "Will this improve my credit score?", answer: "The dashboard gives you prioritised, deterministic recommendations. Acting on them — like lowering utilisation or never missing a payment — is what improves your score over time." },
  { question: "Does checking my credit health affect my score?", answer: "No. We use a soft inquiry, which has no impact on your CIBIL or bureau score." },
  { question: "Is it free?", answer: "Yes. Your Credit Health Dashboard is free to access." },
];

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={[
          organizationSchema(),
          serviceSchema({
            name: "Credit Health Dashboard",
            description:
              "A structured view of your credit health across 7 factors, with a personalised, prioritised improvement plan.",
            url: "/credit-health",
            serviceType: "Credit monitoring",
          }),
          faqPageSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Credit Health", path: "/credit-health" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="Credit Health" />

        <Section background="page" className="py-10 lg:py-16">
          <Container>
            <div className="max-w-2xl">
              <Label caps className="mb-4 block">Credit Health</Label>
              <Heading level={1} size="display-hero" className="mb-4">
                Understand and improve your credit
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-6">
                Your Credit Health Dashboard breaks down the factors behind your
                score and gives you a clear, prioritised plan to improve them — so
                your next loan comes at a better rate.
              </Paragraph>
            </div>
          </Container>
        </Section>

        {/* 7 modules */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">What we track</Label>
              <Heading level={2} size="h1">Seven factors that shape your score</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m) => (
                <Card key={m.name} className="flex flex-col gap-2">
                  <Heading level={3} size="h3">{m.name}</Heading>
                  <Paragraph color="secondary">{m.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Improvement plan preview */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Your improvement plan</Label>
              <Heading level={2} size="h1">Know exactly what to do next</Heading>
            </div>
            <div className="flex max-w-2xl flex-col gap-3">
              {[
                "Bring credit-card utilisation below 30% to lift your score the fastest.",
                "Set up auto-pay so you never miss an EMI or card due date.",
                "Avoid multiple loan enquiries in a short window before applying.",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border-token-default bg-background-card p-4">
                  <span className="font-mono text-body-lg font-semibold text-interactive-primary">{i + 1}</span>
                  <p className="text-body-lg text-foreground-secondary">{tip}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-body-sm text-foreground-tertiary">
              Illustrative recommendations. Your plan is personalised to your profile.
            </p>
          </Container>
        </Section>

        {/* Risk indicators */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Risk indicators</Label>
              <Heading level={2} size="h1">We flag what&apos;s holding you back</Heading>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "High credit utilisation", tone: "danger" },
                { label: "Recent missed payment (DPD)", tone: "danger" },
                { label: "Multiple recent enquiries", tone: "warning" },
                { label: "Thin credit file", tone: "warning" },
                { label: "High FOIR", tone: "warning" },
                { label: "Healthy repayment history", tone: "success" },
              ].map((chip) => {
                const tones: Record<string, string> = {
                  danger: "border-status-danger/30 text-status-danger",
                  warning: "border-status-warning/30 text-status-warning",
                  success: "border-status-success/30 text-status-success",
                };
                return (
                  <span
                    key={chip.label}
                    className={`rounded-full border px-4 py-2 text-body-md font-medium ${tones[chip.tone]}`}
                  >
                    {chip.label}
                  </span>
                );
              })}
            </div>
            <p className="mt-4 text-body-sm text-foreground-tertiary">
              Illustrative indicators. Yours are detected automatically from your bureau profile.
            </p>
          </Container>
        </Section>

        {/* Sample insights */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Sample insights</Label>
              <Heading level={2} size="h1">Insights written in plain English</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                "Your utilisation is 62%. Bringing it under 30% could lift your score within 1–2 cycles.",
                "You have no missed payments in 12 months — keep it up to stay loan-ready.",
                "Your FOIR is borderline. Reducing one EMI would meaningfully raise your eligibility.",
              ].map((insight, i) => (
                <Card key={i} className="flex flex-col gap-2">
                  <span className="font-mono text-body-sm text-interactive-primary">Insight {i + 1}</span>
                  <Paragraph color="secondary">{insight}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <JourneyStrip activeKey="credit-health" />
        <FaqAccordion faqs={FAQS} heading="Credit Health — frequently asked questions" />
        <FeatureCta
          heading="Get your free credit analysis"
          body="See the factors behind your score and get a free, personalised improvement plan."
          ctaLabel="Get free credit analysis"
          ctaHref="/register"
        />
      </main>
      <Footer />
    </>
  );
}
