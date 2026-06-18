# Current Sprint: Sprint 21 — Borrower Portal V3 Redesign

**Sprint:** 21
**Status:** Complete
**Date:** 2026-06-18
**Input:** docs/research/V3_Design_Blueprint.md · **Uses:** @leapmoney/ui V3 components
**Goal:** Apply V3 design components across the borrower portal. UI only — no backend/engine/API
changes. Functionality, accessibility, SEO preserved.

## Screens redesigned (5)
### Dashboard
- Snapshots already on `MetricCardV2` (from parallel V3 merge); added `TrustBar` (security) trust indicator.

### Credit Report (credit-report/report)
- `LeapScoreGauge` (300–900) for the LeapScore; `DistributionChart` bureau comparison; `RiskBadge` on payment history.

### Cash Flow (CashFlowWidgets)
- `KpiValue` for verified income; `TrendChart` salary-credit sparkline; `MatchStrengthChart` for cash-flow strength; V3 `FOIRMeter`.

### Financial Analysis (FinancialWidgets)
- `CountUp` animated savings counters; `KpiValue` current-position tiles; V3 `FOIRMeter` for FOIR optimization.

### LeapMatch Results (matches)
- `TrustBar` (regulatory); per-lender `BestMatchBadge`, `ApprovalOddsNumber`, `ConfidenceBadge`, `MatchStrengthChart`.

## Important fix (scale bug)
The merged `ScoreGauge` (from the parallel commit) is a **0–100 readiness** gauge (`getBandInfo` >=80
"Loan Ready"); feeding it a 300–900 LeapScore clamped to "100", contradicting the "802 / 900" headline.
Resolved by re-exporting the Sprint 19 300–900 gauge as **`LeapScoreGauge`** (`packages/ui/src/index.ts`)
and using it on the Credit Report page AND the Sprint 20 website /leapscore page (which had the same
latent clamp bug). The 0–100 `ScoreGauge` is untouched for readiness use.

## Files modified
- apps/borrower/src/components/cashflow/CashFlowWidgets.tsx
- apps/borrower/src/components/financial/FinancialWidgets.tsx
- apps/borrower/src/app/(auth)/matches/page.tsx
- apps/borrower/src/app/(auth)/credit-report/report/page.tsx
- apps/borrower/src/app/(auth)/dashboard/page.tsx
- apps/web/src/app/leapscore/page.tsx (LeapScoreGauge fix)
- packages/ui/src/index.ts (export LeapScoreGauge)
- .claude/CURRENT_SPRINT.md

## Before vs After
| Screen | Before | After |
|--------|--------|-------|
| Credit Report | Plain score headline + metric grid | LeapScoreGauge (802 ✓) + bureau DistributionChart + payment RiskBadge |
| Cash Flow | Plain numbers + hand-rolled FOIR bar | KpiValue, salary TrendChart, MatchStrengthChart, V3 FOIRMeter |
| Financial | Static savings figures | Animated CountUp savings + KpiValue + V3 FOIRMeter |
| Matches | Plain % + text bands | ApprovalOddsNumber + ConfidenceBadge + MatchStrengthChart + BestMatchBadge + TrustBar |
| Dashboard | MetricCardV2 KPIs (already) | + TrustBar trust indicator |

## Validation
- pnpm turbo type-check: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — 6/6
- Visual QA: desktop + mobile (375px); 0 console errors; gauges/charts/count-ups/FOIR meters render; LeapScore gauge shows 802 correctly post-fix.
