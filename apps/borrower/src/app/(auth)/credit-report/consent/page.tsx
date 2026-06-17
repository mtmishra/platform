"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { Target, Lock, Clock, Undo2 } from "lucide-react";
import { FlowSteps } from "@/components/credit-report/FlowSteps";

const CLAUSES = [
  {
    icon: <Target size={18} />,
    title: "Purpose of this check",
    body: "We fetch your credit report from CIBIL, Experian, CRIF and Equifax to compute your LeapScore, Credit Health, and matching lenders.",
  },
  {
    icon: <Lock size={18} />,
    title: "How your data is used",
    body: "Only to assess your loan eligibility and show offers you actually qualify for. We never sell your data and never make cold calls.",
  },
  {
    icon: <Clock size={18} />,
    title: "Retention",
    body: "Held only as long as needed for your active session and applications, in line with the DPDP Act 2023. You can request deletion anytime.",
  },
  {
    icon: <Undo2 size={18} />,
    title: "Your right to withdraw",
    body: "This is a soft check — it leaves no bureau footprint and consent can be withdrawn from your profile at any time. A hard pull happens only at application, behind separate consent.",
  },
];

export default function CreditReportConsentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = React.useState(false);

  function accept(): void {
    if (!agreed) return;
    try {
      const ref = (typeof crypto !== "undefined" && "randomUUID" in crypto)
        ? crypto.randomUUID()
        : `demo-${Date.now()}`;
      sessionStorage.setItem(
        "leap_demo_consent",
        JSON.stringify({
          id: ref,
          purpose: "bureau_pull",
          pull_type: "soft",
          version: "1.0",
          granted: true,
          created_at: new Date().toISOString(),
        }),
      );
    } catch {
      /* sessionStorage unavailable — flow still proceeds */
    }
    router.push("/credit-report/fetching");
  }

  return (
    <div className="mx-auto max-w-card-md">
      <FlowSteps current="consent" />
      <Heading level={1} size="display-large" className="mb-2">Your consent</Heading>
      <Paragraph color="secondary" className="mb-8">
        Before we fetch your report, here&apos;s exactly what you&apos;re agreeing to. This is required
        under the RBI Digital Lending Directions and the DPDP Act 2023.
      </Paragraph>

      <div className="flex flex-col gap-4">
        {CLAUSES.map((c) => (
          <div key={c.title} className="flex gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <span className="mt-0.5 flex-shrink-0 text-interactive-primary">{c.icon}</span>
            <div>
              <p className="text-body-md font-semibold text-foreground-primary">{c.title}</p>
              <p className="text-body-sm text-foreground-secondary">{c.body}</p>
            </div>
          </div>
        ))}
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-body-md text-foreground-secondary">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[color:var(--color-interactive-primary)]"
        />
        <span>I consent to LeapMoney performing a soft credit check across the four bureaus for the purpose described above.</span>
      </label>

      <Button
        type="button"
        variant="primary"
        size="lg"
        className="mt-6 w-full"
        disabled={!agreed}
        onClick={accept}
      >
        I consent — fetch my report
      </Button>
    </div>
  );
}
