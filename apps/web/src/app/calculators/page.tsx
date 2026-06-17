import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
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
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Financial Calculators — EMI, Eligibility | LeapMoney",
  description:
    "Free financial calculators for loans in India: EMI calculator, loan eligibility calculator, and affordability calculator. Plan your loan with confidence.",
  path: "/calculators",
});

const CALCULATORS = [
  {
    title: "EMI Calculator",
    href: "/emi-calculator",
    description: "Work out your monthly EMI, total interest, and total payment for any loan amount, rate, and tenure.",
  },
  {
    title: "Loan Eligibility Calculator",
    href: "/loan-eligibility-calculator",
    description: "Estimate how much you can borrow based on your income, existing obligations, and FOIR.",
  },
  {
    title: "Affordability Calculator",
    href: "/affordability-calculator",
    description: "Find a loan amount that fits a monthly EMI you're comfortable paying — borrow within your means.",
  },
] as const;

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Calculators", path: "/calculators" },
        ])}
      />
      <main>
        <Section background="page" className="py-12 lg:py-16">
          <Container>
            <div className="mb-10 max-w-2xl">
              <Label caps className="mb-3 block">Calculators</Label>
              <Heading level={1} size="display-large" className="mb-3">
                Financial calculators
              </Heading>
              <Paragraph size="lg" color="secondary">
                Plan your loan before you apply. Our free calculators help you
                understand EMIs, eligibility, and what you can comfortably afford.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {CALCULATORS.map((calc) => (
                <Link key={calc.href} href={calc.href}>
                  <Card hoverable className="h-full">
                    <CardHeader>
                      <Heading level={3} size="h3">{calc.title}</Heading>
                    </CardHeader>
                    <CardBody>
                      <p className="text-body-sm text-foreground-secondary">{calc.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-interactive-primary">
                        Open calculator <ArrowRight size={14} />
                      </span>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
