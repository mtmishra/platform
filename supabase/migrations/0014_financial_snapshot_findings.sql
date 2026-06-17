-- ============================================================================
-- LeapMoney — Sprint 13.5 (expanded): persist the analysis inputs alongside the
-- savings on financial_snapshot. findings + opportunities stored as jsonb so the
-- full Financial Analysis report can be reconstructed (audit-compliant, append-only).
-- ============================================================================

alter table public.financial_snapshot
  add column if not exists findings      jsonb not null default '[]',
  add column if not exists opportunities jsonb not null default '[]';
