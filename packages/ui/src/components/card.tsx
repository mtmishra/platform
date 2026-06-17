import React from "react";

export interface CardProps {
  children: React.ReactNode;
  variant?: "default" | "feature";
  hoverable?: boolean;
  className?: string;
  as?: React.ElementType;
}

const variantClasses: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "bg-background-card border border-border-token-default shadow-1",
  feature: "bg-background-feature text-foreground-on-dark shadow-2",
};

export function Card({
  children,
  variant = "default",
  hoverable = false,
  className = "",
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={[
        "rounded-lg p-6",
        variantClasses[variant],
        hoverable
          ? "transition-shadow duration-normal ease-standard hover:shadow-2 cursor-pointer"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={["mb-4", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className = "" }: CardBodyProps) {
  return (
    <div className={["text-body-md text-foreground-secondary", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
