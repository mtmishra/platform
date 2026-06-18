# Current Sprint: Sprint 16 — Lender Portal Demo

**Sprint:** 16
**Status:** Complete
**Date:** 2026-06-18
**Goal:** Investor-ready lender underwriting & portfolio platform (apps/lender): review applications
+ borrower intelligence, make credit decisions, track underwriting/portfolio. Demo mode, mock data
— no LOS/LMS/CRM/bureau/bank APIs.

## Sprint 16 Scope — Completed (all 12 items)
- [x] Lender app wired to shared design system + LenderShell (sidebar + mobile drawer + topbar)
- [x] Dashboard: KPI cards (New/Under Review/Approved/Rejected/Disbursed) + portfolio strip + review queue + notifications
- [x] Application inbox (/applications): applicant/product/amount/LeapScore/odds/source/status + filters (product, status, score band)
- [x] Application review (/applications/[id]): borrower profile, LeapScore, credit health, cash flow, FOIR, employer intelligence, recommendations, approval probability, timeline, documents
- [x] Credit decision workspace: Approve / Reject / Conditional + reason codes (Low Score / High FOIR / Income Risk / Employer Risk / Policy Mismatch) — demo only
- [x] Underwriting (/underwriting): risk distribution, score bands, approval-probability distribution, approval/rejection trends
- [x] Portfolio (/portfolio): total exposure, avg ticket, avg LeapScore, disbursed loans, portfolio quality, portfolio health
- [x] Lead source analytics (/analytics): Borrower Direct / DSA / Referral / Organic — applications, approvals, conversion
- [x] Product analytics: top products, top amounts, top cities, top score bands
- [x] Notifications: new application / approval required / conditional approval / disbursal completed / high risk alert
- [x] Snapshots: underwriting_snapshot + portfolio_snapshot (0018; append-only, RLS) + row types (lender_snapshot from 0017)
- [x] Demo data: 54 applications, multiple products/score bands/sources/statuses
- [x] Mobile UX: responsive desktop/tablet/mobile

## Files (apps/lender/src)
```
lib/lender-demo.ts              # 54 applications + KPIs, underwriting, portfolio, source/product analytics, notifications
components/LenderShell.tsx       # sidebar + mobile drawer + topbar
components/LenderWidgets.tsx     # StatusBadge, ScoreBandBadge, KpiCard, ApplicationRow, BarList, ColumnChart
components/ApplicationInbox.tsx  # client filters (product/status/score band)
components/DecisionWorkspace.tsx # client approve/reject/conditional + reason codes (demo)
app/{page, applications, applications/[id], underwriting, portfolio, analytics}.tsx
app/{layout.tsx, globals.css}, tailwind.config.ts   # shared design system wiring
supabase/migrations/0018_underwriting_portfolio_snapshot.sql
packages/supabase/src/types.ts  # UnderwritingSnapshotRow, PortfolioSnapshotRow
```

## Validation
- pnpm turbo type-check: 15/15 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps; lender emits /, /applications, /applications/[id], /underwriting, /portfolio, /analytics
- Visual QA: desktop + mobile; filters + decision workspace interactive
- Console: a dev-only React hydration warning ("Extra attributes from the server: style" on <html>) was observed during scripted QA navigation — induced by the QA harness setting an inline style on <html>; not in app code, absent in the production build.

## NOT built
Live LOS/LMS/CRM/bureau/bank APIs; lender auth; server-side persistence (lender/underwriting/portfolio
snapshots are the wired-later targets; decisions are demo-only, not persisted).
