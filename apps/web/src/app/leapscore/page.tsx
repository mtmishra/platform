import type { Metadata } from "next";
import {
  Card,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
  LeapScoreGauge,
  ScoreBandBadge,
  DistributionChart,
  TrendChart,
  TrustBar,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScoreSimulator } from "@/components/feature/ScoreSimulator";
import { JsonLd } from "@/components/seo/JsonLd";
import { FeatureBreadcrumb } from "@/components/feature/FeatureBreadcrumb";
import { JourneyStrip } from "@/components/feature/JourneyStrip";
import { FaqAccordion } from "@/components/feature/FaqAccordion";
import { FeatureCta } from "@/components/feature/FeatureCta";
import { StickyMobileCta } from "@/components/feature/StickyMobileCta";
import {
  buildMetadata,
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  serviceSchema,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LeapScore™ — Check Your Credit Score Free | LeapMoney",
  description:
    "LeapScore™ is a 300–900 score that blends all four bureaus with your bank cash-flow and payment behaviour to show how loan-ready you are. Free, with no impact on your credit score.",
  path: "/leapscore",
});

// Four weighted layers — mirrors the Sprint 7 LeapScore v2 engine (R3 §9).
const COMPONENTS = [
  { name: "Bureau Layer", weight: "55%", body: "Your CIBIL, Experian and CRIF scores, blended — including accounts, payment history and enquiries." },
  { name: "Cash Flow Layer", weight: "25%", body: "Income stability and account conduct from your bank statements (shared with consent via Account Aggregator)." },
  { name: "Payment Behaviour", weight: "15%", body: "Utility, GST and postpaid-mobile payment regularity — discipline the bureaus often miss." },
  { name: "Account Health", weight: "5%", body: "Credit utilisation, account age and recent hard enquiries." },
];

// Standard 300–900 bands (R3 Appendix E).
const BANDS = [
  { band: "Excellent", range: "800–900", label: "Pre-approved offers and the best available rates", tone: "text-status-success" },
  { band: "Very Good", range: "750–799", label: "All banks approve at competitive rates", tone: "text-status-success" },
  { band: "Good", range: "700–749", label: "Most NBFCs and some private banks", tone: "text-status-success" },
  { band: "Average", range: "650–699", label: "Digital lenders and NBFCs; banks are difficult", tone: "text-status-warning" },
  { band: "Below Average", range: "550–649", label: "Limited options at higher cost — improve before applying", tone: "text-status-warning" },
  { band: "Poor", range: "300–549", label: "Rebuild required — start with your improvement plan", tone: "text-status-danger" },
];

const FAQS = [
  { question: "Does checking my LeapScore affect my credit score?", answer: "No. LeapScore™ is calculated using a soft inquiry on your bureau report, which has no impact on your CIBIL or bureau score." },
  { question: "How is LeapScore different from my CIBIL score?", answer: "Your CIBIL score reflects one bureau's view of past credit behaviour. LeapScore™ blends all four bureaus with your bank cash-flow and payment behaviour into a single 300–900 score that shows how loan-ready you are right now." },
  { question: "Is LeapScore free?", answer: "Yes. Checking your LeapScore™ is completely free, and there's no obligation to apply for a loan." },
  { question: "How often is my LeapScore updated?", answer: "Your LeapScore™ refreshes as new information becomes available, so you can track your progress over time." },
];

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={[
          organizationSchema(),
          serviceSchema({
            name: "LeapScore™",
            description:
              "A proprietary 300–900 loan-readiness score blending all four credit bureaus with bank cash-flow and payment behaviour.",
            url: "/leapscore",
            serviceType: "Credit scoring",
          }),
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
                LeapScore™ is a 300–900 score that blends all four credit bureaus with
                your bank cash-flow and payment behaviour — so it shows how likely you are
                to be approved, and what to improve. Free to check, with no impact on your
                credit score.
              </Paragraph>
              <TrustBar variant="security" />
            </div>
          </Container>
        </Section>

        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">What goes into it</Label>
              <Heading level={2} size="h1">Four layers, one clear score</Heading>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <Card className="flex flex-col gap-4">
                <Label caps>Layer weighting</Label>
                <DistributionChart
                  rows={[
                    { label: "Bureau", value: 55, tone: "var(--color-interactive-primary)" },
                    { label: "Cash Flow", value: 25, tone: "var(--color-status-success)" },
                    { label: "Payment", value: 15, tone: "var(--color-status-warning)" },
                    { label: "Account Health", value: 5, tone: "var(--color-text-tertiary)" },
                  ]}
                  max={55}
                />
              </Card>
            </div>
          </Container>
        </Section>

        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Score bands</Label>
              <Heading level={2} size="h1">From 300 to 900 — where do you land?</Heading>
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

        {/* Sample score visualization */}
        <Section background="card">
          <Container>
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              <div>
                <Label caps className="mb-3 block">Sample score</Label>
                <Heading level={2} size="h1" className="mb-3">This is what you&apos;ll see</Heading>
                <Paragraph size="lg" color="secondary">
                  Your LeapScore™ is shown as a single, easy-to-read number with your
                  band and what it means for your next loan. The example here shows a
                  742 — a Very Good profile that most banks approve at competitive rates.
                </Paragraph>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-token-default bg-background-page p-8">
                  <LeapScoreGauge value={742} min={300} max={900} bandLabel="Good" label="LeapScore" size={208} />
                  <ScoreBandBadge band="Good" />
                  <p className="text-body-sm text-foreground-tertiary">All banks · competitive rates</p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Future dashboard preview */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Coming to your dashboard</Label>
              <Heading level={2} size="h1">A living view of your score</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="flex flex-col gap-3">
                <Heading level={3} size="h3">Score over time</Heading>
                <Paragraph color="secondary">Track how your LeapScore™ changes month to month.</Paragraph>
                <TrendChart data={[688, 702, 710, 725, 731, 742]} className="mt-auto w-full" />
                <span className="font-mono text-body-sm text-status-success">+54 over 6 months</span>
              </Card>
              <Card className="flex flex-col gap-3">
                <Heading level={3} size="h3">Factor breakdown</Heading>
                <Paragraph color="secondary">See exactly which factors lift or hold back your score.</Paragraph>
                <DistributionChart
                  className="mt-auto"
                  rows={[
                    { label: "On-time pay", value: 92, tone: "var(--color-status-success)" },
                    { label: "Utilisation", value: 64, tone: "var(--color-status-warning)" },
                    { label: "Enquiries", value: 38, tone: "var(--color-status-danger)" },
                  ]}
                  max={100}
                />
              </Card>
              <Card className="flex flex-col gap-2">
                <Heading level={3} size="h3">Improvement plan</Heading>
                <Paragraph color="secondary">Get 3–5 prioritised actions to reach the next band.</Paragraph>
              </Card>
            </div>
            <p className="mt-4 text-body-sm text-foreground-tertiary">
              Dashboard preview — available after you create your free account.
            </p>
          </Container>
        </Section>

        {/* Interactive Score Simulator */}
        <Section background="page">
          <Container>
            <div className="mb-8 text-center">
              <Label caps className="mb-3 block">Score Simulator</Label>
              <Heading level={2} size="h1">Interactive Score Card Builder</Heading>
              <Paragraph size="lg" color="secondary" className="mx-auto mt-2 max-w-2xl">
                Indian lenders check more than a bureau number. Drag the sliders to see how your
                LeapScore™ behaves under standard underwriting guidelines.
              </Paragraph>
            </div>
            <ScoreSimulator />
          </Container>
        </Section>

        <JourneyStrip activeKey="leapscore" />
        <FaqAccordion faqs={FAQS} heading="LeapScore — frequently asked questions" />
        <FeatureCta
          heading="Explore your LeapScore free"
          body="See how loan-ready you are in under 2 minutes — no impact on your credit score."
          ctaLabel="Get my LeapScore"
          ctaHref="/register"
        />
      </main>
      <StickyMobileCta label="Get my LeapScore" href="/register" note="Free · No credit score impact" />
      <Footer />
    </>
  );
}
