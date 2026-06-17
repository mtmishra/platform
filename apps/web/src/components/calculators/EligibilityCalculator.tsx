"use client";

import React, { useEffect, useMemo, useState } from "react";
import { calculateEligibleAmount, formatINR } from "@/lib/finance";
import { trackCalculatorUsed } from "@leapmoney/analytics";
import { CalculatorField } from "./CalculatorField";

export function EligibilityCalculator() {
  const [income, setIncome] = useState(75_000);
  const [obligations, setObligations] = useState(10_000);
  const [rate, setRate] = useState(10.5);
  const [months, setMonths] = useState(60);
  const [tracked, setTracked] = useState(false);

  const result = useMemo(
    () =>
      calculateEligibleAmount({
        monthlyIncome: income,
        monthlyObligations: obligations,
        annualRatePct: rate,
        months,
      }),
    [income, obligations, rate, months]
  );

  useEffect(() => {
    if (!tracked) {
      trackCalculatorUsed("eligibility");
      setTracked(true);
    }
  }, [income, obligations, rate, months, tracked]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6 rounded-lg border border-border-token-default bg-background-card p-6">
        <CalculatorField
          label="Net monthly income"
          value={income}
          min={15_000}
          max={1_000_000}
          step={5_000}
          display={formatINR(income)}
          onChange={setIncome}
        />
        <CalculatorField
          label="Existing monthly obligations"
          value={obligations}
          min={0}
          max={500_000}
          step={1_000}
          display={formatINR(obligations)}
          onChange={setObligations}
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
          <p className="text-body-sm opacity-70">Indicative loan eligibility</p>
          <p className="font-mono text-display-large font-bold">
            {formatINR(result.eligibleAmount)}
          </p>
        </div>
        <div>
          <p className="text-body-sm opacity-70">Eligible monthly EMI</p>
          <p className="font-mono text-h2 font-semibold">{formatINR(result.eligibleEmi)}</p>
        </div>
        <p className="text-body-sm opacity-70">
          Based on a 50% FOIR assumption. Lenders apply their own policies — check
          your real eligibility free with LeapMatch™.
        </p>
      </div>
    </div>
  );
}
