"use client";

import React, { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button, Input, Heading, Paragraph } from "@leapmoney/ui";
import { trackFormSubmit, track } from "@leapmoney/analytics";
import { isFormValid, validateIndianPhone, validateName } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

interface EligibilityFormProps {
  loanType?: string;
  formId?: string;
  heading?: string;
}

const FORM_ID_DEFAULT = "eligibility_form";

export function EligibilityForm({
  loanType = "personal-loan",
  formId = FORM_ID_DEFAULT,
  heading = "Check your eligibility free",
}: EligibilityFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [employment, setEmployment] = useState("salaried");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);

  function onFirstInteraction() {
    if (!started) {
      setStarted(true);
      track({ name: "form_start", properties: { form_id: formId, loan_type: loanType } });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      name: validateName(name),
      phone: validateIndianPhone(phone),
      amount: amount.trim() === "" ? "Enter your required loan amount" : undefined,
    };
    setErrors(nextErrors);
    if (!isFormValid(nextErrors)) {
      trackFormSubmit(formId, false);
      return;
    }
    setStatus("submitting");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      trackFormSubmit(formId, true);
      track({ name: "eligibility_check_start", properties: { loan_type: loanType, employment } });
      setStatus("success");
    } catch {
      setStatus("error");
      trackFormSubmit(formId, false);
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-status-success/30 bg-background-card p-6 shadow-1">
        <CheckCircle2 size={28} className="text-status-success" />
        <Heading level={3} size="h2">We're checking your eligibility, {name.split(" ")[0]}!</Heading>
        <Paragraph color="secondary">
          Our AI is matching your profile to lenders. We'll send your LeapScore™ and
          matched lender shortlist to +91 {phone} via WhatsApp within 2 minutes.
        </Paragraph>
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-page px-4 py-2">
          <span className="text-body-sm text-foreground-tertiary">Soft pull only · Zero CIBIL impact · Free</span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={onFirstInteraction}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1"
      aria-label={heading}
    >
      <div>
        <Heading level={3} size="h2">{heading}</Heading>
        <p className="mt-1 text-body-sm text-foreground-tertiary">Soft pull · No CIBIL impact · Free · 2 minutes</p>
      </div>

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

      <Input
        label="Loan amount required (₹)"
        type="text"
        inputMode="numeric"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
        placeholder="e.g. 5,00,000"
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-body-md font-medium text-foreground-primary">Employment type</span>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: "salaried", label: "Salaried" },
            { value: "self-employed", label: "Self-Employed" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setEmployment(opt.value)}
              className={`rounded-lg border py-2.5 text-body-md font-semibold transition-colors ${
                employment === opt.value
                  ? "border-interactive-primary bg-interactive-primary/10 text-interactive-primary"
                  : "border-border-token-default bg-background-page text-foreground-secondary"
              }`}
            >
              {opt.label}
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
        <span className="flex items-center gap-2">
          {status === "submitting" ? "Checking…" : "Check My Eligibility Free"}
          {status !== "submitting" && <ArrowRight size={16} />}
        </span>
      </Button>

      <p className="text-body-sm text-foreground-tertiary">
        By submitting, you agree to our{" "}
        <a href="/terms-of-service" className="underline hover:text-foreground-primary">Terms</a>
        {" "}and{" "}
        <a href="/privacy-policy" className="underline hover:text-foreground-primary">Privacy Policy</a>.
        A soft credit pull will be performed — no score impact.
      </p>
    </form>
  );
}
