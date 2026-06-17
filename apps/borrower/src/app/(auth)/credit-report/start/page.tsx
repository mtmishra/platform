"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Heading, Input, Paragraph } from "@leapmoney/ui";
import { ShieldCheck } from "lucide-react";
import { FlowSteps } from "@/components/credit-report/FlowSteps";

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function CreditReportStartPage() {
  const router = useRouter();
  const [pan, setPan] = React.useState("");
  const [name, setName] = React.useState("");
  const [dob, setDob] = React.useState("");
  const [errors, setErrors] = React.useState<{ pan?: string; name?: string; dob?: string }>({});

  function submit(e: React.FormEvent): void {
    e.preventDefault();
    const next: typeof errors = {};
    if (!pan.trim()) next.pan = "PAN is required.";
    else if (!PAN_RE.test(pan.trim().toUpperCase())) next.pan = "Enter a valid PAN (e.g. ABCDE1234F).";
    if (!name.trim()) next.name = "Full name is required.";
    if (!dob) next.dob = "Date of birth is required.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      sessionStorage.setItem("leap_demo_applicant", JSON.stringify({ pan: pan.trim().toUpperCase(), name, dob }));
    } catch {
      /* sessionStorage unavailable — flow still proceeds via query param */
    }
    router.push(`/credit-report/consent?pan=${encodeURIComponent(pan.trim().toUpperCase())}`);
  }

  return (
    <div className="mx-auto max-w-card-md">
      <FlowSteps current="details" />
      <Heading level={1} size="display-large" className="mb-2">Get your free credit report</Heading>
      <Paragraph color="secondary" className="mb-8">
        We&apos;ll use your PAN to fetch your credit profile across all four bureaus. This is a soft
        check — it never affects your credit score.
      </Paragraph>

      <form onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1">
        <Input
          label="PAN number"
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
          error={errors.pan}
          placeholder="ABCDE1234F"
          maxLength={10}
          autoCapitalize="characters"
        />
        <Input
          label="Full name (as on PAN)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          placeholder="Priya Sharma"
        />
        <Input
          label="Date of birth"
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          error={errors.dob}
        />
        <Button type="submit" variant="primary" size="lg">Continue</Button>
        <p className="flex items-center justify-center gap-1.5 text-body-sm text-foreground-tertiary">
          <ShieldCheck size={14} className="text-interactive-primary" />
          256-bit encrypted · No spam calls · Soft check only
        </p>
      </form>
    </div>
  );
}
