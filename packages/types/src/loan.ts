export type LoanStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "disbursed"
  | "closed";

export interface LoanApplication {
  id: string;
  userId: string;
  amount: number;
  tenure: number;
  purpose: string;
  status: LoanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoanOffer {
  id: string;
  applicationId: string;
  lenderId: string;
  interestRate: number;
  tenure: number;
  emi: number;
  processingFee: number;
  expiresAt: string;
}
