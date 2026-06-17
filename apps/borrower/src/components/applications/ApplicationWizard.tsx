"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Heading, Input, Paragraph } from "@leapmoney/ui";
import { Check, CheckCircle2, Circle } from "lucide-react";

const STEPS = [
  "Loan selection",
  "Personal details",
  "Employment",
  "Income",
  "Documents",
  "Review",
  "Submit",
] as const;

const DOCS = ["PAN", "Aadhaar", "Salary Slip", "Bank Statement", "ITR"] as const;

export function ApplicationWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);

  // Lightweight demo state.
  const [loanType, setLoanType] = React.useState("Personal Loan");
  const [amount, setAmount] = React.useState("1000000");
  const [tenure, setTenure] = React.useState("60");
  const [name, setName] = React.useState("Demo User");
  const [employer, setEmployer] = React.useState("MNC");
  const [income, setIncome] = React.useState("90000");
  const [uploaded, setUploaded] = React.useState<string[]>(["PAN", "Aadhaar"]);

  const last = STEPS.length - 1;
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  const next = (): void => setStep((s) => Math.min(last, s + 1));
  const back = (): void => setStep((s) => Math.max(0, s - 1));
  const submit = (): void => router.push("/applications/AP-100482");

  const toggleDoc = (d: string): void =>
    setUploaded((u) => (u.includes(d) ? u.filter((x) => x !== d) : [...u, d]));

  return (
    <div className="mx-auto max-w-card-md">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Step {step + 1} of {STEPS.length}</span>
          <span className="text-body-sm font-medium text-foreground-secondary">{STEPS[step]}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-background-page">
          <div className="h-full origin-left rounded-full bg-interactive-primary" style={{ transform: `scaleX(${progress / 100})`, transition: "transform 300ms cubic-bezier(0,0,0.2,1)" }} />
        </div>
      </div>

      <div className="rounded-xl border border-border-token-default bg-background-card p-6 shadow-1">
        {step === 0 ? (
          <div className="flex flex-col gap-4">
            <Heading level={2} size="h1">Loan selection</Heading>
            <Input label="Loan type" value={loanType} onChange={(e) => setLoanType(e.target.value)} />
            <Input label="Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input label="Tenure (months)" type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} />
          </div>
        ) : null}

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <Heading level={2} size="h1">Personal details</Heading>
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="PAN" placeholder="ABCDE1234F" defaultValue="ABCDE1234F" />
            <Input label="Date of birth" type="date" defaultValue="1992-05-10" />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="flex flex-col gap-4">
            <Heading level={2} size="h1">Employment</Heading>
            <Input label="Employer type" value={employer} onChange={(e) => setEmployer(e.target.value)} />
            <Input label="Employer name" defaultValue="Acme Corp" />
            <Input label="Years at employer" type="number" defaultValue="5" />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-4">
            <Heading level={2} size="h1">Income</Heading>
            <Input label="Monthly net income (₹)" type="number" value={income} onChange={(e) => setIncome(e.target.value)} />
            <Input label="Salary bank" defaultValue="HDFC Bank" />
          </div>
        ) : null}

        {step === 4 ? (
          <div className="flex flex-col gap-3">
            <Heading level={2} size="h1">Documents</Heading>
            <Paragraph color="secondary">Tap to mark a document as uploaded (demo — no real storage).</Paragraph>
            {DOCS.map((d) => {
              const isUp = uploaded.includes(d);
              return (
                <button key={d} type="button" onClick={() => toggleDoc(d)} className="flex items-center justify-between rounded-lg border border-border-token-default bg-background-card p-4 text-left transition-colors duration-fast hover:bg-background-page">
                  <span className="text-body-md text-foreground-primary">{d}</span>
                  {isUp ? <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-status-success"><CheckCircle2 size={15} /> Uploaded</span> : <span className="inline-flex items-center gap-1.5 text-body-sm text-foreground-tertiary"><Circle size={15} /> Missing</span>}
                </button>
              );
            })}
          </div>
        ) : null}

        {step === 5 ? (
          <div className="flex flex-col gap-3">
            <Heading level={2} size="h1">Review</Heading>
            {[
              ["Loan", `${loanType} · ₹${Number(amount).toLocaleString("en-IN")} · ${tenure} mo`],
              ["Applicant", name],
              ["Employer", employer],
              ["Monthly income", `₹${Number(income).toLocaleString("en-IN")}`],
              ["Documents", `${uploaded.length} of ${DOCS.length} uploaded`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-border-token-default py-2 last:border-0">
                <span className="text-body-sm text-foreground-tertiary">{k}</span>
                <span className="text-body-md font-medium text-foreground-primary">{v}</span>
              </div>
            ))}
          </div>
        ) : null}

        {step === 6 ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-status-success/10 text-status-success"><Check size={28} /></span>
            <Heading level={2} size="h1">Ready to submit</Heading>
            <Paragraph color="secondary">We&apos;ll send your pre-filled application to the lender and start tracking its status. A soft check has already been done — submitting authorises the lender&apos;s hard pull.</Paragraph>
          </div>
        ) : null}

        {/* Nav */}
        <div className="mt-6 flex gap-3">
          {step > 0 ? <Button variant="ghost" size="lg" onClick={back} className="flex-1">Back</Button> : null}
          {step < last ? (
            <Button variant="primary" size="lg" onClick={next} className="flex-1">Continue</Button>
          ) : (
            <Button variant="primary" size="lg" onClick={submit} className="flex-1">Submit application</Button>
          )}
        </div>
      </div>
    </div>
  );
}
