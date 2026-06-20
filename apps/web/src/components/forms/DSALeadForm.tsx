"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button, Input, Heading, Paragraph } from "@leapmoney/ui";
import { trackFormSubmit, track } from "@leapmoney/analytics";
import { isFormValid, validateIndianPhone, validateName, validateEmail } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

const FORM_ID = "dsa_lead_form";

export function DSALeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("0-1");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);

  function onFirstInteraction() {
    if (!started) {
      setStarted(true);
      track({ name: "form_start", properties: { form_id: FORM_ID } });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      name: validateName(name),
      phone: validateIndianPhone(phone),
      email: validateEmail(email),
      city: city.trim().length < 2 ? "Enter your city" : undefined,
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
      track({ name: "dsa_registration_start", properties: { city, experience } });
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
        <Heading level={3} size="h2">Application received, {name.split(" ")[0]}!</Heading>
        <Paragraph color="secondary">
          Our DSA onboarding team will call you on +91 {phone} within 24 hours.
          You'll get access to the DSA Suite after a quick KYC verification.
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
      aria-label="Join as DSA Partner"
    >
      <Heading level={3} size="h2">Join as DSA Partner</Heading>
      <Paragraph color="secondary" className="text-body-sm">
        Free to join · Earn up to ₹8,000 per loan disbursed · On-time payouts
      </Paragraph>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
          placeholder="e.g. Rajesh Kumar"
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
      </div>

      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
        placeholder="you@example.com"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={errors.city}
          placeholder="e.g. Mumbai"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dsa-experience" className="text-body-md font-medium text-foreground-primary">
            DSA experience
          </label>
          <select
            id="dsa-experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="h-11 w-full rounded-md border border-border-token-default bg-background-card px-3 text-body-lg text-foreground-primary focus:outline-none focus:ring-2 focus:ring-interactive-primary"
          >
            <option value="0-1">Less than 1 year</option>
            <option value="1-3">1–3 years</option>
            <option value="3-5">3–5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
      </div>

      {status === "error" && (
        <p className="text-body-sm text-status-danger" role="alert">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" loading={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : "Apply to Join DSA Network"}
      </Button>

      <p className="text-body-sm text-foreground-tertiary">
        Our team will contact you within 24 hours · Free to join · No hidden fees
      </p>
    </form>
  );
}
