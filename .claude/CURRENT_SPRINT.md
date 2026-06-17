# Current Sprint: Sprint 5 — Product Experience & Differentiator Pages

**Sprint:** 5
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Convert the 6 product/feature placeholders into real, conversion-focused pages

## Source of Truth
Phase 5 (IA + per-page content elements §10), Phase 6 (tokens), Phase 3 (LeapScore components, Credit Health modules). See [[website-v2-ia]].

## Sprint 5 Scope — Completed
- [x] /leapscore — 6 components, A+–D band table, "vs CIBIL" FAQ, no-impact messaging
- [x] /leapmatch — 4-step how-it-works, sample approval-probability output, FAQ
- [x] /credit-health — 7-module explainer, improvement-plan preview, FAQ
- [x] /compare — TCB explainer, sample comparison table (lower rate ≠ cheaper), FAQ
- [x] /dsa — "Earn more. Work smarter.", 8-module suite, why-partner stats, FAQ
- [x] /lenders — pre-qualified lead value props, applicant-pool snapshot, Request Demo CTA, FAQ
- [x] Shared journey strip: Credit Report → LeapScore → Credit Health → LeapMatch → Compare → Apply
  (rendered on all 4 borrower pages, cross-links the full flow)
- [x] SEO: unique title/meta + canonical per page; FAQPage + BreadcrumbList JSON-LD
- [x] New shared components: JourneyStrip, FaqAccordion, FeatureCta, FeatureBreadcrumb; data/journey.ts

## Validation
- pnpm turbo type-check: 11/11 PASS (0 errors)
- pnpm turbo build --filter=@leapmoney/web: SUCCESS — all pages Static/SSG

## Notes
- No Supabase / auth / backend (website experience only).
- Borrower-page CTAs → /register; /dsa → /partners; /lenders → /contact (all resolve).
