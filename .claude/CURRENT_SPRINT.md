# Current Sprint: Sprint 14.5 — Lender Intelligence Repository

**Sprint:** 14.5
**Status:** Complete
**Date:** 2026-06-18
**Goal:** A structured lender intelligence repository — the single source of truth for credit
policies, products, payouts, approval & match intelligence — to power LeapMatch, DSA, Lender,
Admin, and the Commission engine. Demo data only (no APIs/CRM/LOS/LMS).

## New package: `@leapmoney/lenders`
```
packages/lenders/src/
  types.ts        # LenderMaster, LenderProductMaster, LenderCreditPolicy, LenderApprovalProfile,
                  # LenderPayout, LenderMatchProfile, RejectionReason, LenderProfile, LenderComparisonRow
  seed.ts         # 65 lenders (25 banks, 25 NBFCs, 15 fintechs) + rejection reasons + product ranges
  repository.ts   # getLenders, getLenderCount, getLenderProfile, getRejectionReasons
  commission.ts   # estimatedCommission(), payoutDisplay()
  compare.ts      # compareLenders()
  index.ts
```
Depends on `@leapmoney/credit` (BureauName). No cycle (credit has no lenders dep).

## Sprint 14.5 Scope — Completed
- [x] Lender master (id/name/type/website/email/region/active; Bank/NBFC/Fintech)
- [x] Products (Personal/Home/Business/LAP/Credit Card) with amount + tenure ranges
- [x] Credit policy (primary/secondary bureau, min/preferred score, income, FOIR, age, employment)
- [x] Approval intelligence (approval_rate, avg_tat_days, avg_disbursal_days, band Excellent/Good/Moderate/Difficult)
- [x] Payout repository (percentage/fixed, value, cap) + estimatedCommission()
- [x] Match intelligence (best_for tags + match_strength)
- [x] Rejection intelligence (low score / high FOIR / income mismatch / bureau issues / employer risk)
- [x] Seed: 65 lenders (HDFC/ICICI/Axis/Kotak/IndusInd/SBI/PNB/BOB/IDFC First + Bajaj/Tata/SMFG/Aditya Birla/L&T/Mahindra + MoneyView/KreditBee/CASHe/Fibe/Navi/PaySense + more); Bajaj/KreditBee/StashFin/Slice use Experian primary (R3 §2.4)
- [x] Lender profile page (DSA portal): /lenders + /lenders/[id] — overview, credit policy, products, approval, payouts, match
- [x] compareLenders() comparison engine (score/income/FOIR/approval/payout/TAT)
- [x] lender_snapshot (0017; append-only, RLS) + row type
- [x] Visual QA passed (directory, profile incl. Experian-primary override, mobile; 0 console errors)

## Validation
- pnpm turbo type-check: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps; dsa emits /lenders + /lenders/[id]
- Seed lender count: 65 (25 banks / 25 NBFCs / 15 fintechs)

## NOT built
Live APIs/CRM/LOS/LMS; rewiring Sprint 8 LeapMatch to consume this repo (prepared, not refactored —
avoids regression); Admin UI (repository is ready for the future Admin Portal); server-side
persistence (lender_snapshot is the wired-later target).
