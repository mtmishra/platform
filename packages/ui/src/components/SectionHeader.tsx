"use client";

import React from "react";
import { Heading, Paragraph, Label } from "./typography";

export interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  className?: string;
  titleLevel?: 1 | 2 | 3;
}

export function SectionHeader({
  label,
  title,
  description,
  rightElement,
  className = "",
  titleLevel = 2,
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 border-b border-border-token-default/50 mb-6 ${className}`}>
      <div className="flex-1 flex flex-col gap-1">
        {label && (
          <Label caps className="text-interactive-primary font-bold tracking-wider mb-0.5">
            {label}
          </Label>
        )}
        <Heading level={titleLevel} size={titleLevel === 1 ? "display-large" : titleLevel === 2 ? "h1" : "h2"} className="text-foreground-primary tracking-tight">
          {title}
        </Heading>
        {description && (
          <Paragraph size="sm" color="secondary" className="mt-1">
            {description}
          </Paragraph>
        )}
      </div>
      {rightElement && (
        <div className="flex items-center shrink-0 self-start md:self-end">
          {rightElement}
        </div>
      )}
    </div>
  );
}
