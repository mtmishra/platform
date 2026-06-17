"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Heading, Paragraph } from "@leapmoney/ui";
import { Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { BankFlowSteps } from "@/components/connect-bank/BankFlowSteps";

const BANKS = ["HDFC Bank", "ICICI Bank", "Axis Bank", "State Bank of India", "Kotak Mahindra", "Other bank"] as const;

export default function ConnectBankPage() {
  const router = useRouter();
  const [selected, setSelected] = React.useState<string | null>(null);

  function choose(bank: string): void {
    setSelected(bank);
    try {
      sessionStorage.setItem("leap_demo_bank", bank);
    } catch {
      /* ignore */
    }
    router.push("/connect-bank/consent");
  }

  return (
    <div className="mx-auto max-w-card-md">
      <BankFlowSteps current="select" />
      <Heading level={1} size="display-large" className="mb-2">Connect your bank</Heading>
      <Paragraph color="secondary" className="mb-8">
        Securely share your bank statements via Account Aggregator to unlock Income &amp; Cash Flow
        Intelligence. This sharpens your LeapScore and the offers you qualify for — read-only, revocable anytime.
      </Paragraph>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BANKS.map((bank) => (
          <button
            key={bank}
            type="button"
            onClick={() => choose(bank)}
            className={[
              "group flex items-center gap-3 rounded-lg border bg-background-card p-4 text-left shadow-1 transition-all duration-fast hover:shadow-2",
              selected === bank ? "border-interactive-primary ring-1 ring-interactive-primary/40" : "border-border-token-default",
            ].join(" ")}
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-interactive-primary/10 text-interactive-primary">
              <Building2 size={18} />
            </span>
            <span className="flex-1 text-body-md font-medium text-foreground-primary">{bank}</span>
            <ArrowRight size={16} className="text-foreground-tertiary transition-transform duration-fast group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>

      <p className="mt-6 flex items-center justify-center gap-1.5 text-body-sm text-foreground-tertiary">
        <ShieldCheck size={14} className="text-interactive-primary" />
        RBI-regulated Account Aggregator · Read-only · You control access
      </p>
    </div>
  );
}
