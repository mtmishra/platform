-- ============================================================================
-- Row-Level Security — Phase 7: RLS enabled on every table; minimum
-- "users can access own rows". Append-only tables block UPDATE/DELETE.
-- ============================================================================

-- Helper: map the current auth.uid() to a users_profile.id
create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.users_profile where auth_user_id = auth.uid();
$$;

-- Helper: role of the current user
create or replace function public.current_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users_profile where auth_user_id = auth.uid();
$$;

-- ── users_profile ───────────────────────────────────────────────────────────
alter table public.users_profile enable row level security;

create policy "profile_select_own"
  on public.users_profile for select
  using (auth_user_id = auth.uid());

create policy "profile_insert_own"
  on public.users_profile for insert
  with check (auth_user_id = auth.uid());

create policy "profile_update_own"
  on public.users_profile for update
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid());

-- ── user_settings ───────────────────────────────────────────────────────────
alter table public.user_settings enable row level security;

create policy "settings_select_own"
  on public.user_settings for select
  using (user_id = public.current_profile_id());

create policy "settings_insert_own"
  on public.user_settings for insert
  with check (user_id = public.current_profile_id());

create policy "settings_update_own"
  on public.user_settings for update
  using (user_id = public.current_profile_id())
  with check (user_id = public.current_profile_id());

-- ── user_consent (append-only) ──────────────────────────────────────────────
alter table public.user_consent enable row level security;

create policy "consent_select_own"
  on public.user_consent for select
  using (user_id = public.current_profile_id());

create policy "consent_insert_own"
  on public.user_consent for insert
  with check (user_id = public.current_profile_id());

-- No UPDATE or DELETE policies => append-only for all roles.

-- ── audit_log (append-only) ─────────────────────────────────────────────────
alter table public.audit_log enable row level security;

create policy "audit_select_own"
  on public.audit_log for select
  using (user_id = public.current_profile_id());

create policy "audit_insert_own"
  on public.audit_log for insert
  with check (user_id = public.current_profile_id() or user_id is null);

-- No UPDATE or DELETE policies => immutable audit trail.
