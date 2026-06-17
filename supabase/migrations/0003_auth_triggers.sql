-- ============================================================================
-- Auth triggers — auto-provision a users_profile + user_settings row when a new
-- auth.users record is created (e.g. after email OTP verification).
-- New users default to the 'borrower' role.
-- ============================================================================

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_profile_id uuid;
begin
  insert into public.users_profile (auth_user_id, email, role, onboarding_step)
  values (new.id, new.email, 'borrower', 'registered')
  returning id into new_profile_id;

  insert into public.user_settings (user_id)
  values (new_profile_id);

  insert into public.audit_log (user_id, action, entity, metadata)
  values (new_profile_id, 'user_registered', 'users_profile',
          jsonb_build_object('auth_user_id', new.id));

  return new;
end;
$$;

drop trigger if exists trg_on_auth_user_created on auth.users;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();
