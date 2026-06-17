# Supabase

Database schema and migrations for the LeapMoney platform.

## Structure

```
supabase/
└── migrations/
    ├── 0001_initial_schema.sql   # roles, users_profile, settings, consent, audit_log, triggers
    ├── 0002_rls_policies.sql     # RLS on every table; append-only enforcement
    ├── 0003_auth_triggers.sql    # auto-provision profile + settings on signup
    ├── 0004_credit_schema.sql    # Sprint 7: bureau_report, tradeline, inquiry, score_factor,
    │                             #           leapscore_snapshot; user_consent extensions
    ├── 0005_credit_rls.sql       # RLS for credit tables; append-only bureau/score history
    ├── 0006_lender_schema.sql    # Sprint 8: lender, lender_product (catalog); RLS read-all/admin-write
    ├── 0007_application_schema.sql # Sprint 10: application, application_event; outcome + match tracking
    ├── 0008_application_rls.sql  # RLS for applications; append-only application_event
    ├── 0009_snapshot_schema.sql  # Sprint 11: score_snapshot, health_snapshot, match_snapshot (time series)
    ├── 0010_snapshot_rls.sql     # RLS for snapshots; append-only
    └── 0011_report_snapshot.sql  # Sprint 12: report_snapshot (pull event + consent reference) + RLS
```

## Applying migrations

With the Supabase CLI (recommended):

```bash
supabase db push          # apply migrations to the linked project
# or, locally:
supabase start
supabase db reset         # re-runs all migrations
```

Or paste each file into the Supabase Dashboard → SQL Editor in order.

## Schema overview (Sprint 6 foundation)

| Table | Purpose | Notes |
|-------|---------|-------|
| `users_profile` | One row per user; role, onboarding state | `auth_user_id` → `auth.users`; all other tables FK here |
| `user_settings` | Notification + theme preferences | 1:1 with profile |
| `user_consent` | DPDP consent records (purpose, version) | **Append-only**; Sprint 7 adds `bureau`, `pull_type`, `expires_at`, `revoked_at`, `supersedes` |
| `audit_log` | Immutable audit trail | **Append-only** |

## Schema overview (Sprint 7 — Credit Intelligence)

| Table | Purpose | Notes |
|-------|---------|-------|
| `bureau_report` | One row per bureau per pull; native-scale score | **Append-only**; `consent_id` → `user_consent`; score `null` = thin file |
| `tradeline` | Credit accounts from a report | Child of `bureau_report`; `dpd_last_36_months int[]` |
| `inquiry` | Hard/soft enquiries on a report | Child of `bureau_report` |
| `score_factor` | Bureau reason codes (helping/hurting) | Child of `bureau_report` |
| `leapscore_snapshot` | Persisted LeapScore v2 output + full payload | **Append-only**; `model_version` for A/B and audit |

Bureau pulls and score snapshots are append-only: a re-pull/re-compute writes a
new row, never mutates history. Equifax scores are stored on their native 1–999
scale and normalized to 300–900 by the engine (`@leapmoney/credit`), not at rest.

## Schema overview (Sprint 8 — Lender Intelligence Database)

| Table | Purpose | Notes |
|-------|---------|-------|
| `lender` | Lender directory | Read by all authenticated users; admin-only writes |
| `lender_product` | Per-product eligibility, rates, bureau strategy, approval bands | `min_score`/`approval_rate_by_band` jsonb; consumed by `@leapmoney/match` |

The LeapMatch engine (`@leapmoney/match`) is rule-based and stateless — it reads
the lender catalog and a borrower profile (from LeapScore) and returns matched +
not-matched lenders with approval odds.

## Schema overview (Sprint 10 — Application & Outcome tracking)

| Table | Purpose | Notes |
|-------|---------|-------|
| `application` | One row per loan application; match-time prediction + realised outcome | Captures recommended/selected/applied/approved lender, `predicted_probability`, `approval_result`, disbursal amount, final rate, fee |
| `application_event` | Status / decision timeline | **Append-only** (immutable) |

These feed `@leapmoney/outcomes` — the feedback loop (predicted vs actual →
calibration) and analytics (approval rate, match accuracy, conversion rate),
which is the data foundation for the R3 §10.3 ML-calibration phase.

## Schema overview (Sprint 11 — Dashboard snapshots)

| Table | Purpose | Notes |
|-------|---------|-------|
| `score_snapshot` | LeapScore time series | **Append-only**; powers the dashboard improvement tracker |
| `health_snapshot` | Credit Health time series | **Append-only** |
| `match_snapshot` | Top-match time series | **Append-only**; top lender + approval prob + match count |

These are lightweight, dashboard-oriented time-series rows — distinct from the
engine's full `leapscore_snapshot` payload table (Sprint 7).

## Conventions (Phase 7)

- UUID primary keys via `gen_random_uuid()`.
- `created_at DEFAULT now()`; `updated_at` maintained by the `set_updated_at()` trigger.
- No FK to `auth.users` except `users_profile.auth_user_id`.
- RLS enabled on all tables; minimum policy is "users can access own rows".
- `user_consent` and `audit_log` have no UPDATE/DELETE policies (append-only).
- New users are provisioned as `borrower` by `handle_new_auth_user()`.

## Environment

Set these in each app's `.env.local` (and in Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Until these are set, the app builds and runs but auth is a no-op (see
`packages/supabase/src/env.ts`).
