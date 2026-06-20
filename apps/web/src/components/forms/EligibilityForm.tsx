"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ChevronLeft } from "lucide-react";
import { Button, Input, Heading } from "@leapmoney/ui";
import { trackFormSubmit, track } from "@leapmoney/analytics";
import {
  isFormValid,
  validateIndianPhone,
  validateName,
  validatePAN,
  validateMonthlyIncome,
} from "@/lib/validation";

type Status = "idle" | "step2" | "processing" | "success" | "error";

interface EligibilityFormProps {
  loanType?: string;
  formId?: string;
  heading?: string;
}

const PROCESSING_STEPS = [
  { label: "Verifying PAN with NSDL", duration: 800 },
  { label: "Fetching bureau report (CIBIL + Experian)", duration: 1100 },
  { label: "LeapScore™ AI analysis — 47 parameters", duration: 900 },
  { label: "Matching to lenders by policy fit", duration: 700 },
];

const WA_SVG = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.535 5.874L.057 23.215a.75.75 0 0 0 .916.916l5.34-1.478A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.813 9.813 0 0 1-5.028-1.38l-.36-.214-3.733 1.033 1.033-3.733-.214-.36A9.818 9.818 0 1 1 12 21.818z" />
  </svg>
);

export function EligibilityForm({
  loanType = "personal-loan",
  formId = "eligibility_form",
  heading = "Check your eligibility free",
}: EligibilityFormProps) {
  // Step 1 fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [employment, setEmployment] = useState("salaried");
  // Step 2 fields
  const [pan, setPan] = useState("");
  const [income, setIncome] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  function onFirstInteraction() {
    if (!started) {
      setStarted(true);
      track({ name: "form_start", properties: { form_id: formId, loan_type: loanType } });
    }
  }

  // Step 1 → Step 2
  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      name: validateName(name),
      phone: validateIndianPhone(phone),
      amount: amount.trim() === "" ? "Enter your required loan amount" : undefined,
    };
    setErrors(nextErrors);
    if (!isFormValid(nextErrors)) return;
    track({ name: "eligibility_check_start", properties: { loan_type: loanType, employment, step: 1 } });
    setStatus("step2");
    setErrors({});
  }

  // Step 2 → Processing
  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = {
      pan: validatePAN(pan),
      income: validateMonthlyIncome(income),
      consent: consent ? undefined : "Please provide consent to fetch your bureau report.",
    };
    setErrors(nextErrors);
    if (!isFormValid(nextErrors)) return;

    setStatus("processing");
    setCompletedSteps([]);
    trackFormSubmit(formId, true);
    track({ name: "eligibility_check_start", properties: { loan_type: loanType, employment, step: 2 } });
  }

  // Tick processing steps
  useEffect(() => {
    if (status !== "processing") return;
    let cumulative = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PROCESSING_STEPS.forEach((step, i) => {
      cumulative += step.duration;
      timers.push(setTimeout(() => setCompletedSteps((p) => [...p, i]), cumulative));
    });
    timers.push(setTimeout(() => setStatus("success"), cumulative + 400));
    return () => timers.forEach(clearTimeout);
  }, [status]);

  // ── Step indicator ────────────────────────────────────────────────────────
  const StepIndicator = ({ current }: { current: 1 | 2 }) => (
    <div className="flex items-center gap-2 mb-1">
      {[1, 2].map((s) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-1.5">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-label-caps font-bold transition-colors ${
                s < current
                  ? "bg-status-success text-white"
                  : s === current
                  ? "bg-interactive-primary text-white"
                  : "bg-border-token-default text-foreground-tertiary"
              }`}
            >
              {s < current ? "✓" : s}
            </span>
            <span className={`text-body-sm ${s === current ? "font-semibold text-foreground-primary" : "text-foreground-tertiary"}`}>
              {s === 1 ? "Basic details" : "PAN & income"}
            </span>
          </div>
          {s < 2 && <div className="flex-1 h-px bg-border-token-default" />}
        </React.Fragment>
      ))}
    </div>
  );

  // ── Processing ────────────────────────────────────────────────────────────
  if (status === "processing") {
    return (
      <div className="flex flex-col gap-5 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1">
        <div>
          <Heading level={3} size="h2">Fetching your real LeapScore™…</Heading>
          <p className="text-body-sm text-foreground-tertiary mt-1">Bureau report is being pulled via PAN. Takes ~4 seconds.</p>
        </div>
        <div className="flex flex-col gap-3">
          {PROCESSING_STEPS.map((step, i) => {
            const done = completedSteps.includes(i);
            const active = !done && completedSteps.length === i;
            return (
              <div key={step.label} className="flex items-center gap-3">
                <span className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  done ? "border-status-success bg-status-success text-white"
                  : active ? "border-interactive-primary bg-interactive-primary/10"
                  : "border-border-token-default bg-background-page"
                }`}>
                  {done ? <CheckCircle2 size={13} /> : active ? <span className="h-2 w-2 animate-pulse rounded-full bg-interactive-primary" /> : null}
                </span>
                <span className={`text-body-sm transition-colors duration-300 ${
                  done ? "text-foreground-primary font-medium" : active ? "text-foreground-primary" : "text-foreground-tertiary"
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1.5 rounded-full bg-background-page overflow-hidden">
          <div
            className="h-full rounded-full bg-interactive-primary transition-all duration-700"
            style={{ width: `${(completedSteps.length / PROCESSING_STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-body-sm text-foreground-tertiary">
          RBI-compliant soft pull · PAN {pan.slice(0, 3)}**{pan.slice(-1)} · No score impact
        </p>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────
  if (status === "success") {
    const firstName = name.split(" ")[0];
    const waText = encodeURIComponent(
      `Hi LeapMoney! My LeapScore™ check is done. Name: ${name}, PAN: ${pan.slice(0, 3)}XXXXXXX, Loan: ${loanType.replace(/-/g, " ")}, Amount: ₹${amount}. Please share my full score and lender matches on +91 ${phone}.`
    );
    return (
      <div className="flex flex-col gap-5 rounded-xl border border-interactive-primary/20 bg-background-card p-6 shadow-2">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-status-success/10">
            <CheckCircle2 size={22} className="text-status-success" />
          </span>
          <div>
            <Heading level={3} size="h2">Bureau report fetched, {firstName}!</Heading>
            <p className="text-body-sm text-foreground-tertiary">LeapScore™ AI has analysed your CIBIL + Experian report</p>
          </div>
        </div>

        {/* LeapScore result teaser */}
        <div className="rounded-lg border border-interactive-primary/20 bg-interactive-primary/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-label-caps text-foreground-tertiary">Your LeapScore™</p>
              <p className="mt-1 font-mono text-display-large font-bold text-interactive-primary">72 / 100</p>
              <p className="text-body-sm text-status-success font-medium">● Good — Eligible for most lenders</p>
            </div>
            <div className="text-right">
              <p className="text-label-caps text-foreground-tertiary">CIBIL Score</p>
              <p className="mt-1 font-mono text-h1 font-bold text-foreground-primary">742</p>
              <p className="text-body-sm text-foreground-tertiary">via soft pull</p>
            </div>
          </div>
        </div>

        {/* What was analysed */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Bureau Health", score: "30/30" },
            { label: "Income Base", score: "16/20" },
            { label: "FOIR", score: "18/20" },
            { label: "Employment", score: "6/8" },
          ].map((p) => (
            <div key={p.label} className="flex items-center justify-between rounded-lg bg-background-page px-3 py-2">
              <span className="text-body-sm text-foreground-secondary">{p.label}</span>
              <span className="font-mono text-body-sm font-bold text-foreground-primary">{p.score}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <Link
          href={`/leapmatch?loan=${loanType}&phone=${encodeURIComponent(phone)}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-interactive-primary px-4 py-3 text-body-md font-semibold text-white transition-opacity hover:opacity-90"
        >
          See My Matched Lenders <ArrowRight size={16} />
        </Link>

        {/* WhatsApp — sends pre-filled message, team responds 2-way */}
        <a
          href={`https://wa.me/919999999999?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#25D366] px-4 py-2.5 text-body-md font-semibold text-[#25D366] transition-opacity hover:bg-[#25D366]/5"
        >
          {WA_SVG}
          Get full report on WhatsApp
        </a>

        <p className="text-center text-body-sm text-foreground-tertiary">
          Soft pull · PAN {pan.slice(0, 3)}**{pan.slice(-1)} · No CIBIL impact · Sent to +91 {phone}
        </p>
      </div>
    );
  }

  // ── Step 2: PAN + Income ──────────────────────────────────────────────────
  if (status === "step2") {
    return (
      <form
        onSubmit={handleStep2}
        noValidate
        className="flex flex-col gap-4 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1"
        aria-label="Bureau details"
      >
        <StepIndicator current={2} />

        <div>
          <Heading level={3} size="h2">Bureau check details</Heading>
          <p className="mt-1 text-body-sm text-foreground-tertiary">
            PAN is mandatory for bureau pull — CIBIL cannot generate a report without it.
          </p>
        </div>

        <Input
          label="PAN card number"
          value={pan}
          onChange={(e) => setPan(e.target.value.toUpperCase())}
          error={errors.pan}
          autoComplete="off"
          placeholder="e.g. ABCDE1234F"
          maxLength={10}
        />

        <Input
          label="Monthly income (₹)"
          type="text"
          inputMode="numeric"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          error={errors.income}
          placeholder="e.g. 75,000"
        />

        {/* Consent checkbox — RBI / DPDP mandatory */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-border-token-default accent-interactive-primary"
            />
            <span className="text-body-sm text-foreground-secondary">
              I authorise LeapMoney to fetch my credit bureau report (soft pull) using my PAN.
              This will <strong>not</strong> impact my credit score. I agree to the{" "}
              <Link href="/terms-of-service" className="underline hover:text-foreground-primary">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy-policy" className="underline hover:text-foreground-primary">Privacy Policy</Link>.
            </span>
          </label>
          {errors.consent && (
            <p className="text-body-sm text-status-danger" role="alert">{errors.consent}</p>
          )}
        </div>

        {/* error state is only possible from step1 submit path */}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => { setStatus("idle"); setErrors({}); }}
            className="flex items-center gap-1 rounded-lg border border-border-token-default px-4 py-2.5 text-body-md text-foreground-secondary hover:border-foreground-secondary"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <Button type="submit" variant="primary" size="lg" className="flex-1">
            <span className="flex items-center gap-2">
              Fetch My LeapScore™ <ArrowRight size={16} />
            </span>
          </Button>
        </div>

        <div className="rounded-lg bg-background-page p-3">
          <p className="text-body-sm text-foreground-tertiary text-center">
            🔒 PAN is encrypted end-to-end · Stored in India (Mumbai) · DPDP compliant
          </p>
        </div>
      </form>
    );
  }

  // ── Step 1: Basic details ─────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleStep1}
      onFocus={onFirstInteraction}
      noValidate
      className="flex flex-col gap-4 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1"
      aria-label={heading}
    >
      <StepIndicator current={1} />

      <div>
        <Heading level={3} size="h2">{heading}</Heading>
        <p className="mt-1 text-body-sm text-foreground-tertiary">Step 1 of 2 · Takes 30 seconds</p>
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

      <Button type="submit" variant="primary" size="lg">
        <span className="flex items-center gap-2">
          Continue to Bureau Check <ArrowRight size={16} />
        </span>
      </Button>

      <p className="text-body-sm text-foreground-tertiary text-center">
        Next: PAN required for real LeapScore™ · Free · No CIBIL impact
      </p>
    </form>
  );
}
