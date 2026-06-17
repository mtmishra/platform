# Current Sprint: Sprint 10 — Outcome Intelligence Foundation

**Sprint:** 10
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Capture application outcomes (predicted vs actual) + analytics — the data
flywheel that will later calibrate/train the matching model. Mock data only; no CRM, no lender APIs.

## Source of Truth
**R3 §10.3** (cold-start → outcome accumulation → ML calibration). Phase 7 (application
flow §5/§9, append-only timelines §15). Phase 8 (no PII, immutable audit).
Reuses Sprint 7 credit schema + Sprint 8 lender catalog and match outputs.

## Sprint 10 Scope — Completed
- [x] Application tracking schema (0007): `application`, `application_event` (append-only), `application_status` enum
- [x] Outcome tracking: approval_result, rejection_reason, disbursal_amount, final_rate, processing_fee
- [x] Match outcome tracking: recommended / selected / applied / approved lender (FK to lender catalog)
- [x] Feedback loop: predicted_probability vs actual_outcome → calibration buckets, mean-abs-error, Brier score
- [x] Analytics foundation: approval_rate, match_accuracy, conversion_rate (+ summarize)
- [x] RLS (0008): own-rows on application; append-only application_event
- [x] New package `@leapmoney/outcomes` with mock outcome dataset

## New package: `@leapmoney/outcomes`
```
packages/outcomes/src/
  types.ts       # ApplicationOutcome, FeedbackPoint, CalibrationBucket/Data, AnalyticsSummary
  analytics.ts   # approvalRate, matchAccuracy, conversionRate, summarize
  calibration.ts # toFeedbackPoints, buildCalibration (deciles + MAE + Brier)
  mock.ts        # MOCK_OUTCOMES (12 records across approved/rejected/disbursed/pending)
  index.ts
```
Depends on `@leapmoney/match` (reuses MatchLoanType, Preference, IneligibilityReason).

## Validation
- pnpm turbo type-check: 14/14 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps

## NOT built (out of scope)
CRM, lender integrations, the ML model itself (this is the dataset/feedback foundation
for it — R3 §10.3 phase 3 trains XGBoost behind an AUC-ROC > 0.75 gate once ~10k real
outcomes accrue), no UI surface for analytics yet.
