import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Users } from "lucide-react";
import { Button, Container, Heading, Paragraph, Section, TrustBar } from "@leapmoney/ui";
import { buildMetadata } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = buildMetadata({
  title: "Create Your Account | LeapMoney",
  description: "Join LeapMoney — India's AI-powered loan marketplace. Get matched with the right lender in minutes with a free soft credit check.",
  path: "/register",
});

const STEPS = [
  {
    step: "01",
    title: "Create your profile",
    detail: "Basic details, PAN, and employment — takes under 2 minutes.",
    icon: <Users size={20} />,
  },
  {
    step: "02",
    title: "Free credit check",
    detail: "Soft pull across all 4 bureaus — no impact on your score.",
    icon: <ShieldCheck size={20} />,
  },
  {
    step: "03",
    title: "Get matched instantly",
    detail: "LeapMatch AI ranks lenders by your approval odds, not commission.",
    icon: <Zap size={20} />,
  },
];

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main>
        <Section background="page" className="py-16 lg:py-24">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: copy */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="mb-3 text-label-caps font-semibold uppercase tracking-wider text-interactive-primary">Get Started Free</p>
                  <Heading level={1} size="display-large" className="mb-4">
                    Your loan journey starts here
                  </Heading>
                  <Paragraph size="lg" color="secondary">
                    LeapMoney matches you to the right lenders based on your credit profile — transparently, fairly, and with zero hidden fees.
                  </Paragraph>
                </div>

                <TrustBar variant="regulatory" />

                <ol className="flex flex-col gap-5">
                  {STEPS.map((s) => (
                    <li key={s.step} className="flex gap-4">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-interactive-primary/10 text-interactive-primary">
                        {s.icon}
                      </span>
                      <div>
                        <p className="text-body-md font-semibold text-foreground-primary">{s.title}</p>
                        <p className="text-body-sm text-foreground-secondary">{s.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Right: CTA card */}
              <div className="flex flex-col justify-center">
                <div className="rounded-2xl border border-border-token-default bg-background-card p-8 shadow-2">
                  <Heading level={2} size="h1" className="mb-2">Create your account</Heading>
                  <Paragraph color="secondary" className="mb-6">
                    Registration and OTP verification are handled securely in the LeapMoney borrower app.
                  </Paragraph>
                  <Button variant="primary" size="lg" className="w-full">
                    <Link href="http://localhost:3001/onboard" className="flex items-center justify-center gap-2">
                      Start registration <ArrowRight size={18} />
                    </Link>
                  </Button>
                  <p className="mt-4 text-center text-body-sm text-foreground-tertiary">
                    Already have an account?{" "}
                    <Link href="http://localhost:3001/login" className="font-medium text-interactive-primary hover:underline">
                      Sign in
                    </Link>
                  </p>
                  <p className="mt-6 text-center text-body-xs text-foreground-tertiary">
                    By registering, you agree to our{" "}
                    <Link href="/terms-of-service" className="underline">Terms of Service</Link>{" "}
                    and{" "}
                    <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
                    We perform a soft credit check — no score impact.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
