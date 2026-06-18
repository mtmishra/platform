# R4 — Repository-Wide UAT Report

**Branch:** `develop` · **Commit at audit:** `2b5a7e5` · **Date:** 2026-06-18
**Scope:** Website, Borrower, DSA, Lender, Admin portals. **Audit only — no features, no design changes, no code modified.**
**Goal:** Validate the complete ecosystem before Design V3.

---

## 1. Executive Summary

| Result | Count |
|--------|-------|
| ✅ Passed checks | 11 categories |
| ❌ Failed (broken routes / dead links) | **0** |
| 🔴 Critical bugs | **0** |
| 🟠 Warnings | 3 |
| 🟡 UI issues | 4 |
| 📱 Mobile issues | 1 |

**Verdict:** The ecosystem is **structurally sound and demo-ready**. All 6 apps build (6/6) and type-check (15/15) clean, every internal link resolves, forms validate, and snapshots are append-only with RLS. No critical or blocking defects. Remaining items are content stubs, cross-portal data reconciliation, and cosmetic polish — all safe to carry into Design V3.

---

## 2. Route Inventory (73 pages across 6 apps)

### 2.1 Website (`apps/web`, port 3000) — 29 routes
| Route | Status | Note |
|-------|--------|------|
| `/` | ✅ | Home |
| `/personal-loan` `/home-loan` `/business-loan` `/loan-against-property` | ✅ | Product pages |
| `/leapscore` `/leapmatch` `/credit-health` `/compare` | ✅ | Feature pages |
| `/lenders` `/dsa` `/partners` | ✅ | Ecosystem |
| `/emi-calculator` `/affordability-calculator` `/loan-eligibility-calculator` `/calculators` | ✅ | Calculators |
| `/about` `/careers` `/press` `/contact` `/blog` `/blog/[slug]` | ✅ | Company |
| `/privacy-policy` `/terms-of-service` `/cookie-policy` `/disclaimer` `/fair-practices-code` `/grievance-redressal` | ✅ | Legal |
| `/register` | ✅ | Conversion CTA target |

### 2.2 Borrower (`apps/borrower`, port 3001) — 22 routes
| Route | Status |
|-------|--------|
| `/(public)/login` `/(public)/onboard` `/forbidden` | ✅ |
| `/(auth)/dashboard` `/(auth)/profile` | ✅ |
| `/(auth)/credit-report/start` `/consent` `/fetching` `/report` | ✅ |
| `/(auth)/connect-bank` `/consent` `/fetching` · `/(auth)/cash-flow` | ✅ |
| `/(auth)/health` `/(auth)/financial` | ✅ |
| `/(auth)/matches` `/(auth)/matches/review` | ✅ |
| `/(auth)/applications` `/new` `/[id]` `/[id]/timeline` | ✅ |

### 2.3 DSA (`apps/dsa`, port 3002) — 8 routes
`/` · `/leads` · `/leads/[id]` · `/lenders` · `/lenders/[id]` · `/referrals` · `/commissions` · `/performance` — **all ✅**

### 2.4 Lender (`apps/lender`, port 3003) — 6 routes
`/` · `/applications` · `/applications/[id]` · `/underwriting` · `/portfolio` · `/analytics` — **all ✅**

### 2.5 Admin (`apps/admin`, port 3004) — 7 routes
`/` · `/users` · `/applications` · `/commissions` · `/risk` · `/revenue` · `/compliance` — **all ✅**

### 2.6 Referral (`apps/referral`, port 3005) — 1 route
`/` — **stub** (Sprint 1 scaffold; out of UAT scope, not one of the 5 reviewed surfaces).

---

## 3. Passed ✅

| # | Check | Evidence |
|---|-------|----------|
| P1 | **Build integrity** | `pnpm turbo build` → 6/6 apps succeed |
| P2 | **Type safety** | `pnpm turbo type-check` → 15/15 packages, 0 errors (strict mode, `exactOptionalPropertyTypes`) |
| P3 | **No broken routes** | All 73 `page.tsx` routes compile and prerender/SSR |
| P4 | **No dead links** | 0 `href="#"`/empty hrefs; all static + config-array hrefs (web nav/footer, portal sidebars) resolve to existing routes |
| P5 | **Cross-route wiring** | Borrower flow intact: login → credit-report → cash-flow → financial → matches/review → matches → applications/new → applications/[id]/timeline. Dynamic `[id]` links resolve. |
| P6 | **Form validation** | PAN regex `^[A-Z]{5}[0-9]{4}[A-Z]$`, required-field errors, login email/OTP validation with inline messaging |
| P7 | **Empty states** | "No applications/leads/results match" present in all filterable tables (borrower, dsa, lender, admin) |
| P8 | **No hydration-causing non-determinism in render** | `Math.random`/`Date.now`/`new Date()` only in event handlers (consent writes) or stable contexts (footer year); demo generators are index-deterministic |
| P9 | **SSR/CSR-safe formatting** | All `toLocaleString`/`toLocaleDateString` calls pass explicit `"en-IN"` locale on fixed input dates → no locale mismatch |
| P10 | **Accessibility baseline** | `aria-label` on icon-only buttons (Open/Close menu), nav landmarks (Sidebar/Main/Mobile navigation), breadcrumbs, cookie consent; no `<img>` missing alt (0 raster images — all SVG/icon) |
| P11 | **Data governance** | Append-only snapshots + RLS across migrations 0009–0019 (score/health/match/report/income/financial/application/dsa/commission/lender/underwriting/portfolio/admin/revenue/compliance) |

---

## 4. Failed ❌ / Critical Bugs 🔴

**None.** No broken routes, no dead links, no runtime crashes, no build/type failures.

---

## 5. Warnings 🟠

| ID | Warning | Detail | Severity | Fix effort |
|----|---------|--------|----------|-----------|
| W1 | **Cross-portal data not reconciled** | Each portal uses its own independent mock layer, so totals don't tie out across apps (DSA shows 26 leads; Lender 54 applications; Admin 1,284 applications / 65 lenders / 8,640 borrowers). Correct *within* each app, inconsistent *across* apps during a multi-portal investor walkthrough. By design (demo mode, no shared backend). | Low | Medium (shared demo-data package or reconciled constants) |
| W2 | **Dev-only hydration warning (harness-induced)** | Sprint 16 QA surfaced `Warning: Extra attributes from the server: style` on `<html>`. Root cause: the preview harness set `document.documentElement.style.scrollBehavior` during scripted navigation — **not in app code**. Confirmed absent when the harness eval is skipped (Sprint 17 console was clean) and stripped from production builds. | Info / non-issue | None |
| W3 | **No custom error/not-found boundaries** | No `not-found.tsx` or `error.tsx` in any app; all rely on the Next.js default 404/500. Functional but unbranded. | Low | Small (per-app `not-found.tsx`) |

---

## 6. UI Issues 🟡

| ID | Issue | Location | Severity | Fix effort |
|----|-------|----------|----------|-----------|
| U1 | **Column-chart bars render faint/short at some render timings** | DSA `/performance` (monthly trend), Admin `/revenue` (monthly revenue). Values are labelled so data is legible; bars use `%` height against `h-28`/`h-32` parents. Cosmetic; bars confirmed rendering on Lender `/underwriting`. | Low | Small (set min-bar height / verify flex height) |
| U2 | **Website content stubs ("coming soon")** | `/about`, `/careers`, `/cookie-policy`, `/fair-practices-code`, `/grievance-redressal`, `/partners`, `/blog` ("more coming soon"), `/register`. Two are RBI-relevant (`fair-practices-code`, `grievance-redressal`); `/register` is a primary CTA target so its stub is a soft conversion dead-end. | Medium (`/register` + compliance pages), Low (others) | Medium (content authoring, not engineering) |
| U3 | **Disabled borrower nav points to non-existent routes** | `Sidebar.tsx`: "LeapScore" → `/score` and "Settings" → `/settings` are `disabled: true` ("Coming soon"), so non-clickable — but the hrefs target routes that don't exist. Intentional placeholder; no actual dead link. LeapScore content already lives at `/health` + dashboard. | Low | Small (point LeapScore to `/health` or remove) |
| U4 | **Savings copy framing (pre-existing)** | Borrower `/financial` savings widget: lifetime/annual figure framing flagged in Sprint 13.5 (lifetime interest-only can read below annual cash-flow savings). Definition/label cleanup, not a calc bug. | Low | Small (copy/label) |

---

## 7. Mobile Issues 📱

| ID | Issue | Detail | Severity | Fix effort |
|----|-------|--------|----------|-----------|
| M1 | **Large currency in 2-col KPI cards** | Lender + Admin KPI cards already mitigated (`text-h1 sm:text-display-large` + `break-words`) so ₹-crore values wrap instead of clipping at 375px. Borrower/DSA KPI cards still use `text-display-large`; re-verify ₹-crore values don't clip there (none observed in current data, but exposure-scale figures could). | Low | Small (apply same responsive font pattern) |

**Passed mobile/tablet checks:** sidebar collapses to hamburger drawer on all four portals; grids reflow `grid-cols-1/2 → lg:grid-cols-4+`; tables degrade to stacked cards (sm-hidden columns); filters usable at 375px; verified on Borrower, DSA, Lender, Admin at 375×812. Tablet (768–1024) inherits the `sm:` breakpoints cleanly.

---

## 8. Recommended Fixes (prioritized)

| Priority | Item | Action | Effort |
|----------|------|--------|--------|
| 1 | U2 (`/register` + compliance) | Author real content for `/register`, `/fair-practices-code`, `/grievance-redressal` before any public/investor launch | M (content) |
| 2 | W1 | Introduce a shared demo-constants module so headline totals reconcile across portals for multi-app demos | M |
| 3 | U3 | Repoint borrower "LeapScore" nav to `/health` (or remove the disabled stub) | S |
| 4 | W3 | Add branded `not-found.tsx` per app | S |
| 5 | U1 / M1 | Min-bar-height on `ColumnChart`; apply responsive KPI font to Borrower/DSA | S |
| 6 | U4 | Clarify savings widget labels (annual vs lifetime) | S |

**None of the above blocks Design V3.** All are content, cosmetic, or demo-data-reconciliation items. Recommend proceeding to Design V3 and folding U1/M1/U3/W3 into that pass (since they touch presentation), while U2/W1 are handled as content/data workstreams.

---

## 9. Method & Coverage

- **Static analysis:** route enumeration (`page.tsx`), internal-href extraction + resolution against route table, grep for dead links / non-deterministic render / placeholder copy / a11y attributes / form validation.
- **Build/type:** full `pnpm turbo build` (6/6) and `type-check` (15/15).
- **Visual QA (carried from Sprints 11–17):** desktop + 375×812 mobile screenshots per portal; filter/decision interactivity confirmed; console checked per app (clean except the harness-induced W2).
- **Not changed:** zero source files modified during this audit. Working tree clean apart from a pre-existing untracked `push_research_to_github.bat`.

*End of R4 UAT Report.*
