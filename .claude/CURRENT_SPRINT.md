# Current Sprint: Sprint 11 — Borrower Dashboard V1

**Sprint:** 11
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Wire the Sprint 7–10 engines into the borrower dashboard home: snapshots,
credit journey, improvement tracker, notification center, snapshot persistence.
Mobile-first, Phase 6 tokens. Mock data only.

## Source of Truth
Sprint 7 LeapScore, Sprint 8 LeapMatch, Sprint 9 Credit Health, Sprint 10 Outcomes.
Phase 6 (design tokens, mobile UX). Phase 7 (CHD is an authenticated borrower module).

## Sprint 11 Scope — Completed
- [x] Dashboard home displays LeapScore, Credit Health, LeapMatch, Improvement Tracker
- [x] Snapshot widgets: CreditSnapshot, HealthSnapshot, MatchSnapshot, OutcomeSnapshot (SnapshotWidgets.tsx)
- [x] Credit Journey timeline: Credit Report → LeapScore → Health → Match → Apply
- [x] Notification center: mock utilization / match / score-improvement alerts
- [x] Improvement tracker: progress to next milestone + month trend
- [x] Snapshot persistence (0009/0010): score_snapshot, health_snapshot, match_snapshot (append-only, RLS)
- [x] Unified `getDashboardData()` composing all engines on mock inputs

## Files
```
apps/borrower/src/
  lib/dashboard-demo.ts                       # composes LeapScore + Health + Match + Outcomes
  components/dashboard/SnapshotWidgets.tsx     # 4 snapshot widgets + shared SnapshotCard
  components/dashboard/CreditJourneyTimeline.tsx
  components/dashboard/ImprovementTracker.tsx
  components/dashboard/NotificationCenter.tsx
  app/(auth)/dashboard/page.tsx                # rewritten dashboard home
supabase/migrations/0009_snapshot_schema.sql, 0010_snapshot_rls.sql
packages/supabase/src/types.ts                 # Score/Health/MatchSnapshotRow
```
Borrower app now depends on @leapmoney/credit, @leapmoney/match, @leapmoney/outcomes.

## Validation
- pnpm turbo type-check: 14/14 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps; /dashboard + /health prerender

## NOT built (out of scope)
Live bureau/lender integration, snapshot write-back (schema only), real notifications.
Dashboard is read-only over mock engine output. The old OnboardingChecklist/EmptyState
components remain but are no longer on the dashboard home.
