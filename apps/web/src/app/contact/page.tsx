import type { Metadata } from "next";
import { Container, Heading, Label, Paragraph, Section } from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us | LeapMoney",
  description:
    "Get in touch with the LeapMoney team. Questions about loans, partnerships, or your account? Reach us at support@leapmoney.net or use our contact form.",
  path: "/contact",
});

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <main>
        <Section background="page" className="py-12 lg:py-16">
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <Label caps className="mb-3 block">Contact</Label>
                <Heading level={1} size="display-large" className="mb-4">
                  Get in touch
                </Heading>
                <Paragraph size="lg" color="secondary" className="mb-6">
                  Have a question about loans, partnerships, or your account? Send us
                  a message and our team will get back to you within 1–2 business days.
                </Paragraph>
                <div className="flex flex-col gap-2">
                  <p className="text-body-md text-foreground-secondary">
                    <span className="font-medium text-foreground-primary">Email:</span>{" "}
                    support@leapmoney.net
                  </p>
                  <p className="text-body-md text-foreground-secondary">
                    <span className="font-medium text-foreground-primary">Grievance:</span>{" "}
                    See our Grievance Redressal page for escalations.
                  </p>
                </div>
              </div>

              <ContactForm />
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
