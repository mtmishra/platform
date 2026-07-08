"use client";

// ── ChatPanel ─────────────────────────────────────────────────────────────
// Sprint 29 T12 — UX §3.02. Right drawer (420px desktop) / full-screen sheet
// (mobile). Overlay — never reflows the page. Header · optional demo banner
// · message region (children) · composer · compliance footer. Esc closes;
// focus moves into the composer on open.

import React, { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";

export interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
  /** LeapAI experience chip, e.g. "CUSTOMER AI" (UX §3.02) */
  experienceLabel?: string;
  /** amber banner while data is demo-sourced (PRD Risk R1) */
  demoBanner?: boolean;
  /** disable composer while a turn streams */
  busy?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ChatPanel({
  open,
  onClose,
  onSend,
  experienceLabel = "CUSTOMER AI",
  demoBanner = false,
  busy = false,
  children,
  className = "",
}: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Keep the newest message in view as content streams in.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  });

  const submit = () => {
    const message = draft.trim();
    if (!message || busy) return;
    setDraft("");
    onSend(message);
  };

  if (!open) return null;

  return (
    <aside
      role="dialog"
      aria-label="LeapAI assistant"
      className={`fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border-token-default bg-background-card shadow-4 md:w-[420px] ${className}`}
    >
      <header className="flex items-center gap-2.5 border-b border-border-token-default px-4 py-3">
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-interactive-primary ring-2 ring-teal-accent" aria-hidden>
          <Sparkles className="h-4 w-4 text-white" />
        </span>
        <span className="text-h2 font-bold text-foreground-primary">LeapAI</span>
        <span className="rounded-full bg-teal-accent/10 px-2 py-0.5 text-label-caps font-bold uppercase text-teal-accent">
          {experienceLabel}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close LeapAI"
          className="ml-auto rounded-md p-1.5 text-foreground-tertiary hover:bg-background-feature hover:text-foreground-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-accent"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </header>

      {demoBanner && (
        <div className="border-b border-border-token-default bg-status-warning/10 px-3 py-1.5 text-center text-body-sm font-semibold text-status-warning">
          Demo data — sample figures shown
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {children}
      </div>

      <div className="flex items-end gap-2 border-t border-border-token-default px-4 py-3">
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={1}
          maxLength={2000}
          placeholder="Ask LeapAI…"
          aria-label="Message LeapAI"
          className="max-h-32 flex-1 resize-none rounded-lg border border-border-token-default bg-background-card px-3 py-2.5 text-body-md text-foreground-primary placeholder:text-foreground-tertiary focus:border-interactive-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={busy || draft.trim().length === 0}
          aria-label="Send"
          className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-interactive-primary text-white disabled:bg-background-feature disabled:text-foreground-tertiary"
        >
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <footer className="px-4 pb-2.5 text-center text-body-sm text-foreground-tertiary">
        LeapAI can make mistakes. Not financial advice.
      </footer>
    </aside>
  );
}
