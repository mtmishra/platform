export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Please enter your email.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email address.";
  return undefined;
}
