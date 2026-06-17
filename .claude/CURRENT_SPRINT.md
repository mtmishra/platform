# Current Sprint: Sprint 4 — Website V2 Launch Readiness

**Sprint:** 4
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Make Website V2 publicly reviewable and Vercel-deployment ready

## Source of Truth
Phase 5 (IA), Phase 6 (design tokens), Phase 7 (engineering). See [[website-v2-ia]].

## Sprint 4 Scope — Completed
- [x] Blog foundation: index with category structure, `/blog/[slug]` SSG template, 6 seeded articles, Article + Breadcrumb JSON-LD
- [x] Calculators: hub (/calculators), EMI, Loan Eligibility, Affordability (live client calculators)
- [x] Lead capture: LeadForm (homepage hero) + ContactForm (/contact) — validation, success/error states
- [x] Analytics: GA4 framework in @leapmoney/analytics, Consent Mode v2, page_view + cta_click + form events
- [x] Cookie & consent layer: DPDP-aware banner, preferences, analytics opt-in gating GA4
- [x] Trust layer: TrustSection (homepage), RBI/facilitation disclaimer in footer
- [x] Legal: expanded Privacy + Terms (Sprint 3), new /disclaimer page
- [x] SEO completion: sitemap (33 URLs), robots.txt, canonical, OG, structured data verified in built HTML
- [x] Deployment readiness: src/lib/env.ts validation, production metadata, NEXT_PUBLIC_ env vars

## Validation
- pnpm turbo type-check: 11/11 PASS (0 errors)
- pnpm turbo build --filter=@leapmoney/web: SUCCESS — 39 pages, all Static/SSG
- Internal link audit: 0 broken (every referenced path resolves)
- SEO audit: canonical + OG + JSON-LD present; sitemap.xml (33 URLs) + robots.txt generated

## Vercel notes
- All pages static/SSG; no server-only runtime deps. Set Vercel project root to `apps/web`
  (or use Turborepo remote caching). Configure NEXT_PUBLIC_SITE_URL and
  NEXT_PUBLIC_GA4_MEASUREMENT_ID in Vercel env. No secrets required to build.
