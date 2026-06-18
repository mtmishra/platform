-- ============================================================================
-- LeapMoney — Sprint 16: Lender Portal snapshots. Append-only point-in-time
-- capture of underwriting analytics and portfolio metrics for a lender's credit
-- desk (auditable risk/portfolio history). Phase 7/8. Demo writes mocked.
-- (lender_snapshot ships in 0017.)
-- ============================================================================

create table if not exists public.underwriting_snapshot (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users_profile (id) on delete cascade,
  risk_distribution    jsonb not null default '{}',
  score_bands          jsonb not null default '{}',
  approval_distribution jsonb not null default '{}',
  approval_trend       jsonb not null default '[]',
  generated_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

create index if not exists idx_underwriting_snapshot_user on public.underwriting_snapshot (user_id, generated_at desc);

create table if not exists public.portfolio_snapshot (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users_profile (id) on delete cascade,
  total_exposure  bigint not null default 0,
  avg_ticket      bigint not null default 0,
  avg_leapscore   integer not null default 0,
  disbursed_loans integer not null default 0,
  portfolio_quality integer not null default 0,
  portfolio_health  text,
  generated_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index if not exists idx_portfolio_snapshot_user on public.portfolio_snapshot (user_id, generated_at desc);

-- ── RLS: own rows; append-only (no UPDATE/DELETE) ─────────────────────────────
alter table public.underwriting_snapshot enable row level security;
alter table public.portfolio_snapshot enable row level security;

create policy "underwriting_snapshot_select_own"
  on public.underwriting_snapshot for select
  using (user_id = public.current_profile_id());
create policy "underwriting_snapshot_insert_own"
  on public.underwriting_snapshot for insert
  with check (user_id = public.current_profile_id());

create policy "portfolio_snapshot_select_own"
  on public.portfolio_snapshot for select
  using (user_id = public.current_profile_id());
create policy "portfolio_snapshot_insert_own"
  on public.portfolio_snapshot for insert
  with check (user_id = public.current_profile_id());
