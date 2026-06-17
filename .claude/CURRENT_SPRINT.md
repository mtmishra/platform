# Current Sprint: Sprint 7 — Credit Intelligence Foundation

**Sprint:** 7
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Bureau abstraction layer + credit data schema + LeapScore v2 engine (no live bureau integration; mock data only)

## Source of Truth
**R3 Credit Intelligence Report** (§1 Bureau Intelligence, §9 LeapScore Data Dictionary)
is the engineering source of truth for this sprint. Phase 7 (architecture, RLS,
data lifecycle §15, consent §16) and Phase 8 (consent governance §4) for compliance.
Note: R3's LeapScore weights (Bureau 55 / Cash Flow 25 / Behavior 15 / Health 5)
supersede the older 6-component model on the marketing `/leapscore` page — the page
will be reconciled to the engine in a later sprint.

## Sprint 7 Scope — Completed
- [x] Bureau abstraction layer: `BureauAdapter` interface + `BureauRegistry` (concurrent multi-bureau pull)
- [x] CIBIL / Experian / CRIF / Equifax adapters (mock; live adapters drop in with no engine change)
- [x] Equifax 1–999 → 300–900 normalization
- [x] Credit schema (0004): bureau_report, tradeline, inquiry, score_factor, leapscore_snapshot
- [x] Consent extensions: bureau, pull_type, expires_at, revoked_at, supersedes (append-only; withdrawal = new row)
- [x] RLS (0005): own-rows on all credit tables; child tables scoped via parent report; append-only bureau/score history
- [x] LeapScore Engine v2: Layer A Bureau 55% / B Cash Flow 25% / C Behavior 15% / D Health 5%
- [x] confidence_level, data_sources_used, thin-file path (alt-data-only + Score Unavailable)
- [x] Outputs: score, band, what's helping/hurting, next milestone, ranked improvement actions, credit cost indicator

## New package: `@leapmoney/credit`
```
packages/credit/src/
  types.ts                 # domain types (R3 §1, §9)
  normalize.ts             # Equifax normalization
  bands.ts                 # score bands + percentile (R3 Appendix E)
  mock.ts                  # demo AA/behavior/health inputs
  bureau/adapter.ts        # BureauAdapter interface + pull req/resp
  bureau/adapters.ts       # CIBIL/Experian/CRIF/Equifax (mock)
  bureau/mock-data.ts      # deterministic fixtures (PAN ending 0 = thin file)
  bureau/registry.ts       # multi-bureau abstraction layer
  leapscore/engine.ts      # computeLeapScore (R3 §9.1.2)
  leapscore/outputs.ts     # explainability outputs (R3 §9.1.3)
  index.ts
```

## Validation
- pnpm turbo type-check: 12/12 PASS (0 errors)
- pnpm turbo build: SUCCESS — all 6 apps

## NOT built (out of scope, per instructions)
Live bureau integration (mock only), LeapMatch, lender matching, Approval Odds engine.
These are Sprint 8 (LeapMatch) and Sprint 9 (Approval Engine) per R3.

## Compliance notes (Phase 8)
- Every `bureau_report` references a `user_consent` row (purpose-specific, recorded).
- Consent withdrawal is a NEW append-only row (granted=false, revoked_at set,
  supersedes the grant) — never an UPDATE.
- Hard-pull consent cannot be revoked after the pull (footprint exists) — disclose at gate.
- Equifax stored on native scale; no PII (PAN) persisted in credit tables.
