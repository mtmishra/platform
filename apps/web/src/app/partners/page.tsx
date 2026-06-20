import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, TrendingUp, Users, BarChart3 } from "lucide-react";
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
import { FeatureCta } from "@/components/feature/FeatureCta";
import { buildMetadata, breadcrumbSchema, organizationSchema } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = buildMetadata({
  title: "Partner With LeapMoney — DSA, Lender & Referral Programmes",
  description:
    "Join LeapMoney's partner network. DSA agents earn more with AI-powered lead matching. Lenders get pre-screened, high-intent borrowers. Referrers earn ₹1,000 per successful loan.",
  path: "/partners",
});

const PARTNER_TYPES = [
  {
    icon: Users,
    title: "DSA Partners",
    subtitle: "For loan agents & agencies",
    color: "text-interactive-primary",
    bgColor: "bg-interactive-primary/10",
    benefits: [
      "LeapMatch AI routes borrowers to the right lender — improving your conversion",
      "Manage leads, documents, and commissions in one portal",
      "Submit to 47+ lenders from a single dashboard",
      "Real-time application status for every client",
      "Transparent commission tracker with on-time payouts",
    ],
    cta: "Join as DSA Partner",
    href: "/dsa",
  },
  {
    icon: BarChart3,
    title: "Lender Partners",
    subtitle: "For banks, NBFCs & fintechs",
    color: "text-status-success",
    bgColor: "bg-status-success/10",
    benefits: [
      "Pre-screened borrowers matched to your underwriting criteria",
      "Reduced rejection rates — borrowers arrive knowing they qualify",
      "Real-time API integration for instant decisioning",
      "LeapScore™ data enrichment for better credit decisions",
      "AI Spotlight — explain your product in the borrower's language",
    ],
    cta: "Apply as Lender Partner",
    href: "/lenders",
  },
  {
    icon: TrendingUp,
    title: "Referral Partners",
    subtitle: "For individuals who know someone",
    color: "text-status-warning",
    bgColor: "bg-status-warning/10",
    benefits: [
      "Earn ₹1,000 for every successful loan disbursed through your referral",
      "Share your unique referral link via WhatsApp, email, or social",
      "Track referral status and earnings in real time",
      "No cap on earnings — refer as many as you like",
      "Instant payout via UPI within 7 days of disbursal",
    ],
    cta: "Start Referring",
    href: "/register",
  },
];

const FAQS = [
  {
    question: "How do I become a DSA partner?",
    answer: "Apply through the DSA portal at dsa.leapmoney.net or via the /dsa page. Our team will verify your details and onboard you within 2–3 business days.",
  },
  {
    question: "How does lender integration work?",
    answer: "We provide a REST API and webhook-based integration. Our team provides technical documentation and support throughout the integration process. Go-live typically takes 5–10 business days.",
  },
  {
    question: "How much can I earn as a referrer?",
    answer: "₹1,000 per successful loan disbursed through your referral link. There is no cap — you can refer as many people as you like. Payouts are via UPI within 7 days of disbursal.",
  },
  {
    question: "Is there a cost to join as a partner?",
    answer: "No cost for DSA agents or referrers. Lender integration is also free — LeapMoney earns only on successful disbursals.",
  },
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
            { name: "Partners", path: "/partners" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="Partner Programme" />

        <Section background="page" className="py-12 lg:py-20">
          <Container>
            <div className="max-w-3xl">
              <Label caps className="mb-4 block">LeapMoney Partner Network</Label>
              <Heading level={1} size="display-hero" className="mb-6">
                Grow your business with India's AI-first loan platform.
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-8 max-w-2xl">
                Whether you're a DSA agent, a lender, or someone who wants to refer friends —
                there's a LeapMoney partner programme built for you.
              </Paragraph>
              <TrustBar variant="security" />
            </div>
          </Container>
        </Section>

        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Choose Your Path</Label>
              <Heading level={2} size="h1">Three ways to partner with LeapMoney</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {PARTNER_TYPES.map((p) => (
                <Card key={p.title} className="flex flex-col gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${p.bgColor}`}>
                    <p.icon size={22} className={p.color} />
                  </div>
                  <div>
                    <Heading level={3} size="h2">{p.title}</Heading>
                    <span className={`text-body-sm font-semibold ${p.color}`}>{p.subtitle}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {p.benefits.map((b) => (
                      <div key={b} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${p.color}`} />
                        <span className="text-body-sm text-foreground-secondary">{b}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" size="md" className="mt-auto">
                    <Link href={p.href} className="flex items-center gap-2">
                      {p.cta} <ArrowRight size={14} />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section background="feature">
          <Container>
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                { value: "47+", label: "Lender Partners" },
                { value: "₹1,000", label: "Per Referral Earned" },
                { value: "30+", label: "DSA Cities" },
                { value: "₹0", label: "Partner Joining Fee" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <span className="font-mono text-display-large font-bold text-white">{s.value}</span>
                  <p className="mt-1 text-body-md text-white/70">{s.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        <FaqAccordion faqs={FAQS} heading="Partner programme — FAQs" />
        <FeatureCta
          heading="Ready to partner with LeapMoney?"
          body="Join India's fastest-growing AI-first loan platform. DSAs, lenders, and referrers welcome."
          ctaLabel="Apply Now"
          ctaHref="/dsa"
        />
      </main>
      <Footer />
    </>
  );
}
