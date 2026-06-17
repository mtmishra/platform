"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { Target, FileText, Clock, Undo2 } from "lucide-react";
import { BankFlowSteps } from "@/components/connect-bank/BankFlowSteps";

const CLAUSES = [
  {
    icon: <Target size={18} />,
    title: "Purpose",
    body: "To analyse your bank cash-flow and verify income, so we can refine your LeapScore and show offers you truly qualify for.",
  },
  {
    icon: <FileText size={18} />,
    title: "Data shared",
    body: "Read-only access to the last 6–12 months of bank statement transactions via the Account Aggregator. No login or password is ever shared with us.",
  },
  {
    icon: <Clock size={18} />,
    title: "Access duration",
    body: "A one-time fetch for this assessment. We do not get standing access and never move money — Account Aggregators cannot initiate transactions.",
  },
  {
    icon: <Undo2 size={18} />,
    title: "Revocation rights",
    body: "You can revoke this consent at any time from your profile or your Account Aggregator app. Revoking stops all future data sharing immediately.",
  },
];

export default function ConnectBankConsentPage() {
  const router = useRouter();
  const [agreed, setAgreed] = React.useState(false);

  function accept(): void {
    if (!agreed) return;
    try {
      const ref = (typeof crypto !== "undefined" && "randomUUID" in crypto) ? crypto.randomUUID() : `demo-${Date.now()}`;
      sessionStorage.setItem(
        "leap_demo_aa_consent",
        JSON.stringify({ id: ref, purpose: "aa_cashflow", version: "1.0", granted: true, created_at: new Date().toISOString() }),
      );
    } catch {
      /* ignore */
    }
    router.push("/connect-bank/fetching");
  }

  return (
    <div className="mx-auto max-w-card-md">
      <BankFlowSteps current="consent" />
      <Heading level={1} size="display-large" className="mb-2">Account Aggregator consent</Heading>
      <Paragraph color="secondary" className="mb-8">
        Your data is shared through an RBI-regulated Account Aggregator. Here&apos;s exactly what
        you&apos;re authorising, per the DPDP Act 2023 and the AA framework.
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
        <span>I consent to a one-time, read-only share of my bank statements via the Account Aggregator for the purpose above.</span>
      </label>

      <Button type="button" variant="primary" size="lg" className="mt-6 w-full" disabled={!agreed} onClick={accept}>
        I consent — connect my bank
      </Button>
    </div>
  );
}
