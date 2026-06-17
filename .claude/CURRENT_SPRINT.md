# Current Sprint: Sprint 13.5 — Financial Intelligence Engine Foundation

**Sprint:** 13.5
**Status:** Complete
**Date:** 2026-06-18
**Goal:** The Financial Intelligence moat — turn credit + cash-flow + loan data into actionable
recommendations, savings opportunities, and approval-improvement guidance. DEMO MODE ONLY,
rule-based, no APIs/ML/lender integrations.

## Architecture note
`@leapmoney/match` depends on `@leapmoney/credit`, so the balance-transfer/consolidation engines
take lender/debt data as INPUTS (dependency injection) rather than importing the catalog — the
borrower app composes them (lib/financial-demo.ts), passing SEED_LENDER_PRODUCTS. No package cycle.

## Sprint 13.5 Scope — Completed
- [x] Employer Intelligence (employer_score, income_confidence, stability_rating; High/Medium/Low + explanation)
- [x] Income Stability (0–100; Strong/Moderate/Weak; insights)
- [x] Advanced FOIR (current/future/safe limit/utilization_of_capacity; Excellent/Healthy/Warning/Critical + explanation)
- [x] Balance Transfer (eligible_lenders, estimated_new_rate, monthly + total interest savings; before/after)
- [x] Debt Consolidation (possible, monthly + interest savings; current vs consolidated structure)
- [x] Recommendation engine (title/description/priority/score+approval+savings impact)
- [x] Savings Opportunity (monthly/annual/lifetime; aggregates BT + consolidation)
- [x] Dashboard Financial Intelligence section + full /financial page (5 subsections)
- [x] Journey: Credit Report → LeapScore → Credit Health → Connect Bank → Cash Flow → Financial Intel → LeapMatch → Apply
- [x] financial_snapshot + recommendation_snapshot (0013; append-only, RLS) + row types
- [x] Visual QA passed (employer, income stability, FOIR, balance transfer, consolidation, recommendations, savings, dashboard, mobile, 0 console errors); fixed mobile savings-widget overlap

## Engine modules (packages/credit/src/)
```
employer/index.ts        # computeEmployerIntelligence, computeIncomeStability
foir/index.ts            # computeAdvancedFoir
balance-transfer/index.ts# computeBalanceTransfer (lender options injected)
consolidation/index.ts   # computeConsolidation (debts injected)
recommendations/index.ts # computeRecommendations (+ savings)
finance.ts               # shared emi/totalInterest
```
Borrower: lib/financial-demo.ts, components/financial/FinancialWidgets.tsx, app/(auth)/financial/page.tsx.

## Validation
- pnpm turbo type-check: 14/14 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps; borrower emits /financial
- Visual QA: desktop + mobile; 0 console errors

## End result
Credit Intelligence + Cash Flow Intelligence + Financial Intelligence + LeapMatch all visible in
the borrower experience. NOT built: live APIs/ML/lender integrations; server-side persistence of
the financial snapshots (financial_snapshot/recommendation_snapshot are the wired-later targets).
