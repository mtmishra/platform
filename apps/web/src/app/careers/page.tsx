import type { Metadata } from "next";
import { ArrowRight, MapPin, Clock, Zap } from "lucide-react";
import {
  Card,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
  Button,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { FeatureBreadcrumb } from "@/components/feature/FeatureBreadcrumb";
import { buildMetadata, breadcrumbSchema, organizationSchema } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Careers at LeapMoney — Join India's AI-First Loan Platform",
  description:
    "Build the future of lending in India. LeapMoney is hiring engineers, designers, and fintech experts who want to make credit access fair, fast, and transparent.",
  path: "/careers",
});

const OPEN_ROLES = [
  {
    title: "Senior Full-Stack Engineer",
    team: "Engineering",
    location: "Remote (India)",
    type: "Full-time",
    tags: ["Next.js", "TypeScript", "Supabase"],
  },
  {
    title: "AI Product Manager",
    team: "Product",
    location: "Remote (India)",
    type: "Full-time",
    tags: ["AI/ML", "Fintech", "Conversational AI"],
  },
  {
    title: "Credit Risk Analyst",
    team: "Risk",
    location: "Mumbai / Remote",
    type: "Full-time",
    tags: ["CIBIL", "Underwriting", "Python"],
  },
  {
    title: "UI/UX Designer — Fintech",
    team: "Design",
    location: "Remote (India)",
    type: "Full-time",
    tags: ["Figma", "Mobile-first", "Design Systems"],
  },
  {
    title: "DSA Partner Manager",
    team: "Growth",
    location: "Mumbai / Delhi / Bangalore",
    type: "Full-time",
    tags: ["DSA Network", "B2B Sales", "Lending"],
  },
  {
    title: "Compliance Officer — RBI / DPDP",
    team: "Legal & Compliance",
    location: "Mumbai",
    type: "Full-time",
    tags: ["RBI DLG", "DPDP 2023", "NBFC"],
  },
];

const PERKS = [
  { icon: "🏠", title: "Remote First", body: "Work from anywhere in India. We believe great work happens where you're most comfortable." },
  { icon: "🚀", title: "Equity", body: "ESOPs for every team member. When LeapMoney wins, you win." },
  { icon: "🧠", title: "Learning Budget", body: "₹50,000/year per employee for courses, books, and conferences." },
  { icon: "🏥", title: "Health Insurance", body: "Comprehensive medical insurance covering you and your family." },
  { icon: "⚡", title: "AI-First Culture", body: "We use AI in everything we do — including how we build products internally." },
  { icon: "📈", title: "Ownership", body: "Small team, big impact. You'll own meaningful parts of a product used by lakhs of Indians." },
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
            { name: "Careers", path: "/careers" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="Careers" />

        <Section background="page" className="py-12 lg:py-20">
          <Container>
            <div className="max-w-3xl">
              <Label caps className="mb-4 block">We're Hiring</Label>
              <Heading level={1} size="display-hero" className="mb-6">
                Build the future of lending in India.
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-8 max-w-2xl">
                LeapMoney is making credit access fair, fast, and transparent for 300 million
                loan-eligible Indians. We're a small, AI-native team — and we're looking for
                people who care about this problem as much as we do.
              </Paragraph>
              <Button variant="primary" size="lg">
                <Link href="mailto:careers@leapmoney.net" className="flex items-center gap-2">
                  Send Us Your CV <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </Container>
        </Section>

        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Open Positions</Label>
              <Heading level={2} size="h1">{OPEN_ROLES.length} open roles</Heading>
            </div>
            <div className="flex flex-col gap-4">
              {OPEN_ROLES.map((role) => (
                <Card key={role.title} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <Heading level={3} size="h3">{role.title}</Heading>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-body-sm font-semibold text-interactive-primary">{role.team}</span>
                      <span className="flex items-center gap-1 text-body-sm text-foreground-tertiary">
                        <MapPin size={12} /> {role.location}
                      </span>
                      <span className="flex items-center gap-1 text-body-sm text-foreground-tertiary">
                        <Clock size={12} /> {role.type}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {role.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-background-page px-2 py-0.5 text-label-caps text-foreground-tertiary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="shrink-0">
                    <Link href={`mailto:careers@leapmoney.net?subject=Application: ${role.title}`} className="flex items-center gap-2">
                      Apply <ArrowRight size={14} />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-body-sm text-foreground-tertiary">
              Don't see your role? Email{" "}
              <a href="mailto:careers@leapmoney.net" className="text-interactive-primary underline">
                careers@leapmoney.net
              </a>
              {" "}— we hire for talent, not just open positions.
            </p>
          </Container>
        </Section>

        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Why LeapMoney</Label>
              <Heading level={2} size="h1">What you get when you join</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PERKS.map((p) => (
                <Card key={p.title} className="flex flex-col gap-2">
                  <span className="text-2xl">{p.icon}</span>
                  <Heading level={3} size="h3">{p.title}</Heading>
                  <Paragraph color="secondary">{p.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section background="feature">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <Zap size={32} className="mx-auto mb-4 text-white/60" />
              <Heading level={2} size="display-large" className="mb-4 text-foreground-on-dark">
                Let's build this together.
              </Heading>
              <Paragraph size="lg" className="mb-8 text-white/70">
                Small team. Real impact. India-scale problem. If this is the kind of work you
                want to do, we'd love to hear from you.
              </Paragraph>
              <Button variant="primary" size="lg">
                <Link href="mailto:careers@leapmoney.net" className="flex items-center gap-2">
                  careers@leapmoney.net <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
