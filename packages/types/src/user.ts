export type UserRole = "borrower" | "dsa" | "lender" | "admin";

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  kycVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
