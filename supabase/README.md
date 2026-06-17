# Supabase

Database schema and migrations for the LeapMoney platform.

## Structure

```
supabase/
└── migrations/
    ├── 0001_initial_schema.sql   # roles, users_profile, settings, consent, audit_log, triggers
    ├── 0002_rls_policies.sql     # RLS on every table; append-only enforcement
    └── 0003_auth_triggers.sql    # auto-provision profile + settings on signup
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
| `user_consent` | DPDP consent records (purpose, version) | **Append-only** |
| `audit_log` | Immutable audit trail | **Append-only** |

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
