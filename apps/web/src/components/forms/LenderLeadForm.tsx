"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Input, Heading, Paragraph } from "@leapmoney/ui";
import { trackFormSubmit, track } from "@leapmoney/analytics";
import { isFormValid, validateEmail, validateName, validateIndianPhone } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

const FORM_ID = "lender_lead_form";

const LENDER_TYPES = [
  { value: "bank", label: "Scheduled Commercial Bank" },
  { value: "nbfc", label: "NBFC" },
  { value: "hfc", label: "Housing Finance Company (HFC)" },
  { value: "fintech", label: "Digital Lender / Fintech" },
  { value: "mfi", label: "Microfinance Institution (MFI)" },
];

const LOAN_TYPES = [
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "Loan Against Property",
  "Two-Wheeler Loan",
  "Gold Loan",
];

export function LenderLeadForm() {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lenderType, setLenderType] = useState("nbfc");
  const [selectedLoans, setSelectedLoans] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);

  function onFirstInteraction() {
    if (!started) {
      setStarted(true);
      track({ name: "form_start", properties: { form_id: FORM_ID } });
    }
  }

  function toggleLoan(loan: string) {
    setSelectedLoans((prev) =>
      prev.includes(loan) ? prev.filter((l) => l !== loan) : [...prev, loan],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      name: validateName(name),
      org: org.trim().length < 2 ? "Enter your organisation name" : undefined,
      email: validateEmail(email),
      phone: validateIndianPhone(phone),
    };
    setErrors(nextErrors);
    if (!isFormValid(nextErrors)) {
      trackFormSubmit(FORM_ID, false);
      return;
    }
    setStatus("submitting");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      trackFormSubmit(FORM_ID, true);
      track({ name: "lender_partnership_request", properties: { lender_type: lenderType, loan_types: selectedLoans } });
      setStatus("success");
    } catch {
      setStatus("error");
      trackFormSubmit(FORM_ID, false);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-status-success/30 bg-background-card p-6 shadow-1">
        <CheckCircle2 size={28} className="text-status-success" />
        <Heading level={3} size="h2">Partnership request received!</Heading>
        <Paragraph color="secondary">
          Our partnerships team will reach out to {email} within 2 business days
          to discuss integration options and API documentation.
        </Paragraph>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={onFirstInteraction}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1"
      aria-label="Request lender partnership"
    >
      <Heading level={3} size="h2">Request a Partnership Demo</Heading>
      <Paragraph color="secondary" className="text-body-sm">
        Our team will walk you through the integration, borrower flow, and API documentation.
      </Paragraph>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Contact person name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
          placeholder="e.g. Suresh Patel"
        />
        <Input
          label="Organisation name"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          error={errors.org}
          placeholder="e.g. Bajaj Finance Ltd"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Work email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          placeholder="you@organisation.com"
        />
        <Input
          label="Phone number"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          prefix="+91"
          placeholder="10-digit mobile"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lender-type" className="text-body-md font-medium text-foreground-primary">
          Organisation type
        </label>
        <select
          id="lender-type"
          value={lenderType}
          onChange={(e) => setLenderType(e.target.value)}
          className="h-11 w-full rounded-md border border-border-token-default bg-background-card px-3 text-body-lg text-foreground-primary focus:outline-none focus:ring-2 focus:ring-interactive-primary"
        >
          {LENDER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-body-md font-medium text-foreground-primary">Loan products you offer</span>
        <div className="flex flex-wrap gap-2">
          {LOAN_TYPES.map((loan) => (
            <button
              key={loan}
              type="button"
              onClick={() => toggleLoan(loan)}
              className={`rounded-full border px-3 py-1 text-body-sm font-medium transition-colors ${
                selectedLoans.includes(loan)
                  ? "border-interactive-primary bg-interactive-primary text-white"
                  : "border-border-token-default bg-background-page text-foreground-secondary hover:border-interactive-primary"
              }`}
            >
              {loan}
            </button>
          ))}
        </div>
      </div>

      {status === "error" && (
        <p className="text-body-sm text-status-danger" role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Request Partnership Demo"}
      </Button>

      <p className="text-body-sm text-foreground-tertiary">
        Our team responds within 2 business days · API docs shared on request · Zero upfront cost
      </p>
    </form>
  );
}
