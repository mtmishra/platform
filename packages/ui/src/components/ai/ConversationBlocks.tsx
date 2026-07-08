"use client";

// ── Conversation blocks ───────────────────────────────────────────────────
// Sprint 29 T13 — Conversation OS §5 (CB-01/02/03/06/04/09/10/12/16, §12).
// Reusable presentational blocks composing the T12 foundation + T14 cards.
// Compliance strings (consent, soft-pull) are register-invariant fixed copy
// from the Conversation OS — do not edit without compliance sign-off (OS §16.8).

import { CheckCircle2, Headphones, ShieldCheck, XCircle } from "lucide-react";
import { AIMessage } from "./MessageBubble";
import { SuggestedPrompts } from "./ChatStates";
import { AIScoreSlot, AIMatchSlot, StatusCard, ToolResultCard } from "./ToolCards";
import type { AIScoreSlotProps, AIMatchSlotProps, StatusCardProps } from "./ToolCards";
import { Button } from "./../button";

// ── CB-01 Welcome ────────────────────────────────────────────────────────────
export function WelcomeBlock({
  name,
  message,
  prompts,
  onPrompt,
}: {
  name: string;
  message?: string;
  prompts: string[];
  onPrompt: (p: string) => void;
}) {
  return (
    <div className="space-y-2.5">
      <AIMessage>
        {message ?? (
          <>
            Welcome back, <b>{name}</b>. Ask me anything about your credit, matches or applications.
          </>
        )}
      </AIMessage>
      <SuggestedPrompts prompts={prompts} onPrompt={onPrompt} className="pl-8" />
    </div>
  );
}

// ── CB-02 Authentication ─────────────────────────────────────────────────────
// Chat never collects OTPs itself — it routes to the app's existing auth flow.
export function AuthenticationBlock({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="space-y-2.5">
      <AIMessage>
        To show your personal data I need to verify it&apos;s you — a quick OTP, takes 30 seconds.
      </AIMessage>
      <div className="pl-8">
        <Button variant="primary" size="sm" onClick={onLogin}>
          Verify with OTP
        </Button>
      </div>
    </div>
  );
}

// ── CB-03 Consent (DPDP + soft-pull, fixed copy) ─────────────────────────────
export function ConsentBlock({
  bureaus = "CIBIL, Experian, CRIF and Equifax",
  purpose = "checking your loan eligibility",
  onAgree,
  onDecline,
}: {
  bureaus?: string;
  purpose?: string;
  onAgree: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="w-full rounded-lg border border-border-token-default border-l-[3px] border-l-interactive-primary bg-background-card p-3.5 shadow-1">
      <h4 className="mb-1.5 flex items-center gap-1.5 text-h3 font-semibold text-foreground-primary">
        <ShieldCheck className="h-4 w-4 text-interactive-primary" aria-hidden /> Your consent is needed
      </h4>
      {/* Register-invariant compliance copy — Conversation OS §5 CB-03. */}
      <p className="text-body-md leading-relaxed text-foreground-primary">
        Before I check your credit report, I need your one-time consent. I&apos;ll fetch your report from {bureaus} —
        this is a <b>soft pull and never reduces your score</b>. Your data stays in India and is used only for {purpose}.
      </p>
      <div className="mt-3 flex gap-2">
        <Button variant="primary" size="sm" onClick={onAgree}>
          I agree
        </Button>
        <Button variant="ghost" size="sm" onClick={onDecline}>
          Not now
        </Button>
      </div>
    </div>
  );
}

// ── CB-06 Eligibility pre-screen result ──────────────────────────────────────
export interface EligibilityCriterion {
  label: string;
  passed: boolean;
}

export function EligibilityBlock({ eligible, criteria }: { eligible: boolean; criteria: EligibilityCriterion[] }) {
  return (
    <ToolResultCard eyebrow="Eligibility · Policy pre-screen">
      <p className={`mb-2 text-body-md font-semibold ${eligible ? "text-status-success" : "text-status-warning"}`}>
        {eligible ? "You clear the basic policy checks." : "A few policy checks need attention — here's exactly what:"}
      </p>
      <ul className="space-y-1 text-body-md text-foreground-primary">
        {criteria.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            {c.passed ? (
              <CheckCircle2 className="h-4 w-4 flex-none text-status-success" aria-hidden />
            ) : (
              <XCircle className="h-4 w-4 flex-none text-status-danger" aria-hidden />
            )}
            {c.label}
          </li>
        ))}
      </ul>
    </ToolResultCard>
  );
}

// ── CB-04 Profile collection (confirm-not-re-ask; Conversation OS §6 rules) ──
export function ProfileFieldConfirm({
  label,
  maskedValue,
  onConfirm,
  onEdit,
}: {
  label: string;
  maskedValue: string;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border border-border-token-default bg-background-card px-3.5 py-2.5">
      <span className="text-body-md text-foreground-secondary">{label}:</span>
      <span className="font-mono text-body-md font-semibold text-foreground-primary">{maskedValue}</span>
      <span className="ml-auto flex gap-1.5">
        <Button variant="primary" size="sm" onClick={onConfirm}>
          Correct
        </Button>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Change
        </Button>
      </span>
    </div>
  );
}

// ── CB-09 LeapScore response · CB-10 LeapMatch response ──────────────────────
// Thin compositions of the T14 slots — the blocks exist so conversation code
// speaks Conversation-OS names, not raw card props.
export function LeapScoreResponse(props: AIScoreSlotProps) {
  return <AIScoreSlot {...props} />;
}

export function LeapMatchResponse({ matches }: { matches: AIMatchSlotProps[] }) {
  return (
    <div className="space-y-2.5">
      {matches.slice(0, 3).map((m) => (
        <AIMatchSlot key={m.lenderName} {...m} />
      ))}
    </div>
  );
}

// ── CB-12/14 Application summary ─────────────────────────────────────────────
export function ApplicationSummaryBlock(props: StatusCardProps) {
  return <StatusCard {...props} />;
}

// ── §12 Cross-sell card (one per conversation, suppression-aware) ────────────
export function CrossSellCard({
  title,
  reason,
  ctaLabel,
  onAccept,
  onDismiss,
}: {
  title: string;
  /** fit-based reason — margin-first framing is a compliance defect (OS §12.3) */
  reason: string;
  ctaLabel: string;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="w-full rounded-lg border border-border-token-default bg-background-feature p-3.5">
      <h4 className="text-h3 font-semibold text-foreground-primary">{title}</h4>
      <p className="mt-1 text-body-sm text-foreground-secondary">{reason}</p>
      <div className="mt-2.5 flex gap-2">
        <Button variant="secondary" size="sm" onClick={onAccept}>
          {ctaLabel}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Not interested
        </Button>
      </div>
    </div>
  );
}

// ── CB-16 Human handoff ──────────────────────────────────────────────────────
export function HumanHandoffBlock({ ticketId, summary }: { ticketId: string; summary?: string }) {
  return (
    <ToolResultCard eyebrow="Support · Human handoff">
      <div className="flex items-start gap-2 text-body-md text-foreground-primary">
        <Headphones className="mt-0.5 h-4 w-4 flex-none text-interactive-primary" aria-hidden />
        <div>
          Connecting you to our team — your ticket is <b className="font-mono">{ticketId}</b>. I&apos;ve summarized
          everything so you won&apos;t repeat yourself.
          {summary && <p className="mt-1 text-body-sm text-foreground-secondary">{summary}</p>}
        </div>
      </div>
    </ToolResultCard>
  );
}
