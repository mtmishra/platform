-- ============================================================================
-- LeapMoney — Sprint 14.5: lender_snapshot. Append-only point-in-time capture of
-- a lender's policies, payouts, and metrics (so the intelligence repository is
-- versioned/auditable as policies change). Phase 7/8. Demo writes mocked.
-- ============================================================================

create table if not exists public.lender_snapshot (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users_profile (id) on delete cascade,
  lender        text not null,
  policies      jsonb not null default '{}',
  payouts       jsonb not null default '[]',
  metrics       jsonb not null default '{}',
  generated_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists idx_lender_snapshot_user on public.lender_snapshot (user_id, generated_at desc);
create index if not exists idx_lender_snapshot_lender on public.lender_snapshot (lender);

-- ── RLS: own rows; append-only (no UPDATE/DELETE) ─────────────────────────────
alter table public.lender_snapshot enable row level security;

create policy "lender_snapshot_select_own"
  on public.lender_snapshot for select
  using (user_id = public.current_profile_id());

create policy "lender_snapshot_insert_own"
  on public.lender_snapshot for insert
  with check (user_id = public.current_profile_id());
