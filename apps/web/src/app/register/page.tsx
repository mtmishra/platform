import type { Metadata } from "next";
import { ShieldCheck, Zap, Users } from "lucide-react";
import { Container, Heading, Paragraph, Section, TrustBar } from "@leapmoney/ui";
import { buildMetadata } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = buildMetadata({
  title: "Check Your Loan Eligibility Free | LeapMoney",
  description:
    "Check your loan eligibility in 2 minutes — free, with no impact on your CIBIL score. LeapMoney matches you to lenders most likely to approve you.",
  path: "/register",
});

const STEPS = [
  {
    step: "01",
    title: "Tell us what you need",
    detail: "Name, mobile, and loan type — takes under 30 seconds.",
    icon: <Users size={20} />,
  },
  {
    step: "02",
    title: "Free soft credit check",
    detail: "Soft pull across all 4 bureaus — zero impact on your CIBIL score.",
    icon: <ShieldCheck size={20} />,
  },
  {
    step: "03",
    title: "Get your matched shortlist",
    detail: "LeapMatch AI ranks lenders by your approval probability — not commission.",
    icon: <Zap size={20} />,
  },
];

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main>
        <Section background="page" className="py-12 lg:py-20">
          <Container>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
              {/* Left: copy */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="mb-3 text-label-caps font-semibold uppercase tracking-wider text-interactive-primary">
                    Free · No CIBIL Impact · 2 Minutes
                  </p>
                  <Heading level={1} size="display-large" className="mb-4">
                    Check your loan eligibility free
                  </Heading>
                  <Paragraph size="lg" color="secondary">
                    LeapMoney matches you to the right lenders based on your actual credit
                    profile — transparently, fairly, and for free. See which lenders will
                    approve you before you apply.
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

                {/* Trust signals */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { icon: "🔒", label: "AES-256 Encrypted" },
                    { icon: "✅", label: "DPDP Compliant" },
                    { icon: "🏦", label: "RBI Registered" },
                    { icon: "⭐", label: "Soft Pull Only" },
                  ].map((t) => (
                    <div key={t.label} className="flex flex-col items-center gap-1 rounded-lg border border-border-token-default bg-background-card p-3 text-center">
                      <span className="text-xl">{t.icon}</span>
                      <span className="text-label-caps text-foreground-tertiary">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Lead Form */}
              <div>
                <LeadForm formId="register_page_lead" />
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
