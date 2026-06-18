# V3 — Design Research & Experience Blueprint

**Branch:** `develop` · **Date:** 2026-06-18 · **Type:** Research & design planning only — no code, no UI changes, no commits.
**Inputs reviewed:** R1 Market Intelligence, R2 Strategic Validation, R3 Credit Intelligence, R4 UAT Report, and the live UI of all five surfaces (Website, Borrower, DSA, Lender, Admin).

---

## 1. Executive Summary

LeapMoney has, after Sprints 1–17, a **complete and structurally sound product** spanning a marketing site and four role portals, powered by nine real engines. R4 confirmed zero broken routes and zero critical defects. The gap now is **not capability — it is perception**. The current UI is clean, consistent, and token-driven (Phase 6 design system: Inter + JetBrains Mono, a disciplined type scale, `shadow-1/2/3`, a premium gold accent, and a GPU-only motion rule). But it reads as a **competent B2B dashboard**, not as the **category-defining "AI that matches you" consumer-fintech brand** the positioning demands.

The differentiator — *intelligence* (LeapScore, Cash Flow, Financial Analysis, LeapMatch) — is currently rendered as **numbers in cards**. The competitors who win in India (CRED, INDmoney, OneScore) win by rendering intelligence as **motion, hierarchy, and narrative**. V3's job is to make LeapMoney *look* as intelligent as it *is*.

**Current Design Score: 6.2 / 10** — solid foundation, low distinctiveness.
**Target Design Score: 9.0 / 10** — premium, intelligence-led, conversion-optimised.

The fastest path: keep the token system and information architecture (both good), and invest in **data visualization, motion, trust layer, and the three P0 surfaces** (Homepage, LeapScore, LeapMatch).

---

## 2. Current vs Target Scorecard

| Dimension | Current /10 | Target /10 | Gap |
|-----------|:-----------:|:----------:|-----|
| Visual distinctiveness | 5 | 9 | High |
| Premium perception | 5 | 9 | High |
| Trust signalling | 6 | 9 | High |
| Typography craft | 7 | 9 | Medium |
| Data visualization | 5 | 9 | **Highest** |
| Motion / micro-interaction | 4 | 9 | **Highest** |
| Dashboard design | 6 | 9 | High |
| Mobile experience | 7 | 9 | Medium |
| Conversion architecture | 6 | 9 | High |
| Information architecture | 8 | 9 | Low (keep) |
| Empty / loading states | 6 | 9 | Medium |
| Consistency across portals | 8 | 9 | Low (keep) |
| **Composite** | **6.2** | **9.0** | — |

---

## 3. Competitor Benchmark Matrix

Captured per competitor: Homepage · Dashboard · Credit Score · Loan Recommendation · Application Flow · Trust · Animation · Typography · Color · Cards · Charts · Mobile · IA. Summarised below by what each does that LeapMoney should learn from.

### Bucket A — Credit Intelligence
| App | Signature strength | Lesson for LeapMoney |
|-----|--------------------|----------------------|
| **OneScore** | Score as a **living animated gauge**, plain-English "why your score changed", monthly refresh narrative, dark premium canvas | Make LeapScore the hero: animated ring + factor breakdown + delta-over-time story |
| **Credit Karma** | Recommendation engine framed as "approval odds" cards; education woven into every screen | Frame LeapMatch as approval-odds cards (already have the data — elevate the visual) |
| **ClearScore** | Calm, friendly, generous whitespace; report as scannable sections with progressive disclosure | Credit Report screen: section accordions, not a wall of metrics |
| **Experian** | Authoritative trust framing (bureau logos, "official"), factor weighting visuals | Surface the 4-bureau strategy + LeapScore weighting (55/25/15/5) as a visual |

### Bucket B — Lending
| App | Signature strength | Lesson |
|-----|--------------------|--------|
| **Moneyview** | 3-tap eligibility, instant "you're eligible for ₹X" reveal, progress nudges | Compress the apply wizard; lead with a pre-approved-amount reveal |
| **Navi** | Radical simplicity, one primary action per screen, large tap targets | Reduce per-screen choices; single dominant CTA |
| **Fibe / KreditBee / CASHe** | Speed cues ("2-min approval"), trust badges (RBI/secure), sticky CTAs | Add speed + security microcopy and sticky mobile CTAs to apply flow |

### Bucket C — Wealth & Premium UX
| App | Signature strength | Lesson |
|-----|--------------------|--------|
| **CRED** | Premium dark surfaces, restrained palette + one accent, *exceptional* motion, generous spacing, typographic confidence | The reference for "premium feel": motion + spacing + restraint |
| **INDmoney** | Dense data made elegant; best-in-class dashboards; charts as first-class citizens | The reference for dashboard + data-viz craft |
| **Fi / Jupiter** | Playful empty states, delightful micro-interactions, friendly tone | Empty/loading states as brand moments |
| **Groww** | Clean charts, fast perceived performance, mobile-first defaults | Chart clarity + perceived speed |

### Bucket D — Marketplace
| App | Signature strength | Lesson |
|-----|--------------------|--------|
| **Paisabazaar** | Match results with approval %, sort/filter, "best match" badges | Already have the data model — elevate the results card + comparison UX |
| **BankBazaar** | Comparison tables, eligibility-first funnel | Side-by-side lender compare view (engine `compareLenders()` already exists) |
| **LendingTree** | "Lenders compete for you" framing — marketplace as a benefit | Reframe LeapMatch as "lenders matched to you", transparency as trust |
| **PolicyBazaar** | Heavy trust scaffolding (ratings, counts, partners), guided flows | Add ratings/counts/partner logos + guided next-step nudges |

---

## 4. What to Copy / Improve / Avoid

### Copy (adopt directly)
- OneScore's **animated score gauge + "why it changed"** narrative.
- INDmoney's **chart-as-first-class-citizen** dashboard density done elegantly.
- CRED's **motion discipline** (purposeful, GPU-cheap, never decorative noise).
- Paisabazaar's **approval-% match cards** and **"best match" badge** system.
- Moneyview's **pre-approved amount reveal** as an emotional high point.

### Improve (we have the data, weak presentation)
- LeapMatch results → from list rows to **ranked, badged, comparable cards**.
- LeapScore → from a number to a **living gauge with factor breakdown + trend**.
- Financial Analysis → from stacked widgets to a **narrative "your money story"**.
- Empty/loading states → from plain text to **branded, animated moments** (R4 flagged faint charts + plain empties).
- Trust → from implicit to an explicit, reusable **Trust Layer** (RBI, DPDP, bureau, secure, ratings).

### Avoid (anti-patterns seen in the set)
- KreditBee/CASHe **aggressive urgency & clutter** — erodes premium trust.
- Over-gamification (badges-for-everything) that cheapens a credit product.
- Dark-mode-only (CRED) — LeapMoney's light system is an asset for trust; offer dark as an *option*, not the default.
- Dense tables without mobile fallbacks (BankBazaar desktop-first) — we're mobile-first; keep it.

---

## 5. Design Direction & Target Positioning

> **OneScore intelligence + Moneyview lending + INDmoney dashboard + CRED premium feel + Paisabazaar marketplace = LeapMoney.**

Concretely, V3 expresses this as four design pillars:

1. **Intelligence is visible.** Every engine output gets a signature visualization (gauge, flow, FOIR meter, match ranking), not a bare number.
2. **Premium through restraint.** One accent, generous spacing, confident type, GPU-cheap motion. Gold (`--color-premium`) reserved for genuine "premium/earned" moments only.
3. **Trust is a layer, not a footnote.** A reusable trust system (regulatory, security, social proof) appears at every decision point.
4. **Marketplace as a benefit.** LeapMatch reframed as "lenders matched to you, ranked transparently" — RBI-compliant transparency *is* the trust story.

---

## 6. V3 Design System Recommendations

Building **on top of** Phase 6 (keep the token architecture; extend it).

| System | Current state | V3 recommendation |
|--------|---------------|-------------------|
| **Color** | Light surfaces, blue `#2563EB` primary, status colors, gold `#D4AF37` premium | Keep core; add a **score-spectrum scale** (red→amber→green for 300–900 and 0–100), a **dark "feature" surface** for hero/intelligence moments, and a tighter gold-usage rule (earned moments only) |
| **Typography** | Inter + JetBrains Mono; display-hero→body scale | Keep families. Add a **display-mega** (3.75–4.5rem) for hero numbers (score, pre-approved amount); standardise mono for all data; introduce tabular-nums everywhere numbers change |
| **Spacing** | Tailwind default + tokens | Adopt an **8pt soft grid** with generous section spacing (premium = air); define page/section/card rhythm tokens |
| **Elevation** | `shadow-1/2/3` | Add **shadow-0 (hairline)** and a **glow/elevated-accent** for active intelligence cards; layer shadows for depth in dashboards |
| **Motion** | GPU-only (transform/opacity/stroke), `fast/normal` durations | Formalise a **motion language**: count-up for numbers, ring-draw for gauges, staggered card reveals, spring easing tokens; keep GPU-only rule (R4: no width/top animations) |
| **Data Visualization** | Bar/column via `scaleX`/`%` height (R4: bars render faint) | **New first-class chart kit**: animated radial gauge, trend sparkline, FOIR meter, distribution bars with min-height, donut for mix; consistent axis/label/empty conventions |
| **Card** | `rounded-lg border shadow-1` | Tiered cards: **base / intelligence / premium**; intelligence cards get accent glow + motion; consistent header/metric/footer slots |
| **Trust Layer** | Implicit, scattered | **Reusable trust components**: regulatory badge row (RBI/DPDP), security lock + "soft check, no score impact", bureau-source chips, ratings/counts, partner logos |
| **Badge** | Status pills (built) | Expand to a **semantic badge system**: status, score band, "best match", "pre-approved", confidence (high/med/low), risk band — one source of truth |
| **Chart** | (see Data-Viz) | Ship as a shared package so all 5 portals share identical chart primitives (fixes R4 U1 faint bars) |
| **Form** | PAN regex, inline errors (good) | Standardise input/label/error/help/disabled states + sticky mobile CTA + progress for multi-step (apply wizard) |
| **Empty State** | Plain text (R4 flagged) | **Branded empty-state system**: illustration/icon + headline + action; loading skeletons over spinners |
| **Notification** | Per-portal lists (built) | Unified notification component: tone, icon, timestamp, action; toast + center variants |

---

## 7. Identified Gaps (the 10 lenses)

1. **Visual weaknesses** — low distinctiveness; cards/typography read generic-SaaS; intelligence under-dramatised.
2. **Trust weaknesses** — regulatory/security/social-proof signals implicit and scattered; no reusable trust layer.
3. **Premium perception gaps** — insufficient whitespace, no signature motion, gold under-leveraged for "earned" moments.
4. **Mobile UX gaps** — ₹-crore KPI clipping risk (R4 M1), no sticky CTAs in apply flow, tables-to-cards solid but charts faint.
5. **Typography gaps** — no "hero number" scale for score/amount; mono not universally applied to data.
6. **Dashboard gaps** — charts secondary; no narrative ordering (most-important-first); density not yet "INDmoney-elegant".
7. **Conversion gaps** — no pre-approved reveal, weak speed/security microcopy, CTAs not always single-dominant.
8. **Motion opportunities** — count-ups, gauge draws, staggered reveals, page transitions all absent.
9. **Intelligence-visualization opportunities** — LeapScore gauge, FOIR meter, cash-flow trend, score-factor weighting, match-strength — all currently numbers.
10. **Marketplace UX opportunities** — match cards → ranked/badged/comparable; surface `compareLenders()` as a real compare view; "lenders matched to you" reframing.

---

## 8. Redesign Priorities (Effort · Complexity · Impact)

Scale: Effort S/M/L · Complexity Low/Med/High · Impact ★–★★★★★

### P0 — Brand-defining (do first)
| Area | Effort | Complexity | Impact |
|------|:------:|:----------:|:------:|
| **Homepage** (hero, intelligence story, trust, conversion) | L | Med | ★★★★★ |
| **LeapScore** (animated gauge + factor breakdown + trend) | M | Med | ★★★★★ |
| **LeapMatch** (ranked badged comparable match cards + compare view) | L | High | ★★★★★ |

### P1 — Core borrower value
| Area | Effort | Complexity | Impact |
|------|:------:|:----------:|:------:|
| **Borrower Dashboard** (narrative ordering, chart-first, motion) | L | Med | ★★★★ |
| **Financial Analysis** ("your money story" narrative) | M | Med | ★★★★ |
| **Applications** (wizard compression, pre-approved reveal, sticky CTA) | M | Med | ★★★★ |

### P2 — Operator portals
| Area | Effort | Complexity | Impact |
|------|:------:|:----------:|:------:|
| **DSA** (performance charts, leaderboard polish) | M | Low | ★★★ |
| **Lender** (underwriting/portfolio chart kit upgrade) | M | Med | ★★★ |
| **Admin** (control-tower density à la INDmoney) | M | Med | ★★★ |

---

## 9. Top 25 Design Improvements

1. Animated **LeapScore gauge** (ring-draw + count-up + band color).
2. **Score-factor breakdown** visual (55/25/15/5 weighting + helping/hurting).
3. **Score trend** sparkline with delta narrative ("+12 since May").
4. **LeapMatch ranked cards** with approval-% prominence + "best match" badge.
5. **Lender compare view** (surface existing `compareLenders()`).
6. **Pre-approved amount reveal** moment in the apply flow.
7. **FOIR meter** (gauge vs safe-limit) replacing the bare percentage.
8. **Cash-flow trend** chart (income consistency/volatility visual).
9. **Reusable Trust Layer** (RBI + DPDP + bureau + secure + ratings).
10. **"Soft check — no score impact"** reassurance at every pull.
11. **Hero-number type scale** for score / pre-approved amount.
12. **Count-up animation** on all KPI numbers.
13. **Staggered card reveal** on dashboard load.
14. **Branded empty states** (illustration + action) across portals.
15. **Loading skeletons** replacing spinners/plain text.
16. **Shared chart package** fixing faint bars (R4 U1) + consistent axes.
17. **Dark "feature" surface** for hero/intelligence moments.
18. **Sticky mobile CTA** in apply + match flows.
19. **Single-dominant-CTA** rule per screen (Navi-style).
20. **Section accordions / progressive disclosure** on Credit Report.
21. **Financial Analysis as narrative** ("your money story", findings → savings → actions).
22. **Semantic badge system** (status/band/best-match/confidence/risk).
23. **Generous spacing pass** (premium = air) across all surfaces.
24. **Tighter gold usage** (earned/premium moments only).
25. **Marketplace reframing** copy ("lenders matched to you, ranked transparently").

---

## 10. Top 10 Quick Wins (high impact, S effort)

1. Count-up animation on existing KPI numbers (token-level, all portals).
2. Staggered fade/translate reveal on dashboard cards (GPU-only).
3. Branded empty-state component swap-in (R4 flagged plain empties).
4. Chart min-bar-height + label polish (fixes R4 U1 faint bars).
5. Trust badge row component on Homepage + apply + match.
6. "Soft check, no score impact" microcopy on credit-report start/consent.
7. Responsive hero-number font for score/amount + ₹-crore KPI wrap (R4 M1).
8. Sticky mobile CTA on apply wizard + match results.
9. Tighten gold to premium moments; audit current usages.
10. Fix R4 U3 (borrower "LeapScore" nav → `/health`) while touching nav.

---

## 11. Recommended Design Roadmap

| Phase | Focus | Deliverables | Duration (design+build, indicative) |
|-------|-------|--------------|------|
| **V3.0 — Foundations** | Extend design system | Chart package, Trust Layer, Badge system, Motion tokens, Empty/Loading kit, hero-number type | ~1 sprint |
| **V3.1 — P0 surfaces** | Brand-defining | Homepage, LeapScore gauge, LeapMatch ranked cards + compare | ~1–2 sprints |
| **V3.2 — P1 borrower** | Core value | Dashboard, Financial Analysis narrative, Applications (reveal + sticky CTA) | ~1–2 sprints |
| **V3.3 — P2 operators** | Polish | DSA, Lender, Admin chart/density upgrade on shared kit | ~1 sprint |
| **V3.4 — Quick-wins + QA** | Sweep | Top-10 quick wins, motion pass, mobile re-verify, a11y, R4 carry-overs | ~0.5 sprint |

**Sequencing logic:** ship the shared foundations first (one investment, five portals benefit and R4's chart/empty-state issues are fixed centrally), then the P0 surfaces that define the brand, then borrower value, then operator polish. Quick wins can run in parallel from day one since they're token/component-level.

---

## 12. Notes & Constraints

- **Keep:** the Phase 6 token architecture, the information architecture (R4 scored IA 8/10), the light-first trust palette, the GPU-only motion rule, and mobile-first responsiveness — all assets.
- **Compliance:** any marketplace reframing must preserve RBI Digital Lending transparency (all lenders shown, ranking methodology disclosed) and DPDP consent UX — these are *trust features*, not friction to design away.
- **This document is planning only.** No source was modified, no UI changed, and per the sprint instruction **this is not committed**. It is the input brief for the V3.0 foundations sprint.

*End of V3 Design Blueprint.*
