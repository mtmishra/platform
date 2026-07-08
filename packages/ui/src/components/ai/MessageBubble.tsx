"use client";

// ── Message bubbles ───────────────────────────────────────────────────────
// Sprint 29 T12 — UX §3.03–3.05. User = primary-filled, right; AI = page
// surface, left, teal-ringed avatar on group start. Streaming caret = teal.

import React from "react";
import { Sparkles } from "lucide-react";

export function UserMessage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex justify-end ${className}`}>
      <div className="max-w-[85%] rounded-lg rounded-br-sm bg-interactive-primary px-3.5 py-2.5 text-body-md text-white">
        {children}
      </div>
    </div>
  );
}

export interface AIMessageProps {
  children: React.ReactNode;
  /** teal-ringed LeapAI avatar — shown on the first bubble of a group */
  showAvatar?: boolean;
  /** blinking teal caret while tokens stream */
  streaming?: boolean;
  className?: string;
}

export function AIMessage({ children, showAvatar = true, streaming = false, className = "" }: AIMessageProps) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {showAvatar ? (
        <span
          className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-interactive-primary ring-2 ring-teal-accent"
          aria-hidden
        >
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </span>
      ) : (
        <span className="w-6 flex-none" aria-hidden />
      )}
      <div className="max-w-[85%] rounded-lg rounded-bl-sm border border-border-token-default bg-background-page px-3.5 py-2.5 text-body-lg text-foreground-primary">
        {children}
        {streaming && (
          <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-teal-accent align-text-bottom motion-reduce:animate-none" aria-hidden />
        )}
      </div>
    </div>
  );
}
