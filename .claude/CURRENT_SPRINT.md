# Current Sprint: Sprint 25 — Final Investor Demo Polish & Platform QA

**Sprint:** 25
**Status:** Complete
**Date:** 2026-06-19
**Input:** docs/research/R4_UAT_Report.md · docs/research/V3_Design_Blueprint.md
**Goal:** Resolve all remaining R4 UAT items, pass motion/a11y/mobile QA, and produce the
Final Platform Readiness Report for investor demo.

---

## Issues Fixed

### U3 — Borrower sidebar duplicate nav
`apps/borrower/src/components/layout/Sidebar.tsx`
- "LeapScore" and "Credit Health" both pointed to `/health` (two nav entries, one destination)
- Merged to single **"LeapScore & Health"** entry with `<Gauge>` icon
- Removed unused `HeartPulse` import

### W3 — Branded not-found.tsx (all 5 portals)
- Web & Borrower already had proper branded 404 pages.
- DSA, Lender, Admin had untracked files (not committed); now committed as proper
  `not-found.tsx` using `<Button>` from @leapmoney/ui for the CTA — consistent with
  web & borrower pattern.

### React import cleanup (style consistency)
- `AdminShell.tsx`: `import React from "react"` → `import { useState, type ReactNode }`
- `LenderShell.tsx`: same fix
- `DecisionWorkspace.tsx`: same fix; `React.useState ×3` → `useState`; `React.ReactNode` → `ReactNode`

### GPU / Motion pass — CONFIRMED CLEAN
- `grep -rn "style={{ height:"` across all apps → 0 results
- `grep -rn "style={{ width:"` → 0 results
- Remaining inline styles: `transform: scaleX/scaleY`, `stroke-dashoffset`, `minHeight` (static, non-animated)
- All animation via GPU compositor properties only

### Accessibility — CONFIRMED (R4 P10 carried forward)
- `aria-label` on all icon-only buttons (Open/Close menu in all shells)
- `aria-current="page"` on active nav links
- `nav` landmark with `aria-label="Sidebar"` in all portals
- No `<img>` without alt (0 raster images)
- Heading hierarchy checked across all pages

### Mobile pass — CONFIRMED
- Borrower/DSA KPI cards use MetricCardV2 → already handles `text-h1 sm:text-display-large + break-words`
- Portfolio quality bar uses `scaleX` (GPU, no height%) 
- 2-col grid → stacked at 375px via `grid-cols-2 → grid-cols-1` patterns

---

## Files Modified (7)
- apps/borrower/src/components/layout/Sidebar.tsx
- apps/admin/src/components/AdminShell.tsx
- apps/lender/src/components/LenderShell.tsx
- apps/lender/src/components/DecisionWorkspace.tsx
- apps/dsa/src/app/not-found.tsx (new tracked file)
- apps/lender/src/app/not-found.tsx (new tracked file)
- apps/admin/src/app/not-found.tsx (new tracked file)

---

## Validation
- pnpm turbo type-check --force: **15/15 PASS (0 errors)**
- pnpm turbo build: **SUCCESS — 6/6**
- Pages generated: web 39 · borrower 23 · dsa 9 · lender 8 · admin 10 · referral 4 = **93 total**

## Commit
- SHA: 74995eb
- Branch: develop
- Pushed: Yes (origin/develop)
