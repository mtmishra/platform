import React from "react";

/**
 * Standing RBI / loan-facilitation disclaimer. Rendered in the footer on every
 * page. Placeholder copy pending legal sign-off.
 */
export function RbiDisclaimer() {
  return (
    <p className="text-body-sm leading-relaxed text-foreground-tertiary">
      <strong className="text-foreground-on-dark">Disclaimer:</strong> LeapMoney is a
      loan facilitation platform and not a lender, bank, or NBFC. We do not lend
      money or guarantee loan approval. All lending decisions, interest rates, and
      terms are determined solely by regulated lending partners. Loan products are
      subject to the lender&apos;s terms and applicable RBI regulations. Please read
      all loan documents carefully before signing.
    </p>
  );
}
