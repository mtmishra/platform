import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Label, Paragraph, Section } from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AffordabilityCalculator } from "@/components/calculators/AffordabilityCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Loan Affordability Calculator | LeapMoney",
  description:
    "Find a loan amount that fits a monthly EMI you're comfortable paying. Free affordability calculator for India. Borrow within your means with LeapMoney.",
  path: "/affordability-calculator",
});

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Affordability Calculator", path: "/affordability-calculator" },
        ])}
      />
      <main>
        <Container className="pt-6">
          <nav aria-label="Breadcrumb" className="text-body-sm text-foreground-tertiary">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="hover:text-foreground-primary">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/calculators" className="hover:text-foreground-primary">Calculators</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground-secondary">Affordability</li>
            </ol>
          </nav>
        </Container>

        <Section background="page" className="py-10 lg:py-12">
          <Container>
            <div className="mb-8 max-w-2xl">
              <Label caps className="mb-3 block">Affordability Calculator</Label>
              <Heading level={1} size="display-large" className="mb-3">
                What can you comfortably afford?
              </Heading>
              <Paragraph size="lg" color="secondary">
                Start with the monthly EMI you&apos;re comfortable paying and see the
                loan amount it supports. Always borrow within your means.
              </Paragraph>
            </div>
            <AffordabilityCalculator />
          </Container>
        </Section>

        <Section background="card">
          <Container>
            <div className="flex flex-col items-start gap-4">
              <Heading level={2} size="h1">Ready to find your match?</Heading>
              <Paragraph color="secondary" className="max-w-xl">
                Once you know your comfortable budget, let LeapMatch™ find the lenders
                most likely to approve you — free, with no credit score impact.
              </Paragraph>
              <Link
                href="/register"
                className="text-body-lg font-semibold text-interactive-primary hover:underline"
              >
                Check my eligibility →
              </Link>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
