-- ============================================================================
-- LeapMoney — Sprint 8: Lender Intelligence Database (R3 §10.1.2).
-- Catalog tables maintained by LeapMoney ops/admin (not user-owned). Read by all
-- authenticated users; writes restricted to admin. Phase 7 conventions: UUID-ish
-- text PKs (stable lender slugs), set_updated_at() trigger, RLS on every table.
-- ============================================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lender_type') then
    create type lender_type as enum ('psb', 'private_bank', 'sfb', 'nbfc', 'digital_nbfc', 'cooperative');
  end if;
  if not exists (select 1 from pg_type where typname = 'match_loan_type') then
    create type match_loan_type as enum ('personal', 'home', 'business', 'auto', 'education', 'gold', 'lap', 'credit_card');
  end if;
  if not exists (select 1 from pg_type where typname = 'fee_type') then
    create type fee_type as enum ('percentage', 'fixed', 'nil');
  end if;
  if not exists (select 1 from pg_type where typname = 'api_integration_status') then
    create type api_integration_status as enum ('full_api', 'partial', 'manual', 'not_integrated');
  end if;
end $$;

-- ── lender ────────────────────────────────────────────────────────────────────
create table if not exists public.lender (
  id          text primary key,                 -- stable slug, e.g. 'bajaj'
  name        text not null,
  lender_type lender_type not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_lender_updated_at
  before update on public.lender
  for each row execute function set_updated_at();

-- ── lender_product ────────────────────────────────────────────────────────────
-- One row per lender per loan product. min_score and approval_rate_by_band are
-- jsonb (keyed by bureau / score-band). Bureau strategy per R3 §2.
create table if not exists public.lender_product (
  id                          text primary key,             -- e.g. 'bajaj-personal'
  lender_id                   text not null references public.lender (id) on delete cascade,
  loan_type                   match_loan_type not null,

  primary_bureau              bureau_name not null,
  secondary_bureau            bureau_name,
  min_score                   jsonb not null default '{}',  -- { "cibil": 730, "experian": 720 }

  min_income_salaried         bigint not null,
  min_income_self_employed    bigint not null,
  max_foir                    numeric(4,2) not null,        -- 0.00–1.00
  min_employment_months       integer not null default 12,
  min_business_vintage_months integer not null default 24,

  loan_amount_min             bigint not null,
  loan_amount_max             bigint not null,
  tenure_min_months           integer not null,
  tenure_max_months           integer not null,

  interest_rate_min           numeric(5,2) not null,
  interest_rate_max           numeric(5,2) not null,
  processing_fee_type         fee_type not null,
  processing_fee_value        numeric(10,2) not null default 0,

  avg_disbursal_days          numeric(5,2) not null,
  approval_rate_by_band       jsonb not null,               -- { "750_plus": 85, ... }

  accepts_new_to_credit       boolean not null default false,
  accepts_self_employed_no_itr boolean not null default false,
  pin_code_blacklist          text[] not null default '{}',
  employer_blacklist          text[] not null default '{}',

  user_review_score           numeric(2,1) not null default 0,
  review_count                integer not null default 0,
  api_integration_status      api_integration_status not null default 'not_integrated',

  active                      boolean not null default true,
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

create index if not exists idx_lender_product_loan_type on public.lender_product (loan_type, active);
create index if not exists idx_lender_product_lender on public.lender_product (lender_id);

create trigger trg_lender_product_updated_at
  before update on public.lender_product
  for each row execute function set_updated_at();

-- ── RLS: readable by any authenticated user; writable only by admin ───────────
alter table public.lender enable row level security;
alter table public.lender_product enable row level security;

create policy "lender_select_all"
  on public.lender for select
  using (auth.uid() is not null);

create policy "lender_admin_write"
  on public.lender for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy "lender_product_select_all"
  on public.lender_product for select
  using (auth.uid() is not null);

create policy "lender_product_admin_write"
  on public.lender_product for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');
