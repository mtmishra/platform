import React from "react";
import {
  Container,
  Heading,
  Paragraph,
  Section,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

export function LegalPage({ title, lastUpdated, intro, sections }: LegalPageProps) {
  return (
    <>
      <Header />
      <main>
        <Section background="page" className="py-12 lg:py-16">
          <Container className="max-w-card-md lg:max-w-3xl">
            <Heading level={1} size="display-large" className="mb-3">
              {title}
            </Heading>
            <p className="text-body-sm text-foreground-tertiary mb-8">
              Last updated: {lastUpdated}
            </p>

            <Paragraph size="lg" color="secondary" className="mb-10">
              {intro}
            </Paragraph>

            <div className="flex flex-col gap-8">
              {sections.map((section) => (
                <section key={section.heading}>
                  <Heading level={2} size="h1" className="mb-3">
                    {section.heading}
                  </Heading>
                  <div className="flex flex-col gap-3">
                    {section.body.map((paragraph, index) => (
                      <Paragraph key={index} color="secondary">
                        {paragraph}
                      </Paragraph>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
