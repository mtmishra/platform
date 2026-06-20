import type { Metadata } from "next";
import { CheckCircle2, Shield, Users, Zap, Award, Building2 } from "lucide-react";
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
import { FeatureCta } from "@/components/feature/FeatureCta";
import { buildMetadata, breadcrumbSchema, organizationSchema } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "About LeapMoney — India's AI-First Loan Marketplace",
  description:
    "LeapMoney is India's first AI-powered loan marketplace. We blend four credit bureaus with bank cash-flow data to match borrowers to lenders most likely to approve — instantly, transparently, and for free.",
  path: "/about",
});

const STATS = [
  { value: "47+", label: "Lender Partners", sub: "Banks, NBFCs & Fintechs" },
  { value: "4", label: "Credit Bureaus", sub: "CIBIL, Experian, CRIF, Equifax" },
  { value: "₹0", label: "Cost to Borrower", sub: "Always free to check & match" },
  { value: "8 min", label: "Average Match Time", sub: "From check to shortlist" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Transparency First",
    body: "We show you approval probability, not just lender logos. Every recommendation cites the exact reason — your CIBIL score, income band, or employer type.",
  },
  {
    icon: Zap,
    title: "AI That Explains Itself",
    body: "LeapAI never says 'trust me'. It says 'HDFC approved because your CIBIL is 742, above their 700 threshold.' Reasoning, not just answers.",
  },
  {
    icon: Users,
    title: "Borrower-Side Only",
    body: "We are not paid by lenders to push products. Our ranking is based on approval probability, not commission rates. Your best deal is our only goal.",
  },
  {
    icon: Award,
    title: "Compliance-Native",
    body: "Built for RBI Digital Lending Guidelines 2022 and DPDP Act 2023 from day one. Your data stays in India. Consent is granular and revocable.",
  },
];

const TEAM = [
  {
    name: "Amit Mishra",
    role: "Founder & CEO",
    bio: "Serial entrepreneur with deep roots in Indian fintech and AI product design.",
  },
  {
    name: "LeapMoney Engineering",
    role: "Full-Stack Team",
    bio: "A lean, AI-native team building the infrastructure for India's next-generation loan marketplace.",
  },
];

const COMPLIANCE = [
  "RBI Registered Loan Aggregator",
  "CIBIL Certified Partner",
  "Experian Certified Partner",
  "DPDP Act 2023 Compliant",
  "AES-256 Data Encryption",
  "ISO 27001 (In Progress)",
];

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={[
          organizationSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="About Us" />

        {/* Hero */}
        <Section background="page" className="py-12 lg:py-20">
          <Container>
            <div className="max-w-3xl">
              <Label caps className="mb-4 block">Our Mission</Label>
              <Heading level={1} size="display-hero" className="mb-6">
                We match borrowers to lenders — not the other way around.
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-8 max-w-2xl">
                Every loan marketplace in India is built to sell you a lender's product.
                LeapMoney is built to find your best loan. We use AI, four credit bureaus,
                and real bank cash-flow data to show you which lenders will approve you —
                before you apply.
              </Paragraph>
              <TrustBar variant="security" />
            </div>
          </Container>
        </Section>

        {/* Stats */}
        <Section background="card">
          <Container>
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col gap-1 text-center">
                  <span className="font-mono text-display-large font-bold text-interactive-primary">
                    {s.value}
                  </span>
                  <span className="text-body-md font-semibold text-foreground-primary">{s.label}</span>
                  <span className="text-body-sm text-foreground-tertiary">{s.sub}</span>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Story */}
        <Section background="page">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Label caps className="mb-3 block">The Problem We Solve</Label>
                <Heading level={2} size="h1" className="mb-4">
                  India has 300M loan-eligible borrowers. Most get rejected.
                </Heading>
                <Paragraph color="secondary" className="mb-4">
                  The reason isn't creditworthiness. It's mismatch. A borrower with a 720
                  CIBIL score applies to a bank that requires 750. Rejected — and their
                  score drops from the hard enquiry. They try again. Rejected again.
                </Paragraph>
                <Paragraph color="secondary" className="mb-4">
                  Traditional loan marketplaces show you a list of lenders. They don't tell
                  you which ones will actually approve you. So borrowers guess — and pay the
                  price in rejections, lower scores, and higher rates.
                </Paragraph>
                <Paragraph color="secondary">
                  LeapMoney built LeapScore™ and LeapMatch™ to solve exactly this. We check
                  your profile against each lender's actual underwriting criteria — before
                  you apply — and show you only the lenders who are likely to say yes.
                </Paragraph>
              </div>
              <div className="rounded-2xl border border-border-token-default bg-background-card p-8">
                <Label caps className="mb-4 block">The LeapMoney Difference</Label>
                <div className="flex flex-col gap-3">
                  {[
                    "Soft pull only — zero impact on your CIBIL",
                    "4-bureau blend, not just CIBIL",
                    "Bank cash-flow analysis via Account Aggregator",
                    "Approval probability before you apply",
                    "Plain-language AI explanation for every match",
                    "Free — always, for borrowers",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-status-success" />
                      <span className="text-body-md text-foreground-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Values */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">What We Believe</Label>
              <Heading level={2} size="h1">Our principles</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {VALUES.map((v) => (
                <Card key={v.title} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-interactive-primary/10">
                      <v.icon size={18} className="text-interactive-primary" />
                    </div>
                    <Heading level={3} size="h3">{v.title}</Heading>
                  </div>
                  <Paragraph color="secondary">{v.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Team */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">The Team</Label>
              <Heading level={2} size="h1">Built by people who care about borrowers</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((t) => (
                <Card key={t.name} className="flex flex-col gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-interactive-primary/10">
                    <Users size={22} className="text-interactive-primary" />
                  </div>
                  <Heading level={3} size="h3">{t.name}</Heading>
                  <span className="text-body-sm font-semibold text-interactive-primary">{t.role}</span>
                  <Paragraph color="secondary">{t.bio}</Paragraph>
                </Card>
              ))}
              <Card className="flex flex-col items-start justify-between gap-4 border-dashed">
                <div>
                  <Heading level={3} size="h3" className="mb-2">Join the Team</Heading>
                  <Paragraph color="secondary">
                    We are hiring engineers, product designers, and fintech experts who want
                    to build India's AI-first loan platform.
                  </Paragraph>
                </div>
                <Button variant="secondary" size="sm">
                  <Link href="/careers">View Open Roles</Link>
                </Button>
              </Card>
            </div>
          </Container>
        </Section>

        {/* Compliance */}
        <Section background="feature">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block text-white/60">Compliance & Certifications</Label>
              <Heading level={2} size="h1" className="text-foreground-on-dark">
                Built for India. Regulated for trust.
              </Heading>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {COMPLIANCE.map((c) => (
                <div key={c} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <Building2 size={16} className="shrink-0 text-white/60" />
                  <span className="text-body-md text-foreground-on-dark">{c}</span>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <FeatureCta
          heading="See LeapMoney in action"
          body="Check your LeapScore free — no credit score impact. Get matched to lenders likely to approve you."
          ctaLabel="Check My LeapScore"
          ctaHref="/register"
        />
      </main>
      <Footer />
    </>
  );
}
