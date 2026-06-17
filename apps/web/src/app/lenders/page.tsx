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
import { buildMetadata, breadcrumbSchema, faqPageSchema } from "@/lib/seo";

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
