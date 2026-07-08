"use client";

// ── AIThinking ────────────────────────────────────────────────────────────
// Sprint 29 T12 — UX §3.12. Teal dots + verb label ("Running LeapMatch…",
// copy map in UX §9.3 / Conversation OS). Reduced-motion: static dots.


export function AIThinking({ label = "LeapAI is thinking…", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 px-1 py-1 text-body-sm text-foreground-tertiary ${className}`} role="status" aria-live="polite">
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-accent motion-reduce:animate-none"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
      {label}
    </div>
  );
}
