-- ============================================================================
-- LeapMoney — Sprint 10: Application & Outcome tracking (R3 §10.3 cold-start
-- phase 2 — capture real outcomes to calibrate/train the matching model later).
-- Reuses Sprint 7 credit schema + Sprint 8 lender catalog. Phase 7 conventions;
-- application_event is append-only (immutable timeline).
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type application_status as enum (
      'draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed', 'withdrawn'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'outcome_result') then
    create type outcome_result as enum ('pending', 'approved', 'rejected');
  end if;
end $$;

-- ── application ───────────────────────────────────────────────────────────────
-- One row per loan application. Captures the match-time prediction alongside the
-- realised outcome so the two can be compared (the feedback loop / calibration).
create table if not exists public.application (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.users_profile (id) on delete cascade,
  loan_type              match_loan_type not null,
  loan_amount_requested  bigint not null,
  tenure_months          integer not null,
  preference             text not null default 'BALANCED',
  status                 application_status not null default 'draft',
  match_session_id       uuid,

  -- Match-outcome tracking (lender slugs from the Sprint 8 catalog)
  recommended_lender_id  text references public.lender (id) on delete set null,
  selected_lender_id     text references public.lender (id) on delete set null,
  applied_lender_id      text references public.lender (id) on delete set null,
  approved_lender_id     text references public.lender (id) on delete set null,

  -- Prediction captured at apply time (the Sprint 8 approval probability, 5–95)
  predicted_probability  integer,

  -- Realised outcome
  approval_result        outcome_result not null default 'pending',
  rejection_reason       text,
  disbursal_amount       bigint,
  final_rate             numeric(5,2),
  processing_fee         numeric(12,2),

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists idx_application_user on public.application (user_id);
create index if not exists idx_application_status on public.application (status);
create index if not exists idx_application_applied_lender on public.application (applied_lender_id);

create trigger trg_application_updated_at
  before update on public.application
  for each row execute function set_updated_at();

-- ── application_event (append-only status / decision timeline) ────────────────
create table if not exists public.application_event (
  id              uuid primary key default gen_random_uuid(),
  application_id  uuid not null references public.application (id) on delete cascade,
  event_type      text not null,                 -- e.g. 'status_change', 'lender_decision'
  from_status     application_status,
  to_status       application_status,
  metadata        jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists idx_application_event_app on public.application_event (application_id, created_at);
