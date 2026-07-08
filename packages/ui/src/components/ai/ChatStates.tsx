"use client";

// ── Chat empty & error states ─────────────────────────────────────────────
// Sprint 29 T12 — UX §3.14/§3.15. Empty state extends the platform's
// existing EmptyState pattern with role-specific SuggestedPrompts chips;
// error state renders inside the message list as an honest AI failure.

import { AlertTriangle, Sparkles } from "lucide-react";

export interface ChatEmptyStateProps {
  greeting: string;
  subtitle: string;
  prompts: string[];
  onPrompt: (prompt: string) => void;
  className?: string;
}

export function ChatEmptyState({ greeting, subtitle, prompts, onPrompt, className = "" }: ChatEmptyStateProps) {
  return (
    <div className={`flex h-full flex-col items-center justify-center gap-3 px-6 text-center ${className}`}>
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-interactive-primary shadow-1 ring-4 ring-teal-accent/10" aria-hidden>
        <Sparkles className="h-6 w-6 text-white" />
      </span>
      <h3 className="text-h2 font-bold text-foreground-primary">{greeting}</h3>
      <p className="max-w-[280px] text-body-sm text-foreground-secondary">{subtitle}</p>
      <SuggestedPrompts prompts={prompts} onPrompt={onPrompt} className="mt-1 justify-center" />
    </div>
  );
}

export function SuggestedPrompts({
  prompts,
  onPrompt,
  className = "",
}: {
  prompts: string[];
  onPrompt: (prompt: string) => void;
  className?: string;
}) {
  if (prompts.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          onClick={() => onPrompt(prompt)}
          className="rounded-full border border-border-token-default bg-background-card px-3.5 py-1.5 text-body-sm text-foreground-secondary transition-colors duration-fast hover:border-teal-accent hover:text-foreground-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-accent"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}

export function ChatErrorState({
  message = "Something broke on my side — nothing you entered is lost.",
  onRetry,
  className = "",
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-start gap-2 rounded-lg border border-border-token-default border-l-2 border-l-status-danger bg-background-page px-3.5 py-2.5 ${className}`} role="alert">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-status-danger" aria-hidden />
      <div className="text-body-md text-foreground-primary">
        {message}
        {onRetry && (
          <button type="button" onClick={onRetry} className="ml-2 font-semibold text-interactive-primary hover:underline">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
