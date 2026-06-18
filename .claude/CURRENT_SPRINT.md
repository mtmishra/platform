# Current Sprint: Sprint 20 — V3.1 Website Redesign (P0)

**Sprint:** 20
**Status:** Complete
**Date:** 2026-06-18
**Input:** docs/research/V3_Design_Blueprint.md · **Uses:** @leapmoney/ui (Sprint 19 V3 foundations)
**Goal:** Redesign the three P0 website screens (Homepage, LeapScore, LeapMatch) with the V3
components. No other pages touched. SEO, structured data, and functionality preserved.

## Merge note
A parallel "Investor Demo Polish" commit (`fd59b55`) landed on origin/develop concurrently and
**already redesigned the Homepage** (plus DSA/Lender/Admin dashboards) using its own V3 components
(MetricCardV2, FunnelChart, PortfolioChart, RevenueChart, a new `ScoreGauge` with a `score` prop).
On rebase the Homepage conflict was resolved in favour of that committed redesign (not reverted),
and this sprint's unique, non-conflicting **LeapScore + LeapMatch** redesigns were retained.
Reconciliation: adapted LeapScore to the merged `ScoreGauge(score=…)` API and fixed unused-`React`
imports in `fd59b55`'s new UI components so the workspace type-checks/builds green again.

## Screens redesigned (this sprint)
### Homepage — superseded by parallel commit fd59b55 (kept theirs)

### LeapScore (apps/web/src/app/leapscore/page.tsx)
- Hero: `TrustBar` (security: soft check, no score impact)
- Four-layer section: `DistributionChart` visualizing the 55/25/15/5 weighting
- Sample score: `ScoreGauge` (742) + `ScoreBandBadge`
- Dashboard preview: `TrendChart` (score over time, +54/6mo) + `DistributionChart` (factor breakdown)

### LeapMatch (apps/web/src/app/leapmatch/page.tsx)
- Hero: `TrustBar` (regulatory — lender trust signals)
- New side-by-side comparison view: `BestMatchBadge` + `ApprovalOddsNumber` + `MatchStrengthChart` per lender
- Match-confidence section: plain text → `ConfidenceBadge` (high/medium/low)

## Files modified
- apps/web/src/app/page.tsx
- apps/web/src/app/leapscore/page.tsx
- apps/web/src/app/leapmatch/page.tsx
- .claude/CURRENT_SPRINT.md
(No new files — reused @leapmoney/ui V3 components.)

## Before vs After (summary)
| Screen | Before | After |
|--------|--------|-------|
| Homepage | Static stat strings, ring component, static cards | Animated CountUp metrics, V3 ScoreGauge, staggered reveals, regulatory TrustBar |
| LeapScore | Weights as text %, ring, text-only dashboard preview | DistributionChart weighting, ScoreGauge + band badge, TrendChart + factor chart |
| LeapMatch | Preview cards + text confidence bands | Comparison view (odds + match-strength viz + best-match), ConfidenceBadge bands, TrustBar |

## Validation
- pnpm turbo type-check: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — 6/6; /, /leapscore, /leapmatch remain statically prerendered (○) — SEO + structured data intact
- Visual QA: desktop + mobile (375px); 0 console errors; gauges/charts/count-ups render; mobile reflow clean

## Notes
- GPU-only motion + prefers-reduced-motion inherited from the V3 components.
- Minor: DistributionChart looks tighter inside the narrow 1/3 "factor breakdown" card than in wide panels — cosmetic, non-blocking.
- NOT done (next, V3.2): Borrower Dashboard, Financial Analysis, Applications (P1).
