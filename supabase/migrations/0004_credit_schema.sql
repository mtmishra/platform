-- ============================================================================
-- LeapMoney — Sprint 7: Credit Intelligence Foundation schema
-- Source of truth: R3 Credit Intelligence Report (§1, §9).
-- Phase 7 rules: UUID PKs, created_at DEFAULT NOW(), set_updated_at() trigger,
-- no FK to auth.users (FK to users_profile), append-only consent/snapshot.
-- Phase 8: every bureau pull is tied to a recorded, purpose-specific consent.
-- ============================================================================

-- ── Enums ─────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'bureau_name') then
    create type bureau_name as enum ('cibil', 'experian', 'crif', 'equifax');
  end if;
  if not exists (select 1 from pg_type where typname = 'pull_type') then
    create type pull_type as enum ('soft', 'hard');
  end if;
  if not exists (select 1 from pg_type where typname = 'account_type') then
    create type account_type as enum (
      'credit_card', 'personal_loan', 'home_loan', 'auto_loan',
      'overdraft', 'gold_loan', 'microfinance', 'business_loan'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'account_status') then
    create type account_status as enum ('standard', 'settlement', 'write_off', 'npa', 'closed');
  end if;
  if not exists (select 1 from pg_type where typname = 'ownership_type') then
    create type ownership_type as enum ('individual', 'joint', 'guarantor');
  end if;
  if not exists (select 1 from pg_type where typname = 'confidence_level') then
    create type confidence_level as enum ('high', 'medium', 'low', 'alternative_data_only');
  end if;
end $$;

-- ── Consent extensions (DPDP / RBI; Phase 8 §4) ───────────────────────────────
-- user_consent stays append-only. A bureau pull MUST reference a consent row.
-- Withdrawal is recorded as a NEW row (granted=false, revoked_at set, supersedes
-- the prior grant) — never an UPDATE, preserving immutability.
alter table public.user_consent
  add column if not exists bureau      bureau_name,
  add column if not exists pull_type   pull_type,
  add column if not exists expires_at  timestamptz,
  add column if not exists revoked_at  timestamptz,
  add column if not exists supersedes  uuid references public.user_consent (id);

-- ── bureau_report ─────────────────────────────────────────────────────────────
-- One row per bureau per pull. Score is on the bureau's NATIVE scale
-- (Equifax 1–999); normalization happens in the engine, not at rest. R3 §1, §9.
create table if not exists public.bureau_report (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users_profile (id) on delete cascade,
  consent_id  uuid references public.user_consent (id) on delete set null,
  bureau      bureau_name not null,
  score       integer,                       -- null = no hit / thin file
  report_date date not null,
  pull_type   pull_type not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_bureau_report_user_id on public.bureau_report (user_id);
create index if not exists idx_bureau_report_bureau on public.bureau_report (user_id, bureau);

-- ── tradeline ─────────────────────────────────────────────────────────────────
-- Account-level credit lines from a bureau report (R3 §1.2 §9.1.1).
create table if not exists public.tradeline (
  id                 uuid primary key default gen_random_uuid(),
  bureau_report_id   uuid not null references public.bureau_report (id) on delete cascade,
  account_type       account_type not null,
  lender_name        text not null,
  sanctioned_amount  bigint not null default 0,
  current_balance    bigint not null default 0,
  credit_limit       bigint,                  -- revolving credit only
  amount_overdue     bigint not null default 0,
  emi_amount         bigint not null default 0,
  account_status     account_status not null,
  dpd_last_36_months integer[] not null default '{}',
  date_opened        date,
  date_closed        date,
  ownership_type     ownership_type not null default 'individual',
  created_at         timestamptz not null default now()
);

create index if not exists idx_tradeline_report on public.tradeline (bureau_report_id);

-- ── inquiry ───────────────────────────────────────────────────────────────────
-- Hard/soft enquiries recorded on a bureau report (R3 §1.2 Section 3).
create table if not exists public.inquiry (
  id                uuid primary key default gen_random_uuid(),
  bureau_report_id  uuid not null references public.bureau_report (id) on delete cascade,
  bureau            bureau_name not null,
  inquiry_date      date not null,
  lender_name       text not null,
  loan_type         account_type not null,
  amount            bigint not null default 0,
  pull_type         pull_type not null,
  created_at        timestamptz not null default now()
);

create index if not exists idx_inquiry_report on public.inquiry (bureau_report_id);

-- ── score_factor ──────────────────────────────────────────────────────────────
-- Bureau-reported reason codes affecting the raw score (R3 §1.2 Section 4).
create table if not exists public.score_factor (
  id                uuid primary key default gen_random_uuid(),
  bureau_report_id  uuid not null references public.bureau_report (id) on delete cascade,
  bureau            bureau_name not null,
  code              text not null,
  description       text not null,
  direction         text not null check (direction in ('positive', 'negative')),
  created_at        timestamptz not null default now()
);

create index if not exists idx_score_factor_report on public.score_factor (bureau_report_id);

-- ── leapscore_snapshot (append-only) ──────────────────────────────────────────
-- Persisted LeapScore v2 output. Append-only like score_history (Phase 7 §15);
-- new computations write a new row with a model_version, never overwrite.
create table if not exists public.leapscore_snapshot (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users_profile (id) on delete cascade,
  leapscore          integer,                 -- null = Score Unavailable (thin file)
  confidence_level   confidence_level not null,
  data_sources_used  text[] not null default '{}',
  bureau_breakdown   jsonb not null,
  score_band         text not null,
  score_percentile   integer,
  payload            jsonb not null,          -- full LeapScoreResult for auditability
  model_version      text not null default 'v2',
  created_at         timestamptz not null default now()
);

create index if not exists idx_leapscore_snapshot_user on public.leapscore_snapshot (user_id, created_at desc);
