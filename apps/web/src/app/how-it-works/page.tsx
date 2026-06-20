import type { Metadata } from "next";
import { CheckCircle2, ArrowRight, Search, Zap, FileCheck, TrendingUp } from "lucide-react";
import {
  Card,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
  TrustBar,
  Button,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { FeatureBreadcrumb } from "@/components/feature/FeatureBreadcrumb";
import { FaqAccordion } from "@/components/feature/FaqAccordion";
import { FeatureCta } from "@/components/feature/FeatureCta";
import { JourneyStrip } from "@/components/feature/JourneyStrip";
import { buildMetadata, breadcrumbSchema, faqPageSchema, organizationSchema } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "How LeapMoney Works — Check, Match, Apply in 8 Minutes",
  description:
    "LeapMoney checks your credit profile across 4 bureaus, matches you to lenders likely to approve, and helps you apply — free, in under 8 minutes, with no impact on your CIBIL score.",
  path: "/how-it-works",
});

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Check Your LeapScore™",
    time: "2 minutes",
    color: "text-interactive-primary",
    bgColor: "bg-interactive-primary/10",
    body: "We run a soft pull across all four credit bureaus — CIBIL, Experian, CRIF, and Equifax — and blend them with your bank cash-flow data (shared with your consent via Account Aggregator). Zero impact on your credit score.",
    bullets: [
      "Soft pull only — no CIBIL impact",
      "4-bureau blend, not just CIBIL",
      "Bank statement analysis via AA (optional)",
      "Score ready in under 60 seconds",
    ],
  },
  {
    number: "02",
    icon: Zap,
    title: "Get Your LeapMatch™ Shortlist",
    time: "3 minutes",
    color: "text-status-success",
    bgColor: "bg-status-success/10",
    body: "Our AI engine compares your profile against 47+ lenders' actual underwriting policies — income bands, FOIR limits, employer categories, bureau thresholds. You see only lenders who are likely to approve you, ranked by approval probability.",
    bullets: [
      "Ranked by your approval probability",
      "Rate, EMI, and disbursal time shown",
      "AI explains WHY each lender matched",
      "No dark patterns — ranking is never paid",
    ],
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Apply to Your Best Match",
    time: "3 minutes",
    color: "text-status-warning",
    bgColor: "bg-status-warning/10",
    body: "Choose the lender that fits your need — lowest rate, fastest disbursal, or highest approval chance. Submit your application with pre-filled details and minimal documents. We track the status in real time.",
    bullets: [
      "One-click apply with pre-filled form",
      "Minimal documents — salaried: 3, self-employed: 5",
      "Real-time application status",
      "Dedicated support for your application",
    ],
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Track & Improve",
    time: "Ongoing",
    color: "text-premium",
    bgColor: "bg-premium/10",
    body: "After disbursal, your LeapScore™ dashboard tracks your credit improvement month by month. Our AI notifies you when you qualify for better rates, top-up loans, or when a missed EMI is about to hurt your score.",
    bullets: [
      "Monthly score refresh",
      "AI improvement roadmap",
      "EMI reminders via WhatsApp",
      "Top-up and balance transfer alerts",
    ],
  },
];

const FAQS = [
  {
    question: "Does checking my LeapScore affect my CIBIL score?",
    answer: "No. LeapScore™ uses a soft inquiry which has absolutely no impact on your CIBIL or any other bureau score. Only a hard inquiry (when you formally apply to a lender) affects your score.",
  },
  {
    question: "How is LeapMatch different from other loan comparison sites?",
    answer: "Other sites show you a list of lenders. We show you lenders ranked by your approval probability — based on your actual credit profile matched against each lender's underwriting policies. We tell you WHY each lender is a good match for you.",
  },
  {
    question: "How long does the whole process take?",
    answer: "Most users complete their LeapScore check and get their matched shortlist in under 8 minutes. The application itself takes 3–5 minutes with pre-filled details.",
  },
  {
    question: "Is LeapMoney free for borrowers?",
    answer: "Yes, completely free. LeapMoney earns a commission from lenders only when a loan is disbursed. There is no cost to the borrower at any step.",
  },
  {
    question: "What documents do I need?",
    answer: "For salaried borrowers: PAN card, Aadhaar, last 3 months salary slips, 6 months bank statement. For self-employed: PAN, Aadhaar, ITR for 2 years, 12 months bank statement. Our AI generates a personalised document list based on your profile.",
  },
];

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={[
          organizationSchema(),
          faqPageSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "How It Works", path: "/how-it-works" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="How It Works" />

        {/* Hero */}
        <Section background="page" className="py-12 lg:py-20">
          <Container>
            <div className="max-w-3xl">
              <Label caps className="mb-4 block">3 Steps · 8 Minutes · Zero Cost</Label>
              <Heading level={1} size="display-hero" className="mb-6">
                From credit check to loan match — in under 8 minutes.
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-8 max-w-2xl">
                Most borrowers waste weeks applying to the wrong lenders. LeapMoney shows
                you which lenders will approve you — before you apply — using AI, four
                credit bureaus, and real cash-flow data.
              </Paragraph>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">
                  <Link href="/register" className="flex items-center gap-2">
                    Check My LeapScore Free <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button variant="secondary" size="lg">
                  <Link href="/leapscore">What is LeapScore?</Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* Trust bar */}
        <Section background="card" className="py-6">
          <Container>
            <TrustBar variant="security" />
          </Container>
        </Section>

        {/* Steps */}
        <Section background="page">
          <Container>
            <div className="mb-10">
              <Label caps className="mb-3 block">The Process</Label>
              <Heading level={2} size="h1">How LeapMoney works</Heading>
            </div>
            <div className="flex flex-col gap-8">
              {STEPS.map((step, i) => (
                <div key={step.number} className="grid grid-cols-1 gap-6 lg:grid-cols-[80px_1fr_340px] lg:items-start">
                  {/* Step number */}
                  <div className="flex items-center gap-4 lg:flex-col lg:items-center lg:gap-2">
                    <span className={`font-mono text-display-large font-bold ${step.color}`}>
                      {step.number}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className="hidden h-12 w-px bg-border-token-default lg:block" />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.bgColor}`}>
                        <step.icon size={20} className={step.color} />
                      </div>
                      <div>
                        <Heading level={3} size="h2">{step.title}</Heading>
                        <span className={`text-body-sm font-semibold ${step.color}`}>⏱ {step.time}</span>
                      </div>
                    </div>
                    <Paragraph color="secondary" className="max-w-xl">{step.body}</Paragraph>
                  </div>

                  {/* Bullets */}
                  <Card className="flex flex-col gap-2">
                    {step.bullets.map((b) => (
                      <div key={b} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${step.color}`} />
                        <span className="text-body-sm text-foreground-secondary">{b}</span>
                      </div>
                    ))}
                  </Card>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <JourneyStrip activeKey="how-it-works" />
        <FaqAccordion faqs={FAQS} heading="How LeapMoney works — FAQs" />
        <FeatureCta
          heading="Ready to find your best loan?"
          body="Check your LeapScore in 2 minutes — free, with no CIBIL impact."
          ctaLabel="Get Started Free"
          ctaHref="/register"
        />
      </main>
      <Footer />
    </>
  );
}
