import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
} from "@leapmoney/ui";
import type { BlogPost } from "@/data/blog";
import { getLoanProducts } from "@/data/loans";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogArticleTemplate({ post }: { post: BlogPost }) {
  const related = getLoanProducts(post.relatedLoans);

  return (
    <main>
      {/* Breadcrumb */}
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="text-body-sm text-foreground-tertiary">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/" className="hover:text-foreground-primary">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/blog" className="hover:text-foreground-primary">Blog</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground-secondary line-clamp-1">{post.title}</li>
          </ol>
        </nav>
      </Container>

      {/* Article header */}
      <Section background="page" className="py-8 lg:py-10">
        <Container className="max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <Label caps>{post.category}</Label>
            <span className="text-body-sm text-foreground-tertiary">
              {post.readingMinutes} min read
            </span>
          </div>
          <Heading level={1} size="display-large" className="mb-4">
            {post.title}
          </Heading>
          <p className="text-body-sm text-foreground-tertiary">
            By {post.author} · {formatDate(post.publishedAt)}
          </p>
        </Container>
      </Section>

      {/* Body */}
      <Section background="card" className="py-8 lg:py-10">
        <Container className="max-w-3xl">
          <article className="flex flex-col gap-8">
            {post.sections.map((section, index) => (
              <section key={index}>
                {section.heading && (
                  <Heading level={2} size="h1" className="mb-3">
                    {section.heading}
                  </Heading>
                )}
                <div className="flex flex-col gap-3">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <Paragraph key={pIndex} size="lg" color="secondary">
                      {paragraph}
                    </Paragraph>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </Container>
      </Section>

      {/* Related loan products — internal linking */}
      {related.length > 0 && (
        <Section background="page">
          <Container className="max-w-3xl">
            <Heading level={2} size="h2" className="mb-4">Related</Heading>
            <ul className="flex flex-col gap-2">
              {related.map((loan) => (
                <li key={loan.slug}>
                  <Link
                    href={`/${loan.slug}`}
                    className="inline-flex items-center gap-1 text-body-lg font-medium text-interactive-primary hover:underline"
                  >
                    {loan.name} <ArrowRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section background="feature">
        <Container className="max-w-3xl">
          <div className="flex flex-col items-start gap-4">
            <Heading level={2} size="h1" color="on-dark">
              Put this into practice
            </Heading>
            <Paragraph size="lg" color="on-dark" className="opacity-80">
              Check your eligibility free with LeapMatch™ — no credit score impact.
            </Paragraph>
            <Link
              href="/register"
              className="text-body-lg font-semibold text-foreground-on-dark underline"
            >
              Check my eligibility →
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
