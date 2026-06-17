# Current Sprint: Sprint 3 — Loan Pages & SEO Foundation

**Sprint:** 3
**Status:** Complete
**Date:** 2026-06-17
**Goal:** Build the Website V2 loan product pages, SEO foundation, and IA per Phase 5

## Source of Truth

Phase 5 Website V2 Gap Analysis (`docs/audits/Phase5_Website_Gap_Analysis.docx`) governs all
information architecture: flat loan URLs, header/footer navigation, page inventory, and SEO strategy.

## Sprint 3 Scope

### Completed
- [x] Reusable loan page template (`components/loan/LoanPageTemplate.tsx`)
- [x] Loan pages: /personal-loan, /home-loan, /business-loan, /loan-against-property
- [x] Conversion sections on all loan pages: Eligibility, Documents, Benefits, Process, FAQ, CTA
- [x] SEO foundation: unique title + meta per page, self-referential canonical, OG image placeholder, JSON-LD structured data (Organization, FAQPage, LoanOrCredit, BreadcrumbList)
- [x] sitemap.xml + robots.txt (Next.js metadata routes)
- [x] Header rebuilt to Phase 5 IA (Products▾ + Loans▾ mega-menus, For DSAs, For Lenders, Blog, Calculators)
- [x] Footer rebuilt to Phase 5 IA (Products, Loans, For Partners, Company, Legal + trust signals)
- [x] Internal linking between loan products (related products section)
- [x] Legal pages: /privacy-policy, /terms-of-service (placeholder content, DPDP + RBI aware)
- [x] Placeholder pages for all remaining nav routes — zero broken internal links
- [x] Homepage loan links migrated from /loans/* to flat Phase 5 URLs

### Notes / Deviations
- Task 21 requested `/terms-and-conditions`; Phase 5 (declared source of truth) specifies
  `/terms-of-service`. Built at `/terms-of-service` to honour Phase 5 IA.
- Loan-Against-Property page added (beyond the 3 requested) because Phase 5 lists it as a P0
  launch page and the Loans mega-menu links to it — required to keep "no broken links" true.

## Validation
- pnpm --filter @leapmoney/web type-check: PASS (0 errors)
- pnpm turbo build --filter=@leapmoney/web: SUCCESS — 29 static pages (all SSG), + robots.txt + sitemap.xml
- Internal link audit: every referenced internal path resolves to a real route (0 broken)

## Branch Strategy
```
main          ← production releases only
develop       ← integration branch, all sprints merge here
feature/*     ← individual feature branches
```
