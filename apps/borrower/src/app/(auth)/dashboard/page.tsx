import Link from "next/link";
import { FileText, Gauge, Sparkles } from "lucide-react";
import { Button, Card, Heading, Paragraph } from "@leapmoney/ui";
import { getProfile } from "@/lib/auth";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";

export const metadata = { title: "Dashboard — LeapMoney" };

export default async function DashboardPage() {
  const profile = await getProfile();
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const step = profile?.onboarding_step ?? "registered";

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">
          Welcome, {firstName}
        </Heading>
        <Paragraph color="secondary">
          This is your LeapMoney dashboard. Your score, applications, and credit
          health will appear here as you progress.
        </Paragraph>
      </div>

      {/* Onboarding */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Get set up</Heading>
        <OnboardingChecklist current={step} />
      </section>

      {/* Empty states */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EmptyState
          icon={<Gauge size={28} />}
          title="No LeapScore yet"
          description="Once you complete your profile, we'll calculate your LeapScore — a 0–100 view of how loan-ready you are."
          action={
            <Button variant="secondary" size="sm">
              <Link href="/profile">Complete profile</Link>
            </Button>
          }
        />
        <EmptyState
          icon={<FileText size={28} />}
          title="No applications yet"
          description="When you apply for a loan, you'll be able to track every application and its status right here."
        />
      </section>

      {/* Next step */}
      <Card variant="feature" className="flex flex-col gap-3">
        <Sparkles size={24} className="text-premium" />
        <Heading level={2} size="h2" color="on-dark">Your next step</Heading>
        <Paragraph color="on-dark" className="opacity-80">
          Complete your profile so we can personalise your experience and prepare
          your eligibility check.
        </Paragraph>
        <div>
          <Button variant="secondary" size="md">
            <Link href="/profile">Go to profile</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
