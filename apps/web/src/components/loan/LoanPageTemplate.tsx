import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
} from "@leapmoney/ui";
import type { LoanProduct } from "@/data/loans";
import { getLoanProducts } from "@/data/loans";

interface LoanPageTemplateProps {
  product: LoanProduct;
}

export function LoanPageTemplate({ product }: LoanPageTemplateProps) {
  const related = getLoanProducts(product.related);

  return (
    <main>
      {/* Breadcrumb */}
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="text-body-sm text-foreground-tertiary">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-foreground-primary">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground-secondary">{product.name}</li>
          </ol>
        </nav>
      </Container>

      {/* Hero */}
      <Section background="page" className="py-10 lg:py-16">
        <Container>
          <div className="max-w-2xl">
            <Label caps className="mb-4 block">{product.name}</Label>
            <Heading level={1} size="display-large" className="mb-4">
              {product.name} — {product.rateFrom}
            </Heading>
            <Paragraph size="lg" color="secondary" className="mb-6">
              {product.tagline}
            </Paragraph>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-lg border border-border-token-default bg-background-card p-4">
                <dt className="text-body-sm text-foreground-tertiary">Loan amount</dt>
                <dd className="text-h3 font-semibold text-foreground-primary mt-1">{product.amountRange}</dd>
              </div>
              <div className="rounded-lg border border-border-token-default bg-background-card p-4">
                <dt className="text-body-sm text-foreground-tertiary">Interest rate</dt>
                <dd className="text-h3 font-semibold text-foreground-primary mt-1">{product.rateFrom}</dd>
              </div>
              <div className="rounded-lg border border-border-token-default bg-background-card p-4">
                <dt className="text-body-sm text-foreground-tertiary">Tenure</dt>
                <dd className="text-h3 font-semibold text-foreground-primary mt-1">{product.tenureRange}</dd>
              </div>
            </dl>

            <Button variant="primary" size="lg">
              <Link href="/register" className="flex items-center gap-2">
                Check Your Eligibility <ArrowRight size={16} />
              </Link>
            </Button>
            <p className="mt-4 text-body-sm text-foreground-tertiary">
              No credit score impact · Takes 2 minutes · Free forever
            </p>
          </div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section background="card">
        <Container>
          <div className="mb-8">
            <Label caps className="mb-3 block">Benefits</Label>
            <Heading level={2} size="h1">Why choose a {product.name} via LeapMoney</Heading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {product.benefits.map((b) => (
              <Card key={b.title} className="flex flex-col gap-3">
                <Sparkles size={22} className="text-interactive-primary" />
                <Heading level={3} size="h2">{b.title}</Heading>
                <Paragraph color="secondary">{b.description}</Paragraph>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Eligibility + Documents */}
      <Section background="page">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Label caps className="mb-3 block">Eligibility</Label>
              <Heading level={2} size="h1" className="mb-6">Who can apply</Heading>
              <ul className="flex flex-col gap-4">
                {product.eligibility.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-status-success" />
                    <span className="text-body-lg text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Label caps className="mb-3 block">Documents Required</Label>
              <Heading level={2} size="h1" className="mb-6">What you&apos;ll need</Heading>
              <ul className="flex flex-col gap-4">
                {product.documents.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <FileText size={20} className="mt-0.5 shrink-0 text-interactive-primary" />
                    <span className="text-body-lg text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Process */}
      <Section background="card">
        <Container>
          <div className="mb-8 text-center">
            <Label caps className="mb-3 block">How It Works</Label>
            <Heading level={2} size="h1">From eligibility to disbursal</Heading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.process.map((step, index) => (
              <div key={step.title} className="flex flex-col gap-3">
                <span className="text-display-large font-bold text-interactive-primary opacity-30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Heading level={3} size="h2">{step.title}</Heading>
                <Paragraph color="secondary">{step.description}</Paragraph>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section background="page">
        <Container>
          <div className="mb-8">
            <Label caps className="mb-3 block">FAQ</Label>
            <Heading level={2} size="h1">{product.name} — frequently asked questions</Heading>
          </div>
          <div className="flex flex-col gap-4 max-w-3xl">
            {product.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-border-token-default bg-background-card p-5"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-body-lg font-semibold text-foreground-primary">
                  {faq.question}
                  <span className="text-foreground-tertiary transition-transform duration-fast group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-body-md text-foreground-secondary">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      {/* Related products — internal linking */}
      {related.length > 0 && (
        <Section background="card">
          <Container>
            <div className="mb-8">
              <Label caps className="mb-3 block">Explore More</Label>
              <Heading level={2} size="h1">Other loan products</Heading>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.slug} href={`/${r.slug}`}>
                  <Card hoverable className="h-full">
                    <CardHeader>
                      <Heading level={3} size="h3">{r.name}</Heading>
                    </CardHeader>
                    <CardBody>
                      <p className="text-body-sm text-foreground-tertiary">{r.rateFrom}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-body-sm font-medium text-interactive-primary">
                        Learn more <ArrowRight size={14} />
                      </span>
                    </CardBody>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA Banner */}
      <Section background="feature">
        <Container>
          <div className="flex flex-col items-center text-center gap-6">
            <Heading level={2} size="display-large" color="on-dark">
              Ready to apply for your {product.name}?
            </Heading>
            <Paragraph size="lg" color="on-dark" className="max-w-lg opacity-80">
              Check your eligibility free with LeapMatch™ — no credit score impact.
              See the lenders most likely to approve you in minutes.
            </Paragraph>
            <Button variant="secondary" size="lg">
              <Link href="/register" className="flex items-center gap-2">
                Get Started Free <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
