import React from "react";

// ── Heading ───────────────────────────────────────────────────────────────

export interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  size?: "display-hero" | "display-large" | "h1" | "h2" | "h3";
  color?: "primary" | "secondary" | "on-dark";
  className?: string;
}

const levelTag: Record<NonNullable<HeadingProps["level"]>, React.ElementType> =
  { 1: "h1", 2: "h2", 3: "h3", 4: "h4" };

const defaultSizeByLevel: Record<
  NonNullable<HeadingProps["level"]>,
  NonNullable<HeadingProps["size"]>
> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h3",
};

const sizeClasses: Record<NonNullable<HeadingProps["size"]>, string> = {
  "display-hero":  "text-display-hero font-bold",
  "display-large": "text-display-large font-bold",
  h1:              "text-h1 font-bold",
  h2:              "text-h2 font-semibold",
  h3:              "text-h3 font-semibold",
};

const colorClasses: Record<NonNullable<HeadingProps["color"]>, string> = {
  primary:   "text-foreground-primary",
  secondary: "text-foreground-secondary",
  "on-dark": "text-foreground-on-dark",
};

export function Heading({
  children,
  level = 2,
  size,
  color = "primary",
  className = "",
}: HeadingProps) {
  const Tag = levelTag[level];
  const resolvedSize = size ?? defaultSizeByLevel[level];

  return (
    <Tag
      className={[
        sizeClasses[resolvedSize],
        colorClasses[color],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}

// ── Paragraph ─────────────────────────────────────────────────────────────

export interface ParagraphProps {
  children: React.ReactNode;
  size?: "lg" | "md" | "sm";
  color?: "primary" | "secondary" | "tertiary" | "on-dark";
  className?: string;
}

const paragraphSizeClasses: Record<NonNullable<ParagraphProps["size"]>, string> =
  {
    lg: "text-body-lg",
    md: "text-body-md",
    sm: "text-body-sm",
  };

const paragraphColorClasses: Record<
  NonNullable<ParagraphProps["color"]>,
  string
> = {
  primary:   "text-foreground-primary",
  secondary: "text-foreground-secondary",
  tertiary:  "text-foreground-tertiary",
  "on-dark": "text-foreground-on-dark",
};

export function Paragraph({
  children,
  size = "md",
  color = "secondary",
  className = "",
}: ParagraphProps) {
  return (
    <p
      className={[
        paragraphSizeClasses[size],
        paragraphColorClasses[color],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}

// ── Label ─────────────────────────────────────────────────────────────────

export interface LabelProps {
  children: React.ReactNode;
  caps?: boolean;
  className?: string;
}

export function Label({ children, caps = false, className = "" }: LabelProps) {
  return (
    <span
      className={[
        caps
          ? "text-label-caps font-semibold uppercase tracking-wider text-foreground-tertiary"
          : "text-body-sm font-medium text-foreground-secondary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
