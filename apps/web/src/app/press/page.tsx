import type { Metadata } from "next";
import { Download, Mail, ArrowRight, Newspaper } from "lucide-react";
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
  title: "Press & Media — LeapMoney",
  description:
    "LeapMoney press resources, media kit, company facts, and PR contact. Download brand assets and get in touch with our communications team.",
  path: "/press",
});

const COMPANY_FACTS = [
  { label: "Founded", value: "2025" },
  { label: "Headquarters", value: "Mumbai, India" },
  { label: "Product", value: "AI-powered loan marketplace" },
  { label: "Lender Network", value: "47+ banks, NBFCs & fintechs" },
  { label: "Core Technology", value: "LeapScore™ + LeapMatch AI™ + LeapAI Copilot" },
  { label: "Bureau Partnerships", value: "CIBIL, Experian, CRIF, Equifax" },
  { label: "Compliance", value: "RBI DLG 2022, DPDP Act 2023" },
  { label: "Data Residency", value: "India only (AWS Mumbai)" },
];

const BRAND_ASSETS = [
  { name: "LeapMoney Logo Pack", format: "SVG + PNG", desc: "Primary, white, and dark variants" },
  { name: "Brand Colors & Typography", format: "PDF", desc: "Design system overview" },
  { name: "Product Screenshots", format: "PNG (2x)", desc: "Homepage, LeapScore, LeapMatch" },
  { name: "Founder Headshot", format: "JPG (Hi-res)", desc: "Press-ready photography" },
];

const COVERAGE = [
  { outlet: "YourStory", headline: "LeapMoney is building India's AI-first loan matching platform", date: "Coming Soon" },
  { outlet: "Inc42", headline: "How AI is transforming credit access for India's middle class", date: "Coming Soon" },
  { outlet: "Mint", headline: "Four-bureau blending: the next evolution in Indian credit scoring", date: "Coming Soon" },
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
            { name: "Press", path: "/press" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="Press & Media" />

        <Section background="page" className="py-12 lg:py-20">
          <Container>
            <div className="max-w-3xl">
              <Label caps className="mb-4 block">Press & Media</Label>
              <Heading level={1} size="display-hero" className="mb-6">
                LeapMoney in the news.
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-8 max-w-2xl">
                For press enquiries, interview requests, and media assets — contact our
                communications team. We respond within 24 hours.
              </Paragraph>
              <Button variant="primary" size="lg">
                <Link href="mailto:press@leapmoney.net" className="flex items-center gap-2">
                  <Mail size={16} /> press@leapmoney.net
                </Link>
              </Button>
            </div>
          </Container>
        </Section>

        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Company Facts</Label>
              <Heading level={2} size="h1">LeapMoney at a glance</Heading>
            </div>
            <div className="overflow-hidden rounded-xl border border-border-token-default">
              <table className="w-full text-left">
                <tbody>
                  {COMPANY_FACTS.map((f, i) => (
                    <tr key={f.label} className={i % 2 === 0 ? "bg-background-card" : "bg-background-page"}>
                      <td className="w-48 px-5 py-3 text-body-md font-semibold text-foreground-secondary">{f.label}</td>
                      <td className="px-5 py-3 text-body-md text-foreground-primary">{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </Section>

        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Brand Assets</Label>
              <Heading level={2} size="h1">Download media kit</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {BRAND_ASSETS.map((a) => (
                <Card key={a.name} className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <Heading level={3} size="h3">{a.name}</Heading>
                    <span className="text-body-sm text-foreground-tertiary">{a.desc} · {a.format}</span>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Link href="mailto:press@leapmoney.net?subject=Media Kit Request" className="flex items-center gap-2">
                      <Download size={14} /> Request
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Media Coverage</Label>
              <Heading level={2} size="h1">LeapMoney in the press</Heading>
            </div>
            <div className="flex flex-col gap-4">
              {COVERAGE.map((c) => (
                <Card key={c.headline} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background-page">
                    <Newspaper size={18} className="text-foreground-tertiary" />
                  </div>
                  <div>
                    <span className="text-body-sm font-bold text-interactive-primary">{c.outlet}</span>
                    <Heading level={3} size="h3" className="mt-1">{c.headline}</Heading>
                    <span className="text-body-sm text-foreground-tertiary">{c.date}</span>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <Section background="feature">
          <Container>
            <div className="mx-auto max-w-xl text-center">
              <Mail size={32} className="mx-auto mb-4 text-white/60" />
              <Heading level={2} size="display-large" className="mb-4 text-foreground-on-dark">
                Get in touch with our PR team.
              </Heading>
              <Paragraph size="lg" className="mb-8 text-white/70">
                We respond to all press enquiries within 24 hours.
              </Paragraph>
              <Button variant="primary" size="lg">
                <Link href="mailto:press@leapmoney.net" className="flex items-center gap-2">
                  press@leapmoney.net <ArrowRight size={16} />
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
