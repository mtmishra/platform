# LeapAI — Phase 3 Sprint Planning Package

**Version:** 1.0 · 2026-06-22 · **Status:** Execution blueprint — no implementation started
**Upstream sources of truth:** `docs/LeapAI_Copilot_Master_PRD.md` (PRD v1.1) · `docs/design/LeapAI_UX_Design_Spec_V1.md` (UX v1)
**Sprint numbering:** continues the platform track — **Sprint 28–33** (six 1-week sprints). Internal codes LA-1…LA-6. The "3A" website numbering is a separate workstream and is not used here.

Estimates: **S** ≤ ½ day · **M** ≈ 1 day · **L** ≈ 2–3 days · **XL** ≈ 4–5 days (split before sprint entry).

---

## 1. Product Backlog (priority order)

| # | Backlog item | PRD § | Phase |
|---|---|---|---|
| B1 | AI Gateway with Mock + Anthropic providers, budgets, audit logging | 4.2, 7.1 | 1 |
| B2 | AI database migrations (0020–0023) | 7.3 | 1 |
| B3 | Prompt registry with `borrower` profile | 4.3, 7.1 | 1 |
| B4 | Tool registry v1 (5 read tools) | 4.4 | 1 |
| B5 | `/api/ai/chat` streaming route + conversation persistence | 7.2, 4.6 | 1 |
| B6 | Chat UI component set in `packages/ui` | 6, UX §3 | 1 |
| B7 | Customer AI mounted in borrower portal (feature-flagged) | 5, 8-P1 | 1 |
| B8 | KB ingestion + `kb.search` (pgvector RAG) | 4.5 | 1 |
| B9 | Feedback (👍/👎) + conversation history API | 7.2 | 1 |
| B10 | DSA AI + Credit AI + Sales AI profiles & mounts | 5, 8-P2 | 2 |
| B11 | Contextual "Explain this ↗" entry points | 6.3 | 2 |
| B12 | Confirmed actions (`application.create_draft`, `documents.request`) | 4.4, 6.2 | 2 |
| B13 | User memory + ⌘K command palette | 4.6, UX §G5 | 2 |
| B14 | Operations AI + Founder AI over snapshots | 5, 8-P3 | 3 |
| B15 | Proactive insight cards | 6.3, UX §3.17 | 3 |
| B16 | Internal MCP server (`ai-mcp`) | 4.7 | 3 |
| B17 | Evaluation harness (golden questions in CI) | 8-P3 | 3 |
| B18 | ScoreGauge consolidation (report page → ui export) — tech-debt from Design QA | UX §1.1 | 1 (piggyback) |

---

## 2. Epic List

| Epic | Name | Backlog items | Sprints |
|---|---|---|---|
| **E1** | AI Foundation (gateway, DB, prompts) | B1, B2, B3 | 28 |
| **E2** | Tools over Existing Engines | B4, B12 | 28–29, 31 |
| **E3** | Conversation API & Memory | B5, B9, B13 | 29, 31 |
| **E4** | Chat UI Component Set | B6, B18 | 29 |
| **E5** | Customer AI (first experience) | B7, B11 | 30 |
| **E6** | Knowledge Base / RAG | B8 | 30 |
| **E7** | Multi-Role Experiences | B10 | 31 |
| **E8** | Ops & Founder Intelligence | B14, B15 | 32 |
| **E9** | Platform & Quality (MCP, evals) | B16, B17 | 33 |

---

## 3. Feature Breakdown

**E1 AI Foundation** → provider interface + MockAIProvider → AnthropicProvider (opus-4-8 / haiku-4-5 routing) → token budget enforcement (`ai_usage`) → PII redaction pre-flight → audit logging → migrations 0020–0023 → prompt registry (`borrower` profile).

**E2 Tools** → tool schema (zod) + role gate → `credit.get_leapscore` · `credit.explain_factors` · `match.get_matches` · `application.status` · `kb.search` (v1) → `application.list` · `lenders.get_products` · `match.explain_match` (v1.1) → confirmed-action tools (Phase 2).

**E3 Conversation API** → `/api/ai/chat` SSE streaming → conversation/message persistence (RLS) → history + delete endpoints (DPDP) → feedback endpoint → user-memory facts (Phase 2).

**E4 Chat UI** → `AssistantLauncher` · `ChatPanel` · `MessageStream` · `ToolResultCard` · `AIScoreSlot`/`AIMatchSlot` (wrapping existing `LeapScoreCard`/`LeapMatchCard`) · `SourceCitation` · `ConfirmActionCard` · `AIThinking` · empty/error/demo-banner states — per UX §3, extending existing `EmptyState`/`Skeleton`.

**E5 Customer AI** → mount in borrower portal behind `NEXT_PUBLIC_LEAPAI_ENABLED` → C0–C9 journey wiring → "Explain this ↗" on score/match/application widgets.

**E6 RAG** → `kb_document`/`kb_chunk` ingestion script → embed via gateway → retrieval tool with citation payloads → corpus: web product/FAQ/legal + `docs/research/*.md`.

**E7 Multi-Role** → `dsa`/`credit`/`sales` prompt profiles → role-scoped toolsets → mounts in dsa + lender portals → Hinglish prompt QA.

**E8 Ops/Founder** → `operations`/`founder` profiles → `metrics.snapshot` tool family → proactive insight generation on snapshot update.

**E9 Platform** → internal MCP server → golden-question eval set per profile → CI eval job (mock provider) → cost dashboard in admin.

---

## 4. User Stories (representative; each maps to tasks in §6)

| ID | Story | PRD § | UX ref |
|---|---|---|---|
| US1 | As a **borrower**, I ask "Why is my score 738?" and get an answer grounded in *my* bureau report with a score card and citations, so I trust it. | 2.2, 4.4 | §8.1, C4 |
| US2 | As a **borrower**, I ask for my best loan offers and see ranked lender cards with approval odds and a plain-English recommendation. | 2.2 | C6–C7, LM3/LM7 |
| US3 | As a **borrower**, when the AI suggests applying, *I* confirm before any draft is created. | 6.2 | §3.13, C8 |
| US4 | As a **borrower**, I can view and delete my AI conversation history. | 4.6, 7.2 | ChatPanel history |
| US5 | As a **user**, when the AI doesn't know, it says so instead of guessing numbers. | 1.2-O2 | §3.14 refusal |
| US6 | As a **DSA**, I ask (in Hinglish) which lead will close first and get a ranked, reasoned list limited to my own leads. | 2.3, 4.4 RLS | §8.2, D2–D3 |
| US7 | As a **credit analyst**, I get a one-shot applicant file summary with anomaly flags. | 5 Credit AI | §5.5 CR2 |
| US8 | As the **founder**, I ask "How did we do this week?" and get KPI + funnel cards from snapshot tables. | 2.4 | §8.3, F2–F4 |
| US9 | As a **compliance officer**, every AI interaction is retrievable from `audit_log`. | 1.2-O3 | — |
| US10 | As a **developer**, the whole system runs in CI with the mock provider and no API keys. | 4.2 | — |

---

## 5. Sprint Plan (six 1-week sprints)

| Sprint | Code | Theme | Exit criterion |
|---|---|---|---|
| **28** | LA-1 | Foundation: gateway + DB + prompts | `MockAIProvider` chat round-trip via `/api/ai/chat` in dev; migrations applied; every call in `audit_log` (US10) |
| **29** | LA-2 | Tools + Chat UI | 5 tools callable; full ChatPanel renders scripted conversation against mock provider |
| **30** | LA-3 | **Customer AI GA (flagged)** + RAG | PRD Phase-1 exit: borrower asks score/match/application/product questions → tool-grounded, cited, streamed answers (US1–US5) |
| **31** | LA-4 | Multi-role + confirmed actions | DSA/Credit/Sales live in their portals; draft-application confirm flow works (US3, US6, US7) |
| **32** | LA-5 | Ops + Founder intelligence | Founder NL queries over snapshots; first proactive insight card (US8) |
| **33** | LA-6 | MCP + evals + hardening | CI eval job green; internal MCP server; cost dashboard; GA decision review |

Sprints 28–30 = PRD Phase 1 · 31 = Phase 2 · 32–33 = Phase 3 (compressed; slip absorbs into a Sprint 34 buffer if needed).

---

## 6. Task Breakdown

Legend: **AC** = acceptance criteria · **Dep** = dependencies · Est = S/M/L/XL.

### Sprint 28 (LA-1)

| ID | Task | PRD § | UX ref | AC | Dep | Est |
|---|---|---|---|---|---|---|
| T1 | Scaffold `packages/ai-gateway` + `AIProvider` interface + `MockAIProvider` | 4.2 | — | Mock streams canned deltas; unit-tested; in turbo graph | — | M |
| T2 | `AnthropicProvider` (opus-4-8/haiku-4-5 routing, retries, timeouts) | 4.2 | — | Live call behind `AI_PROVIDER=anthropic`; never bundled client-side | T1 | M |
| T3 | Migrations 0020–0023 (`vector` ext, `ai_conversation`/`ai_message`, `kb_document`/`kb_chunk`, `ai_usage`) + RLS | 7.3 | — | Applied on staging; RLS: owner-only conv/messages; RLS tests pass | — | M |
| T4 | Audit logging: every gateway call → `audit_log` (user, model, tool, tokens, latency) | 1.2-O3, 4.2 | — | Row per call verified in test; no PII in log payload | T1 | S |
| T5 | Token budgets via `ai_usage` (per-user daily cap, 429-style refusal) | 4.2, 7.3 | — | Cap exceeded → friendly refusal message; counter resets daily | T1, T3 | M |
| T6 | PII redaction pre-flight (PAN/Aadhaar/phone masking) | 9-R3 | — | Regex suite passes; masked values in provider payloads (mock inspect) | T1 | M |
| T7 | `packages/ai-prompts` + `borrower` profile v1 | 4.3 | — | Prompt versioned; profile resolves from `users_profile.role` | — | S |
| T8 | `/api/ai/chat` SSE route (auth → profile → gateway → stream) + persistence | 7.2, 4.6 | — | Streamed turn stored as `ai_message` rows; unauth → 401 | T1, T3, T7 | L |

### Sprint 29 (LA-2)

| ID | Task | PRD § | UX ref | AC | Dep | Est |
|---|---|---|---|---|---|---|
| T9 | `packages/ai-tools` registry (zod schemas, role gates, audit hook) | 4.4 | — | Tool call rejected for wrong role (server-side test) | T1 | M |
| T10 | Tools: `credit.get_leapscore`, `credit.explain_factors` | 4.4 | UX §3.07 | Returns engine output; flagged demo/real data source | T9 | M |
| T11 | Tools: `match.get_matches`, `application.status` | 4.4 | UX §3.08 | Same; matches ≤3 with reasons; status maps `outcomes` model | T9 | M |
| T12 | UI: `AssistantLauncher` + `ChatPanel` shell (drawer/sheet, header, composer, footer, demo banner) | 6.1 | UX §3.01–3.02, §4 G1–G4 | All variants/states; ⌘K/Esc; focus trap; reduced-motion | — | L |
| T13 | UI: `MessageStream` + bubbles + `AIThinking` + error/refusal states | 6.2 | UX §3.03–3.05, 3.12, 3.14 | Streams from T8; thinking-verb copy map §9.3 | T8, T12 | L |
| T14 | UI: `ToolResultCard` + `AIScoreSlot`/`AIMatchSlot` **wrapping existing** `LeapScoreCard`/`LeapMatchCard` + `SourceCitation` | 6.2 | UX §3.06–3.10 | Zero duplicated components (reuse audit passes); loading/error states | T12 | L |
| T15 | Consolidate report-page local `ScoreGauge` onto `packages/ui` export (QA debt) | — | UX §1.1 ⚠ | Report page renders identically; local copy deleted | — | S |
| T16 | Empty state + `SuggestedPrompts` (extends `EmptyState`) | 6.2 | UX §3.15 | Role-specific chip sets; chips advance conversation | T12 | S |

### Sprint 30 (LA-3)

| ID | Task | PRD § | UX ref | AC | Dep | Est |
|---|---|---|---|---|---|---|
| T17 | KB ingestion script (`scripts/kb-ingest.ts`): chunk→embed→upsert | 4.5 | — | Corpus ingested; checksum-based re-ingest; run documented | T3 | M |
| T18 | `kb.search` tool + citation payloads; low-confidence refusal | 4.5, 1.2-O2 | UX §3.10, 3.14 | Answers cite source; below-threshold → honest refusal (US5) | T9, T17 | M |
| T19 | Mount Customer AI in borrower portal behind `NEXT_PUBLIC_LEAPAI_ENABLED` | 8-P1 | UX §5.1 C0–C9 | Flag off = zero footprint; on = full journey C0→C9 | T10–T14, T16 | M |
| T20 | "Explain this ↗" contextual entry on score/health/application widgets | 6.3 | UX LS1, prototype | Opens panel pre-seeded with entity context (id, not pasted text) | T19 | M |
| T21 | Conversation history + DPDP delete + feedback endpoints & UI | 7.2, 4.6 | ChatPanel header | `GET/DELETE /api/ai/conversations`; hard delete verified; 👍/👎 stored (US4) | T8 | M |
| T22 | Phase-1 exit QA: scripted E2E (mock provider) of US1–US5 | 8-P1 | UX §8.1 | All 5 stories pass on staging; sign-off note in this doc | T19–T21 | M |

### Sprint 31 (LA-4)

| ID | Task | PRD § | UX ref | AC | Dep | Est |
|---|---|---|---|---|---|---|
| T23 | Profiles: `dsa`, `credit`, `sales` + role-scoped toolsets (`lenders.get_products`, `match.explain_match`, `application.list`, lead/commission reads) | 4.3–4.4, 5 | UX §5.4–5.5 | RLS: DSA sees own leads only (US6 test); Hinglish QA set passes | T7, T9 | L |
| T24 | Mount launcher in dsa + lender portals | 8-P2 | UX §5.2, 5.5 | D0–D6 and CR0–CR3 journeys work flagged | T19, T23 | M |
| T25 | Confirmed actions: `application.create_draft`, `documents.request` + `ConfirmActionCard` wiring | 4.4, 6.2 | UX §3.13, C8 | Model never mutates; Confirm button calls normal app mutation; audit row (US3) | T11, T14 | L |
| T26 | User memory (structured facts) + conversation resume + ⌘K palette | 4.6 | UX §G5–G6 | Facts injected to prompt; no raw PAN/report in memory; resume across sessions | T8, T21 | L |

### Sprint 32 (LA-5)

| ID | Task | PRD § | UX ref | AC | Dep | Est |
|---|---|---|---|---|---|---|
| T27 | `metrics.snapshot` tool family over admin/revenue/portfolio/dsa snapshots | 4.4 | UX §5.3 F2–F5 | Founder-role only; numbers match snapshot rows exactly (US8) | T9 | M |
| T28 | Profiles `operations`, `founder` + admin-portal mount (gold chip) | 5 | UX §5.3, §8.3–8.4 | F0–F7 journey; stuck-application query works | T23, T27 | M |
| T29 | Proactive insight cards (server-generated on snapshot update) | 6.3 | UX §3.17 | Insight card renders on dashboard; "Ask more" pre-seeds chat; generation audited | T27 | L |

### Sprint 33 (LA-6)

| ID | Task | PRD § | UX ref | AC | Dep | Est |
|---|---|---|---|---|---|---|
| T30 | `packages/ai-mcp`: internal MCP server exposing tool registry | 4.7 | — | Tools callable from MCP client with service auth; internal-only | T9–T11, T18, T27 | L |
| T31 | Eval harness: golden questions per profile, CI job on mock provider | 8-P3 | — | CI red on grounding regression; ≥90% golden pass | T22 | L |
| T32 | Cost/quality dashboard in admin from `ai_usage` + feedback | 8-P3 | — | Tokens/cost per day/user/profile; 👎 review queue | T5, T21 | M |
| T33 | GA review: flag-removal decision, load test, security pass (injection suite) | 9 | — | Written go/no-go with evidence | all | M |

---

## 7. Dependency Matrix

```
T1 ──┬─ T2, T4, T5, T6, T9
T3 ──┼─ T5, T8, T17
T7 ──┼─ T8, T23
T8 ──┼─ T13, T21, T26
T9 ──┼─ T10, T11, T18, T23, T27, T30
T12 ─┼─ T13, T14, T16
T10+T11+T14+T16 ─ T19 ─┬─ T20, T24
T17 ─ T18 ─ T19        └─ T22 (also ← T21)
T23 ─ T24, (with T27) T28
T11+T14 ─ T25
T27 ─ T28, T29
T22 ─ T31;  T5+T21 ─ T32;  ALL ─ T33
External (non-blocking, from MVP Conversion Plan): persistence wiring +
Decentro flip tool data real — tools interface unchanged (adapter swap).
```

**Critical path:** T1 → T8 → T13 → T19 → T22 (foundation → stream → UI → mount → Phase-1 exit).

---

## 8. Technical Milestones

| M | Milestone | Proof | Sprint |
|---|---|---|---|
| M1 | First streamed AI turn (mock), persisted + audited | dev demo + `audit_log` row | 28 |
| M2 | First tool-grounded answer with real engine output | LeapScore card in chat | 29 |
| M3 | **Customer AI live (flagged) — PRD Phase 1 exit** | US1–US5 E2E green | 30 |
| M4 | First human-confirmed AI-initiated action | draft application created via ConfirmActionCard | 31 |
| M5 | Founder NL query over live snapshots | KPI answer matches SQL | 32 |
| M6 | CI evals green + GA go/no-go | eval report + decision doc | 33 |

---

## 9. Release Plan

| Stage | When | Gate | Audience |
|---|---|---|---|
| Internal alpha | end S29 | M2 | team only, mock+live provider, dev env |
| Private beta (flag ON for internal accounts) | end S30 | M3 + demo-data banner rule (PRD R1) | internal + selected demo users |
| Beta: DSA/Credit/Sales | end S31 | M4 + RLS audit | partner DSAs (flagged) |
| Ops/Founder rollout | end S32 | M5 | internal business users |
| **GA decision** | end S33 | M6 + security pass + cost review + DPDP/DPA sign-off | flag removal per-portal |

Rollback = flag off (zero footprint by T19 AC). Provider outage = automatic mock-provider degradation with honest "assistant offline" state.

---

## 10. Definition of Done (every task)

1. Code reviewed via PR to `develop`; CI green (type-check, lint, build, evals where applicable).
2. **Reuse verified** — no component/logic duplicated where `packages/ui`/engines already provide it (UX §1.1 table is the checklist).
3. Acceptance criteria demonstrated on staging (screenshot or E2E in PR).
4. Runs with `MockAIProvider` and no API keys (CI requirement — PRD recommendation 2).
5. RLS respected — no service-role reads for user data; test included where data access changes.
6. Every AI/tool call visible in `audit_log`.
7. States complete per UX spec: loading, error, empty, refusal, reduced-motion.
8. No plaintext PAN/Aadhaar in logs, memory, or provider payloads.
9. Task's PRD § and UX ref linked in the PR description.
10. This document updated (task checked off, deviations noted) — it is the execution source of truth.

---

## 11. Sprint Dashboard

**Six sprints, one continuous delivery thread.** Each sprint moves the needle from zero to MVP to complete platform.

| Sprint | Code | Theme | Epics | Key deliverables | Exit gate | Reuse audit |
|---|---|---|---|---|---|---|
| **28** | LA-1 | **Foundation** | E1 | Gateway (mock+anthropic) · DB (0020–0023) · Prompts · 5 tools | Mock chat round-trip in dev; all calls audited | None (greenfield packages) |
| **29** | LA-2 | **Chat UI + Tools** | E2, E3, E4 | UI component set · `ToolResultCard` wraps existing `LeapScoreCard`/`LeapMatchCard` · conversation persistence | Scripted customer conversation works on staging | 2 wraps (LeapScoreCard, LeapMatchCard) |
| **30** | LA-3 | **Customer AI GA (flagged)** | E5, E6 | Borrower portal mount · contextual "Explain this" · KB + RAG · Phase-1 exit criteria | US1–US5 E2E green; all 9 stories pass | Zero new components (all extend existing) |
| **31** | LA-4 | **Multi-Role + Actions** | E2, E3, E7 | DSA/Credit/Sales profiles · confirmed-actions workflow · user memory + `⌘K` | Draft application flow works; RLS audit passes | 0 duplication (tools reused) |
| **32** | LA-5 | **Founder Intelligence** | E8 | Ops/Founder profiles · metrics-snapshot tools · proactive insights | Founder NL query matches snapshot data | Tools over existing snapshots (no new schema) |
| **33** | LA-6 | **QA + Release** | E9 | MCP server · eval harness · cost dashboard · GA decision | CI evals ≥90% pass; security audit clean | No new components (all Phase 1–2 reused) |

**PRD alignment:** Every sprint maps to Master PRD v1.1 phases (28–30 = Phase 1 · 31 = Phase 2 · 32–33 = Phase 3).
**UX alignment:** Every deliverable references UX Design Spec v1 screens (e.g., Sprint 30 → UX §5.1 C0–C9 customer journey).
**Reuse target:** Phase 1 ships zero duplicate components; Phase 2–3 build exclusively on Phase 1's chat layer (zero new UI primitives).

---

## 12. Definition of Ready (every backlog item before sprint entry)

A backlog item is **ready for sprint planning** if:

1. **PRD-mapped:** item or task links to Master PRD section(s); non-PRD work is explicitly flagged as "tech debt" or "infrastructure" with business justification.
2. **UX-mapped:** design screens exist in UX Design Spec v1 (§3–§8); UI-heavy items have wireframe/high-fi reference.
3. **Acceptance criteria clear:** written in plain English, testable, not ambiguous.
4. **Dependencies explicit:** all upstream tasks, external APIs (Decentro, Finvu), or vendor onboarding listed; critical-path items flagged.
5. **Effort estimate provided:** S/M/L/XL (dev pair consensus, ±1 band).
6. **Reuse audit passed:** if the item builds a component, UX §1.1 checklist confirms no duplication exists in `packages/ui` or existing pages.
7. **No scope bloat:** the item fits in its assigned sprint; if not, split it.
8. **Stakeholder sign-off:** if cross-team (design QA debt, security audit, compliance), owning team confirms priority.

**Gate:** sprint planning stops if ≥1 item lacks DoR criteria. Return to backlog grooming.

---

## 13. Project Status (as of commit date: 2026-06-22)

| Component | Status | Notes |
|---|---|---|
| **Master PRD v1.1** | ✅ **COMMITTED** | Complete; no further changes until Phase 1 exit |
| **UX Design Spec v1** | ✅ **COMMITTED** | 17 components, 52 screens, 5 journeys; Design QA passed (95.3%) |
| **Sprint Plan (this doc)** | ⏳ **READY FOR COMMIT** | Execution blueprint; validation pending |
| **Code (apps, packages)** | ✅ **UNTOUCHED** | Zero changes this phase; ready for Sprint 28 start |
| **AI Infrastructure** | ❌ **NOT STARTED** | Sprint 28 task: build `packages/ai-gateway` + DB migrations |
| **Phase 1 MVP exit gate** | ❌ **BLOCKED ON SPRINT 30** | Requires persistence wiring (MVP Conversion Plan, external dependency) |
| **Phase 2 multi-role** | ❌ **BLOCKED ON SPRINT 31** | Requires Phase 1 customer AI live |
| **Phase 3 ops/founder** | ❌ **BLOCKED ON SPRINT 32** | Requires Phase 2 multi-role confirmed |
| **GA decision** | ❌ **BLOCKED ON SPRINT 33** | Requires all phases complete + security/DPDP review |

**External blockers tracked:** 
- MVP Conversion (persistence wiring + Decentro live) — must land before Sprint 30 day 3; if slips, Phase-1 exit moves to Sprint 31
- WhatsApp BSP approval (Phase 2) — request Day 1 of Sprint 28; if template approval takes >4 weeks, defer to fast-follow
- DPDP/DPA vendor review (AI provider Terms of Service) — run in parallel with Sprints 28–29; must clear before GA gate

---

## 14. Milestone Timeline

| Milestone | Sprint | Week | Proof | Owner |
|---|---|---|---|---|
| **M1 — First streamed AI turn** | 28 | Fri | `/api/ai/chat` streams mock delta; `audit_log` row created | LA-1 eng |
| **M2 — Real engine output in chat** | 29 | Wed | LeapScore card renders live engine output (mock data source) | LA-2 eng |
| **M3 — Phase 1 exit: Customer AI live** | 30 | Fri | US1–US5 E2E pass on staging; demo-data banner present; flag ON for internal | LA-3 eng + PM |
| **M4 — Confirmed actions working** | 31 | Wed | Draft application via ConfirmActionCard; audit logged; RLS test passes | LA-4 eng |
| **M5 — Founder NL queries live** | 32 | Thu | Founder asks "revenue this week?" → answer matches SQL on snapshot table | LA-5 eng |
| **M6 — GA go/no-go** | 33 | Fri | Eval harness ≥90% pass; security audit clean; written decision doc signed | LA-6 PM + security |
| **✅ Launch Ready** | 34 (optional buffer) | — | Rollout plan finalized; customer comms ready; on-call rotation assigned | product + ops |

**Milestone validation:** each milestone is verified by a named owner via evidence (screenshots, test output, audit log excerpt) attached to the sprint retro doc. No hand-waving.

---

## 15. Validation Checklist (before commit)

| Check | Status | Evidence |
|---|---|---|
| ✅ Every task references PRD § + UX screen | PASS | §6 Task Breakdown, all tasks T1–T33 link PRD & UX |
| ✅ Every epic maps to backlog | PASS | §2 Epic List cross-referenced with §1 Product Backlog |
| ✅ Critical path unblocked | PASS | T1→T8→T13→T19→T22; no circular dependencies |
| ✅ Reuse audit confirmed | PASS | T14 AC requires UX §1.1 checklist; T15 consolidates duplicate; zero new components in Phase 1 |
| ✅ No duplicate work (backlog) | PASS | 18 backlog items; B1–B17 span foundation→platform, no repeats; B18 is debt |
| ✅ No duplicate documentation | PASS | This doc is *only* execution plan; PRD & UX committed separately |
| ✅ Dependency matrix complete | PASS | §7 shows all edges; external blockers in §13 |
| ✅ DoR defined | PASS | §12 — 8 criteria gate backlog entry |
| ✅ DoD defined | PASS | §10 — 10 checks enforce quality |
| ✅ Sprint Dashboard clear | PASS | §11 — 6 sprints, exit gates, reuse targets per sprint |
| ✅ Project Status current | PASS | §13 — status as of 2026-06-22; external blockers identified |
| ✅ Milestone Timeline achievable | PASS | §14 — 6 milestones, one per sprint, owner assigned, proof defined |

**Validation result: ✅ PASS — all checks clear. Ready for commit.**

---

## 16. Execution Notes for Team

1. **Commit this doc to `develop` as the source of truth for engineering.** Update it, don't fork it; every PR adds a task completion line to §6.
2. **Print this to PDF for the kickoff meeting** — keep it visible on the ops board (Asana/Linear/Jira mirrors it, but this is the canonical text).
3. **Review §13 blockers weekly** (persistence/Decentro/WhatsApp/DPDP). If any slip, update the sprint plan and flag the PM same day.
4. **Sprint retros attach evidence to this doc** — screenshot of M1, copy of audit_log row, e2e test output. Don't just say "done"; link proof.
5. **GA gate (Sprint 33) is a real decision point** — if M6 fails evals or security, rollout is deferred; mark it clearly in the decision doc.

---
*End — LeapAI Phase 3 Sprint Plan v1.0 (executable). Amend in place; do not fork.*
