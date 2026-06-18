"use client";

import React from "react";
import { Database, Loader2, Clock, ClipboardCheck, AlertCircle } from "lucide-react";
import { Button } from "./button";

export type EmptyStateVariant = "no-data" | "loading" | "pending" | "under-review" | "error" | "custom";

export interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  variant = "no-data",
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = "",
}: EmptyStateProps) {
  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case "loading":
        return <Loader2 size={36} className="animate-spin text-interactive-primary" />;
      case "pending":
        return <Clock size={36} className="text-status-warning" />;
      case "under-review":
        return <ClipboardCheck size={36} className="text-interactive-primary" />;
      case "error":
        return <AlertCircle size={36} className="text-status-danger" />;
      case "no-data":
      default:
        return <Database size={36} className="text-foreground-tertiary" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border-token-default/80 bg-background-card/50 backdrop-blur-sm p-10 text-center shadow-1 ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background-page/80 shadow-1 border border-border-token-default/50">
        {getIcon()}
      </div>
      <div className="flex flex-col gap-1.5 max-w-md">
        <h3 className="text-h2 font-bold text-foreground-primary tracking-tight">{title}</h3>
        <p className="text-body-md text-foreground-secondary leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="mt-2">
          <Button variant="secondary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
