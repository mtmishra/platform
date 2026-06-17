# Current Sprint: Sprint 8 — LeapMatch Engine Foundation

**Sprint:** 8
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Rule-based LeapMatch — lender DB, eligibility filter, approval odds, ranking, LeapCheck (no ML, no live lender APIs, mock data)

## Source of Truth
**R3 Credit Intelligence Report §10** (LeapMatch Data Dictionary). Phase 7 (engine
flow §5, RLS, config §12) and Phase 8 (RBI 2025 transparent ranking, all-lenders
disclosure) for compliance.

## Sprint 8 Scope — Completed
- [x] Lender Intelligence Database: `lender`, `lender_product` (0006) — primary/secondary bureau,
      min_score per bureau, income/FOIR rules, approval_rate_by_band, avg_disbursal_days
- [x] Eligibility engine: hard pass/fail filter (R3 §10.1.3 Step 1) — score/income/FOIR/amount/age/geo/NTC/no-ITR
- [x] Approval Odds engine: base band rate + signed modifiers, reason_codes, confidence; clamped **5–95 (never 0/100)**
- [x] Ranking engine: BALANCED / LOWEST_RATE / HIGHEST_APPROVAL / FASTEST (weight vectors per R3 §10.1.3 Step 3)
- [x] Match Result model: matched_lenders[], not_matched_lenders[] (+ what-you-need), ranking_methodology (RBI 2025)
- [x] LeapCheck: soft-pull prequalification — no hard inquiries (hard_inquiry_warning=false)
- [x] EMI + APR (fee-inclusive) computation (R3 §10.2)
- [x] Seed mock lender catalog (8 personal-loan products incl. Bajaj=Experian-primary per R3 §2.4)

## New package: `@leapmoney/match`
```
packages/match/src/
  types.ts        # lender, lender_product, user profile, loan request, match result (R3 §10)
  util.ts         # EMI/APR, score-band mapping, evaluated-score (lender's bureau)
  eligibility.ts  # hard filter (Step 1)
  approval.ts     # approval odds engine (Step 2) — 5–95 clamp, reason codes
  ranking.ts      # 4 preference modes + ranking_methodology (Step 3)
  engine.ts       # runMatch orchestration + badges + match reason (Step 4)
  leapcheck.ts    # soft-pull prequalification wrapper
  seed.ts         # mock lender catalog (bureau mapping from R3 §2)
  profile.ts      # build MatchUserProfile from a LeapScoreResult
  mock.ts         # demo user + loan request
  index.ts
```

## Validation
- pnpm turbo type-check: 13/13 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps

## NOT built (out of scope, per instructions)
ML matching model (Sprint 9 cold-start → outcomes → XGBoost), live lender APIs,
application/lead submission, CRM integration.

## Compliance notes (RBI 2025 / Phase 8)
- All eligible AND ineligible lenders returned (no hiding to push preferred ones).
- Ranking is transparent (published weights) and never commission-influenced; methodology surfaced to user.
- APR (fee-inclusive) computed per offer, not just flat rate.
- LeapCheck soft pull creates no hard inquiry; hard pull only at application time behind explicit consent.
