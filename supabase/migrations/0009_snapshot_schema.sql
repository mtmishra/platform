-- ============================================================================
-- LeapMoney — Sprint 11: Dashboard snapshot persistence. Lightweight, append-only
-- time-series rows that power the dashboard's progress trackers (distinct from
-- the engine's full leapscore_snapshot payload table). Phase 7 conventions.
-- ============================================================================

-- ── score_snapshot ────────────────────────────────────────────────────────────
create table if not exists public.score_snapshot (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users_profile (id) on delete cascade,
  score       integer not null,          -- LeapScore 300–900
  band        text not null,
  captured_at timestamptz not null default now()
);

create index if not exists idx_score_snapshot_user on public.score_snapshot (user_id, captured_at desc);

-- ── health_snapshot ───────────────────────────────────────────────────────────
create table if not exists public.health_snapshot (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users_profile (id) on delete cascade,
  health_score integer not null,         -- Credit Health 0–100
  band         text not null,
  captured_at  timestamptz not null default now()
);

create index if not exists idx_health_snapshot_user on public.health_snapshot (user_id, captured_at desc);

-- ── match_snapshot ────────────────────────────────────────────────────────────
create table if not exists public.match_snapshot (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references public.users_profile (id) on delete cascade,
  loan_type                match_loan_type not null,
  top_lender_id            text references public.lender (id) on delete set null,
  top_approval_probability integer,
  match_count              integer not null default 0,
  captured_at              timestamptz not null default now()
);

create index if not exists idx_match_snapshot_user on public.match_snapshot (user_id, captured_at desc);
