# LeapAI — UX & Figma Design Specification V1

**Phase 2 deliverable · 2026-06-22 · Status: Ready for Figma execution**
**Source of truth upstream:** `docs/LeapAI_Copilot_Master_PRD.md` (v1.1)
**Design system source:** `packages/config/tailwind/index.ts` + `packages/ui` (V3)

> **Purpose.** This document converts the Master PRD into a complete, Figma-ready UX specification. Every screen maps to a PRD section (cited inline). A designer can execute this 1:1 in Figma; a developer can build from it without guessing. The interactive HTML prototype accompanying this spec demonstrates the core chat experience with real tokens.
>
> **Figma status.** The existing Figma file (`LeapMoney-Web`, node 1514-94) could not be programmatically reviewed in this session (connector unauthorized). The design system below is extracted from the **implemented code**, which is the higher-priority source of truth per project rules. When Figma access is available, reconcile: any Figma component that already matches a code component listed in §2 must be reused, not redrawn.

---

## 1. Review Summary — What Exists & What We Reuse

### 1.1 Existing components to REUSE (do not redraw — from `packages/ui` + apps)

| Component | Location | Reused in LeapAI as |
|---|---|---|
| `Button`, `Card`, `Heading`, `Paragraph`, `Label`, `Input` | `packages/ui` | All chat chrome |
| `TrustBar` (RBI/DPDP badges) | `packages/ui` | ChatPanel footer disclaimer row |
| `ApprovalOddsNumber`, `ConfidenceBadge`, `BestMatchBadge`, `MatchStrengthChart` | `packages/ui` | **LeapMatch Card** tool result |
| `ScoreGauge` (SVG arc, −210° start, 240° sweep) | borrower `credit-report/report` | **LeapScore Card** tool result |
| `PaymentCalendar` (36-month DPD grid) | borrower report page | Credit AI file summary |
| `StatusBadge`, `ApplicationTimeline` | borrower `ApplicationWidgets` | Application tracking tool result |
| `NotificationCenter` (bottom-right pattern) | borrower dashboard | Placement precedent for AI Launcher |
| `Sidebar`, `FlowSteps` | borrower layout | Untouched; ChatPanel overlays, never replaces |
| **`LeapScoreCard`, `LeapMatchCard`** (already exported!) | `packages/ui` | Rendered **as-is inside** `ToolResultCard` — do NOT redraw; chat only wraps them |
| `EmptyState`, `Skeleton`, `CardSkeleton`, `ScoreSkeleton`, `LoadingState` | `packages/ui` | Chat empty state (3.15) and loading states (3.11) **extend these**, not new builds |
| `ScoreGauge` / `LeapScoreGauge`, `ApprovalGauge` | `packages/ui` (canonical export) | Gauge inside score tool card. ⚠ Note: borrower report page has a **local duplicate** ScoreGauge — engineering should consolidate on the ui export (tech-debt ticket, not a design task) |

### 1.2 What is NEW (LeapAI Design System, §3)

Only conversational surfaces are new. No existing screen is redesigned; LeapAI **overlays** the current UI (PRD §6).

---

## 2. Design Tokens (extracted from code — the real values)

Designers: create these as Figma Variables, names identical to code tokens.

### 2.1 Color — base palette

| Token | Hex | Use |
|---|---|---|
| `navy-deep` | `#0B1220` | Dark surfaces, founder/admin chrome |
| `blue-primary` | `#2563EB` | Primary actions, LeapAI brand accent |
| `teal-accent` | `#14B8A6` | **LeapAI signature accent** (AI-specific highlights, thinking shimmer) |
| `dark-surface` | `#1E293B` | Dark cards |
| `gray-50-lm` → `gray-700-lm` | `#F8FAFC · #E2E8F0 · #94A3B8 · #334155` | Neutrals |
| `green-600-lm` | `#16A34A` | Success / positive factors |
| `amber-600-lm` | `#D97706` | Warning / medium risk |
| `red-600-lm` | `#DC2626` | Danger / negative factors |
| `gold` | `#D4AF37` | Premium (Founder AI badge) |

### 2.2 Color — semantic (components bind ONLY to these)

`background.page/card/feature` · `foreground.primary/secondary/tertiary/on-dark` · `interactive.primary/hover` · `border-token.default` · `status.success/warning/danger/info` · `premium`

**LeapAI rule:** AI-authored content is visually marked with `teal-accent` (avatar ring, streaming caret, tool-card left border). Human/system content never uses teal. This is the single visual signature separating AI from app.

### 2.3 Typography (Inter / JetBrains Mono)

| Style | Size/LH | LeapAI use |
|---|---|---|
| `display-large` | 36/1.2 | — (not used in chat) |
| `h2` | 20/1.4 | ChatPanel title |
| `h3` | 16/1.5 | Tool-card titles |
| `body-lg` | 16/1.6 | AI message body (desktop) |
| `body-md` | 14/1.5 | User messages, mobile AI body |
| `body-sm` | 12/1.5 | Citations, timestamps, disclaimers |
| `label-caps` | 11/1.2/+6% | Tool-card eyebrows ("LEAPSCORE™", "TOOL RESULT") |
| `data-mono` | 14/1.4 JetBrains | All numbers inside tool cards (scores, ₹, %) |

### 2.4 Radius · Shadow · Motion

- Radius: `sm 4 · md 8 · lg 12 · xl 16 · 2xl 24 · full`. Chat bubbles `lg`; panels `xl`; launcher `full`.
- Shadows: `1`–`4`. Launcher `3`; open panel `4`.
- Durations: `instant 50 · fast 100 · normal 200 · slow 300 · xslow 500 · reveal 1200 ms`.
- Easing: `standard`, `enter`, `exit`, `spring (0.34,1.56,0.64,1)` — launcher open uses `spring`.

---

## 3. LeapAI Design System — Component Library (Figma page: "LeapAI / Components")

Each component: anatomy → variants → states → token bindings. Build as Figma components with auto-layout; names below are canonical for code parity (PRD §7.1 `packages/ui` additions).

### 3.01 `AILauncher` (floating button)
- 56×56 `full` circle, `interactive.primary` bg, LeapAI spark glyph `on-dark`, shadow `3`. Bottom-right, 24px inset (matches `NotificationCenter` precedent), z-index above content, below modals.
- Variants: `default` · `unread` (teal 8px dot, top-right) · `thinking` (teal ring pulse, 1200ms `reveal` loop) · `hidden` (when panel open, desktop).
- Hover: scale 1.06, `spring`, shadow `4`. Tooltip "Ask LeapAI · ⌘K".
- Mobile: 48×48, respects safe-area inset.

### 3.02 `ChatPanel`
- **Desktop:** right drawer, 420px wide (min 380 / max 480), full height, `background.card`, left border `border-token.default`, shadow `4`. Slides in 300ms `enter`. Page content NOT reflowed (overlay).
- **Mobile:** full-screen sheet, slides up 300ms; drag-handle 32×4 `gray-200-lm`.
- Anatomy: Header (40px avatar-mark + "LeapAI" `h2` + experience chip `label-caps` [CUSTOMER AI / DSA AI / FOUNDER AI…] + history icon + minimize + close) → MessageList (scroll, 16px gutter) → Composer → FooterBar (`body-sm` `foreground.tertiary`: "LeapAI can make mistakes. Not financial advice." + `TrustBar` condensed).
- States: `default` · `empty` (→ 3.15) · `loading-history` (3 skeleton bubbles) · `error-banner` (→ 3.13) · `demo-data` (amber banner "Demo data — sample figures", per PRD Risk R1).

### 3.03 `MessageBubble` — base
Max-width 85% (desktop) / 92% (mobile). Padding 12×14. Radius `lg` with 4px "tail corner" toward the author side. Timestamp `body-sm` `tertiary` on hover (desktop) / long-press (mobile).

### 3.04 `UserMessage`
`interactive.primary` bg, `on-dark` text `body-md`, right-aligned, tail bottom-right. States: `sending` (60% opacity) · `failed` (red left border + "Retry" ghost link).

### 3.05 `AIMessage`
`background.page` bg, `foreground.primary` `body-lg`, left-aligned; 24px LeapAI avatar with **teal ring** at first bubble of a group. Supports inline markdown (bold, lists, links `blue-primary`). Streaming state: teal caret ▍blinks 500ms. Footer row (on last bubble of turn): 👍 👎 copy — 16px icons `tertiary`, hover `primary`.

### 3.06 `ToolResultCard` — generic frame
The AI's "receipt of truth" (PRD §4.4, §6.2). `background.card`, radius `lg`, border `border-token.default`, **3px left border `teal-accent`**, shadow `1`.
Header: tool icon 16px + `label-caps` eyebrow (e.g. "LEAPSCORE™ · LIVE DATA") + timestamp `body-sm`.
Body: slot (specialized cards below). Footer: optional "Open in app →" deep-link `body-sm` `blue-primary`.
States: `loading` (skeleton, 1200ms shimmer teal-tinted) · `success` · `error` ("Couldn't fetch — Retry").

### 3.07 Score tool slot — `AIScoreSlot` (wraps EXISTING `LeapScoreCard`)
⚠ **QA correction:** `LeapScoreCard` already exists in `packages/ui` — the chat does NOT introduce a new one. This slot renders the existing card (compact prop) inside the 3.06 frame, adding only: delta pill ("↑ +12 pts" `green-600-lm` tint) + "4 bureaus · updated {date}" `body-sm` + tap-to-expand 4-bureau mini-table (CIBIL/Experian/CRIF/Equifax `data-mono`). Gauge = the canonical `ScoreGauge` export from `packages/ui` at 96px.

### 3.08 Match tool slot — `AIMatchSlot` (wraps EXISTING `LeapMatchCard`)
⚠ **QA correction:** `LeapMatchCard` already exists in `packages/ui` (composes `BestMatchBadge`, `ApprovalOddsNumber`, `MatchStrengthChart`, `ConfidenceBadge`) — reuse as-is. The chat wrapper adds only a CTA row: "Why this bank?" ghost + "Apply →" primary (→ ConfirmActionCard). Stack ≤3 in chat; "View all N matches →" deep-link.

### 3.09 `RecommendationCard` (slot)
AI's synthesized advice (distinct from raw tool data): teal-tint bg (`teal-accent` @ 8%), lightbulb icon, title `h3`, 1–3 bullet actions each with impact chip ("+5 pts" / "Save ₹12,252" `data-mono`). Footer: "Based on:" + citation chips (3.10). Never shows numbers without a source chip.

### 3.10 `CitationCard` / chip
Inline chip: 12px doc icon + source title `body-sm`, `background.page`, radius `full`, border. Hover/tap → popover: source excerpt (3 lines) + "Open source →". Sources: KB doc, bureau report, snapshot table (PRD §4.5 — answers must cite).

### 3.11 Loading states — **extend existing `Skeleton`/`CardSkeleton`/`LoadingState`** (`packages/ui`)
- `MessageSkeleton`: 3 bars 60/90/40% width — built from existing `SkeletonBlock`.
- `ToolCardSkeleton`: existing `CardSkeleton` + teal-tinted shimmer variant.
- Rule: skeletons within 100ms of send; never a blank panel.

### 3.12 `AIThinking` animation
Three 6px dots, `teal-accent`, staggered bounce (400ms, `standard`), label "LeapAI is thinking…" `body-sm` `tertiary`. When a tool runs, label swaps to verb + tool: "Checking your LeapScore…", "Running LeapMatch…" (maps to PRD tool names; copy table in §9.3). Reduced-motion: static dots + text only.

### 3.13 `ConfirmActionCard` (PRD §6.2 — human executes, never the model)
`status.warning` 3px left border. Title "Confirm action" `h3` + plain-English summary ("Create a draft application to HDFC Bank for ₹10,00,000 / 60 mo") + exact-effect bullet list + buttons: `Confirm` (primary) / `Cancel` (ghost). Post-confirm → success state with deep-link. Keyboard: Enter=Confirm, Esc=Cancel. **The Confirm button triggers the normal app mutation path.**

### 3.14 Error states
- Message-level: AI bubble, `status.danger` icon, "I couldn't complete that — {reason}. Try again?" + Retry.
- Tool-level: inside ToolResultCard (3.06 error).
- Panel-level: banner "Connection lost — reconnecting…" `status.warning`.
- Refusal (PRD O2): normal AIMessage, honest copy: "I don't have that in my knowledge base, and I won't guess about financial figures." + suggested rephrase chips.

### 3.15 Empty state / `SuggestedPrompts` — **extends existing `EmptyState`** (`packages/ui`)
Existing `EmptyState` variant: LeapAI mark 48px + "Hi {name} — I'm LeapAI" `h2` + one-line role subtitle + 3–4 prompt chips (`background.page`, radius `full`, border; hover teal border). Prompts are role-specific (per-experience sets in §6–§8). Chips also appear contextually after AI turns (max 3, horizontally scrollable on mobile).

### 3.16 `VoiceInputButton` (future-ready)
Mic icon 20px in composer, `tertiary`, disabled state in V1 with tooltip "Voice — coming soon". Reserve 40×40 slot so layout doesn't shift at enablement. Active spec (future): teal pulse ring + waveform bar.
**PRD note:** voice input is NOT in Master PRD v1.1 — carried here as a design-only reserved slot per Phase-2 brief. Add to PRD backlog at v1.2; no engineering until then.

### 3.17 `ProactiveInsightCard` (Phase 3 — PRD §6.3)
Dashboard-resident AI insight (server-generated on snapshot updates): existing `DashboardCard` frame + teal 3px left border + insight text + impact chip + "Ask more →" (opens ChatPanel pre-seeded). Wireframe-only in V1 Figma; no build until PRD Phase 3.

### 3.18 Composer
Textarea auto-grow 1→6 lines, `body-md`, placeholder "Ask LeapAI…", radius `lg`, border focus → `interactive.primary`. Right: Voice slot (3.16) + Send (paper-plane, primary when text present, `tertiary` disabled otherwise). Enter=send, Shift+Enter=newline. Char guard at 2,000.

---

## 4. Global AI Experience (Figma page: "LeapAI / Global")

Frames to produce (each × light theme; dark theme Phase 2 of design work):

| Frame | Spec |
|---|---|
| G1 Floating button — all 4 variants | on borrower dashboard screenshot underlay |
| G2 Desktop panel OPEN | 1440×900; panel 420px overlaying dashboard; page interactive behind |
| G3 Desktop MINIMIZED | pill 200×48 bottom-right: avatar + last-message preview (1 line) + unread dot; click restores |
| G4 Mobile full-screen | 390×844; sheet covers app; back-swipe/handle closes |
| G5 Expanded (desktop max) | 480px panel; optional ⌘K "command mode" overlay — Phase 2, wireframe only |
| G6 Keyboard map | ⌘K/Ctrl+K open · Esc close · Enter send · ↑ edit last |

Placement invariants: never covers primary page CTA; launcher hides while panel open (desktop); one panel instance across route changes (conversation persists per PRD §4.6 memory).

---

## 5. Experience Flows (Figma page per experience; one frame per step)

### 5.1 Customer Experience (PRD §2.2) — 10 frames
```
C0 Home (existing dashboard, launcher visible)
C1 Ask LeapAI      empty state + customer prompt chips
C2 Loan Requirement AI elicits amount/tenure/purpose — chips for quick answers
C3 Credit Analysis  AIThinking "Fetching your bureau report…" → consent check
                    (if no consent: ConfirmActionCard → routes to existing
                    /credit-report/consent — reuse FlowSteps screen, no new UI)
C4 LeapScore        LeapScoreCard result + factor summary
C5 LeapMatch        AIThinking "Running LeapMatch…"
C6 Recommended Banks 3× LeapMatchCard stack
C7 Compare Offers   comparison ToolResultCard: 3-column table
                    Rate/EMI/Fees/APR (data-mono) + RecommendationCard verdict
C8 Apply            ConfirmActionCard → deep-link to existing 7-step wizard
                    (?lender=&score= param — flow already implemented)
C9 Track            ApplicationTimeline inside ToolResultCard + proactive
                    status copy
```
Cross-sell (PRD journey final step): Phase 3 — wireframe C10 only, RecommendationCard variant, gated on real product lines.

### 5.2 DSA Experience (PRD §2.3) — 7 frames
```
D0 DSA dashboard → D1 Ask LeapAI (DSA chips: "Which leads close this week?")
→ D2 Lead Insights (tool card: lead-list table, RLS = own leads only)
→ D3 Priority Leads (ranked, reason per lead) → D4 Best Bank (LeapMatchCard
for selected lead) → D5 Commission Prediction (data-mono ₹ + "estimate"
label + basis citation) → D6 Application Tracking (multi-application status
table)
```

### 5.3 Founder Experience (PRD §2.4) — 8 frames
```
F0 Admin dashboard (Founder AI gold chip) → F1 Ask LeapAI → F2 Business
Overview (KPI tool card: revenue/apps/disbursals, data-mono) → F3 Revenue
(trend mini-chart card) → F4 Conversion (funnel card) → F5 Sales/Team
Performance (DSA table) → F6 Forecast (projection + confidence note,
Phase 3 flag) → F7 Recommendations (RecommendationCard, always
human-decided)
```

### 5.4 Sales AI (PRD §5, Phase 2) — 4 frames *(added at Design QA)*
```
S0 Web lead context → S1 Ask LeapAI (qualify inbound lead: amount/employment
chips) → S2 Qualification result (eligibility card + odds) → S3 Draft
follow-up (WhatsApp/email copy card, marked "draft — review before sending",
citation to KB)
```

### 5.5 Credit AI (PRD §5, Phase 2) — 4 frames *(added at Design QA)*
```
CR0 Lender portal application view → CR1 Ask LeapAI ("Summarize this file")
→ CR2 File summary card (reuses PaymentCalendar + factor list; anomaly
flags in status.warning) → CR3 Policy-fit explanation (criteria checklist
vs lender policy, each row cited to bureau_report fields)
```

## 6. LeapScore Experience (Figma page: "LeapAI / LeapScore")

Screens (extend existing report page patterns — do NOT redesign the existing `/credit-report/report` page; these specify its AI-connected states + the chat cards):

| Screen | Content |
|---|---|
| LS1 Credit Summary | existing report header + "Explain this ↗" affordance (16px teal spark icon, top-right of score card — the §6.3 PRD contextual entry) |
| LS2 Score Gauge | existing ScoreGauge; states: no-history (null), low/fair/good/excellent |
| LS3 Score Factors | factor list; each row: name + weight bar + impact chip |
| LS4 Positive Factors | green-tint ToolResultCard list |
| LS5 Negative Factors | red-tint list + severity |
| LS6 Improvement Tips | RecommendationCard stack, each tip with pts-impact + timeframe |
| LS7 History | existing `/credit-report` history page + trend sparkline card (chat variant) |
| LS8 Download Report | existing Download action; chat variant = ToolResultCard with file chip |

## 7. LeapMatch Experience (Figma page: "LeapAI / LeapMatch")

| Screen | Content |
|---|---|
| LM1 Eligibility | check result: eligible/needs-work; criteria checklist ✓/✗ |
| LM2 Approval Probability | ApprovalOddsNumber large + ConfidenceBadge + basis line |
| LM3 Recommended Banks | LeapMatchCard stack (=C6) |
| LM4 Interest Comparison | comparison table card, best value highlighted teal |
| LM5 Processing Fees | fee breakdown card, ₹ data-mono, APR-impact note |
| LM6 Monthly EMI | EMI card + tenure slider (reuse calculator pattern from web app) |
| LM7 AI Recommendation | RecommendationCard verdict + trade-off sentence |
| LM8 Why this Bank? | explanation card: 3 reasons, each citing a data point (score fit / FOIR headroom / employer category — real fields from `match_reason`) |

---

## 8. Conversation Design (Figma page: "LeapAI / Conversations" — one tall frame each)

Scripts demonstrate: reasoning → tool call → result card → follow-up → action. (Abbreviated here; full copy in prototype.)

**8.1 Customer**
> U: "Why is my score only 738? I never missed a payment."
> AI [thinking: "Checking your bureau report…"] → LeapScoreCard(738, CIBIL)
> AI: "You're right that payments are perfect — 36/36 on time. Two things hold you back:" → factors card: Utilisation 41% (−impact), Credit age 2.1y (−impact) + citations
> chips: [How do I fix utilisation?] [When will it improve?]
> U: taps first → RecommendationCard: "Pay card before statement date… +9–14 pts in 2 cycles"

**8.2 DSA**
> U: "kaunsa lead sabse pehle close hoga?" *(Hinglish supported)*
> AI → lead-ranking tool card (3 leads, odds, reason) → "Rahul S. — 92% at Bajaj; Experian 746 fits their band. Want me to prepare the application draft?" → ConfirmActionCard

**8.3 Founder**
> U: "How did we do this week?"
> AI → KPI card (revenue ₹, 14 applications, 3 disbursals) + funnel card → "Conversion dipped 4% at document-upload — 6 applications stalled there. Recommend: WhatsApp reminder automation (Ops backlog #4)." + citation: application_snapshot

**8.4 Operations**
> U: "Which applications are stuck?"
> AI → stuck-list card (>48h in stage) → "3 waiting on KYC >3 days. Draft reminder to these borrowers?" → ConfirmActionCard (batch, shows recipient list)

**8.5 Support**
> U: "Customer asking why HDFC rejected them."
> AI: refusal-then-help pattern — "I can't see HDFC's internal decision. What I can show: the applicant's fit vs HDFC's published band at application time." → eligibility card + suggested customer-facing explanation (marked "draft — review before sending")

---

## 9. Responsive, Interaction & Motion Specs

### 9.1 Breakpoints
| | Mobile <768 | Tablet 768–1279 | Desktop ≥1280 |
|---|---|---|---|
| Surface | Full-screen sheet | 380px drawer | 420px drawer (max 480) |
| AI body type | body-md | body-lg | body-lg |
| Tool cards | full-width, stat rows wrap 2×2 | full-width | full-width in panel |
| Launcher | 48px, safe-area | 56px | 56px |
| Suggested prompts | horizontal scroll | wrap | wrap |

### 9.2 Motion (token-bound)
Panel open 300ms `enter` / close 200ms `exit` · launcher hover `spring` · message entry: 8px rise + fade 200ms · stream caret 500ms blink · skeleton shimmer 1200ms `reveal` · thinking dots 400ms stagger. `prefers-reduced-motion`: all replaced by opacity fades ≤100ms.

### 9.3 Thinking-verb copy map (tool → label)
`credit.get_report`→"Fetching your bureau report…" · `credit.get_leapscore`→"Checking your LeapScore…" · `match.get_matches`→"Running LeapMatch…" · `application.status`→"Looking up your application…" · `kb.search`→"Searching LeapMoney knowledge…" · `metrics.snapshot`→"Crunching the numbers…"

### 9.4 Accessibility
WCAG AA contrast on all pairs (teal-on-white passes for icons/borders only — never teal body text on white; use `foreground.primary`). Full keyboard path (§4 G6). `aria-live="polite"` on message list; tool cards labelled regions. Focus trap inside panel while open (Esc releases). Hindi/Hinglish input supported — no English-only validation.

---

## 10. Deliverables Checklist & Handoff Notes

### 10.1 Figma file structure (create as pages, this order)
1. **Cover & Changelog**
2. **Tokens** (variables synced to §2 — names must match code)
3. **LeapAI / Components** (§3 — 17 components, all variants/states)
4. **LeapAI / Global** (§4 — G1–G6)
5. **Flows / Customer · DSA · Founder** (§5 — user-flow diagram + screen flow per experience)
6. **LeapAI / LeapScore** (§6) · **LeapAI / LeapMatch** (§7)
7. **Conversations** (§8 — 5 scripted frames)
8. **Responsive** (§9 — 3-breakpoint matrix for ChatPanel + 2 key cards)
9. **Prototype** (wire C0→C9 as the primary clickthrough; D and F as secondary)
10. **Handoff** (§10.2 notes + IA diagram)

### 10.2 Developer handoff notes
- Component names in Figma = exported names planned for `packages/ui` (PRD §7.1): `AssistantLauncher`, `ChatPanel`, `MessageStream`, `ToolResultCard`, `SourceCitation`, `ConfirmActionCard`. Do not invent alternates.
- Every tool card's data shape = an existing tool's return type (PRD §4.4). Designers must not add data fields the tools don't return (e.g., no "bank rating stars" in LeapMatchCard unless `lenders.get_products` provides `user_review_score` — it does).
- Deep-links from cards go to **existing routes** only: `/credit-report/report`, `/matches`, `/applications/[id]`, `/applications/new?lender=&score=`.
- Demo-data banner (3.02) is mandatory until persistence wiring lands (PRD Risk R1).
- Information architecture: LeapAI adds **zero new routes** in Phase 1 — it is an overlay + `/api/ai/*`. The only nav change: none. (Launcher is global chrome.)

### 10.3 Status of the 10 requested deliverables
| # | Deliverable | Status |
|---|---|---|
| 1 | User Flow Diagram | §5 (ASCII → redraw as Figma flow) |
| 2 | Information Architecture | §10.2 (zero new routes; overlay model) + §4 |
| 3 | Screen Flow | §5–§7 frame lists |
| 4 | Wireframes | Specified per-frame §3–§8 (execute in Figma) |
| 5 | High-Fidelity UI | HTML prototype (this phase) + Figma (next) |
| 6 | Prototype | **Interactive HTML prototype shipped with this spec** |
| 7 | Component Library | §3 (17 components) |
| 8 | Design Tokens | §2 (extracted from code — exact) |
| 9 | Interaction Specifications | §9 |
| 10 | Handoff Notes | §10.2 |

---
*End of LeapAI UX Design Spec V1 — amend this file; do not fork.*
