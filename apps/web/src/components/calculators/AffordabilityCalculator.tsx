"use client";

import React, { useEffect, useMemo, useState } from "react";
import { calculateAffordability, formatINR } from "@/lib/finance";
import { trackCalculatorUsed } from "@leapmoney/analytics";
import { CalculatorField } from "./CalculatorField";

export function AffordabilityCalculator() {
  const [budget, setBudget] = useState(25_000);
  const [rate, setRate] = useState(10.5);
  const [months, setMonths] = useState(60);
  const [tracked, setTracked] = useState(false);

  const result = useMemo(
    () =>
      calculateAffordability({
        monthlyBudget: budget,
        annualRatePct: rate,
        months,
      }),
    [budget, rate, months]
  );

  useEffect(() => {
    if (!tracked) {
      trackCalculatorUsed("affordability");
      setTracked(true);
    }
  }, [budget, rate, months, tracked]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6 rounded-lg border border-border-token-default bg-background-card p-6">
        <CalculatorField
          label="Comfortable monthly EMI"
          value={budget}
          min={2_000}
          max={500_000}
          step={1_000}
          display={formatINR(budget)}
          onChange={setBudget}
        />
        <CalculatorField
          label="Interest rate (p.a.)"
          value={rate}
          min={6}
          max={24}
          step={0.1}
          display={`${rate.toFixed(1)}%`}
          onChange={setRate}
        />
        <CalculatorField
          label="Tenure (months)"
          value={months}
          min={12}
          max={360}
          step={6}
          display={`${months} mo`}
          onChange={setMonths}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 rounded-lg bg-background-feature p-6 text-foreground-on-dark">
        <div>
          <p className="text-body-sm opacity-70">You can comfortably borrow</p>
          <p className="font-mono text-display-large font-bold">
            {formatINR(result.affordableAmount)}
          </p>
        </div>
        <p className="text-body-sm opacity-70">
          A guide based on the EMI you&apos;re comfortable paying. Borrow within your
          means — never stretch your budget.
        </p>
      </div>
    </div>
  );
}
