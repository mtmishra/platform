import type { AppRole } from "./types";

// ── RBAC ─────────────────────────────────────────────────────────────────────
// Central role definitions. Each surface (borrower/dsa/lender/admin app) maps to
// a role; route guards and RLS both reference these values.

export const ROLES = {
  BORROWER: "borrower",
  DSA: "dsa",
  LENDER: "lender",
  ADMIN: "admin",
} as const satisfies Record<string, AppRole>;

export const ALL_ROLES: AppRole[] = ["borrower", "dsa", "lender", "admin"];

/** Which app surface a role belongs to. */
export const ROLE_HOME: Record<AppRole, string> = {
  borrower: "/dashboard",
  dsa: "/dashboard",
  lender: "/dashboard",
  admin: "/dashboard",
};

export function isRole(value: unknown): value is AppRole {
  return (
    value === "borrower" ||
    value === "dsa" ||
    value === "lender" ||
    value === "admin"
  );
}

/** True when `role` is allowed by `allowed` (single or list). */
export function hasRole(
  role: AppRole | null | undefined,
  allowed: AppRole | AppRole[]
): boolean {
  if (!role) return false;
  return Array.isArray(allowed) ? allowed.includes(role) : role === allowed;
}
