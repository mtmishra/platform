# Current Sprint: Sprint 12 — Complete Borrower Demo Experience

**Sprint:** 12
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Investor-ready end-to-end borrower demo: Login → Credit Pull → Consent → Processing
→ Report Ready → Dashboard. DEMO MODE ONLY — uses the Sprint 7 mock bureau framework.
No Decentro / CIBIL / Experian / CRIF / Equifax / lender APIs.

## Demo-mode access (key enabler)
When Supabase is NOT configured, the borrower app now runs as a demo: middleware allows
the protected routes through and `lib/auth` returns a demo guest, so the full flow has no
dead ends. Production auth (configured Supabase) is unchanged.

## Sprint 12 Scope — Completed
- [x] Credit-pull flow: /credit-report/start → consent → fetching → report → dashboard
- [x] PAN capture (/credit-report/start): PAN format + required-field validation, error states
- [x] Consent (/credit-report/consent): purpose, data usage, retention, withdrawal; mock consent record (sessionStorage)
- [x] Fetching simulation (/credit-report/fetching): 5 animated steps (~4s), then redirect to report
- [x] Report Ready (/credit-report/report): bureau scores (4, Equifax on /999), active accounts, utilization, enquiries, credit age, DPD summary — from Sprint 7 mock data
- [x] Dashboard auto-population: LeapScore / Credit Health / LeapMatch via existing engines
- [x] report_snapshot (0011): report_id, pull_timestamp, consent_reference (append-only, RLS) + row type
- [x] Journey experience: Credit Report → LeapScore → Health → Match → Apply (report + dashboard)
- [x] Empty-state removal: login "Explore the demo" + dashboard "Get your free credit report" entry CTA
- [x] Visual QA passed (login, PAN+validation, consent, fetching, report, dashboard population, mobile, 0 console errors)

## Files
```
apps/borrower/src/
  lib/credit-report-demo.ts                     # buildCreditReport(pan) from Sprint 7 mock framework
  components/credit-report/FlowSteps.tsx
  app/(auth)/credit-report/start|consent|fetching|report/page.tsx
  app/(auth)/dashboard/page.tsx                 # + entry CTA
  components/auth/LoginForm.tsx                 # + "Explore the demo"
  lib/auth.ts, lib/supabase/middleware.ts       # demo-mode guest / allow-through
supabase/migrations/0011_report_snapshot.sql
packages/supabase/src/types.ts                  # ReportSnapshotRow
```

## Validation
- pnpm turbo type-check: 14/14 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps; borrower emits /credit-report/{start,consent,fetching,report}
- Visual QA: full flow verified on desktop + mobile; 0 console errors

## NOT built (out of scope)
Live bureau APIs (Decentro/CIBIL/Experian/CRIF/Equifax), lender APIs, CRM, server-side
persistence of the demo flow (consent + report snapshots are mocked client-side; the
report_snapshot table is the wired-later target).
