import type { Metadata } from "next";
import {
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
import { JourneyStrip } from "@/components/feature/JourneyStrip";
import { FaqAccordion } from "@/components/feature/FaqAccordion";
import { FeatureCta } from "@/components/feature/FeatureCta";
import { buildMetadata, breadcrumbSchema, faqPageSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Compare Loans on True Cost of Borrowing | LeapMoney",
  description:
    "The lowest rate isn't always the cheapest loan. LeapMoney compares lenders on Total Cost of Borrowing — rate plus fees — so you choose the best overall deal.",
  path: "/compare",
});

const SAMPLE = [
  { lender: "Lender A", rate: "10.5%", fee: "₹12,000", tcb: "₹1,98,400", best: false },
  { lender: "Lender B", rate: "10.9%", fee: "₹3,000", tcb: "₹1,91,200", best: true },
];

const FAQS = [
  { question: "What is Total Cost of Borrowing (TCB)?", answer: "TCB is the all-in cost of a loan — the interest you pay plus processing fees and other charges over the full tenure. It's the truest way to compare loans." },
  { question: "Why isn't the lowest rate always the best?", answer: "A loan with a slightly lower rate but a high processing fee can cost more overall than one with a marginally higher rate and low fees. TCB captures this; the headline rate doesn't." },
  { question: "Does LeapMoney's comparison cost anything?", answer: "No. Comparing your matches is free, and there's no obligation to apply." },
  { question: "How does the AI summary help?", answer: "Our AI explains, in plain English, why one option may be better for your situation — so you don't have to decode the fine print yourself." },
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
            { name: "Compare", path: "/compare" },
          ]),
        ]}
      />
      <main>
        <FeatureBreadcrumb title="AI Comparison" />

        <Section background="page" className="py-10 lg:py-16">
          <Container>
            <div className="max-w-2xl">
              <Label caps className="mb-4 block">AI Bank Comparison</Label>
              <Heading level={1} size="display-hero" className="mb-4">
                The lowest rate isn&apos;t always the cheapest loan
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-6">
                Two loans with similar rates can cost very different amounts once
                fees are included. LeapMoney compares lenders on Total Cost of
                Borrowing — so you see the real winner, not just the flashiest rate.
              </Paragraph>
            </div>
          </Container>
        </Section>

        {/* Sample TCB comparison */}
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">True cost in action</Label>
              <Heading level={2} size="h1">A lower rate, a higher total cost</Heading>
              <Paragraph color="secondary" className="mt-3 max-w-xl">
                Example: ₹10 lakh over 3 years. Lender A has the lower rate, but its
                higher fee makes Lender B cheaper overall.
              </Paragraph>
            </div>
            <div className="overflow-hidden rounded-lg border border-border-token-default">
              <table className="w-full text-left">
                <thead className="bg-background-feature text-foreground-on-dark">
                  <tr>
                    <th className="px-4 py-3 text-body-md font-semibold">Lender</th>
                    <th className="px-4 py-3 text-body-md font-semibold">Rate</th>
                    <th className="px-4 py-3 text-body-md font-semibold">Processing fee</th>
                    <th className="px-4 py-3 text-body-md font-semibold">Total cost (TCB)</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE.map((row, i) => (
                    <tr key={row.lender} className={i % 2 === 0 ? "bg-background-card" : "bg-background-page"}>
                      <td className="px-4 py-3 text-body-md font-medium text-foreground-primary">
                        {row.lender}
                        {row.best && (
                          <span className="ml-2 rounded-full bg-status-success/10 px-2 py-0.5 text-body-sm font-semibold text-status-success">
                            Best value
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-body-md text-foreground-secondary">{row.rate}</td>
                      <td className="px-4 py-3 font-mono text-body-md text-foreground-secondary">{row.fee}</td>
                      <td className={`px-4 py-3 font-mono text-body-md font-semibold ${row.best ? "text-status-success" : "text-foreground-secondary"}`}>
                        {row.tcb}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-body-sm text-foreground-tertiary">
              Illustrative figures for explanation only.
            </p>
          </Container>
        </Section>

        <JourneyStrip activeKey="compare" />
        <FaqAccordion faqs={FAQS} heading="Comparison — frequently asked questions" />
        <FeatureCta
          heading="Compare your matches"
          body="See your real options ranked by true cost of borrowing — free, no credit score impact."
          ctaLabel="Compare lenders"
          ctaHref="/register"
        />
      </main>
      <Footer />
    </>
  );
}
