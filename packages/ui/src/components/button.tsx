"use client";

import React from "react";

export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: [
    "bg-interactive-primary text-foreground-on-dark",
    "hover:bg-interactive-hover",
    "focus-visible:ring-interactive-primary",
  ].join(" "),
  secondary: [
    "bg-background-card text-foreground-primary",
    "border border-border-token-default",
    "hover:bg-background-page",
    "focus-visible:ring-interactive-primary",
  ].join(" "),
  ghost: [
    "bg-transparent text-foreground-primary",
    "hover:bg-background-page",
    "focus-visible:ring-interactive-primary",
  ].join(" "),
  danger: [
    "bg-status-danger text-foreground-on-dark",
    "hover:opacity-90",
    "focus-visible:ring-status-danger",
  ].join(" "),
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-body-md",
  md: "h-11 px-4 text-body-lg",
  lg: "h-12 px-6 text-body-lg font-semibold",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors duration-normal ease-standard",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
