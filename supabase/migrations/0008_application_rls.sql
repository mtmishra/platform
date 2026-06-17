-- ============================================================================
-- Row-Level Security — Sprint 10 application tracking. Borrowers access only
-- their own applications. application_event is scoped via its parent and is
-- append-only (immutable timeline; no UPDATE/DELETE).
-- ============================================================================

create or replace function public.owns_application(app_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.application a
    where a.id = app_id
      and a.user_id = public.current_profile_id()
  );
$$;

-- ── application ───────────────────────────────────────────────────────────────
alter table public.application enable row level security;

create policy "application_select_own"
  on public.application for select
  using (user_id = public.current_profile_id());

create policy "application_insert_own"
  on public.application for insert
  with check (user_id = public.current_profile_id());

create policy "application_update_own"
  on public.application for update
  using (user_id = public.current_profile_id())
  with check (user_id = public.current_profile_id());

-- ── application_event (append-only) ───────────────────────────────────────────
alter table public.application_event enable row level security;

create policy "application_event_select_own"
  on public.application_event for select
  using (public.owns_application(application_id));

create policy "application_event_insert_own"
  on public.application_event for insert
  with check (public.owns_application(application_id));

-- No UPDATE/DELETE => immutable application timeline.
