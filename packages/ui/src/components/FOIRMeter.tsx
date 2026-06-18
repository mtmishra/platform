

export interface FOIRMeterProps {
  foir: number; // FOIR percentage, e.g., 38
  className?: string;
  showLabels?: boolean;
}

export function FOIRMeter({ foir, className = "", showLabels = true }: FOIRMeterProps) {
  const clamped = Math.max(0, Math.min(100, foir));

  // Determine color segment based on standard Indian underwriting bounds
  let color = "#16A34A"; // Safe Green
  let label = "Comfortable";
  let textClass = "text-status-success";

  if (foir > 65) {
    color = "#DC2626"; // Red (Above platform cap)
    label = "Critical (Overleveraged)";
    textClass = "text-status-danger";
  } else if (foir > 50) {
    color = "#EA580C"; // Orange (Borderline cap)
    label = "Borderline";
    textClass = "text-orange-600-lm";
  } else if (foir > 35) {
    color = "#D97706"; // Amber (Attention needed)
    label = "Moderate";
    textClass = "text-status-warning";
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showLabels && (
        <div className="flex justify-between items-center text-body-sm">
          <span className="font-semibold text-foreground-secondary">
            Debt-to-Income (FOIR)
          </span>
          <span className={`font-bold ${textClass}`}>
            {foir}% · {label}
          </span>
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative w-full h-4 bg-gray-200-lm rounded-full overflow-hidden">
        {/* Fill */}
        <div
          className="h-full rounded-full transition-[width] duration-slow ease-standard"
          style={{
            width: `${clamped}%`,
            backgroundColor: color,
            willChange: "width",
          }}
        />

        {/* 35% safe marker line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground-primary/40"
          style={{ left: "35%" }}
          title="Comfort Limit (35%)"
        />

        {/* 65% platform cap line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-status-danger/70"
          style={{ left: "65%" }}
          title="Platform Cap (65%)"
        />
      </div>

      {showLabels && (
        <div className="flex justify-between text-body-sm text-foreground-tertiary px-0.5">
          <span>0%</span>
          <span className="text-center translate-x-[-50%] relative">
            <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 border-l border-t border-foreground-tertiary w-1.5 h-1.5 rotate-45" />
            Comfort limit (35%)
          </span>
          <span className="text-center translate-x-[-50%] relative">
            <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 border-l border-t border-status-danger w-1.5 h-1.5 rotate-45" />
            Max Cap (65%)
          </span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
}
