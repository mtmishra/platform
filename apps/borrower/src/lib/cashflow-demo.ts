// Cash Flow Intelligence demo bundle (Sprint 13). Built from the Sprint 7 AA-style
// mock cash-flow data — no live Account Aggregator / bank integration.

import { computeCashFlowIntelligence, MOCK_CASH_FLOW, type CashFlowIntelligence } from "@leapmoney/credit";

// Existing fixed-obligation ratio for the demo borrower (matches MOCK_MATCH_USER).
const DEMO_CURRENT_FOIR = 0.22;

export function getCashFlowIntelligence(): CashFlowIntelligence {
  return computeCashFlowIntelligence(MOCK_CASH_FLOW, DEMO_CURRENT_FOIR);
}
