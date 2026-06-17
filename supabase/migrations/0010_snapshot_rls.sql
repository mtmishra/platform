-- ============================================================================
-- Row-Level Security — Sprint 11 dashboard snapshots. Own-rows only; append-only
-- (no UPDATE/DELETE) so each snapshot is an immutable point in the time series.
-- ============================================================================

alter table public.score_snapshot enable row level security;
alter table public.health_snapshot enable row level security;
alter table public.match_snapshot enable row level security;

create policy "score_snapshot_select_own"
  on public.score_snapshot for select
  using (user_id = public.current_profile_id());
create policy "score_snapshot_insert_own"
  on public.score_snapshot for insert
  with check (user_id = public.current_profile_id());

create policy "health_snapshot_select_own"
  on public.health_snapshot for select
  using (user_id = public.current_profile_id());
create policy "health_snapshot_insert_own"
  on public.health_snapshot for insert
  with check (user_id = public.current_profile_id());

create policy "match_snapshot_select_own"
  on public.match_snapshot for select
  using (user_id = public.current_profile_id());
create policy "match_snapshot_insert_own"
  on public.match_snapshot for insert
  with check (user_id = public.current_profile_id());

-- No UPDATE/DELETE on any snapshot table => append-only time series.
