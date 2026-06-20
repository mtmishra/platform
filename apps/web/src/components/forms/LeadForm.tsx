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
    const waText = encodeURIComponent(`Hi LeapMoney! I just submitted my details for a ${loan.replace(/-/g, " ")}. My name is ${name} and mobile is ${phone}. Please help me check eligibility.`);
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-status-success/30 bg-background-card p-6">
        <CheckCircle2 size={28} className="text-status-success" />
        <Heading level={3} size="h2">You&apos;re all set, {name.split(" ")[0]}!</Heading>
        <Paragraph color="secondary">
          We&apos;ve received your details. Our AI is matching your profile now —
          you&apos;ll hear from us on <strong>+91 {phone}</strong> shortly.
        </Paragraph>
        <a
          href={`https://wa.me/919999999999?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-body-md font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.535 5.874L.057 23.215a.75.75 0 0 0 .916.916l5.34-1.478A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.813 9.813 0 0 1-5.028-1.38l-.36-.214-3.733 1.033 1.033-3.733-.214-.36A9.818 9.818 0 1 1 12 21.818z"/></svg>
          Continue on WhatsApp
        </a>
        <p className="text-body-sm text-foreground-tertiary">Soft pull only · Zero CIBIL impact · Free</p>
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
