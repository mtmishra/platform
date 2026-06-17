import React from "react";

export interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  background?: "page" | "card" | "feature";
  as?: React.ElementType;
}

const backgroundClasses: Record<
  NonNullable<SectionProps["background"]>,
  string
> = {
  page:    "bg-background-page",
  card:    "bg-background-card",
  feature: "bg-background-feature",
};

export function Section({
  children,
  id,
  className = "",
  background = "page",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={[
        "py-12 lg:py-16",
        backgroundClasses[background],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
