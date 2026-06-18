# Current Sprint: Sprint 19 — V3.0 Design Foundations

**Sprint:** 19
**Status:** Complete
**Date:** 2026-06-18
**Input:** docs/research/V3_Design_Blueprint.md
**Goal:** Build the shared V3 design-foundation components in `@leapmoney/ui` so all five
surfaces (Website, Borrower, DSA, Lender, Admin) can adopt them. Reusable components only —
NO page redesigns yet. GPU-only motion (transform/opacity/stroke), prefers-reduced-motion aware.

## Built (all in packages/ui/src/components)
1. **Trust Layer** (`trust.tsx`): TrustBar, SecurityBadge, BureauBadge, ComplianceBadge, RatingBadge
2. **Chart System** (`charts.tsx`): ScoreGauge (radial), TrendChart (sparkline), DistributionChart, FOIRMeter, MatchStrengthChart
3. **Motion System** (`motion.tsx`): CountUp, NumberTicker, RevealOnScroll, StaggerContainer, AnimatedCard (GPU-only, reduced-motion aware)
4. **Badge System** (`badges.tsx`): StatusBadge, ScoreBandBadge, RiskBadge, ConfidenceBadge, BestMatchBadge
5. **Empty/Loading/Skeleton** (`states.tsx`): EmptyState, LoadingState, SkeletonState (+ SkeletonBlock)
6. **Hero Number System** (`hero-number.tsx`): HeroNumber, LeapScoreNumber, ApprovalOddsNumber, PreApprovedAmount, KpiValue

All exported from `packages/ui/src/index.ts`.

## Design rules honored
- GPU-only animation: transform / opacity / stroke-dashoffset only — no width/height/top/left/bg.
- `prefers-reduced-motion: reduce` short-circuits CountUp / gauges / meters / reveals to final state.
- Token-driven (CSS variables + Phase 6 scale); mono + tabular-nums for all figures.
- Hero "mega" type scale (`text-[3.75rem]`) above display-hero for signature numbers.
- Additive only — no existing component or page changed; app-local badges untouched.

## Validation
- pnpm turbo type-check: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps (arbitrary `text-[3.75rem]` JIT-generated via ui content glob)

## NOT in scope (next: V3.1)
Page redesigns, adopting these components into app screens (P0 Homepage/LeapScore/LeapMatch), dark feature surface.
