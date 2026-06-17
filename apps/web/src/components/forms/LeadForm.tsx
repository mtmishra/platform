"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Input, Heading, Paragraph } from "@leapmoney/ui";
import { trackFormSubmit, track } from "@leapmoney/analytics";
import { LOAN_PRODUCTS } from "@/data/loans";
import {
  isFormValid,
  validateIndianPhone,
  validateName,
} from "@/lib/validation";

interface LeadFormProps {
  /** Pre-selected loan slug, e.g. when embedded on a loan page. */
  defaultLoan?: string;
  formId?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function LeadForm({ defaultLoan, formId = "lead_form" }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loan, setLoan] = useState(defaultLoan ?? LOAN_PRODUCTS[0]!.slug);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);

  function onFirstInteraction() {
    if (!started) {
      setStarted(true);
      track({ name: "form_start", properties: { form_id: formId } });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      name: validateName(name),
      phone: validateIndianPhone(phone),
    };
    setErrors(nextErrors);
    if (!isFormValid(nextErrors)) {
      trackFormSubmit(formId, false);
      return;
    }

    setStatus("submitting");
    try {
      // No backend in this sprint — simulate a network round-trip.
      await new Promise((resolve) => setTimeout(resolve, 700));
      trackFormSubmit(formId, true);
      track({ name: "registration_start", properties: { loan_type: loan } });
      setStatus("success");
    } catch {
      setStatus("error");
      trackFormSubmit(formId, false);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-lg border border-status-success/30 bg-background-card p-6">
        <CheckCircle2 size={28} className="text-status-success" />
        <Heading level={3} size="h2">You&apos;re all set, {name.split(" ")[0]}!</Heading>
        <Paragraph color="secondary">
          We&apos;ve received your details. The next step is a quick eligibility
          check — with no impact on your credit score. Our team will guide you
          through it shortly.
        </Paragraph>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={onFirstInteraction}
      noValidate
      className="flex flex-col gap-4 rounded-lg border border-border-token-default bg-background-card p-6"
      aria-label="Check eligibility"
    >
      <Heading level={3} size="h2">Check your eligibility</Heading>

      <Input
        label="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoComplete="name"
        placeholder="e.g. Priya Sharma"
      />

      <Input
        label="Mobile number"
        type="tel"
        inputMode="numeric"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        error={errors.phone}
        autoComplete="tel"
        prefix="+91"
        placeholder="10-digit mobile"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="loan-type" className="text-body-md font-medium text-foreground-primary">
          Loan type
        </label>
        <select
          id="loan-type"
          value={loan}
          onChange={(e) => setLoan(e.target.value)}
          className="h-11 w-full rounded-md border border-border-token-default bg-background-card px-3 text-body-lg text-foreground-primary focus:outline-none focus:ring-2 focus:ring-interactive-primary"
        >
          {LOAN_PRODUCTS.map((p) => (
            <option key={p.slug} value={p.slug}>{p.name}</option>
          ))}
        </select>
      </div>

      {status === "error" && (
        <p className="text-body-sm text-status-danger" role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Check Eligibility"}
      </Button>

      <p className="text-body-sm text-foreground-tertiary">
        No credit score impact · Takes 2 minutes · Free forever
      </p>
    </form>
  );
}
