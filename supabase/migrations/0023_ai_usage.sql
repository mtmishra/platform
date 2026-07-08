-- ============================================================================
-- LeapMoney — Sprint 28: LeapAI database foundation, part 4/4.
-- Per-user daily token/cost accumulator backing the AI Gateway's budget
-- enforcement (Master PRD v1.1 §4.2 T5, §7.3). One row per user per day;
-- the gateway upserts + increments as calls complete.
-- ============================================================================

create table if not exists public.ai_usage (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users_profile (id) on delete cascade,
  day          date not null default current_date,
  tokens_in    integer not null default 0,
  tokens_out   integer not null default 0,
  cost_micros  bigint not null default 0,            -- cost in millionths of the base currency unit, avoids float rounding
  updated_at   timestamptz not null default now()
);

comment on table public.ai_usage is
  'Per-user, per-day token/cost accumulator. Read by the AI Gateway budget check before each call; incremented after.';
comment on column public.ai_usage.cost_micros is
  'Cost in millionths of the base currency unit (1 unit = 1,000,000 micros) — integer arithmetic avoids float rounding drift over many increments.';

create unique index if not exists idx_ai_usage_user_day on public.ai_usage (user_id, day);

create trigger trg_ai_usage_updated_at
  before update on public.ai_usage
  for each row execute function set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table public.ai_usage enable row level security;

create policy "ai_usage_select_own"
  on public.ai_usage for select
  using (user_id = public.current_profile_id());

create policy "ai_usage_insert_own"
  on public.ai_usage for insert
  with check (user_id = public.current_profile_id());

create policy "ai_usage_update_own"
  on public.ai_usage for update
  using (user_id = public.current_profile_id())
  with check (user_id = public.current_profile_id());
-- No DELETE policy — usage history is retained for cost/audit reconciliation.
