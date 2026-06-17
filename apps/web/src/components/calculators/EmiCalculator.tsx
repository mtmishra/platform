"use client";

import React, { useEffect, useMemo, useState } from "react";
import { calculateEmi, formatINR } from "@/lib/finance";
import { trackCalculatorUsed } from "@leapmoney/analytics";
import { CalculatorField } from "./CalculatorField";

export function EmiCalculator() {
  const [amount, setAmount] = useState(1_000_000);
  const [rate, setRate] = useState(10.5);
  const [months, setMonths] = useState(36);
  const [tracked, setTracked] = useState(false);

  const result = useMemo(
    () => calculateEmi(amount, rate, months),
    [amount, rate, months]
  );

  useEffect(() => {
    if (!tracked) {
      trackCalculatorUsed("emi");
      setTracked(true);
    }
  }, [amount, rate, months, tracked]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6 rounded-lg border border-border-token-default bg-background-card p-6">
        <CalculatorField
          label="Loan amount"
          value={amount}
          min={50_000}
          max={10_000_000}
          step={50_000}
          display={formatINR(amount)}
          onChange={setAmount}
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
          min={6}
          max={360}
          step={6}
          display={`${months} mo`}
          onChange={setMonths}
        />
      </div>

      <div className="flex flex-col justify-center gap-6 rounded-lg bg-background-feature p-6 text-foreground-on-dark">
        <div>
          <p className="text-body-sm opacity-70">Monthly EMI</p>
          <p className="font-mono text-display-large font-bold">{formatINR(result.emi)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-body-sm opacity-70">Total interest</p>
            <p className="font-mono text-h2 font-semibold">{formatINR(result.totalInterest)}</p>
          </div>
          <div>
            <p className="text-body-sm opacity-70">Total payment</p>
            <p className="font-mono text-h2 font-semibold">{formatINR(result.totalPayment)}</p>
          </div>
        </div>
        <p className="text-body-sm opacity-70">
          Indicative only. Your actual rate depends on your credit profile and lender.
        </p>
      </div>
    </div>
  );
}
