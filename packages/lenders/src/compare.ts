// Comparison engine — side-by-side lender comparison on the metrics that matter
// (score / income / FOIR / approval rate / TAT / payout).

import { getLenderProfile } from "./repository";
import { payoutDisplay } from "./commission";
import type { LenderComparisonRow, LoanProduct } from "./types";

/**
 * Compare lenders by id. Optionally scope payout to a specific product
 * (defaults to the lender's first product).
 */
export function compareLenders(ids: string[], product?: LoanProduct): LenderComparisonRow[] {
  const rows: LenderComparisonRow[] = [];
  for (const id of ids) {
    const p = getLenderProfile(id);
    if (!p) continue;
    const payout = p.payouts.find((x) => x.product === product) ?? p.payouts[0];
    rows.push({
      lender_id: p.master.lender_id,
      lender_name: p.master.lender_name,
      lender_type: p.master.lender_type,
      min_score: p.policy.min_score,
      min_income: p.policy.min_income,
      max_foir: p.policy.max_foir,
      approval_rate: p.approval.approval_rate,
      avg_tat_days: p.approval.avg_tat_days,
      payout_display: payout ? payoutDisplay(payout) : "—",
    });
  }
  return rows;
}
