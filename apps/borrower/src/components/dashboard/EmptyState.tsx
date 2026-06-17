import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-token-default bg-background-card p-10 text-center">
      <div className="text-foreground-tertiary">{icon}</div>
      <h3 className="text-h3 font-semibold text-foreground-primary">{title}</h3>
      <p className="max-w-sm text-body-md text-foreground-secondary">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
