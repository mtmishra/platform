"use client";

import React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  prefix?: string;
}

const sizeClasses: Record<NonNullable<InputProps["size"]>, string> = {
  sm: "h-9 px-3 text-body-md",
  md: "h-11 px-3 text-body-lg",
  lg: "h-12 px-4 text-body-lg",
};

export function Input({
  label,
  hint,
  error,
  size = "md",
  prefixIcon,
  suffixIcon,
  prefix,
  className = "",
  id,
  ...rest
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-body-md font-medium text-foreground-primary"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-body-md text-foreground-tertiary select-none">
            {prefix}
          </span>
        )}
        {prefixIcon && !prefix && (
          <span className="absolute left-3 flex items-center text-foreground-tertiary">
            {prefixIcon}
          </span>
        )}

        <input
          id={inputId}
          className={[
            "w-full rounded-md border bg-background-card text-foreground-primary",
            "placeholder:text-foreground-tertiary",
            "transition-colors duration-fast ease-standard",
            "focus:outline-none focus:ring-2 focus:ring-interactive-primary focus:border-interactive-primary",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError
              ? "border-status-danger focus:ring-status-danger focus:border-status-danger"
              : "border-border-token-default",
            prefix ? "pl-7" : prefixIcon ? "pl-10" : "",
            suffixIcon ? "pr-10" : "",
            sizeClasses[size],
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        />

        {suffixIcon && (
          <span className="absolute right-3 flex items-center text-foreground-tertiary">
            {suffixIcon}
          </span>
        )}
      </div>

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
