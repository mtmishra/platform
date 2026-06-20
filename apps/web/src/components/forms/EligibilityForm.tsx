"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ChevronLeft, Smartphone } from "lucide-react";
import { Button, Input, Heading } from "@leapmoney/ui";
import { trackFormSubmit, track } from "@leapmoney/analytics";
import {
  isFormValid,
  validateIndianPhone,
  validateName,
  validatePAN,
  validateMonthlyIncome,
} from "@/lib/validation";

// Borrower portal URL — swap to env var when Supabase auth is live
const BORROWER_PORTAL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3001"
    : "https://app.leapmoney.net";

type Status = "idle" | "step2" | "otp" | "otp_verifying" | "processing" | "redirecting";

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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.133 1.535 5.874L.057 23.215a.75.75 0 0 0 .916.916l5.34-1.478A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.813 9.813 0 0 1-5.028-1.38l-.36-.214-3.733 1.033 1.033-3.733-.214-.36A9.818 9.818 0 1 1 12 21.818z" />
  </svg>
);

// Step indicator shared across steps
function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Basic details", "PAN & income", "WhatsApp OTP"];
  return (
    <div className="flex items-center gap-1 mb-1">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-label-caps font-bold transition-colors ${
                done ? "bg-status-success text-white" : active ? "bg-interactive-primary text-white" : "bg-border-token-default text-foreground-tertiary"
              }`}>
                {done ? "✓" : num}
              </span>
              <span className={`text-label-caps whitespace-nowrap ${active ? "font-semibold text-foreground-primary" : "text-foreground-tertiary"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border-token-default mx-1" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// 6-box OTP input
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      const next = digits.map((d, j) => (j === i ? "" : d));
      onChange(next.join("").replace(/\s/g, ""));
      if (i > 0) refs.current[i - 1]?.focus();
    }
  }

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, j) => (j === i ? char : d));
    onChange(next.join("").replace(/\s/g, ""));
    if (char && i < 5) refs.current[i + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    refs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  }

  return (
    <div className="flex gap-2" onPaste={handlePaste}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] ?? ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          aria-label={`OTP digit ${i + 1}`}
          className="h-12 w-full rounded-lg border-2 border-border-token-default bg-background-card text-center font-mono text-h3 font-bold text-foreground-primary focus:border-interactive-primary focus:outline-none transition-colors"
        />
      ))}
    </div>
  );
}

export function EligibilityForm({
  loanType = "personal-loan",
  formId = "eligibility_form",
  heading = "Check your eligibility free",
}: EligibilityFormProps) {
  // Step 1
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [employment, setEmployment] = useState("salaried");
  // Step 2
  const [pan, setPan] = useState("");
  const [income, setIncome] = useState("");
  const [consent, setConsent] = useState(false);
  // Step 3
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | undefined>();
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Resend countdown
  useEffect(() => {
    if (status !== "otp") return;
    setResendTimer(30);
    setCanResend(false);
    const interval = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(interval); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  // Processing steps ticker
  useEffect(() => {
    if (status !== "processing") return;
    let cumulative = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PROCESSING_STEPS.forEach((step, i) => {
      cumulative += step.duration;
      timers.push(setTimeout(() => setCompletedSteps((p) => [...p, i]), cumulative));
    });
    // After all steps → redirect to borrower portal
    timers.push(setTimeout(() => {
      setStatus("redirecting");
      track({ name: "otp_verified", properties: { loan_type: loanType } });
      // Short delay so user sees "redirecting" state, then navigate
      setTimeout(() => {
        window.location.href = `${BORROWER_PORTAL}/onboard?loan=${loanType}&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`;
      }, 1200);
    }, cumulative + 400));
    return () => timers.forEach(clearTimeout);
  }, [status, loanType, name, phone]);

  function onFirstInteraction() {
    if (!started) {
      setStarted(true);
      track({ name: "form_start", properties: { form_id: formId, loan_type: loanType } });
    }
  }

  // Step 1 → Step 2
  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    const errs = {
      name: validateName(name),
      phone: validateIndianPhone(phone),
      amount: amount.trim() === "" ? "Enter your required loan amount" : undefined,
    };
    setErrors(errs);
    if (!isFormValid(errs)) return;
    track({ name: "eligibility_check_start", properties: { loan_type: loanType, step: 1 } });
    setStatus("step2");
    setErrors({});
  }

  // Step 2 → Send WhatsApp OTP
  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    const errs = {
      pan: validatePAN(pan),
      income: validateMonthlyIncome(income),
      consent: consent ? undefined : "Please provide consent to fetch your bureau report.",
    };
    setErrors(errs);
    if (!isFormValid(errs)) return;
    trackFormSubmit(formId, true);
    // TODO: call API → Supabase Auth sendOtp({ phone }) or WhatsApp Business API
    setStatus("otp");
    setErrors({});
  }

  // Step 3 — Verify OTP
  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length < 6) { setOtpError("Enter the 6-digit OTP sent on WhatsApp."); return; }
    setOtpError(undefined);
    setStatus("otp_verifying");
    // TODO: call Supabase Auth verifyOtp({ phone, token: otp, type: 'sms' })
    await new Promise((r) => setTimeout(r, 800));
    setCompletedSteps([]);
    setStatus("processing");
    track({ name: "eligibility_check_start", properties: { loan_type: loanType, step: "otp_done" } });
  }

  // ── Redirecting ───────────────────────────────────────────────────────────
  if (status === "redirecting") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-interactive-primary/20 bg-background-card p-8 shadow-1 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-status-success/10">
          <CheckCircle2 size={28} className="text-status-success" />
        </div>
        <Heading level={3} size="h2">Welcome to LeapMoney, {name.split(" ")[0]}!</Heading>
        <p className="text-body-md text-foreground-secondary">
          Your LeapScore™ is ready. Taking you to your borrower dashboard…
        </p>
        <div className="flex items-center gap-2 text-body-sm text-foreground-tertiary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-interactive-primary" />
          Redirecting to your portal
        </div>
      </div>
    );
  }

  // ── Processing ────────────────────────────────────────────────────────────
  if (status === "processing") {
    return (
      <div className="flex flex-col gap-5 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1">
        <div>
          <Heading level={3} size="h2">Fetching your real LeapScore™…</Heading>
          <p className="text-body-sm text-foreground-tertiary mt-1">Bureau report pulling via PAN — takes ~4 seconds.</p>
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
                <span className={`text-body-sm transition-colors duration-300 ${done ? "text-foreground-primary font-medium" : active ? "text-foreground-primary" : "text-foreground-tertiary"}`}>
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

  // ── Step 3: WhatsApp OTP ──────────────────────────────────────────────────
  if (status === "otp" || status === "otp_verifying") {
    return (
      <form
        onSubmit={handleOtpVerify}
        noValidate
        className="flex flex-col gap-5 rounded-xl border border-border-token-default bg-background-card p-6 shadow-1"
        aria-label="WhatsApp OTP verification"
      >
        <StepIndicator current={3} />

        <div className="flex flex-col items-center gap-3 text-center py-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/10">
            {WA_SVG && <span className="scale-150 text-[#25D366]">{WA_SVG}</span>}
          </span>
          <div>
            <Heading level={3} size="h2">Verify your WhatsApp</Heading>
            <p className="mt-1 text-body-sm text-foreground-secondary">
              We sent a 6-digit OTP to <strong>+91 {phone}</strong> on WhatsApp.
              <br />Enter it below to create your borrower account.
            </p>
          </div>
        </div>

        <OtpInput value={otp} onChange={setOtp} />

        {otpError && (
          <p className="text-body-sm text-status-danger text-center" role="alert">{otpError}</p>
        )}

        <Button type="submit" variant="primary" size="lg" loading={status === "otp_verifying"}>
          <span className="flex items-center justify-center gap-2">
            {status === "otp_verifying" ? "Verifying…" : "Verify & Create Account"}
            {status !== "otp_verifying" && <ArrowRight size={16} />}
          </span>
        </Button>

        {/* Resend */}
        <div className="text-center">
          {canResend ? (
            <button
              type="button"
              onClick={() => { setStatus("otp"); setOtp(""); }}
              className="text-body-sm font-semibold text-interactive-primary hover:underline"
            >
              Resend OTP on WhatsApp
            </button>
          ) : (
            <p className="text-body-sm text-foreground-tertiary">
              Resend OTP in <span className="font-mono font-bold">{resendTimer}s</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 rounded-lg bg-background-page px-4 py-2.5">
          <Smartphone size={14} className="text-foreground-tertiary" />
          <p className="text-body-sm text-foreground-tertiary">
            Didn&apos;t get it? Check WhatsApp · OTP valid for 10 minutes
          </p>
        </div>

        <button
          type="button"
          onClick={() => { setStatus("step2"); setOtp(""); setOtpError(undefined); }}
          className="flex items-center gap-1 text-body-sm text-foreground-tertiary hover:text-foreground-secondary mx-auto"
        >
          <ChevronLeft size={14} /> Change details
        </button>
      </form>
    );
  }

  // ── Step 2: PAN + Income + Consent ───────────────────────────────────────
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
            PAN is mandatory — CIBIL cannot generate a report without it.
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
              Send WhatsApp OTP {WA_SVG}
            </span>
          </Button>
        </div>

        <div className="rounded-lg bg-background-page p-3">
          <p className="text-body-sm text-foreground-tertiary text-center">
            🔒 PAN encrypted end-to-end · Stored in India (Mumbai) · DPDP compliant
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
        <p className="mt-1 text-body-sm text-foreground-tertiary">3 steps · Free · No CIBIL impact</p>
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
          Continue <ArrowRight size={16} />
        </span>
      </Button>

      <p className="text-body-sm text-foreground-tertiary text-center">
        Next: PAN + WhatsApp OTP to create your account
      </p>
    </form>
  );
}
