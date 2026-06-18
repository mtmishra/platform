# Current Sprint: Sprint 24 — Admin Portal V3 Redesign

**Sprint:** 24
**Status:** Complete
**Date:** 2026-06-19
**Input:** docs/research/V3_Design_Blueprint.md · **Uses:** @leapmoney/ui V3 components
**Goal:** Apply V3 design components across the admin portal. UI only — no backend/RBAC/engine
changes. GPU-only animation rule enforced. Functionality and accessibility preserved.

## Screens redesigned (6)

### Dashboard (app/page.tsx)
- `StaggerContainer` on KPI grid (8 MetricCardV2 cards).
- `StatusBadge` (from @leapmoney/ui) on notifications; TONE map replaced with NOTIF_STATUS map.

### Users (app/users/page.tsx)
- `AnimatedCard` + `CountUp` on role totals (Borrowers/DSAs/Lenders).
- `DistributionChart` × 2: platform role distribution + user status breakdown.
- `StaggerContainer` on filtered user list (via UsersTable).

### Applications (app/applications/page.tsx)
- `DistributionChart` × 2: pipeline-by-status + applications-by-source.
- Approval rate metric card (computed from 40-app sample).
- `StaggerContainer` on app list (via ApplicationsTable).

### Commissions (app/commissions/page.tsx)
- `MetricCardV2` × 3 (Pending/Approved/Paid) replacing `KpiCard`.
- `TrendChart` for monthly platform revenue trend.
- `CountUp` on per-DSA pending/paid amounts.
- `StaggerContainer` on DSA payout list.

### Risk (app/risk/page.tsx)
- `DistributionChart` × 3 replaces `BarList` ×3 (score bands, approval
  rate by band, rejection reasons).
- `RiskBadge` in score-band risk profile grid.
- `StaggerContainer` on grid.

### Compliance (app/compliance/page.tsx)
- `TrustBar variant="regulatory"` at page top.
- `MetricCardV2` × 3 for consent metrics (Granted/Active/Withdrawn).
- `AnimatedCard` + `CountUp` on bureau pull stats.
- `StaggerContainer` on both consent and bureau sections.

### Revenue (app/revenue/page.tsx)
- `MetricCardV2` × 3 replacing `KpiCard` ×3.
- `TrendChart` replaces `ColumnChart` (GPU fix — ColumnChart used inline
  `height` style).
- `CountUp` on commission pool and revenue totals.
- `StaggerContainer` on top KPI grid.

## Component file fixes
- `AdminWidgets.tsx`: removed `ColumnChart` (GPU violation — inline `height`),
  removed `KpiCard` and `BarList` (replaced by V3 ui components in pages),
  fixed `React.ReactNode` → `ReactNode` import in Panel.
- `UsersTable.tsx`: `import React from "react"` → `import { useState } from "react"`;
  `React.useState` → `useState`; `StaggerContainer` on filtered list.
- `ApplicationsTable.tsx`: same React import fix; `React.useState` ×2 → `useState`;
  `StaggerContainer` on filtered list.

## Files modified (10)
- apps/admin/src/components/AdminWidgets.tsx
- apps/admin/src/components/UsersTable.tsx
- apps/admin/src/components/ApplicationsTable.tsx
- apps/admin/src/app/page.tsx
- apps/admin/src/app/users/page.tsx
- apps/admin/src/app/applications/page.tsx
- apps/admin/src/app/commissions/page.tsx
- apps/admin/src/app/risk/page.tsx
- apps/admin/src/app/compliance/page.tsx
- apps/admin/src/app/revenue/page.tsx

## Validation
- pnpm turbo type-check --force: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — 6/6
- Admin routes: / applications commissions compliance revenue risk users — all ○ Static

## Commit
- SHA: 617d935
- Branch: develop
- Pushed: Yes (origin/develop)
