"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { ScoreGauge } from "@leapmoney/ui";

// ── LeapScore v2 computation (mirrors packages/credit/src/leapscore/engine.ts)
function computeLeapScore(
  cibil: number,
  income: number,
  utilisation: number,
  emi: number,
): { score: number; bureau: number; incomeBase: number; foir: number; banking: number } {
  // Bureau Health (max 30)
  const bs = (cibil - 300) / 600;
  const bureau = Math.round(
    Math.max(0, Math.min(bs * 13.5, 13.5)) + // CIBIL contribution
    6.0 + // DPD assumed 0
    3.0 + // Enquiries ≤2
    1.5 + // Credit age ~5yr
    Math.max(0, Math.min((1 - utilisation / 100 + (utilisation < 30 ? 0.05 : 0)) * 6, 6)),
  );

  // Income Base (max 20)
  const ibContrib = Math.min(income / 100000, 1.0) * 10;
  const incomeBase = Math.round(ibContrib + 10); // stable salaried +10

  // FOIR (max 20)
  const foirRatio = income > 0 ? (emi / income) * 100 : 100;
  let foirNorm = 0;
  if (foirRatio <= 20) foirNorm = 1.0;
  else if (foirRatio <= 35) foirNorm = 0.8;
  else if (foirRatio <= 50) foirNorm = 0.55;
  else if (foirRatio <= 65) foirNorm = 0.3;
  else if (foirRatio <= 75) foirNorm = 0.1;
  const foir = Math.round(foirNorm * 20);

  // Banking behaviour (max 15) — fixed assumption
  const banking = 11;

  // Employment (max 8) + Readiness (max 4.5) — fixed
  const other = 8 + 4.5;

  const score = Math.min(100, Math.round(bureau + incomeBase + foir + banking + other));
  return { score, bureau, incomeBase, foir, banking };
}

function getBand(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "EXCELLENT", color: "#16A34A" };
  if (score >= 70) return { label: "LOAN READY", color: "#16A34A" };
  if (score >= 55) return { label: "MODERATE", color: "#D97706" };
  if (score >= 40) return { label: "NEEDS WORK", color: "#D97706" };
  return { label: "HIGH RISK", color: "#DC2626" };
}

function getImprovement(utilisation: number, foir: number, cibil: number): string | null {
  if (utilisation > 30)
    return `Reducing your card utilisation to ${Math.max(utilisation - 10, 28)}% would lift your score by +${Math.round((utilisation - 28) / 5)} points.`;
  if (foir > 35)
    return "Clearing one existing EMI would improve your FOIR and unlock better lender options.";
  if (cibil < 700)
    return "Maintaining 0 missed payments for 6 months will improve your bureau score significantly.";
  return null;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  markers: { value: number; label: string }[];
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, format, markers, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-body-md font-semibold text-foreground-primary">{label}</span>
        <span className="font-mono text-body-md font-bold text-blue-primary">{format(value)}</span>
      </div>
      <div className="relative py-1">
        <div className="relative h-1.5 rounded-full bg-border-token-default">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-blue-primary transition-[width] duration-fast"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
          aria-label={label}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
        />
        {/* Thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-primary bg-background-card shadow-2 transition-[left] duration-fast"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between">
        {markers.map((m) => (
          <span key={m.label} className="text-label-caps text-foreground-tertiary">{m.label}</span>
        ))}
      </div>
    </div>
  );
}

export function ScoreSimulator() {
  const [cibil, setCibil] = useState(720);
  const [income, setIncome] = useState(65000);
  const [utilisation, setUtilisation] = useState(38);
  const [emi, setEmi] = useState(12000);

  const { score, bureau, incomeBase, foir, banking } = useMemo(
    () => computeLeapScore(cibil, income, utilisation, emi),
    [cibil, income, utilisation, emi],
  );

  const foirPct = income > 0 ? Math.round((emi / income) * 100) : 0;
  const band = getBand(score);
  const tip = getImprovement(utilisation, foirPct, cibil);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
      {/* Left — sliders */}
      <div className="rounded-xl border border-border-token-default bg-background-card p-6 shadow-1">
        <div className="mb-5 flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-blue-primary" aria-hidden="true" />
          <span className="text-body-md font-bold text-foreground-primary">Adjust Profile Signals</span>
        </div>

        <div className="flex flex-col gap-6">
          <Slider
            label="Bureau Score (CIBIL / Experian)"
            value={cibil}
            min={300}
            max={900}
            step={5}
            format={(v) => v.toString()}
            markers={[
              { value: 300, label: "Thin File (300)" },
              { value: 600, label: "Average (700)" },
              { value: 900, label: "Excellent (900)" },
            ]}
            onChange={setCibil}
          />

          <Slider
            label="Net Monthly Income (NMI)"
            value={income}
            min={20000}
            max={150000}
            step={5000}
            format={(v) => `₹${v.toLocaleString("en-IN")}`}
            markers={[
              { value: 20000, label: "₹20,000" },
              { value: 85000, label: "₹75,000" },
              { value: 150000, label: "₹1,50,000+" },
            ]}
            onChange={setIncome}
          />

          <Slider
            label="Credit Card Utilisation Ratio"
            value={utilisation}
            min={0}
            max={100}
            step={1}
            format={(v) => `${v}%`}
            markers={[
              { value: 0, label: "Ideal (<30%)" },
              { value: 50, label: "Moderate (50%)" },
              { value: 100, label: "High Risk (100%)" },
            ]}
            onChange={setUtilisation}
          />

          <Slider
            label="Existing Monthly EMIs"
            value={emi}
            min={0}
            max={50000}
            step={1000}
            format={(v) => `₹${v.toLocaleString("en-IN")}`}
            markers={[
              { value: 0, label: "No Obligations (₹0)" },
              { value: 25000, label: "₹20,000" },
              { value: 50000, label: "High obligations (₹50,000)" },
            ]}
            onChange={setEmi}
          />
        </div>
      </div>

      {/* Right — score output */}
      <div className="flex flex-col gap-4">
        {/* Score gauge */}
        <div className="rounded-xl border border-border-token-default bg-background-card p-6 shadow-1 flex flex-col items-center gap-4">
          <ScoreGauge score={score} size={180} />
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-body-sm font-bold text-white"
            style={{ background: band.color }}
          >
            + {band.label}
          </div>
        </div>

        {/* Factor breakdown */}
        <div className="rounded-xl border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="mb-3 text-center text-body-md font-semibold text-foreground-primary">
            Score Factor Contributions
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {[
              { label: "Bureau Health", value: bureau, max: 30 },
              { label: "Income Base", value: incomeBase, max: 20 },
              { label: "FOIR Score", value: foir, max: 20 },
              { label: "Banking Behaviour", value: banking, max: 15 },
            ].map((f) => (
              <div key={f.label} className="flex items-center justify-between">
                <span className="text-body-sm text-foreground-secondary">{f.label}:</span>
                <span className="font-mono text-body-sm font-bold text-foreground-primary">
                  {f.value}/{f.max}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI improvement tip */}
        {tip && (
          <div className="rounded-xl border border-status-success/20 bg-status-success/5 p-4">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles size={14} className="text-status-success" aria-hidden="true" />
              <span className="text-body-sm font-semibold text-status-success">AI Improvement Opportunity</span>
            </div>
            <p className="text-body-sm text-foreground-secondary">{tip}</p>
          </div>
        )}

        {/* FOIR display */}
        <div className="rounded-xl border border-border-token-default bg-background-page p-4">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-foreground-secondary">Current FOIR</span>
            <span
              className="font-mono text-body-md font-bold"
              style={{ color: foirPct <= 35 ? "#16A34A" : foirPct <= 50 ? "#D97706" : "#DC2626" }}
            >
              {foirPct}%
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-border-token-default overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-fast"
              style={{
                width: `${Math.min(foirPct, 100)}%`,
                background: foirPct <= 35 ? "#16A34A" : foirPct <= 50 ? "#D97706" : "#DC2626",
              }}
            />
          </div>
          <p className="mt-1 text-label-caps text-foreground-tertiary">
            {foirPct <= 35 ? "Healthy — most lenders approve" : foirPct <= 50 ? "Moderate — some lenders restrict" : "High — approval difficult above 50%"}
          </p>
        </div>
      </div>
    </div>
  );
}
