-- ============================================================================
-- LeapMoney — Sprint 6 foundation schema
-- Phase 7 rules: UUID PKs (gen_random_uuid), created_at DEFAULT NOW(),
-- updated_at via set_updated_at() trigger, no FK to auth.users directly
-- (reference public.users_profile), append-only audit/consent tables.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Roles ───────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('borrower', 'dsa', 'lender', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'onboarding_step') then
    create type onboarding_step as enum ('registered', 'profile', 'consent', 'complete');
  end if;
end $$;

-- ── updated_at trigger function ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── users_profile ───────────────────────────────────────────────────────────
-- One row per authenticated user. auth_user_id links to auth.users; all other
-- tables FK to users_profile.id (never to auth.users directly).
create table if not exists public.users_profile (
  id                uuid primary key default gen_random_uuid(),
  auth_user_id      uuid not null unique references auth.users (id) on delete cascade,
  email             text,
  phone             text,
  full_name         text,
  role              app_role not null default 'borrower',
  profile_completed boolean not null default false,
  onboarding_step   onboarding_step not null default 'registered',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_users_profile_auth_user_id on public.users_profile (auth_user_id);
create index if not exists idx_users_profile_role on public.users_profile (role);

create trigger trg_users_profile_updated_at
  before update on public.users_profile
  for each row execute function set_updated_at();

-- ── user_settings ───────────────────────────────────────────────────────────
create table if not exists public.user_settings (
  user_id                 uuid primary key references public.users_profile (id) on delete cascade,
  notifications_email     boolean not null default true,
  notifications_whatsapp  boolean not null default true,
  theme                   text not null default 'system' check (theme in ('light','dark','system')),
  updated_at              timestamptz not null default now()
);

create trigger trg_user_settings_updated_at
  before update on public.user_settings
  for each row execute function set_updated_at();

-- ── user_consent (append-only) ──────────────────────────────────────────────
-- DPDP consent record: purpose + version + timestamp. Never updated or deleted.
create table if not exists public.user_consent (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users_profile (id) on delete cascade,
  purpose    text not null,
  version    text not null,
  granted    boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_consent_user_id on public.user_consent (user_id);

-- ── audit_log (append-only) ─────────────────────────────────────────────────
-- Immutable record required for DPDP/RBI. No UPDATE/DELETE permitted (see RLS).
create table if not exists public.audit_log (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.users_profile (id) on delete set null,
  action     text not null,
  entity     text,
  metadata   jsonb,
  ip         text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_log_user_id on public.audit_log (user_id);
create index if not exists idx_audit_log_created_at on public.audit_log (created_at);
