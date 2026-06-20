import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Container, Heading, Paragraph, Section } from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <Section background="page" className="py-20 lg:py-28">
          <Container>
            <div className="max-w-2xl">
              <p className="mb-4 font-mono text-display-large font-bold tabular-nums text-interactive-primary/30">404</p>
              <Heading level={1} size="display-large" className="mb-4">Page not found</Heading>
              <Paragraph size="lg" color="secondary" className="mb-8">
                The page you're looking for doesn't exist or has been moved. Let's get you back on track.
              </Paragraph>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="lg">
                  <Link href="/" className="flex items-center gap-2">Back to home <ArrowRight size={16} /></Link>
                </Button>
                <Button variant="ghost" size="lg">
                  <Link href="/contact">Contact support</Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
