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
  title: "For Lenders — Pre-Qualified Loan Leads | LeapMoney",
  description:
    "Partner with LeapMoney to receive pre-qualified, FOIR-checked, document-ready loan applications. Reduce underwriting effort and improve approval rates. Request a demo.",
  path: "/lenders",
});

const VALUE = [
  { title: "Pre-qualified leads", body: "Every applicant is screened by LeapScore™ and matched to your policy before they reach you." },
  { title: "FOIR pre-checked", body: "Affordability is assessed upfront, reducing the volume of unviable applications." },
  { title: "Documents ready", body: "Applications arrive with KYC and income documents collected and organised." },
  { title: "Better conversion", body: "Higher-intent, better-fit applicants mean stronger approval-to-disbursal rates." },
];

const FAQS = [
  { question: "What kind of leads will we receive?", answer: "Borrowers pre-screened against your eligibility policy, with a LeapScore™, FOIR assessment, and the documents needed to underwrite — so your team spends less time on unviable cases." },
  { question: "How do we integrate?", answer: "You receive applications through the lender portal and, optionally, via webhook into your systems. Our team supports onboarding and integration." },
  { question: "What loan products are supported?", answer: "Personal, home, business, and loan against property, with more products on the roadmap." },
  { question: "How do we get started?", answer: "Request a demo and our partnerships team will walk you through lead quality, the portal, and onboarding." },
];

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={[
          organizationSchema(),
          serviceSchema({
            name: "LeapMoney for Lenders",
            description:
              "Pre-qualified, FOIR-checked, document-ready loan applications matched to your policy, delivered via the lender portal.",
            url: "/lenders",
            serviceType: "Lead origination for lenders",
          }),
          faqPageSchema(FAQS),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "For Lenders", path: "/lenders" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="For Lenders" />

        <Section background="page" className="py-10 lg:py-16">
          <Container>
            <div className="max-w-2xl">
              <Label caps className="mb-4 block">For Lenders</Label>
              <Heading level={1} size="display-hero" className="mb-4">
                Pre-qualified borrowers, ready to underwrite
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-6">
                LeapMoney sends you applicants who already fit your policy — screened
                by LeapScore™, FOIR-checked, and document-ready. Less wasted
                underwriting effort, better conversion.
              </Paragraph>
            </div>
          </Container>
        </Section>

        {/* Lead quality proof */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Lead quality</Label>
              <Heading level={2} size="h1">Quality you can see before you underwrite</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {VALUE.map((v) => (
                <Card key={v.title} className="flex flex-col gap-2">
                  <Heading level={3} size="h2">{v.title}</Heading>
                  <Paragraph color="secondary">{v.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Applicant pool snapshot */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Applicant pool</Label>
              <Heading level={2} size="h1">A higher-quality top of funnel</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { stat: "LeapScore™", label: "Every applicant is scored 0–100" },
                { stat: "FOIR", label: "Affordability checked upfront" },
                { stat: "KYC-ready", label: "Documents collected before submission" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-h1 font-bold text-interactive-primary">{item.stat}</p>
                  <p className="mt-1 text-body-md text-foreground-secondary">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-body-sm text-foreground-tertiary">
              Illustrative. Specific pool metrics are shared during your demo.
            </p>
          </Container>
        </Section>

        {/* Lead quality process */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Lead quality process</Label>
              <Heading level={2} size="h1">How every lead is qualified before it reaches you</Heading>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { step: "Score", body: "Each borrower is scored 0–100 by LeapScore™." },
                { step: "Filter", body: "Hard eligibility filters remove anyone who doesn't fit your policy." },
                { step: "Assess", body: "FOIR and affordability are checked before routing." },
                { step: "Package", body: "KYC and income documents are collected and organised." },
              ].map((s, i) => (
                <div key={s.step} className="flex flex-col gap-2">
                  <span className="font-mono text-h2 font-bold text-interactive-primary opacity-40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Heading level={3} size="h3">{s.step}</Heading>
                  <Paragraph color="secondary">{s.body}</Paragraph>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Match engine benefits */}
        <Section background="page">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Match engine benefits</Label>
              <Heading level={2} size="h1">Why our matching works for lenders</Heading>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                { title: "Policy-aligned routing", body: "Leads are routed only to lenders whose criteria they meet — less noise, higher conversion." },
                { title: "Lower acquisition cost", body: "Pre-qualification reduces wasted underwriting on unviable applications." },
                { title: "Privacy by design", body: "You receive LeapScore band and derived metrics — never raw bureau reports — with access controls enforced." },
              ].map((c) => (
                <Card key={c.title} className="flex flex-col gap-2">
                  <Heading level={3} size="h3">{c.title}</Heading>
                  <Paragraph color="secondary">{c.body}</Paragraph>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        <FaqAccordion faqs={FAQS} heading="For Lenders — frequently asked questions" background="card" />
        <FeatureCta
          heading="Request a demo"
          body="See lead quality, the lender portal, and how LeapMoney fits your underwriting flow."
          ctaLabel="Request a demo"
          ctaHref="/contact"
        />
      </main>
      <Footer />
    </>
  );
}
