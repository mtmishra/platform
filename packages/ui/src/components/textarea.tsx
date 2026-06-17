"use client";

import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string | undefined;
}

export function Textarea({
  label,
  hint,
  error,
  className = "",
  id,
  rows = 4,
  ...rest
}: TextareaProps) {
  const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={fieldId}
          className="text-body-md font-medium text-foreground-primary"
        >
          {label}
        </label>
      )}

      <textarea
        id={fieldId}
        rows={rows}
        className={[
          "w-full rounded-md border bg-background-card px-3 py-2 text-body-lg text-foreground-primary",
          "placeholder:text-foreground-tertiary",
          "transition-colors duration-fast ease-standard",
          "focus:outline-none focus:ring-2 focus:ring-interactive-primary focus:border-interactive-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError
            ? "border-status-danger focus:ring-status-danger focus:border-status-danger"
            : "border-border-token-default",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />

      {(hint ?? error) && (
        <p
          className={[
            "text-body-sm",
            hasError ? "text-status-danger" : "text-foreground-tertiary",
          ].join(" ")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
