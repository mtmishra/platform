"use client";

// ── AILauncher ────────────────────────────────────────────────────────────
// Sprint 29 T12 — UX §3.01. Floating LeapAI entry point, bottom-right
// (NotificationCenter placement precedent). Teal ring = the AI signature:
// only AI-authored surfaces use teal-accent (UX §2.2 rule).

import { Sparkles } from "lucide-react";

export interface AILauncherProps {
  onClick: () => void;
  /** teal dot for unseen assistant activity */
  unread?: boolean;
  /** pulsing ring while a background AI task runs */
  thinking?: boolean;
  /** hidden while the panel is open on desktop (UX §3.01) */
  hidden?: boolean;
  className?: string;
}

export function AILauncher({ onClick, unread = false, thinking = false, hidden = false, className = "" }: AILauncherProps) {
  if (hidden) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ask LeapAI (Ctrl+K)"
      title="Ask LeapAI · Ctrl+K"
      className={`fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-interactive-primary text-white shadow-3 transition-transform duration-normal ease-spring hover:scale-105 hover:shadow-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-accent motion-reduce:transition-none ${className}`}
    >
      <Sparkles className="h-6 w-6" aria-hidden />
      {unread && (
        <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-interactive-primary bg-teal-accent" aria-hidden />
      )}
      {thinking && (
        <span className="absolute inset-0 animate-ping rounded-full bg-teal-accent/30 motion-reduce:hidden" aria-hidden />
      )}
    </button>
  );
}
