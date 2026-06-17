// ── Database types ───────────────────────────────────────────────────────────
// Mirrors the SQL schema in supabase/migrations. Hand-written (not generated) so
// the foundation type-checks before a live project exists. Keep in sync with the
// migrations.

export type AppRole = "borrower" | "dsa" | "lender" | "admin";

export type OnboardingStep =
  | "registered"
  | "profile"
  | "consent"
  | "complete";

export interface UsersProfileRow {
  id: string;
  auth_user_id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: AppRole;
  profile_completed: boolean;
  onboarding_step: OnboardingStep;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsRow {
  user_id: string;
  notifications_email: boolean;
  notifications_whatsapp: boolean;
  theme: "light" | "dark" | "system";
  updated_at: string;
}

export interface UserConsentRow {
  id: string;
  user_id: string;
  purpose: string;
  version: string;
  granted: boolean;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  user_id: string | null;
  action: string;
  entity: string | null;
  metadata: Record<string, unknown> | null;
  ip: string | null;
  created_at: string;
}

type Insertable<T, Auto extends keyof T> = Omit<T, Auto> & Partial<Pick<T, Auto>>;

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: UsersProfileRow;
        Insert: Insertable<UsersProfileRow, "id" | "created_at" | "updated_at" | "profile_completed" | "onboarding_step" | "role">;
        Update: Partial<UsersProfileRow>;
      };
      user_settings: {
        Row: UserSettingsRow;
        Insert: Insertable<UserSettingsRow, "updated_at" | "notifications_email" | "notifications_whatsapp" | "theme">;
        Update: Partial<UserSettingsRow>;
      };
      user_consent: {
        Row: UserConsentRow;
        Insert: Insertable<UserConsentRow, "id" | "created_at">;
        Update: never;
      };
      audit_log: {
        Row: AuditLogRow;
        Insert: Insertable<AuditLogRow, "id" | "created_at">;
        Update: never;
      };
    };
  };
}
