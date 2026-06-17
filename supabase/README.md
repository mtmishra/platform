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
    └── 0005_credit_rls.sql       # RLS for credit tables; append-only bureau/score history
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
