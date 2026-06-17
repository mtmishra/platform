-- ============================================================================
-- Row-Level Security — Sprint 7 credit tables. Borrowers access only their own
-- credit data. Child tables (tradeline / inquiry / score_factor) are scoped via
-- their parent bureau_report. leapscore_snapshot is append-only (no UPDATE/
-- DELETE) like score_history (Phase 7 §15). Bureau reports are append-only too:
-- a re-pull writes a new report, never mutates a prior one.
-- ============================================================================

-- Helper: does the current user own this bureau_report?
create or replace function public.owns_bureau_report(report_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.bureau_report br
    where br.id = report_id
      and br.user_id = public.current_profile_id()
  );
$$;

-- ── bureau_report (append-only) ───────────────────────────────────────────────
alter table public.bureau_report enable row level security;

create policy "bureau_report_select_own"
  on public.bureau_report for select
  using (user_id = public.current_profile_id());

create policy "bureau_report_insert_own"
  on public.bureau_report for insert
  with check (user_id = public.current_profile_id());

-- No UPDATE/DELETE => bureau pulls are immutable history.

-- ── tradeline ─────────────────────────────────────────────────────────────────
alter table public.tradeline enable row level security;

create policy "tradeline_select_own"
  on public.tradeline for select
  using (public.owns_bureau_report(bureau_report_id));

create policy "tradeline_insert_own"
  on public.tradeline for insert
  with check (public.owns_bureau_report(bureau_report_id));

-- ── inquiry ───────────────────────────────────────────────────────────────────
alter table public.inquiry enable row level security;

create policy "inquiry_select_own"
  on public.inquiry for select
  using (public.owns_bureau_report(bureau_report_id));

create policy "inquiry_insert_own"
  on public.inquiry for insert
  with check (public.owns_bureau_report(bureau_report_id));

-- ── score_factor ──────────────────────────────────────────────────────────────
alter table public.score_factor enable row level security;

create policy "score_factor_select_own"
  on public.score_factor for select
  using (public.owns_bureau_report(bureau_report_id));

create policy "score_factor_insert_own"
  on public.score_factor for insert
  with check (public.owns_bureau_report(bureau_report_id));

-- ── leapscore_snapshot (append-only) ──────────────────────────────────────────
alter table public.leapscore_snapshot enable row level security;

create policy "leapscore_snapshot_select_own"
  on public.leapscore_snapshot for select
  using (user_id = public.current_profile_id());

create policy "leapscore_snapshot_insert_own"
  on public.leapscore_snapshot for insert
  with check (user_id = public.current_profile_id());

-- No UPDATE/DELETE => score history is immutable; re-computation appends.
