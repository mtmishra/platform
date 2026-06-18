# Current Sprint: Sprint 22 — DSA Portal V3 Redesign

**Sprint:** 22
**Status:** Complete
**Date:** 2026-06-18
**Input:** docs/research/V3_Design_Blueprint.md · **Uses:** @leapmoney/ui V3 components
**Goal:** Apply V3 design components across the DSA portal. UI only — no backend/engine/API
changes. Functionality, accessibility, SEO preserved.

## Screens redesigned (4)

### Dashboard (app/page.tsx)
- `StaggerContainer` staggered entrance on KPI grid.
- `StatusBadge` on notification items replacing manual tone-class span.

### Leads (app/leads/page.tsx + app/leads/[id]/page.tsx)
- `StaggerContainer` + `CountUp` on status-count chips (leads list).
- `StaggerContainer` on the full lead list.
- Lead detail: `TrustBar` (regulatory), `LeapScoreGauge` (300–900), `ApprovalOddsNumber`,
  dual `ConfidenceBadge` (header + odds panel).

### Commissions (app/commissions/page.tsx)
- Three `StatCard`s replaced with `MetricCardV2` (sparklines + statusBorder colours).
- `CountUp` animated monthly / yearly / projected earnings.
- New `TrendChart` earnings-trend sparkline (Jan–Jun) with month labels.
- Commission-by-lead list wrapped in `StaggerContainer`.

### Performance (app/performance/page.tsx)
- `MiniBarChart` (custom, height-based) replaced with V3 `TrendChart` + month labels.
- `AnalyticsList` (plain text rows) replaced with `DistributionChart` bars for top
  products, top lenders, and best sources.
- Metrics grid upgraded to `KpiValue` + `StaggerContainer`.
- Leaderboard `#7` now displayed via `KpiValue`.

## DsaWidgets.tsx fixes
- `import React from "react"` → `import { Fragment, type ReactNode } from "react"`;
  `<React.Fragment key={…}>` → `<Fragment key={…}>`.
- `confidence()` helper added; `ConfidenceBadge` shown in `LeadRow` (next to lender name).
- `StatCard` upgraded to use `KpiValue` for the primary value.
- Imported `ConfidenceBadge`, `KpiValue`, `type Confidence` from @leapmoney/ui.

## Files modified (6)
- apps/dsa/src/components/DsaWidgets.tsx
- apps/dsa/src/app/page.tsx
- apps/dsa/src/app/leads/page.tsx
- apps/dsa/src/app/leads/[id]/page.tsx
- apps/dsa/src/app/commissions/page.tsx
- apps/dsa/src/app/performance/page.tsx
- .claude/CURRENT_SPRINT.md

## Validation
- pnpm turbo type-check --force: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — 6/6
- DSA routes: / commissions leads leads/[id] performance all ○ Static or ƒ Dynamic
