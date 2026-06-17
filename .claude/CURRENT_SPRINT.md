# Current Sprint: Sprint 14 — Loan Application Journey Demo

**Sprint:** 14
**Status:** Complete
**Date:** 2026-06-18
**Goal:** Borrower-side journey from LeapMatch → Apply → Track Status. Mock workflow only —
no APIs, CRM, lender integrations, KYC providers, or document storage.

## Sprint 14 Scope — Completed
- [x] Application workspace: /applications, /applications/new, /applications/[id], /applications/[id]/timeline
- [x] 7-step Application Wizard: Loan selection → Personal → Employment → Income → Documents → Review → Submit (progress indicator)
- [x] My Applications list + status summary (Draft/Submitted/Under Review/Approved/Rejected/Disbursed)
- [x] Document vault (PAN/Aadhaar/Salary Slip/Bank Statement/ITR; Uploaded/Missing — mock)
- [x] KYC module (Pending/In Progress/Verified) + progress card
- [x] Status timeline (Created → Documents → KYC → Under review → Decision → Disbursal), visual
- [x] Application detail page (summary, approval simulation + why-this-lender, KYC, documents, timeline, notifications)
- [x] Approval simulation (probability/confidence/expected decision time) reusing Sprint 8 outputs
- [x] Application notifications (submitted/verified/under review/approved/disbursed)
- [x] application_snapshot (0015; append-only, RLS) + row type
- [x] Dashboard integration: My Applications section + status summary + recent activity
- [x] Journey updated: … → LeapMatch → Apply → Track Status (9 steps); Applications sidebar enabled; /matches Apply → /applications/new
- [x] Visual QA passed (wizard, vault, KYC, timeline, detail, status, notifications, dashboard, mobile; 0 console errors)

## Files
```
apps/borrower/src/
  lib/applications-demo.ts                       # seed applications + timeline/status helpers
  components/applications/ApplicationWidgets.tsx # StatusBadge, ApplicationCard, Timeline, DocumentVault, KycCard, ApprovalCard, Notifications
  components/applications/ApplicationWizard.tsx  # 7-step client wizard
  app/(auth)/applications/{page, new, [id], [id]/timeline}.tsx
  app/(auth)/dashboard/page.tsx                  # + My Applications section
  components/dashboard/CreditJourneyTimeline.tsx # + Track Status step
  components/layout/Sidebar.tsx                  # Applications enabled
  app/(auth)/matches/page.tsx                    # Apply → /applications/new
supabase/migrations/0015_application_snapshot.sql
packages/supabase/src/types.ts                  # ApplicationSnapshotRow
```

## Validation
- pnpm turbo type-check: 14/14 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps; borrower emits /applications, /applications/new, /applications/[id], /applications/[id]/timeline
- Visual QA: desktop + mobile; 0 console errors

## End result
The borrower journey is now complete end-to-end: Credit Report → LeapScore → Credit Health →
Connect Bank → Cash Flow → Financial Analysis → LeapMatch → Apply → Track Status. NOT built:
live APIs/CRM/lender/KYC/storage; server-side persistence (application_snapshot is the wired-later target).
