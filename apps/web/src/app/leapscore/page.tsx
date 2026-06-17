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
import { buildMetadata, breadcrumbSchema, faqPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LeapScore™ — Check Your Credit Score Free | LeapMoney",
  description:
    "LeapScore™ is a simple 0–100 score that shows how loan-ready you are. Check it free with no impact on your CIBIL score. See where you stand with LeapMoney.",
  path: "/leapscore",
});

const COMPONENTS = [
  { name: "Credit Health", weight: "30%", body: "Your CIBIL score, credit utilisation, repayment history, and credit age." },
  { name: "Income Stability", weight: "20%", body: "How steady and predictable your income is over time." },
  { name: "FOIR", weight: "20%", body: "How much of your income already goes toward fixed obligations." },
  { name: "Banking Behaviour", weight: "Mix", body: "Your account conduct — balances, bounces, and cash-flow patterns." },
  { name: "Employment Stability", weight: "Mix", body: "Your job tenure and employer profile." },
  { name: "Loan Readiness", weight: "Mix", body: "An overall read on how prepared you are to take on a loan now." },
];

const BANDS = [
  { band: "A+", range: "85–100", label: "Loan Ready", tone: "text-status-success" },
  { band: "A", range: "70–84", label: "Strong", tone: "text-status-success" },
  { band: "B", range: "55–69", label: "Improvable", tone: "text-status-warning" },
  { band: "C", range: "40–54", label: "Developing", tone: "text-status-warning" },
  { band: "D", range: "0–39", label: "Not Ready Yet", tone: "text-status-danger" },
];

const FAQS = [
  { question: "Does checking my LeapScore affect my credit score?", answer: "No. LeapScore™ is calculated using a soft inquiry on your bureau report, which has no impact on your CIBIL or bureau score." },
  { question: "How is LeapScore different from my CIBIL score?", answer: "Your CIBIL score reflects past credit behaviour. LeapScore™ goes further — it combines your credit health with income stability, FOIR, banking behaviour, and employment to show how loan-ready you are right now." },
  { question: "Is LeapScore free?", answer: "Yes. Checking your LeapScore™ is completely free, and there's no obligation to apply for a loan." },
  { question: "How often is my LeapScore updated?", answer: "Your LeapScore™ refreshes as new information becomes available, so you can track your progress over time." },
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
            { name: "LeapScore", path: "/leapscore" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="LeapScore™" />

        <Section background="page" className="py-10 lg:py-16">
          <Container>
            <div className="max-w-2xl">
              <Label caps className="mb-4 block">LeapScore™</Label>
              <Heading level={1} size="display-hero" className="mb-4">
                Know how loan-ready you are
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-6">
                LeapScore™ is a simple 0–100 score that goes beyond your CIBIL score
                to show how likely you are to be approved — and what to improve.
                Free to check, with no impact on your credit score.
              </Paragraph>
            </div>
          </Container>
        </Section>

        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">What goes into it</Label>
              <Heading level={2} size="h1">Six factors, one clear score</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COMPONENTS.map((c) => (
                <Card key={c.name} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Heading level={3} size="h3">{c.name}</Heading>
                    <span className="font-mono text-body-sm text-interactive-primary">{c.weight}</span>
                  </div>
                  <Paragraph color="secondary">{c.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Score bands</Label>
              <Heading level={2} size="h1">From 0 to 100 — where do you land?</Heading>
            </div>
            <div className="overflow-hidden rounded-lg border border-border-token-default">
              <table className="w-full text-left">
                <thead className="bg-background-feature text-foreground-on-dark">
                  <tr>
                    <th className="px-4 py-3 text-body-md font-semibold">Band</th>
                    <th className="px-4 py-3 text-body-md font-semibold">Score</th>
                    <th className="px-4 py-3 text-body-md font-semibold">What it means</th>
                  </tr>
                </thead>
                <tbody>
                  {BANDS.map((b, i) => (
                    <tr key={b.band} className={i % 2 === 0 ? "bg-background-card" : "bg-background-page"}>
                      <td className={`px-4 py-3 font-mono font-semibold ${b.tone}`}>{b.band}</td>
                      <td className="px-4 py-3 font-mono text-body-md text-foreground-secondary">{b.range}</td>
                      <td className="px-4 py-3 text-body-md text-foreground-secondary">{b.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </Section>

        <JourneyStrip activeKey="leapscore" />
        <FaqAccordion faqs={FAQS} heading="LeapScore — frequently asked questions" />
        <FeatureCta
          heading="Get your LeapScore free"
          body="See how loan-ready you are in under 2 minutes — no impact on your credit score."
          ctaLabel="Get my LeapScore"
          ctaHref="/register"
        />
      </main>
      <Footer />
    </>
  );
}
