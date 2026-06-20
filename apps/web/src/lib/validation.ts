// ── Lightweight client-side form validation ──────────────────────────────────
// No external dependency. Returns a human-readable error string, or undefined
// when the value is valid.

export function validateRequired(value: string, label = "This field"): string | undefined {
  return value.trim().length === 0 ? `${label} is required.` : undefined;
}

export function validateName(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Please enter your name.";
  if (v.length < 2) return "Name is too short.";
  return undefined;
}

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Please enter your email.";
  // Pragmatic email check.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email address.";
  return undefined;
}

export function validateIndianPhone(value: string): string | undefined {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Please enter your mobile number.";
  // Indian mobile: 10 digits starting 6-9, optional 91 prefix.
  const local = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  if (!/^[6-9]\d{9}$/.test(local)) return "Enter a valid 10-digit Indian mobile number.";
  return undefined;
}

export function validateMessage(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Please enter a message.";
  if (v.length < 10) return "Message should be at least 10 characters.";
  return undefined;
}

/** PAN card: 5 letters + 4 digits + 1 letter, uppercase. */
export function validatePAN(value: string): string | undefined {
  const v = value.trim().toUpperCase();
  if (!v) return "PAN card number is required for bureau check.";
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v)) return "Enter a valid PAN (e.g. ABCDE1234F).";
  return undefined;
}

/** Monthly income — positive integer, min ₹5,000 */
export function validateMonthlyIncome(value: string): string | undefined {
  const n = parseInt(value.replace(/[,\s]/g, ""), 10);
  if (!value.trim()) return "Please enter your monthly income.";
  if (isNaN(n) || n < 5000) return "Minimum monthly income should be ₹5,000.";
  return undefined;
}

/** Returns true when every value in the errors map is undefined. */
export function isFormValid(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).every((e) => !e);
}
