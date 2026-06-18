-- ============================================================================
-- LeapMoney — Sprint 17: Admin Control Tower snapshots. Append-only point-in-time
-- capture of platform-wide metrics, revenue, and compliance posture (auditable
-- ops history). Phase 7/8. Demo writes mocked client-side.
-- ============================================================================

create table if not exists public.admin_snapshot (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users_profile (id) on delete cascade,
  metrics       jsonb not null default '{}',
  generated_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index if not exists idx_admin_snapshot_user on public.admin_snapshot (user_id, generated_at desc);

create table if not exists public.revenue_snapshot (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users_profile (id) on delete cascade,
  revenue         bigint not null default 0,
  disbursal_volume bigint not null default 0,
  conversion_rate integer not null default 0,
  monthly         jsonb not null default '[]',
  generated_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);
create index if not exists idx_revenue_snapshot_user on public.revenue_snapshot (user_id, generated_at desc);

create table if not exists public.compliance_snapshot (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.users_profile (id) on delete cascade,
  consents      jsonb not null default '{}',
  bureau_pulls  jsonb not null default '{}',
  audit_summary jsonb not null default '{}',
  generated_at  timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index if not exists idx_compliance_snapshot_user on public.compliance_snapshot (user_id, generated_at desc);

-- ── RLS: own rows; append-only (no UPDATE/DELETE) ─────────────────────────────
alter table public.admin_snapshot enable row level security;
alter table public.revenue_snapshot enable row level security;
alter table public.compliance_snapshot enable row level security;

create policy "admin_snapshot_select_own" on public.admin_snapshot for select using (user_id = public.current_profile_id());
create policy "admin_snapshot_insert_own" on public.admin_snapshot for insert with check (user_id = public.current_profile_id());

create policy "revenue_snapshot_select_own" on public.revenue_snapshot for select using (user_id = public.current_profile_id());
create policy "revenue_snapshot_insert_own" on public.revenue_snapshot for insert with check (user_id = public.current_profile_id());

create policy "compliance_snapshot_select_own" on public.compliance_snapshot for select using (user_id = public.current_profile_id());
create policy "compliance_snapshot_insert_own" on public.compliance_snapshot for insert with check (user_id = public.current_profile_id());
