# Current Sprint: Sprint 23 — Lender Portal V3 Redesign

**Sprint:** 23
**Status:** Complete
**Date:** 2026-06-18
**Input:** docs/research/V3_Design_Blueprint.md · **Uses:** @leapmoney/ui V3 components
**Goal:** Apply V3 design components across the lender portal. UI only — no backend/engine/API
changes. GPU-only animation rule enforced. Functionality, accessibility, SEO preserved.

## Screens redesigned (6)

### Dashboard (app/page.tsx)
- `StaggerContainer` on KPI grid (5 MetricCardV2 cards).
- `StatusBadge` on notification items; TONE map replaced with NOTIF_STATUS map.

### Applications Inbox (components/ApplicationInbox.tsx)
- `import React from "react"` → `import { useState } from "react"`; `React.useState` × 3 → `useState`.
- `StaggerContainer` wrapping filtered application list.

### Application Review (app/applications/[id]/page.tsx)
- `TrustBar variant="security"` at page top.
- Visual intel section (4-col grid): `LeapScoreGauge` (300-900), `FOIRMeter` (single `foir` prop),
  `ApprovalOddsNumber` + `ConfidenceBadge`, `RiskBadge` for employer stability.
- Intel array reduced to Credit Health, Cash Flow, Verified Income (LeapScore/FOIR/Odds shown visually).
- Employer intelligence section: `RiskBadge` replaces plain text stability indicator.

### Underwriting (app/underwriting/page.tsx)
- `BarList` × 3 → `DistributionChart` (risk distribution, score bands, approval probability).
- `ColumnChart` (GPU violation — inline `height` style) → `TrendChart` for approval trend.
- `StaggerContainer` on 2×2 grid.
- `Panel` function: `React.ReactNode` → `ReactNode` (import from react).

### Portfolio (app/portfolio/page.tsx)
- `KpiCard` × 4 → `MetricCardV2` with sparklineData + statusBorder.
- `CountUp` on portfolio quality %.
- `TrendChart` for portfolio quality trend sparkline.
- `StaggerContainer` on disbursed loan list.

### Analytics (app/analytics/page.tsx)
- `RankList` local function removed.
- `DistributionChart` × 6 replaces RankList (×4 product analytics) + table (source analytics ×2).
- `StaggerContainer` on product analytics grid.

## LenderWidgets.tsx fixes
- `import React from "react"` → `import { type ReactNode } from "react"`.
- `KpiCard` icon prop: `React.ReactNode` → `ReactNode`.
- `KpiCard` value: plain `<p>` → `<KpiValue value={value} className={...} />`.
- `ApplicationRow` odds column: plain `{app.approval_probability}%` → `<ConfidenceBadge level={app.confidence} />`.
- `ConfidenceBadge`, `KpiValue` imported from @leapmoney/ui.

## Files modified (7)
- apps/lender/src/app/page.tsx
- apps/lender/src/components/ApplicationInbox.tsx
- apps/lender/src/components/LenderWidgets.tsx
- apps/lender/src/app/applications/[id]/page.tsx
- apps/lender/src/app/underwriting/page.tsx
- apps/lender/src/app/portfolio/page.tsx
- apps/lender/src/app/analytics/page.tsx

## Validation
- pnpm turbo type-check --force: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — 6/6
- Lender routes: / analytics applications applications/[id] portfolio underwriting all ○ Static or ƒ Dynamic

## Commit
- SHA: a9ba090
- Branch: develop
- Pushed: Yes (origin/develop)
