-- ============================================================================
-- LeapMoney — Sprint 15: DSA partner snapshots. Append-only time series of a
-- DSA's metrics/earnings/performance and commission position. Phase 7/8.
-- Demo writes are mocked client-side; these are the wired-later persistence targets.
-- ============================================================================

create table if not exists public.dsa_snapshot (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users_profile (id) on delete cascade,
  metrics       jsonb not null default '{}',
  earnings      bigint not null default 0,
  performance   jsonb not null default '{}',
  generated_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists idx_dsa_snapshot_user on public.dsa_snapshot (user_id, generated_at desc);

create table if not exists public.commission_snapshot (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users_profile (id) on delete cascade,
  pending       bigint not null default 0,
  approved      bigint not null default 0,
  paid          bigint not null default 0,
  generated_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists idx_commission_snapshot_user on public.commission_snapshot (user_id, generated_at desc);

-- ── RLS: own rows; append-only (no UPDATE/DELETE) ─────────────────────────────
alter table public.dsa_snapshot enable row level security;
alter table public.commission_snapshot enable row level security;

create policy "dsa_snapshot_select_own"
  on public.dsa_snapshot for select
  using (user_id = public.current_profile_id());
create policy "dsa_snapshot_insert_own"
  on public.dsa_snapshot for insert
  with check (user_id = public.current_profile_id());

create policy "commission_snapshot_select_own"
  on public.commission_snapshot for select
  using (user_id = public.current_profile_id());
create policy "commission_snapshot_insert_own"
  on public.commission_snapshot for insert
  with check (user_id = public.current_profile_id());
