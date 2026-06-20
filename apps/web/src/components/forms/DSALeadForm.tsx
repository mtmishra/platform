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
    const waText = encodeURIComponent(`Hi LeapMoney! I just applied to become a DSA partner. Name: ${name}, Mobile: ${phone}, City: ${city}. Please guide me on next steps.`);
    return (
      <div className="flex flex-col items-start gap-4 rounded-xl border border-status-success/30 bg-background-card p-6 shadow-1">
        <CheckCircle2 size={28} className="text-status-success" />
        <Heading level={3} size="h2">Application received, {name.split(" ")[0]}!</Heading>
        <Paragraph color="secondary">
          Our DSA onboarding team will call you on <strong>+91 {phone}</strong> within 24 hours.
          You&apos;ll get access to the DSA Suite after a quick KYC verification.
        </Paragraph>
        <a
          href={`https://wa.me/919999999999?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-body-md font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.535 5.874L.057 23.215a.75.75 0 0 0 .916.916l5.34-1.478A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.813 9.813 0 0 1-5.028-1.38l-.36-.214-3.733 1.033 1.033-3.733-.214-.36A9.818 9.818 0 1 1 12 21.818z"/></svg>
          Message us on WhatsApp
        </a>
        <p className="text-body-sm text-foreground-tertiary">Our team responds within 2 hours on WhatsApp</p>
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
