"use client";

import { EmptyState } from "./EmptyState";

export interface RevenueDataPoint {
  label: string; // e.g. "Jan"
  primaryValue: number; // e.g. Commission
  secondaryValue?: number; // e.g. Total Volume (indicative)
}

export interface RevenueChartProps {
  data: RevenueDataPoint[];
  primaryName?: string;
  secondaryName?: string;
  height?: number;
  className?: string;
}

export function RevenueChart({
  data,
  primaryName = "Earnings",
  secondaryName,
  height = 160,
  className = "",
}: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No Revenue Data"
        description="MTD earnings and disbursement history details will be plotted here."
        className="w-full border-none shadow-none"
      />
    );
  }

  const primaryValues = data.map((d) => d.primaryValue);
  const secondaryValues = data.map((d) => d.secondaryValue ?? 0);
  const allValues = [...primaryValues, ...secondaryValues];
  
  const maxVal = Math.max(...allValues, 10000);
  
  // Format currency
  const formatInr = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  // SVG Coordinates
  const width = 500;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Axis lines helpers
  const yTicks = [0, maxVal * 0.5, maxVal];

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* SVG Bar Chart */}
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 500 ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Y Axis Guidelines */}
          {yTicks.map((tick, i) => {
            const y = paddingTop + chartHeight - (tick / maxVal) * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  fill="#94A3B8"
                  fontSize="8"
                  textAnchor="end"
                  className="font-mono font-semibold"
                >
                  {formatInr(tick)}
                </text>
              </g>
            );
          })}

          {/* Bottom baseline */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />

          {/* Render Bars */}
          {data.map((item, idx) => {
            const numBars = data.length;
            const groupWidth = chartWidth / numBars;
            const barWidth = groupWidth * 0.4;
            const groupX = paddingLeft + idx * groupWidth;

            // Bar 1 (Primary)
            const val1 = item.primaryValue;
            const barHeight1 = (val1 / maxVal) * chartHeight;
            const x1 = groupX + groupWidth * 0.15;
            const y1 = height - paddingBottom - barHeight1;

            // Bar 2 (Secondary, optional)
            const val2 = item.secondaryValue ?? 0;
            const barHeight2 = (val2 / maxVal) * chartHeight;
            const x2 = groupX + groupWidth * 0.45;
            const y2 = height - paddingBottom - barHeight2;

            return (
              <g key={idx} className="group cursor-pointer">
                {/* Primary Bar */}
                <rect
                  x={x1}
                  y={y1}
                  width={barWidth}
                  height={Math.max(barHeight1, 2)}
                  fill="#2563EB"
                  rx="3"
                  ry="3"
                  className="transition-all hover:fill-blue-600"
                />
                {/* Primary Tooltip Overlay */}
                <text
                  x={x1 + barWidth / 2}
                  y={y1 - 5}
                  fill="#0B1220"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast pointer-events-none fill-foreground-primary"
                >
                  {formatInr(val1)}
                </text>

                {/* Secondary Bar */}
                {secondaryName && val2 > 0 && (
                  <>
                    <rect
                      x={x2}
                      y={y2}
                      width={barWidth}
                      height={Math.max(barHeight2, 2)}
                      fill="#14B8A6"
                      rx="3"
                      ry="3"
                      className="transition-all hover:fill-teal-600"
                    />
                    {/* Secondary Tooltip Overlay */}
                    <text
                      x={x2 + barWidth / 2}
                      y={y2 - 5}
                      fill="#0B1220"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast pointer-events-none fill-foreground-primary"
                    >
                      {formatInr(val2)}
                    </text>
                  </>
                )}

                {/* X Axis label centered under the group */}
                <text
                  x={groupX + groupWidth / 2 - 5}
                  y={height - 10}
                  fill="#64748B"
                  fontSize="9"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legends */}
      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border-token-default/40 pt-2 text-body-sm">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded bg-blue-primary" />
          <span className="text-foreground-secondary">{primaryName}</span>
        </span>
        {secondaryName && (
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded bg-teal-accent" />
            <span className="text-foreground-secondary">{secondaryName}</span>
          </span>
        )}
      </div>
    </div>
  );
}
