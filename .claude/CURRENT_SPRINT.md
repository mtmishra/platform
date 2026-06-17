# Current Sprint: Sprint 6 — Borrower Platform Foundation

**Sprint:** 6
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Supabase + auth + RBAC + protected borrower dashboard (foundation only)

## Source of Truth
Phase 7 (architecture, RLS, folder structure §3, route map, auth §16), Phase 8 (DPDP consent, audit), Phase 11/12 (scope). See [[architecture-decisions]].

## Sprint 6 Scope — Completed
- [x] Supabase foundation: @supabase/ssr; browser/server/middleware clients; env with safe fallback
- [x] Database schema (supabase/migrations): users_profile, user_settings, user_consent (append-only),
      audit_log (append-only); set_updated_at trigger; handle_new_auth_user provisioning
- [x] RLS on every table; "own rows" policies; append-only enforced (no UPDATE/DELETE policies)
- [x] Email OTP auth (request code -> verify), session via cookies, sign-out
- [x] Role system: app_role enum (borrower/dsa/lender/admin); ROLES/hasRole/isRole helpers
- [x] Route protection: middleware.ts (edge) + (auth) route group + requireUser/requireRole
- [x] User profiles: profile schema, settings, profile_completed + onboarding_step tracking
- [x] Borrower app shell: sidebar (desktop + mobile drawer), topbar, empty states, onboarding checklist
- [x] Pages: /login, /onboard, /dashboard, /profile, /forbidden
- [x] Security: RBAC, middleware protection, server-side session validation, audit-ready append-only tables

## Architecture (Phase 7)
- Folder structure: app/(public)/, app/(auth)/, lib/supabase/, components/, middleware.ts
- UUID PKs, set_updated_at trigger, no direct FK to auth.users (FK -> users_profile)
- No PII in logs; consent + audit immutable

## Validation
- pnpm turbo type-check: 11/11 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps; borrower emits /login /onboard /dashboard /profile /forbidden + Middleware

## NOT built (out of scope, per instructions)
Credit bureau, LeapScore engine, LeapMatch engine, loan applications, CRM.

## To enable auth
Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY and run migrations
(see supabase/README.md). Until then the app runs in demo mode (auth no-op).
