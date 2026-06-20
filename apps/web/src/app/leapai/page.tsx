import type { Metadata } from "next";
import { MessageSquare, Zap, Shield, Brain, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import {
  Card,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
  Button,
  TrustBar,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { FeatureBreadcrumb } from "@/components/feature/FeatureBreadcrumb";
import { FaqAccordion } from "@/components/feature/FaqAccordion";
import { buildMetadata, breadcrumbSchema, organizationSchema, serviceSchema } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "LeapAI™ — India's First AI Loan Copilot | LeapMoney",
  description:
    "LeapAI is India's first AI-powered loan copilot. Ask anything about loans, credit scores, and eligibility in plain Hindi or English. Get instant, personalised answers — no jargon, no sales pitch.",
  path: "/leapai",
});

const CAPABILITIES = [
  {
    icon: Brain,
    title: "Credit Score Explanation",
    body: "Ask LeapAI why your score is what it is. It reads your bureau data and explains every factor in plain language — no fintech jargon.",
    example: '"Why is my CIBIL 682 and not higher?"',
  },
  {
    icon: Zap,
    title: "Loan Eligibility Discovery",
    body: "Tell LeapAI what you need. It asks the right questions and tells you which lenders are likely to approve you — before you apply.",
    example: '"I need ₹5 lakh personal loan. Will I get approved?"',
  },
  {
    icon: MessageSquare,
    title: "Instant FAQ Resolution",
    body: "No more searching help pages. Ask LeapAI anything — prepayment penalties, processing fees, document lists — and get an instant, accurate answer.",
    example: '"What documents do I need for a home loan?"',
  },
  {
    icon: Shield,
    title: "Application Tracking",
    body: "LeapAI monitors your loan application status in real time and alerts you when action is needed — via chat, email, or WhatsApp.",
    example: '"What is the status of my HDFC application?"',
  },
  {
    icon: Sparkles,
    title: "Score Improvement Coaching",
    body: "LeapAI builds a personised 90-day plan to improve your LeapScore™ — prioritising the highest-impact actions for your specific profile.",
    example: '"How do I improve my score by 50 points in 3 months?"',
  },
  {
    icon: ArrowRight,
    title: "Referral & Rewards",
    body: "At the right moment — after disbursal or a score milestone — LeapAI proactively suggests referrals and explains how you earn ₹1,000 per successful referral.",
    example: '"How do I refer a friend and earn rewards?"',
  },
];

const TECH_STACK = [
  { label: "Conversational AI", value: "Claude Haiku (Anthropic)" },
  { label: "Credit Analysis", value: "Claude Sonnet (Anthropic)" },
  { label: "Session Memory", value: "Redis (short-term context)" },
  { label: "User Profile", value: "PostgreSQL via Supabase" },
  { label: "Knowledge Base", value: "RAG — lender T&Cs, RBI circulars" },
  { label: "Response Latency", value: "< 1.5 seconds conversational" },
  { label: "Safety Layer", value: "RBI Digital Lending compliance rails" },
  { label: "Data Residency", value: "India only (AWS ap-south-1)" },
];

const FAQS = [
  {
    question: "What is LeapAI?",
    answer: "LeapAI is LeapMoney's AI-powered loan copilot — a conversational assistant that helps you understand your credit score, check loan eligibility, compare lender options, and track your application. It is available on every page of LeapMoney and responds in plain Hindi or English.",
  },
  {
    question: "Is LeapAI powered by ChatGPT?",
    answer: "No. LeapAI is built on Claude (by Anthropic) — chosen for its safety, reasoning quality, and ability to handle financial data responsibly. We use Claude Haiku for fast conversational responses and Claude Sonnet for deeper credit analysis.",
  },
  {
    question: "Will LeapAI ever promise me loan approval?",
    answer: "Never. LeapAI always uses probability language: 'You have an 87% approval probability with HDFC Bank.' It never says 'You will be approved.' This is both an RBI compliance requirement and our product principle.",
  },
  {
    question: "Does LeapAI share my data?",
    answer: "No. LeapAI operates within LeapMoney's DPDP Act 2023 compliant data infrastructure. Your financial data is never shared with third parties for AI training. All data stays in India (AWS Mumbai).",
  },
  {
    question: "When will LeapAI be available?",
    answer: "LeapAI is currently in development. Early access will be available to users on the waitlist. Sign up below to be among the first to try it.",
  },
];

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={[
          organizationSchema(),
          serviceSchema({
            name: "LeapAI™ Copilot",
            description: "India's first AI-powered loan copilot for credit score explanation, eligibility discovery, and lender matching.",
            url: "/leapai",
            serviceType: "AI Financial Advisory",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "LeapAI", path: "/leapai" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="LeapAI™" />

        {/* Hero */}
        <Section background="feature" className="py-16 lg:py-24">
          <Container>
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <Sparkles size={14} className="text-white/80" />
                <span className="text-body-sm font-semibold text-white/80">India's First AI Loan Copilot</span>
              </div>
              <Heading level={1} size="display-hero" className="mb-6 text-foreground-on-dark">
                Ask anything about your loan. Get an honest answer.
              </Heading>
              <Paragraph size="lg" className="mb-8 max-w-2xl text-white/70">
                LeapAI understands your credit profile and answers loan questions in plain Hindi
                or English — no jargon, no sales pitch, no hidden agenda. Just clear, accurate,
                personalised guidance.
              </Paragraph>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">
                  <Link href="/register" className="flex items-center gap-2">
                    Join Early Access <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* Chat preview */}
        <Section background="card">
          <Container>
            <div className="mx-auto max-w-2xl">
              <Label caps className="mb-3 block text-center">See LeapAI in Action</Label>
              <Heading level={2} size="h1" className="mb-8 text-center">A conversation that gets you answers</Heading>

              <div className="rounded-2xl border border-border-token-default bg-background-page p-6 shadow-2">
                <div className="mb-4 flex items-center gap-3 border-b border-border-token-default pb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-interactive-primary">
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <div>
                    <span className="text-body-md font-bold text-foreground-primary">LeapAI</span>
                    <span className="ml-2 text-body-sm text-status-success">● Online</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* AI message */}
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-interactive-primary/10">
                      <Sparkles size={12} className="text-interactive-primary" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-background-card px-4 py-3 shadow-1">
                      <p className="text-body-md text-foreground-primary">
                        Namaste! I'm LeapAI — your personal loan advisor. I can check your loan eligibility,
                        explain your credit score, or compare lender options. What would you like to know?
                      </p>
                    </div>
                  </div>

                  {/* User message */}
                  <div className="flex justify-end gap-3">
                    <div className="rounded-2xl rounded-tr-none bg-interactive-primary px-4 py-3">
                      <p className="text-body-md text-white">
                        My CIBIL is 710. Can I get a ₹5 lakh personal loan?
                      </p>
                    </div>
                  </div>

                  {/* AI response */}
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-interactive-primary/10">
                      <Sparkles size={12} className="text-interactive-primary" />
                    </div>
                    <div className="rounded-2xl rounded-tl-none bg-background-card px-4 py-3 shadow-1">
                      <p className="text-body-md text-foreground-primary mb-2">
                        Yes — with a 710 CIBIL, you qualify with several lenders. Based on your score:
                      </p>
                      <div className="flex flex-col gap-2">
                        {[
                          { lender: "HDFC Bank", prob: "84%", rate: "11.5% p.a." },
                          { lender: "ICICI Bank", prob: "79%", rate: "12.0% p.a." },
                          { lender: "Bajaj Finance", prob: "91%", rate: "13.0% p.a." },
                        ].map((l) => (
                          <div key={l.lender} className="flex items-center justify-between rounded-lg bg-background-page px-3 py-2">
                            <span className="text-body-sm font-semibold text-foreground-primary">{l.lender}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-body-sm text-status-success font-bold">{l.prob}</span>
                              <span className="text-body-sm text-foreground-tertiary">{l.rate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-body-sm text-foreground-tertiary">
                        Want me to explain why each lender matched you?
                      </p>
                    </div>
                  </div>

                  {/* Quick replies */}
                  <div className="flex flex-wrap gap-2 pl-10">
                    {["Yes, explain the matches", "What documents do I need?", "Show fastest disbursal"].map((q) => (
                      <span key={q} className="rounded-full border border-interactive-primary/30 bg-interactive-primary/5 px-3 py-1 text-body-sm text-interactive-primary">
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Capabilities */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">What LeapAI Can Do</Label>
              <Heading level={2} size="h1">6 things LeapAI handles instantly</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((c) => (
                <Card key={c.title} className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-interactive-primary/10">
                    <c.icon size={20} className="text-interactive-primary" />
                  </div>
                  <Heading level={3} size="h3">{c.title}</Heading>
                  <Paragraph color="secondary">{c.body}</Paragraph>
                  <div className="mt-auto rounded-lg bg-background-page px-3 py-2">
                    <span className="text-body-sm italic text-foreground-tertiary">{c.example}</span>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Trust & Compliance */}
        <Section background="card">
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <Label caps className="mb-3 block">Safety & Compliance</Label>
                <Heading level={2} size="h1" className="mb-4">
                  AI that never crosses the line.
                </Heading>
                <Paragraph color="secondary" className="mb-6">
                  LeapAI is built with RBI Digital Lending Guidelines 2022 compliance as a
                  hard constraint — not an afterthought. Every AI output is filtered through
                  safety rails before it reaches you.
                </Paragraph>
                <div className="flex flex-col gap-3">
                  {[
                    "Never promises loan approval — always uses probability language",
                    "APR always displayed alongside every recommendation",
                    "Explicit consent before any credit data is accessed",
                    "All financial data stays in India (AWS Mumbai)",
                    "Human escalation path always available",
                    "DPDP Act 2023 compliant — granular, revocable consent",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-status-success" />
                      <span className="text-body-md text-foreground-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div className="rounded-2xl border border-border-token-default bg-background-page p-6">
                <Label caps className="mb-4 block">Technical Architecture</Label>
                <div className="flex flex-col gap-3">
                  {TECH_STACK.map((t) => (
                    <div key={t.label} className="flex items-center justify-between border-b border-border-token-default pb-3 last:border-0 last:pb-0">
                      <span className="text-body-sm text-foreground-secondary">{t.label}</span>
                      <span className="font-mono text-body-sm font-semibold text-foreground-primary">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Early access CTA */}
        <Section background="feature">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Sparkles size={32} className="mx-auto mb-4 text-white/60" />
              <Heading level={2} size="display-large" className="mb-4 text-foreground-on-dark">
                LeapAI is coming soon.
              </Heading>
              <Paragraph size="lg" className="mb-8 text-white/70">
                Be the first to experience India's AI-first loan copilot. Early access users
                get priority matching, free LeapAI Pro for 3 months, and direct input on the
                product roadmap.
              </Paragraph>
              <Button variant="primary" size="lg">
                <Link href="/register" className="flex items-center gap-2">
                  Join the Early Access List <ArrowRight size={16} />
                </Link>
              </Button>
              <TrustBar variant="security" className="mt-6 justify-center" />
            </div>
          </Container>
        </Section>

        <FaqAccordion faqs={FAQS} heading="LeapAI — frequently asked questions" />
      </main>
      <Footer />
    </>
  );
}
