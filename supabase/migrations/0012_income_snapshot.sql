-- ============================================================================
-- LeapMoney — Sprint 13: income_snapshot. Append-only time series of verified
-- income + cash-flow score + FOIR from each AA bank-connection. Phase 7/8.
-- Demo writes are mocked client-side; this is the wired-later persistence target.
-- ============================================================================

create table if not exists public.income_snapshot (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.users_profile (id) on delete cascade,
  income               bigint not null,                 -- detected monthly income (₹)
  cashflow_score       integer not null,                -- 0–100
  foir                 numeric(4,2) not null,           -- 0.00–1.00
  verification_status  text not null default 'verified',
  generated_at         timestamptz not null default now(),
  created_at           timestamptz not null default now()
);

create index if not exists idx_income_snapshot_user on public.income_snapshot (user_id, generated_at desc);

-- ── RLS: own rows; append-only (no UPDATE/DELETE) ─────────────────────────────
alter table public.income_snapshot enable row level security;

create policy "income_snapshot_select_own"
  on public.income_snapshot for select
  using (user_id = public.current_profile_id());

create policy "income_snapshot_insert_own"
  on public.income_snapshot for insert
  with check (user_id = public.current_profile_id());
