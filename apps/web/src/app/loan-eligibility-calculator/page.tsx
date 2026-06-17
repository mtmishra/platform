import type { Metadata } from "next";
import Link from "next/link";
import { Container, Heading, Label, Paragraph, Section } from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EligibilityCalculator } from "@/components/calculators/EligibilityCalculator";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Loan Eligibility Calculator | LeapMoney",
  description:
    "Estimate how much loan you can get based on your income and obligations. Free loan eligibility calculator for India. Then check your real eligibility free.",
  path: "/loan-eligibility-calculator",
});

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
          { name: "Loan Eligibility Calculator", path: "/loan-eligibility-calculator" },
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
              <li className="text-foreground-secondary">Loan Eligibility</li>
            </ol>
          </nav>
        </Container>

        <Section background="page" className="py-10 lg:py-12">
          <Container>
            <div className="mb-8 max-w-2xl">
              <Label caps className="mb-3 block">Eligibility Calculator</Label>
              <Heading level={1} size="display-large" className="mb-3">
                How much can you borrow?
              </Heading>
              <Paragraph size="lg" color="secondary">
                Estimate your indicative loan eligibility based on your income and
                existing obligations. Then check your real eligibility with LeapMatch™.
              </Paragraph>
            </div>
            <EligibilityCalculator />
          </Container>
        </Section>

        <Section background="card">
          <Container>
            <div className="flex flex-col items-start gap-4">
              <Heading level={2} size="h1">Get your real eligibility — free</Heading>
              <Paragraph color="secondary" className="max-w-xl">
                This is an estimate. LeapMatch™ checks you against 30+ lender policies
                and shows the lenders most likely to approve you — no credit score impact.
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
