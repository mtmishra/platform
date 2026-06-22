// Mock loan-application data (Sprint 14). Demo workflow only â€” no APIs, CRM,
// lender integrations, KYC providers, or document storage. Mirrors the Sprint 10
// `application` schema + Sprint 8 approval outputs.

import type { ApplicationStatus } from "@leapmoney/outcomes";
import type { ApprovalConfidence } from "@leapmoney/match";

export type DocType = "PAN" | "Aadhaar" | "Salary Slip" | "Bank Statement" | "ITR";
export type DocStatus = "uploaded" | "missing";
export type KycStatus = "pending" | "in_progress" | "verified";

export interface AppDocument {
  type: DocType;
  status: DocStatus;
}

export type TimelineStepStatus = "done" | "current" | "pending";

export interface TimelineStep {
  key: string;
  label: string;
  status: TimelineStepStatus;
  at: string | null;
}

export interface DemoApplication {
  id: string;
  lender_id: string;
  lender_name: string;
  loan_type: string;
  amount: number;
  tenure_months: number;
  rate: number;
  emi: number;
  approval_probability: number;
  confidence: ApprovalConfidence;
  expected_decision_time: string;
  match_reason: string;
  status: ApplicationStatus;
  kyc_status: KycStatus;
  documents: AppDocument[];
  last_updated: string;
  created_at: string;
}

const TIMELINE_ORDER = [
  { key: "created", label: "Application created" },
  { key: "documents", label: "Documents uploaded" },
  { key: "kyc", label: "KYC completed" },
  { key: "review", label: "Under review" },
  { key: "decision", label: "Decision generated" },
  { key: "disbursal", label: "Disbursal" },
] as const;

// How many timeline steps are complete for a given status.
const STATUS_PROGRESS: Record<ApplicationStatus, number> = {
  draft: 1,
  submitted: 2,
  under_review: 4,
  approved: 5,
  rejected: 5,
  disbursed: 6,
  withdrawn: 1,
};

export function buildTimeline(app: DemoApplication): TimelineStep[] {
  const done = STATUS_PROGRESS[app.status];
  return TIMELINE_ORDER.map((step, i) => {
    const status: TimelineStepStatus = i < done ? "done" : i === done ? "current" : "pending";
    // Relabel the decision step by outcome.
    let label: string = step.label;
    if (step.key === "decision" && app.status === "approved") label = "Approved";
    if (step.key === "decision" && app.status === "rejected") label = "Decision: not approved";
    const hoursAgo = (done - i - 1) * 3;
    const ts = new Date(new Date(app.last_updated).getTime() - hoursAgo * 3600 * 1000).toISOString();
    return { key: step.key, label, status, at: i < done ? ts : null };
  });
}

const FULL_DOCS: DocType[] = ["PAN", "Aadhaar", "Salary Slip", "Bank Statement", "ITR"];
const docs = (uploaded: DocType[]): AppDocument[] =>
  FULL_DOCS.map((t) => ({ type: t, status: uploaded.includes(t) ? "uploaded" : "missing" }));

const SEED_APPLICATIONS: DemoApplication[] = [
  {
    id: "AP-100482",
    lender_id: "hdfc",
    lender_name: "HDFC Bank",
    loan_type: "Personal Loan",
    amount: 1000000,
    tenure_months: 60,
    rate: 11.0,
    emi: 21740,
    approval_probability: 87,
    confidence: "high",
    expected_decision_time: "48 hours",
    match_reason: "Your CIBIL 738 and 5-year employment fit HDFC's approval band; 87% of similar profiles were approved.",
    status: "under_review",
    kyc_status: "verified",
    documents: docs(["PAN", "Aadhaar", "Salary Slip", "Bank Statement"]),
    last_updated: "2026-06-17T09:30:00.000Z",
    created_at: "2026-06-16T18:00:00.000Z",
  },
  {
    id: "AP-100455",
    lender_id: "bajaj",
    lender_name: "Bajaj Finance",
    loan_type: "Personal Loan",
    amount: 500000,
    tenure_months: 36,
    rate: 13.5,
    emi: 16970,
    approval_probability: 92,
    confidence: "high",
    expected_decision_time: "2 hours",
    match_reason: "Bajaj uses Experian (746) as its primary bureau â€” a strong fit for your profile.",
    status: "disbursed",
    kyc_status: "verified",
    documents: docs(["PAN", "Aadhaar", "Salary Slip", "Bank Statement", "ITR"]),
    last_updated: "2026-06-10T12:00:00.000Z",
    created_at: "2026-06-08T10:00:00.000Z",
  },
  {
    id: "AP-100501",
    lender_id: "icici",
    lender_name: "ICICI Bank",
    loan_type: "Personal Loan",
    amount: 800000,
    tenure_months: 48,
    rate: 10.85,
    emi: 20560,
    approval_probability: 80,
    confidence: "medium",
    expected_decision_time: "24 hours",
    match_reason: "Your profile meets ICICI's criteria with comfortable FOIR headroom.",
    status: "draft",
    kyc_status: "pending",
    documents: docs(["PAN"]),
    last_updated: "2026-06-18T08:00:00.000Z",
    created_at: "2026-06-18T08:00:00.000Z",
  },
];

export function getApplications(): DemoApplication[] {
  return SEED_APPLICATIONS;
}

export function getApplication(id: string): DemoApplication | undefined {
  return SEED_APPLICATIONS.find((a) => a.id === id);
}

/** Status summary counts for the dashboard. */
export function getStatusSummary(): Record<ApplicationStatus, number> {
  const base: Record<ApplicationStatus, number> = {
    draft: 0,
    submitted: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0,
    withdrawn: 0,
  };
  for (const a of SEED_APPLICATIONS) base[a.status] += 1;
  return base;
}

