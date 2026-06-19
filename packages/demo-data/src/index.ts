// @leapmoney/demo-data — Single source of truth for platform demo data.
// All portal mock files (admin-demo, dsa-demo, lender-demo, dashboard-demo)
// import constants from here so aggregate numbers stay consistent across portals.
// Demo mode only — no live APIs, CRM, LOS/LMS, or bureau integrations.

// ── Canonical platform aggregates ────────────────────────────────────────────
// These are the authoritative numbers. Admin Control Tower is the system of
// record; all portal-level views are subsets of these totals.
export const PLATFORM = {
  total_borrowers: 8640,
  total_dsas: 240,
  total_applications: 1284,
  total_disbursals: 412,
  avg_ticket_inr: 875000,       // ₹8.75L average loan ticket
  platform_take_rate: 0.011,    // 1.1% of disbursed volume
  dsa_commission_rate: 0.015,   // 1.5% of disbursed volume
} as const;

// Derived financials — computed once so every portal uses the same ₹ figures.
const _vol = PLATFORM.total_disbursals * PLATFORM.avg_ticket_inr; // ₹36.05 Cr
export const PLATFORM_FINANCIALS = {
  disbursal_volume: _vol,
  platform_revenue: Math.round(_vol * PLATFORM.platform_take_rate),  // ~₹39.66L
  commission_pool: Math.round(_vol * PLATFORM.dsa_commission_rate),   // ~₹54.08L
} as const;

// ── Shared reference lists ────────────────────────────────────────────────────
// Use these instead of local copies so the same lender names/spellings appear
// consistently across Admin, DSA, Lender, and Borrower portals.

export const LENDER_NAMES = [
  "HDFC Bank",
  "ICICI Bank",
  "Bajaj Finance",
  "Axis Bank",
  "Tata Capital",
  "MoneyView",
  "KreditBee",
] as const;
export type LenderName = (typeof LENDER_NAMES)[number];

export const PRODUCT_NAMES = [
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "LAP",
  "Credit Card",
] as const;
export type ProductName = (typeof PRODUCT_NAMES)[number];

export const LEAD_SOURCE_NAMES = [
  "Borrower Direct",
  "DSA",
  "Referral",
  "Organic",
] as const;
export type LeadSourceName = (typeof LEAD_SOURCE_NAMES)[number];

// Canonical borrower name pool. Same order used in every portal so the same
// index produces the same person — enabling cross-portal narrative consistency.
export const BORROWER_NAMES = [
  "Priya Sharma",   "Rahul Verma",    "Anjali Nair",    "Vikram Singh",
  "Sneha Reddy",    "Arjun Mehta",    "Kavya Iyer",     "Rohan Gupta",
  "Meera Joshi",    "Aditya Rao",     "Pooja Patel",    "Karthik Menon",
  "Divya Pillai",   "Sanjay Kumar",   "Neha Agarwal",   "Amit Desai",
  "Ritu Banerjee",  "Suresh Babu",    "Tanvi Shah",     "Manish Tiwari",
  "Ananya Bose",    "Gaurav Malhotra","Shruti Kulkarni", "Deepak Yadav",
  "Isha Chopra",    "Nikhil Saxena",
] as const;

// First/last name components for admin user-management tables (builds a larger
// synthetic population via cross-product rather than the fixed name list).
export const FIRST_NAMES = [
  "Priya", "Rahul", "Anjali", "Vikram", "Sneha", "Arjun", "Kavya", "Rohan",
  "Meera", "Aditya", "Pooja", "Karthik", "Divya", "Sanjay", "Neha", "Amit",
  "Ritu", "Suresh",
] as const;
export const LAST_NAMES = [
  "Sharma", "Verma", "Nair", "Singh", "Reddy", "Mehta",
  "Iyer", "Gupta", "Joshi", "Rao", "Patel", "Menon",
] as const;

export const CITY_NAMES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai",
  "Pune", "Ahmedabad", "Kolkata", "Jaipur", "Surat",
] as const;

export const EMPLOYER_CATEGORIES = [
  "Government", "PSU", "MNC", "Listed", "Startup", "SME", "Self-Employed", "Professional",
] as const;
export type EmployerCategory = (typeof EMPLOYER_CATEGORIES)[number];

// ── Shared utilities ──────────────────────────────────────────────────────────

/** Format a number as an Indian rupee string (₹X,XX,XXX). */
export function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Cyclic array pick — wraps index to array length. */
export function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length]!;
}

/** Map employer category to a stability rating. */
export function employerStability(category: EmployerCategory): "High" | "Medium" | "Low" {
  if (["Government", "PSU", "MNC", "Listed"].includes(category)) return "High";
  if (["SME", "Self-Employed"].includes(category)) return "Low";
  return "Medium";
}
