-- ============================================================================
-- LeapMoney — Sprint 13.5: Financial Intelligence snapshots. Append-only time
-- series of the financial-intelligence output and the recommendations served.
-- Phase 7 conventions; Phase 8 audit-compliant (immutable). Demo writes mocked
-- client-side; these are the wired-later persistence targets.
-- ============================================================================

-- ── financial_snapshot ────────────────────────────────────────────────────────
create table if not exists public.financial_snapshot (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users_profile (id) on delete cascade,
  score           integer,                       -- LeapScore at time of snapshot
  foir            numeric(4,2),                  -- future FOIR (0.00–1.00)
  monthly_savings bigint not null default 0,
  annual_savings  bigint not null default 0,
  lifetime_savings bigint not null default 0,
  generated_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index if not exists idx_financial_snapshot_user on public.financial_snapshot (user_id, generated_at desc);

-- ── recommendation_snapshot ───────────────────────────────────────────────────
-- One row per recommendation served (so we can later learn which recs convert).
create table if not exists public.recommendation_snapshot (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references public.users_profile (id) on delete cascade,
  financial_snapshot_id    uuid references public.financial_snapshot (id) on delete cascade,
  recommendation_id        text not null,        -- e.g. 'balance_transfer'
  title                    text not null,
  priority                 text not null,
  expected_score_impact    integer not null default 0,
  expected_savings         bigint not null default 0,
  generated_at             timestamptz not null default now(),
  created_at               timestamptz not null default now()
);

create index if not exists idx_recommendation_snapshot_user on public.recommendation_snapshot (user_id, generated_at desc);

-- ── RLS: own rows; append-only (no UPDATE/DELETE) ─────────────────────────────
alter table public.financial_snapshot enable row level security;
alter table public.recommendation_snapshot enable row level security;

create policy "financial_snapshot_select_own"
  on public.financial_snapshot for select
  using (user_id = public.current_profile_id());
create policy "financial_snapshot_insert_own"
  on public.financial_snapshot for insert
  with check (user_id = public.current_profile_id());

create policy "recommendation_snapshot_select_own"
  on public.recommendation_snapshot for select
  using (user_id = public.current_profile_id());
create policy "recommendation_snapshot_insert_own"
  on public.recommendation_snapshot for insert
  with check (user_id = public.current_profile_id());
