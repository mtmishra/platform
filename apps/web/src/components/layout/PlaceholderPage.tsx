import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Button,
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface PlaceholderPageProps {
  eyebrow?: string;
  title: string;
  description: string;
}

/**
 * Lightweight placeholder for routes that exist in the Phase 5 IA / navigation
 * but whose full content ships in a later sprint. Ensures no broken internal
 * links while keeping the page SEO-indexable.
 */
export function PlaceholderPage({
  eyebrow = "Coming Soon",
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <>
      <Header />
      <main>
        <Section background="page" className="py-20 lg:py-28">
          <Container>
            <div className="max-w-2xl">
              <Label caps className="mb-4 block">{eyebrow}</Label>
              <Heading level={1} size="display-large" className="mb-4">
                {title}
              </Heading>
              <Paragraph size="lg" color="secondary" className="mb-8">
                {description}
              </Paragraph>
              <Button variant="primary" size="lg">
                <Link href="/" className="flex items-center gap-2">
                  Back to Home <ArrowRight size={16} />
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
