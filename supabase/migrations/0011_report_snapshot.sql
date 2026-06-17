-- ============================================================================
-- LeapMoney — Sprint 12: report_snapshot. Records each credit-report pull event
-- (links the pull to the consent that authorised it). Append-only. Phase 7/8.
-- Demo flow writes are mocked client-side; this is the persistence target once
-- the bureau pull is wired.
-- ============================================================================

create table if not exists public.report_snapshot (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.users_profile (id) on delete cascade,
  report_id          text not null,                       -- internal report identifier
  pull_timestamp     timestamptz not null default now(),
  consent_reference  uuid references public.user_consent (id) on delete set null,
  pull_type          pull_type not null default 'soft',
  created_at         timestamptz not null default now()
);

create index if not exists idx_report_snapshot_user on public.report_snapshot (user_id, pull_timestamp desc);

-- ── RLS: own rows; append-only (no UPDATE/DELETE) ─────────────────────────────
alter table public.report_snapshot enable row level security;

create policy "report_snapshot_select_own"
  on public.report_snapshot for select
  using (user_id = public.current_profile_id());

create policy "report_snapshot_insert_own"
  on public.report_snapshot for insert
  with check (user_id = public.current_profile_id());
