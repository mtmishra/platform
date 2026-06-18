"use client";

import React from "react";
import { EmptyState } from "./EmptyState";

export interface ApprovalTrendChartProps {
  data: number[];
  labels: string[];
  height?: number;
  className?: string;
}

export function ApprovalTrendChart({
  data,
  labels,
  height = 160,
  className = "",
}: ApprovalTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No Approval Odds Data"
        description="We will calculate and track your lender matches approval likelihood once profile criteria is set."
        className="w-full border-none shadow-none"
      />
    );
  }

  // Range bounds (0% to 100%)
  const minProb = 0;
  const maxProb = 100;
  const range = 100;

  // Chart coordinates
  const width = 500;
  const paddingX = 40;
  const paddingY = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Map odds to coordinates
  const points = data.map((val, i) => {
    const clampedVal = Math.max(minProb, Math.min(maxProb, val));
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - (clampedVal / range) * chartHeight;
    return { x, y, value: val };
  });

  // SVG Path String
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Gradient path
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  let gradientD = "";
  if (firstPoint && lastPoint) {
    gradientD = `${pathD} L ${lastPoint.x} ${height - paddingY} L ${firstPoint.x} ${height - paddingY} Z`;
  }

  const getYForProb = (prob: number) => {
    return height - paddingY - (prob / range) * chartHeight;
  };

  const thresholds = [
    { value: 70, label: "High Odds", color: "#16A34A" },
    { value: 40, label: "Medium Odds", color: "#D97706" },
  ];

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* Grid & SVG Chart */}
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 500 ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Threshold lines */}
          {thresholds.map((t) => {
            const y = getYForProb(t.value);
            return (
              <g key={t.value}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke={t.color}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <text
                  x={width - paddingX + 5}
                  y={y + 3}
                  fill={t.color}
                  fontSize="8"
                  className="font-mono font-semibold"
                >
                  {t.value}%
                </text>
              </g>
            );
          })}

          {/* Bottom baseline */}
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#E2E8F0"
            strokeWidth="1.5"
          />

          {/* Gradient Area Fill */}
          {gradientD && <path d={gradientD} fill="url(#probGradient)" />}

          {/* Main Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#14B8A6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#14B8A6"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text
                x={p.x}
                y={p.y - 10}
                fill="#0B1220"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast pointer-events-none fill-foreground-primary"
              >
                {p.value}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Axis Month Labels */}
      {labels && labels.length > 0 && (
        <div className="flex justify-between text-body-sm text-foreground-tertiary px-[40px]">
          {labels.map((lbl, idx) => (
            <span key={idx} className="font-mono">
              {lbl}
            </span>
          ))}
        </div>
      )}

      {/* Legends */}
      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border-token-default/40 pt-2 text-body-sm">
        <span className="text-foreground-tertiary">Odds:</span>
        {thresholds.map((t) => (
          <span key={t.value} className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
            <span className="text-foreground-secondary">{t.label} ({t.value}%+)</span>
          </span>
        ))}
      </div>
    </div>
  );
}
