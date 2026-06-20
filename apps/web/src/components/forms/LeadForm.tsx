"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Zap, ShieldCheck, BarChart3 } from "lucide-react";
import { Button, Input, Heading } from "@leapmoney/ui";
import { trackFormSubmit, track } from "@leapmoney/analytics";
import { LOAN_PRODUCTS } from "@/data/loans";
import { isFormValid, validateIndianPhone, validateName } from "@/lib/validation";

interface LeadFormProps {
  defaultLoan?: string;
  formId?: string;
}

type Status = "idle" | "submitting" | "processing" | "success" | "error";

const PROCESSING_STEPS = [
  { label: "Verifying your mobile number", duration: 700 },
  { label: "Running soft credit check (no CIBIL impact)", duration: 900 },
  { label: "Matching to 47 lenders with LeapMatch™ AI", duration: 800 },
];

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.535 5.874L.057 23.215a.75.75 0 0 0 .916.916l5.34-1.478A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.813 9.813 0 0 1-5.028-1.38l-.36-.214-3.733 1.033 1.033-3.733-.214-.36A9.818 9.818 0 1 1 12 21.818z" />
  </svg>
);

// Illustrative lender match cards shown after processing
const QUICK_MATCHES = [
  { abbr: "HDFC", color: "#004C97", name: "HDFC Bank", approval: 87, rate: "10.8%" },
  { abbr: "KMB", color: "#ED1C24", name: "Kotak Mahindra", approval: 74, rate: "11.5%" },
  { abbr: "BFL", color: "#0033A0", name: "Bajaj Finance", approval: 68, rate: "13.0%" },
];

export function LeadForm({ defaultLoan, formId = "lead_form" }: LeadFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loan, setLoan] = useState(defaultLoan ?? LOAN_PRODUCTS[0]!.slug);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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
    await new Promise((r) => setTimeout(r, 400));
    setStatus("processing");
    trackFormSubmit(formId, true);
    track({ name: "registration_start", properties: { loan_type: loan } });
  }

  // Tick processing steps sequentially
  useEffect(() => {
    if (status !== "processing") return;
    let cumulative = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PROCESSING_STEPS.forEach((step, i) => {
      cumulative += step.duration;
      timers.push(setTimeout(() => setCompletedSteps((prev) => [...prev, i]), cumulative));
    });
    const total = cumulative + 300;
    timers.push(setTimeout(() => setStatus("success"), total));
    return () => timers.forEach(clearTimeout);
  }, [status]);

  // ── Processing state ──────────────────────────────────────────────────────
  if (status === "processing") {
    return (
      <div className="flex flex-col gap-5 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1">
        <div className="flex flex-col gap-1">
          <Heading level={3} size="h2">Checking your eligibility…</Heading>
          <p className="text-body-sm text-foreground-tertiary">This takes about 3 seconds</p>
        </div>

        <div className="flex flex-col gap-3">
          {PROCESSING_STEPS.map((step, i) => {
            const done = completedSteps.includes(i);
            const active = !done && completedSteps.length === i;
            return (
              <div key={step.label} className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    done
                      ? "border-status-success bg-status-success text-white"
                      : active
                      ? "border-interactive-primary bg-interactive-primary/10"
                      : "border-border-token-default bg-background-page"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 size={14} />
                  ) : active ? (
                    <span className="h-2 w-2 animate-pulse rounded-full bg-interactive-primary" />
                  ) : null}
                </span>
                <span
                  className={`text-body-sm transition-colors duration-300 ${
                    done
                      ? "text-foreground-primary font-medium"
                      : active
                      ? "text-foreground-primary"
                      : "text-foreground-tertiary"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-background-page overflow-hidden">
          <div
            className="h-full rounded-full bg-interactive-primary transition-all duration-700"
            style={{ width: `${((completedSteps.length) / PROCESSING_STEPS.length) * 100}%` }}
          />
        </div>

        <p className="text-body-sm text-foreground-tertiary text-center">
          Soft pull only · No CIBIL impact · Comparing 47 lenders
        </p>
      </div>
    );
  }

  // ── Success / Results state ───────────────────────────────────────────────
  if (status === "success") {
    const firstName = name.split(" ")[0];
    const waText = encodeURIComponent(
      `Hi LeapMoney! I just checked eligibility for ${loan.replace(/-/g, " ")}. Name: ${name}, Mobile: ${phone}. Please share my full LeapScore™ and lender matches.`
    );
    return (
      <div className="flex flex-col gap-5 rounded-xl border border-interactive-primary/20 bg-background-card p-6 shadow-2">
        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-status-success/10">
            <CheckCircle2 size={22} className="text-status-success" />
          </span>
          <div>
            <Heading level={3} size="h2">Results ready, {firstName}!</Heading>
            <p className="text-body-sm text-foreground-tertiary">LeapMatch™ AI found {QUICK_MATCHES.length} lenders likely to approve you</p>
          </div>
        </div>

        {/* LeapScore teaser */}
        <div className="rounded-lg border border-interactive-primary/20 bg-interactive-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-caps text-foreground-tertiary">Your estimated LeapScore™</p>
              <p className="mt-1 font-mono text-display-large font-bold text-interactive-primary">720–760</p>
              <p className="text-body-sm text-status-success font-medium">● Good — High approval odds</p>
            </div>
            <div className="text-right">
              <p className="text-label-caps text-foreground-tertiary">Lenders matched</p>
              <p className="mt-1 font-mono text-h1 font-bold text-foreground-primary">12</p>
              <p className="text-body-sm text-foreground-tertiary">out of 47</p>
            </div>
          </div>
        </div>

        {/* Quick lender previews */}
        <div className="flex flex-col gap-2">
          <p className="text-body-sm font-semibold text-foreground-primary">Top 3 matches</p>
          {QUICK_MATCHES.map((m) => (
            <div key={m.abbr} className="flex items-center justify-between rounded-lg border border-border-token-default bg-background-page px-3 py-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-label-caps font-bold text-white"
                  style={{ background: m.color }}
                >
                  {m.abbr}
                </span>
                <span className="text-body-sm font-medium text-foreground-primary">{m.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-label-caps text-foreground-tertiary">{m.rate} p.a.</span>
                <span className="rounded-full bg-status-success/10 px-2 py-0.5 text-label-caps font-semibold text-status-success">
                  {m.approval}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <Link
          href={`/leapmatch?loan=${loan}&name=${encodeURIComponent(name)}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-interactive-primary px-4 py-3 text-body-md font-semibold text-white transition-opacity hover:opacity-90"
        >
          See All 12 Matches <ArrowRight size={16} />
        </Link>

        {/* Secondary: WhatsApp */}
        <a
          href={`https://wa.me/919999999999?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#25D366] px-4 py-2.5 text-body-md font-semibold text-[#25D366] transition-opacity hover:bg-[#25D366]/5"
        >
          {WA_SVG}
          Get results on WhatsApp too
        </a>

        <p className="text-center text-body-sm text-foreground-tertiary">
          Soft pull only · No CIBIL impact · Results sent to +91 {phone}
        </p>
      </div>
    );
  }

  // ── Form state ────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      onFocus={onFirstInteraction}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1"
      aria-label="Check eligibility"
    >
      <div>
        <Heading level={3} size="h2">Check your eligibility</Heading>
        <p className="mt-1 text-body-sm text-foreground-tertiary">Free · No CIBIL impact · Results in 3 seconds</p>
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="lead-loan-type" className="text-body-md font-medium text-foreground-primary">
          Loan type
        </label>
        <select
          id="lead-loan-type"
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
        <span className="flex items-center gap-2">
          {status === "submitting" ? "Starting…" : "Check My Eligibility Free"}
          {status !== "submitting" && <Zap size={16} />}
        </span>
      </Button>

      {/* Trust row */}
      <div className="flex items-center justify-center gap-4 text-body-sm text-foreground-tertiary">
        <span className="flex items-center gap-1">
          <ShieldCheck size={13} className="text-status-success" />
          No CIBIL impact
        </span>
        <span className="flex items-center gap-1">
          <BarChart3 size={13} className="text-interactive-primary" />
          47 lenders checked
        </span>
      </div>
    </form>
  );
}
