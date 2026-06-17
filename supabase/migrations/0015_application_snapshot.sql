-- ============================================================================
-- LeapMoney — Sprint 14: application_snapshot. Append-only point-in-time capture
-- of an application's status, approval probability, and timeline (so progress is
-- auditable). Phase 7/8 conventions. Demo writes mocked client-side; this is the
-- wired-later persistence target.
-- ============================================================================

create table if not exists public.application_snapshot (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users_profile (id) on delete cascade,
  application_id  text not null,
  lender          text,
  status          application_status not null,
  probability     integer,
  timeline        jsonb not null default '[]',
  created_at      timestamptz not null default now()
);

create index if not exists idx_application_snapshot_user on public.application_snapshot (user_id, created_at desc);
create index if not exists idx_application_snapshot_app on public.application_snapshot (application_id);

-- ── RLS: own rows; append-only (no UPDATE/DELETE) ─────────────────────────────
alter table public.application_snapshot enable row level security;

create policy "application_snapshot_select_own"
  on public.application_snapshot for select
  using (user_id = public.current_profile_id());

create policy "application_snapshot_insert_own"
  on public.application_snapshot for insert
  with check (user_id = public.current_profile_id());
