"use client";

import { EmptyState } from "./EmptyState";

export interface ScoreTrendChartProps {
  data: number[];
  labels: string[];
  height?: number;
  className?: string;
}

export function ScoreTrendChart({
  data,
  labels,
  height = 160,
  className = "",
}: ScoreTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No Score Data Available"
        description="We need to retrieve your credit score to plot history trends."
        className="w-full border-none shadow-none"
      />
    );
  }

  // LeapScore scale bounds (300 to 900)
  const minScore = 300;
  const maxScore = 900;
  const range = maxScore - minScore;

  // Chart coordinates
  const width = 500;
  const paddingX = 40;
  const paddingY = 20;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Map scores to coordinates
  const points = data.map((val, i) => {
    const clampedVal = Math.max(minScore, Math.min(maxScore, val));
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    // SVGs draw from top-left, so subtract from height
    const y = height - paddingY - ((clampedVal - minScore) / range) * chartHeight;
    return { x, y, value: val };
  });

  // SVG Path String
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Gradient path string (close the shape to the bottom of the grid)
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  let gradientD = "";
  if (firstPoint && lastPoint) {
    gradientD = `${pathD} L ${lastPoint.x} ${height - paddingY} L ${firstPoint.x} ${height - paddingY} Z`;
  }

  // Guideline helper
  const getYForScore = (score: number) => {
    const clamped = Math.max(minScore, Math.min(maxScore, score));
    return height - paddingY - ((clamped - minScore) / range) * chartHeight;
  };

  const bands = [
    { score: 800, label: "Loan Ready", color: "#16A34A" },
    { score: 650, label: "Strong Candidate", color: "#2563EB" },
    { score: 500, label: "Improvable", color: "#D97706" },
  ];

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* Score Grid & SVG Chart */}
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 500 ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines & score band boundaries */}
          {bands.map((b) => {
            const y = getYForScore(b.score);
            return (
              <g key={b.score}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke={b.color}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
                <text
                  x={width - paddingX + 5}
                  y={y + 3}
                  fill={b.color}
                  fontSize="8"
                  className="font-mono font-semibold"
                >
                  {b.score}
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
          {gradientD && <path d={gradientD} fill="url(#scoreGradient)" />}

          {/* Main Score Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Score Nodes */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              {/* Score label hover tooltip overlay */}
              <text
                x={p.x}
                y={p.y - 10}
                fill="#0B1220"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-fast pointer-events-none fill-foreground-primary"
              >
                {p.value}
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

      {/* Standard Legends */}
      <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border-token-default/40 pt-2 text-body-sm">
        <span className="text-foreground-tertiary">Bands:</span>
        {bands.map((b) => (
          <span key={b.score} className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: b.color }} />
            <span className="text-foreground-secondary">{b.label} ({b.score}+)</span>
          </span>
        ))}
      </div>
    </div>
  );
}
