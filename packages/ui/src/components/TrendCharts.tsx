export interface TrendChartsProps {
  data: number[];
  labels?: string[];
  type?: "line" | "sparkline";
  color?: string;
  height?: number;
  className?: string;
}

export function TrendCharts({
  data,
  labels,
  type = "line",
  color = "#2563EB",
  height = 120,
  className = "",
}: TrendChartsProps) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data) - 5;
  const max = Math.max(...data) + 5;
  const range = max - min || 1;

  // Chart coordinates
  const width = 400;
  const paddingX = type === "sparkline" ? 0 : 30;
  const paddingY = type === "sparkline" ? 2 : 15;
  
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = data.map((val, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - ((val - min) / range) * chartHeight;
    return { x, y, value: val };
  });

  // SVG Path String
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Gradient path string (close the shape to the bottom)
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  
  if (!firstPoint || !lastPoint) return null;
  
  const gradientD = `${pathD} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;

  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 400 ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (only for full line chart) */}
          {type === "line" && (
            <>
              <line x1="30" y1={paddingY} x2="370" y2={paddingY} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1={height / 2} x2="370" y2={height / 2} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="30" y1={height - paddingY} x2="370" y2={height - paddingY} stroke="#E2E8F0" strokeWidth="1" />
            </>
          )}

          {/* Gradient Fill */}
          <path d={gradientD} fill="url(#chartGradient)" />

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth={type === "sparkline" ? "2" : "3"}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing points */}
          {type === "line" &&
            points.map((p, i) => (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="5"
                  fill={color}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-transform duration-fast hover:scale-150"
                />
                {/* Score hover tooltip overlay (mock representation) */}
                <title>{`Value: ${p.value}${labels && labels[i] ? ` in ${labels[i]}` : ""}`}</title>
              </g>
            ))}
        </svg>
      </div>

      {/* X Axis labels */}
      {type === "line" && labels && labels.length > 0 && (
        <div className="flex justify-between text-body-sm text-foreground-tertiary mt-2 px-[15px]">
          {labels.map((lbl, idx) => (
            <span key={idx} className="font-mono">{lbl}</span>
          ))}
        </div>
      )}
    </div>
  );
}
