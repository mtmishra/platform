# LeapMoney Research Reports

**Location:** `docs/research/`  
**Branch:** `develop`  
**Maintained by:** LeapMoney Founder Office  
**Classification:** Internal — Engineering + Product Reference

---

## Purpose

This folder contains the three foundational research reports that underpin the LeapMoney platform. These reports define the market context, competitive landscape, product strategy, and the complete data model for LeapScore and LeapMatch.

**All developers working on Sprint 7 and Sprint 8 must read R1, R2, and R3 before writing any code.**

---

## Reports

### R1 — Market Intelligence Report
**File:** `R1_Market_Intelligence_Report.md`  
**Version:** 1.0  
**Created:** May 2026  
**Author:** LeapMoney Founder Office (AI-Augmented Research)

**Purpose:**  
Baseline market intelligence covering 50+ companies across 7 categories: Loan Marketplaces & DSAs, Credit Score Platforms, Top Fintechs, Banks, NBFCs, AI Infrastructure, and International Benchmarks. Establishes the competitive landscape, identifies product gaps, and defines the original LeapMoney Blueprint.

**Key Contents:**
- Market size: ₹157B personal loan market; $487M digital lending platform market
- Competitor matrix: 50+ platforms analysed
- LeapMoney Homepage, Loan Page, LeapScore, LeapMatch wireframes (ASCII)
- Full borrower journey (8 stages)
- Mobile funnel (5-tab app structure)
- 3-year roadmap v1
- Critical finding: "No single platform has successfully combined free credit intelligence, AI-powered loan matching, and a seamless borrower journey"

**Formula:** `LeapMoney = Credit Karma intelligence + Paisabazaar marketplace + CRED design quality`

---

### R2 — Market Intelligence Validation Report
**File:** `R2_Market_Intelligence_Report.md`  
**Version:** 1.0  
**Created:** June 2026  
**Author:** LeapMoney Founder Office (AI-Augmented Research)

**Purpose:**  
Validation and strategic expansion of R1. Challenges every R1 conclusion. Identifies new threats and opportunities missed in R1. Delivers updated product strategy with LeapScore v2, LeapMatch v2, full compliance blueprint (RBI 2025 + DPDP Rules), technology stack recommendations, and 5-stream revenue model.

**Key Contents:**
- R1 Validation Scorecard (what held, what was wrong, what was missing)
- New threats: PhonePe (₹14,270Cr disbursals), GPay Credit Score (500M+ users), Amazon+Axio
- 12 product gaps no Indian credit platform addresses
- SEO strategy: NerdWallet playbook adapted for India
- LeapScore v2 specification (4-bureau + AA + alternative data)
- LeapMatch v2 specification (approval probability model)
- RBI Digital Lending Directions 2025 compliance architecture
- DPDP Act 2023 / Rules 2025 compliance blueprint
- Revenue model: ₹350–530Cr Year 3 target (5 streams)
- 25 Founder Recommendations
- 3-Year Roadmap (Product + Tech + AI + SEO + Revenue)

**R2 Strategy:** `LeapMoney earns trust through the best credit intelligence in India, converts it through transparent AI loan matching, and retains users through post-disbursal engagement — building a data flywheel that compounds into an insurmountable competitive advantage.`

---

### R3 — Credit Infrastructure & Lender Intelligence Report
**File:** `R3_Credit_Intelligence_Report.md`  
**Version:** 1.0  
**Created:** June 2026  
**Author:** LeapMoney Founder Office (AI-Augmented Research)

**Purpose:**  
Complete data model and intelligence database for LeapScore, LeapMatch, and the Approval Odds Engine. This is the engineering specification document — every field, every weight, every formula, every algorithm. Sprint 7 and Sprint 8 implement from this document.

**Key Contents:**
- Multi-Bureau Comparison Matrix: CIBIL, Experian, CRIF, Equifax (score ranges, factors, API options)
- DPD code definitions (000 through WO/SET/CLO)
- Score impact table for all negative credit events
- **Lender Bureau Mapping Database** — which bureau every major bank, NBFC, and fintech lender uses as primary/secondary
- **Key insight:** Bajaj Finance uses Experian as primary (not CIBIL)
- Approval Probability Framework: per-lender criteria, FOIR rules, relationship multipliers, inquiry penalties
- Rejection Intelligence: 15 rejection reasons ranked by frequency
- Self-Employed underwriting stack: 4-level hierarchy (bureau → income → business → alt data)
- Home Loan: LTV, FOIR, income multiplier, co-applicant impact, PMAY
- MSME / Business Loan: digital underwriting, GST Sahay, PSB 59-minute loans
- Alternative Data: UPI signals, GST signals, BBPS utility, telecom — integration priority stack
- **LeapScore Data Dictionary v2.0:** Complete input schema, computation model (55/25/15/5 weights), thin-file path, full output schema
- **LeapMatch Data Dictionary v2.0:** Full input schema, lender database schema, matching algorithm (eligibility filter → approval probability scoring → ranking → output), EMI/APR formulas
- Cold-Start solution: rule-based (Year 1) → data accumulation (Year 2) → XGBoost model at 10K outcomes (Year 2+)

---

## Sprint Reading Guide

| Sprint | Name | R1 | R2 | R3 | Priority |
|---|---|---|---|---|---|
| Sprint 4 | Foundation Setup | Optional | — | — | Low |
| Sprint 5 | Auth & User Flows | Optional | — | — | Low |
| Sprint 6 | Website V2 | Optional | Optional | — | Low |
| **Sprint 7** | **LeapScore** | ✅ **Mandatory** | ✅ **Mandatory** | ✅ **Mandatory** | **CRITICAL** |
| **Sprint 8** | **LeapMatch** | ✅ **Mandatory** | ✅ **Mandatory** | ✅ **Mandatory** | **CRITICAL** |
| Sprint 9+ | Approval Engine / Post-Disbursal | Reference | Reference | Reference | As needed |

### What to read first for Sprint 7 (LeapScore):
1. R3 Section 1 — Bureau Intelligence (score factors, DPD codes, API options)
2. R3 Section 9 — LeapScore Data Dictionary (complete implementation spec)
3. R2 Section 8 — LeapScore v2 Design Rationale (why it's designed this way)
4. R1 Section 3 — Original competitor credit score analysis (context)

### What to read first for Sprint 8 (LeapMatch):
1. R3 Section 2 — Lender Bureau Mapping (which bureau each lender uses)
2. R3 Section 3 — Approval Probability Framework (per-lender approval criteria)
3. R3 Section 10 — LeapMatch Data Dictionary (complete implementation spec)
4. R2 Section 9 — LeapMatch v2 Design Rationale (why it's designed this way)
5. R3 Section 4 — Rejection Intelligence (for "not matched" UI logic)

---

## File Summary

| File | Size | Sections | Primary Use |
|---|---|---|---|
| `R1_Market_Intelligence_Report.md` | ~63KB | 14 sections | Market context; competitor analysis; product vision |
| `R2_Market_Intelligence_Report.md` | ~71KB | 14 sections | Strategy validation; compliance; revenue model; roadmap |
| `R3_Credit_Intelligence_Report.md` | ~59KB | 10 sections | **Engineering spec** for LeapScore + LeapMatch |
| `README.md` | This file | — | Navigation guide |

---

## Update Policy

These reports are research snapshots, not living documents. They are versioned.  
- R1 v1.0 — Baseline; do not modify  
- R2 v1.0 — Validation layer; do not modify  
- R3 v1.0 — Engineering spec; update only when data model changes (version bump required)  

If significant market changes occur (new regulation, major competitor move), create R4 rather than editing R1–R3.

---

*LeapMoney Platform — Research Documentation*  
*Branch: develop | Path: docs/research/*
