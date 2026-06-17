import React from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, CheckCircle } from "lucide-react";

// ── Hero ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <Section background="page" className="py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Label caps className="mb-6 block">
            Powered by LeapMatch™ AI
          </Label>

          <Heading level={1} size="display-hero" className="mb-6">
            Your Intelligent Loan Marketplace
          </Heading>

          <Paragraph size="lg" color="secondary" className="mb-8 mx-auto max-w-xl">
            LeapMoney matches you to the right lender in minutes — not days.
            No guesswork. No hidden charges. Just the loan you qualify for.
          </Paragraph>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg">
              <Link href="/register" className="flex items-center gap-2">
                Check Your Eligibility
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="secondary" size="lg">
              <Link href="/emi-calculator">Calculate EMI</Link>
            </Button>
          </div>

          <p className="mt-6 text-body-sm text-foreground-tertiary">
            No credit score impact · Takes 2 minutes · Free forever
          </p>
        </div>
      </Container>
    </Section>
  );
}

// ── Trust Bar ────────────────────────────────────────────────────────────

function TrustBar() {
  const stats = [
    { value: "₹500 Cr+", label: "Loans Facilitated" },
    { value: "50,000+",  label: "Happy Borrowers" },
    { value: "30+",      label: "Lender Partners" },
    { value: "4.8★",     label: "App Rating" },
  ] as const;

  return (
    <div className="border-y border-border-token-default bg-background-card py-8">
      <Container>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-display-large font-bold text-interactive-primary">
                {stat.value}
              </p>
              <p className="text-body-sm text-foreground-tertiary mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

// ── Loan Categories ──────────────────────────────────────────────────────

function LoanCategories() {
  const categories = [
    { title: "Home Loan",      subtitle: "Up to ₹5 Cr · 8.5% onwards",   href: "/loans/home-loan" },
    { title: "Personal Loan",  subtitle: "Up to ₹40 L · 10.5% onwards",  href: "/loans/personal-loan" },
    { title: "Business Loan",  subtitle: "Up to ₹2 Cr · 14% onwards",    href: "/loans/business-loan" },
    { title: "Car Loan",       subtitle: "Up to ₹1 Cr · 8.7% onwards",   href: "/loans/car-loan" },
    { title: "Education Loan", subtitle: "Up to ₹75 L · 9% onwards",     href: "/loans/education-loan" },
    { title: "Loan Against Property", subtitle: "Up to ₹10 Cr · 9.5% onwards", href: "/loans/lap" },
  ] as const;

  return (
    <Section background="page">
      <Container>
        <div className="text-center mb-10">
          <Label caps className="mb-4 block">Loan Products</Label>
          <Heading level={2} size="h1">Find the Right Loan</Heading>
          <Paragraph color="secondary" className="mt-3 max-w-lg mx-auto">
            From home loans to business finance — matched to your profile, not
            just your interest in the best rate.
          </Paragraph>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href}>
              <Card hoverable className="h-full">
                <CardHeader>
                  <Heading level={3} size="h3">{cat.title}</Heading>
                </CardHeader>
                <CardBody>
                  <p className="text-body-sm text-foreground-tertiary">
                    {cat.subtitle}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-interactive-primary">
                    Apply Now <ArrowRight size={14} />
                  </span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ── How It Works ─────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title:    "Share your profile",
      description: "Tell us about your income, employment, and the loan you need. Takes under 2 minutes.",
    },
    {
      step: "02",
      title:    "LeapMatch™ finds your lenders",
      description: "Our AI engine screens you against 30+ lenders and ranks the ones most likely to approve you.",
    },
    {
      step: "03",
      title:    "Compare and apply",
      description: "See your personalised offers with transparent rates and charges. Apply to one or many.",
    },
  ] as const;

  return (
    <Section background="card">
      <Container>
        <div className="text-center mb-10">
          <Label caps className="mb-4 block">How It Works</Label>
          <Heading level={2} size="h1">From Profile to Offer in Minutes</Heading>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col gap-4">
              <span className="text-display-large font-bold text-interactive-primary opacity-30">
                {s.step}
              </span>
              <Heading level={3} size="h2">{s.title}</Heading>
              <Paragraph color="secondary">{s.description}</Paragraph>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ── Why LeapMoney ─────────────────────────────────────────────────────────

function WhyLeapMoney() {
  const pillars = [
    {
      icon: <Zap size={24} className="text-interactive-primary" />,
      title: "AI-Powered Matching",
      body:  "LeapMatch™ scores your eligibility against every lender policy — not just the headline rate.",
    },
    {
      icon: <ShieldCheck size={24} className="text-interactive-primary" />,
      title: "RBI Compliant",
      body:  "Licensed lenders only. Full compliance with RBI Digital Lending Guidelines 2022.",
    },
    {
      icon: <TrendingUp size={24} className="text-interactive-primary" />,
      title: "Transparent, Always",
      body:  "No hidden fees. No dark patterns. You see exactly what you're signing up for.",
    },
    {
      icon: <CheckCircle size={24} className="text-interactive-primary" />,
      title: "No Credit Impact",
      body:  "LeapMatch™ uses a soft inquiry. Checking your eligibility never affects your CIBIL score.",
    },
  ] as const;

  return (
    <Section background="page">
      <Container>
        <div className="text-center mb-10">
          <Label caps className="mb-4 block">Why LeapMoney</Label>
          <Heading level={2} size="h1">Intelligent. Transparent. Yours.</Heading>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {pillars.map((p) => (
            <Card key={p.title} className="flex flex-col gap-4">
              <div>{p.icon}</div>
              <Heading level={3} size="h2">{p.title}</Heading>
              <Paragraph color="secondary">{p.body}</Paragraph>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ── CTA Banner ────────────────────────────────────────────────────────────

function CtaBanner() {
  return (
    <Section background="feature">
      <Container>
        <div className="flex flex-col items-center text-center gap-6">
          <Heading level={2} size="display-large" color="on-dark">
            Ready to Make Your Leap?
          </Heading>
          <Paragraph size="lg" color="on-dark" className="max-w-lg opacity-80">
            Join 50,000+ borrowers who found their ideal loan through LeapMoney.
            Start for free — no credit score impact.
          </Paragraph>
          <Button variant="secondary" size="lg">
            <Link href="/register" className="flex items-center gap-2">
              Get Started Free <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <LoanCategories />
        <HowItWorks />
        <WhyLeapMoney />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
