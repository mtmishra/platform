import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";

export const metadata = { title: "Get started — LeapMoney" };

export default function OnboardPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background-page p-4">
      <div className="w-full max-w-card-md rounded-xl border border-border-token-default bg-background-card p-8 shadow-2">
        <Heading level={1} size="h1" className="mb-2">Welcome to LeapMoney</Heading>
        <Paragraph color="secondary" className="mb-6">
          Here&apos;s what to expect. Onboarding steps will be enabled as we build them out.
        </Paragraph>

        <OnboardingChecklist current="registered" />

        <div className="mt-6 flex gap-3">
          <Button variant="primary" size="lg">
            <Link href="/login">Sign in to continue</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
