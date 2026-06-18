import React from "react";
import { Inbox } from "lucide-react";

// ── Empty / Loading / Skeleton State System (V3.0) ─────────────────────────────
// Branded placeholders. Shared across all surfaces. Skeleton/loading use opacity
// pulse only (GPU-safe).

// EmptyState — icon + headline + description + optional action.
export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}
export function EmptyState({ title, description, icon, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-token-default bg-background-card px-6 py-12 text-center ${className}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background-page text-foreground-tertiary">
        {icon ?? <Inbox size={22} aria-hidden="true" />}
      </span>
      <p className="text-body-lg font-semibold text-foreground-primary">{title}</p>
      {description ? <p className="max-w-sm text-body-md text-foreground-secondary">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

// LoadingState — spinner + label (opacity/transform animation only).
export interface LoadingStateProps {
  label?: string;
  className?: string;
}
export function LoadingState({ label = "Loading…", className = "" }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 px-6 py-12 text-center ${className}`} role="status" aria-live="polite">
      <svg className="h-7 w-7 animate-spin text-interactive-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-body-md text-foreground-secondary">{label}</p>
    </div>
  );
}

// SkeletonState — shimmer placeholder blocks (opacity pulse).
export interface SkeletonStateProps {
  lines?: number;
  className?: string;
}
export function SkeletonState({ lines = 3, className = "" }: SkeletonStateProps) {
  return (
    <div className={`flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 ${className}`} aria-hidden="true">
      <div className="h-6 w-1/3 animate-pulse rounded bg-background-page" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 animate-pulse rounded bg-background-page" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

// SkeletonBlock — single shimmer block for composing custom skeletons.
export interface SkeletonBlockProps {
  className?: string;
}
export function SkeletonBlock({ className = "h-4 w-full" }: SkeletonBlockProps) {
  return <div className={`animate-pulse rounded bg-background-page ${className}`} aria-hidden="true" />;
}
