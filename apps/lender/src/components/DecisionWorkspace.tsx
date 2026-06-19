"use client";

import { useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { REASON_CODES, type Decision } from "@/lib/lender-demo";

// Demo-only credit decision workspace. No persistence — captures a decision +
// reason codes in local state and shows the resulting (mock) outcome.
export function DecisionWorkspace({ initialDecision, initialReasons }: { initialDecision: Decision | null; initialReasons: string[] }) {
  const [decision, setDecision] = useState<Decision | null>(initialDecision);
  const [reasons, setReasons] = useState<string[]>(initialReasons);
  const [saved, setSaved] = useState(false);

  const toggle = (code: string): void => {
    setSaved(false);
    setReasons((r) => (r.includes(code) ? r.filter((x) => x !== code) : [...r, code]));
  };
  const choose = (d: Decision): void => { setDecision(d); setSaved(false); };

  const options: Array<{ key: Decision; label: string; icon: ReactNode; cls: string; active: string }> = [
    { key: "approve", label: "Approve", icon: <CheckCircle2 size={18} />, cls: "border-status-success/40 text-status-success", active: "bg-status-success text-foreground-on-dark border-status-success" },
    { key: "conditional", label: "Conditional", icon: <AlertTriangle size={18} />, cls: "border-status-warning/40 text-status-warning", active: "bg-status-warning text-foreground-on-dark border-status-warning" },
    { key: "reject", label: "Reject", icon: <XCircle size={18} />, cls: "border-status-danger/40 text-status-danger", active: "bg-status-danger text-foreground-on-dark border-status-danger" },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <h2 className="text-h3 font-semibold text-foreground-primary">Credit decision</h2>

      <div className="grid grid-cols-3 gap-3">
        {options.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => choose(o.key)}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-3 text-body-md font-semibold transition-colors duration-fast ${decision === o.key ? o.active : `bg-background-card ${o.cls} hover:bg-background-page`}`}
          >
            {o.icon} {o.label}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">Reason codes</p>
        <div className="flex flex-wrap gap-2">
          {REASON_CODES.map((rc) => (
            <button
              key={rc.code}
              type="button"
              onClick={() => toggle(rc.code)}
              className={`rounded-full px-3 py-1 text-body-sm font-medium transition-colors duration-fast ${reasons.includes(rc.code) ? "bg-foreground-primary text-foreground-on-dark" : "bg-background-page text-foreground-secondary hover:bg-border-token-default"}`}
            >
              {rc.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSaved(true)}
        disabled={!decision}
        className="rounded-md bg-interactive-primary px-4 py-2.5 text-body-md font-semibold text-foreground-on-dark transition-colors duration-fast hover:bg-interactive-hover disabled:opacity-50"
      >
        Record decision
      </button>

      {saved && decision ? (
        <p className="rounded-md bg-status-success/10 px-3 py-2 text-body-sm text-status-success">
          Decision recorded (demo): <span className="font-semibold capitalize">{decision}</span>
          {reasons.length ? ` · ${reasons.map((c) => REASON_CODES.find((r) => r.code === c)?.label).join(", ")}` : ""}.
        </p>
      ) : null}
    </div>
  );
}
