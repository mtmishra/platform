"use client";

import React from "react";
import { EmptyState } from "./EmptyState";

export interface PortfolioSegment {
  label: string;
  value: number; // raw value e.g. principal amount
  count: number;
  color: string;
}

export interface PortfolioChartProps {
  segments: PortfolioSegment[];
  totalLabel?: string;
  className?: string;
}

export function PortfolioChart({
  segments,
  totalLabel = "Total Exposure",
  className = "",
}: PortfolioChartProps) {
  if (!segments || segments.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No Portfolio Data"
        description="Active loan products and outstanding obligations will appear here."
        className="w-full border-none shadow-none"
      />
    );
  }

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  // Format currency in Lakhs/INR
  const formatInr = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className={`w-full flex flex-col gap-4 ${className}`}>
      {/* Total Display */}
      <div className="flex justify-between items-baseline">
        <span className="text-body-sm text-foreground-tertiary uppercase font-bold tracking-wider">
          {totalLabel}
        </span>
        <span className="font-mono text-h1 font-bold text-foreground-primary">
          {formatInr(total)}
        </span>
      </div>

      {/* Horizontal Stacked Segmented Bar */}
      <div className="relative w-full h-6 rounded-md bg-gray-200-lm/30 border border-border-token-default/40 overflow-hidden flex">
        {total > 0 ? (
          segments.map((seg, idx) => {
            const pct = (seg.value / total) * 100;
            if (pct <= 0) return null;
            return (
              <div
                key={idx}
                className="h-full flex items-center justify-center text-[10px] text-white font-bold select-none cursor-pointer group relative transition-all hover:brightness-105"
                style={{
                  width: `${pct}%`,
                  backgroundColor: seg.color,
                }}
                title={`${seg.label}: ${pct.toFixed(1)}% (${formatInr(seg.value)})`}
              >
                {pct >= 10 && `${pct.toFixed(0)}%`}
              </div>
            );
          })
        ) : (
          <div className="w-full h-full bg-border-token-default/30 flex items-center justify-center text-body-sm text-foreground-tertiary">
            0% Allocation
          </div>
        )}
      </div>

      {/* Legend & Details Block */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-border-token-default/40 pt-3">
        {segments.map((seg, idx) => {
          const pct = total > 0 ? (seg.value / total) * 100 : 0;
          return (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 rounded bg-background-page/40 border border-border-token-default/30"
            >
              <span
                className="h-3 w-3 rounded-full shrink-0 mt-0.5"
                style={{ backgroundColor: seg.color }}
              />
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-body-sm font-semibold text-foreground-secondary">
                  {seg.label}
                </span>
                <span className="font-mono text-body-sm font-bold text-foreground-primary">
                  {formatInr(seg.value)}
                </span>
                <span className="text-[10px] text-foreground-tertiary">
                  {seg.count} application{seg.count !== 1 ? "s" : ""} ({pct.toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
