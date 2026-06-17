# LeapMoney — Project Context

## What We Are Building

LeapMoney is an AI-powered loan marketplace for India. It connects three audiences:

| Audience | Portal | Purpose |
|----------|--------|---------|
| Borrowers | `apps/borrower` | Apply for loans, track status, manage documents |
| DSAs | `apps/dsa` | Manage leads, submit applications, track commissions |
| Lenders | `apps/lender` | Define policies, review applications, manage disbursals |

The marketing website (`apps/web`) and admin dashboard (`apps/admin`) complete the platform.

## Core Differentiator: LeapMatch AI

LeapMatch AI is the eligibility engine that:
1. Ingests borrower profile data
2. Scores the borrower against each lender's policy matrix
3. Returns a ranked list of matching loan products
4. Explains eligibility/ineligibility in plain language

## Business Context

- **Stage:** Pre-launch, building MVP
- **Market:** India — pan-India loan marketplace
- **Compliance:** RBI Digital Lending Guidelines 2022, DPDP Act 2023, FAIR Practices Code
- **Data residency:** All data must stay in India — AWS Mumbai (ap-south-1)

## Phase Documents (Source of Truth)

| Phase | Document | Topic |
|-------|----------|-------|
| 1 | Phase1_Vision_Strategy | Vision, positioning, target audiences |
| 2 | Phase2_Technical_Architecture | System architecture, infra design |
| 3 | Phase3_Data_Model_Scoring_Engine | Database schema, LeapMatch scoring |
| 4 | Phase4_UX_Architecture | UX flows, wireframes, design system |
| 6 | Phase6_Design_System_Figma_Architecture | Component library, Figma specs |
| 7 | Phase7_Full_Platform_Engineering_Specification | Full engineering spec |
| 8 | Phase8_Compliance_Risk_Fraud_Framework | KYC, AML, fraud rules |
| 9 | Phase9_Revenue_Model_Unit_Economics | Monetisation, pricing |
| 10 | Phase10_QA_Release_Launch_Strategy | QA plan, release process |
| 11 | Phase11_MVP_Roadmap_Sprint_Planning | MVP scope, sprint plan |
| 12 | Phase12_Development_Execution_Blueprint | Execution blueprint |

## Sprint Context

See `.claude/CURRENT_SPRINT.md` for active sprint scope and status.

## Key External Services

| Service | Purpose |
|---------|---------|
| Supabase | PostgreSQL database + Auth + Storage |
| Razorpay | Payment processing |
| Google Analytics 4 | Web analytics |
| Redis | Session management, caching, rate limiting |
