# Current Sprint: Sprint 17 — Admin Control Tower

**Sprint:** 17
**Status:** Complete
**Date:** 2026-06-18
**Goal:** Investor-ready Admin Control Tower completing the ecosystem (apps/admin) — platform-wide
ops, users, applications, commissions, risk, revenue, compliance. Demo mode, mock data — no APIs/CRM/integrations.

## Sprint 17 Scope — Completed
- [x] Admin app wired to shared design system + AdminShell (sidebar + mobile drawer + topbar)
- [x] Dashboard: Total Borrowers / DSAs / Lenders / Applications / Disbursals / Revenue / Commission / Disbursal Volume + Notifications center
- [x] User management (/users): Borrowers / DSAs / Lenders with role filter + status
- [x] Application management (/applications): all applications + status & source filters
- [x] Commission management (/commissions): Pending / Approved / Paid + top earning DSAs
- [x] Risk dashboard (/risk): score bands, approval rate by band, rejection reasons (from lender repository)
- [x] Revenue dashboard (/revenue): revenue, disbursal volume, conversion + monthly trend
- [x] Compliance dashboard (/compliance): consents (granted/active/withdrawn), audit log, bureau pull logs
- [x] Notifications center (dashboard)
- [x] Snapshots: admin_snapshot + revenue_snapshot + compliance_snapshot (0019; append-only, RLS) + row types
- [x] Mobile-first; Visual QA passed (filters interactive; 0 console errors)

## Files (apps/admin/src)
```
lib/admin-demo.ts               # cross-portal aggregates (KPIs, users, applications, commissions, risk, revenue, compliance, notifications)
components/AdminShell.tsx         # sidebar + mobile drawer + topbar
components/AdminWidgets.tsx       # KpiCard, Panel, BarList, ColumnChart, StatusBadge
components/UsersTable.tsx         # client role filter
components/ApplicationsTable.tsx  # client status/source filters
app/{page, users, applications, commissions, risk, revenue, compliance}.tsx
app/{layout.tsx, globals.css}, tailwind.config.ts   # shared design system wiring
supabase/migrations/0019_admin_snapshot.sql
packages/supabase/src/types.ts  # AdminSnapshotRow, RevenueSnapshotRow, ComplianceSnapshotRow
```
Reuses @leapmoney/lenders (lender count + rejection reasons) as a cross-portal data source.

## Validation
- pnpm turbo type-check: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps; admin emits /, /users, /applications, /commissions, /risk, /revenue, /compliance
- Visual QA: desktop + mobile; role/status filters interactive; 0 console errors

## Ecosystem complete
Borrower (6–14) → DSA (15) → Lender (16) → Admin (17). All five portals + marketing site are live in demo mode.

## NOT built
Live APIs/CRM/integrations; admin auth/RBAC enforcement; server-side persistence (admin/revenue/compliance
snapshots are the wired-later targets); cross-app live data (each portal uses its own mock layer).
