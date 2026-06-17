"use client";

import React from "react";

interface CalculatorFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Formatted display of the current value, e.g. "₹10,00,000". */
  display: string;
  onChange: (value: number) => void;
}

export function CalculatorField({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: CalculatorFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-body-md font-medium text-foreground-secondary">{label}</label>
        <span className="font-mono text-body-lg font-semibold text-foreground-primary">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border-token-default accent-[var(--color-interactive-primary)]"
      />
      <div className="flex justify-between text-body-sm text-foreground-tertiary">
        <span>{min.toLocaleString("en-IN")}</span>
        <span>{max.toLocaleString("en-IN")}</span>
      </div>
    </div>
  );
}
