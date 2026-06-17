// ── Public environment configuration ─────────────────────────────────────────
// Reads NEXT_PUBLIC_* vars that are safe to expose to the client. All values are
// optional in this sprint (no backend wired) — the site builds and runs without
// any of them. `validatePublicEnv` surfaces non-fatal warnings in development.

export interface PublicEnv {
  siteUrl: string;
  ga4MeasurementId?: string | undefined;
}

export function getPublicEnv(): PublicEnv {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://leapmoney.net",
    ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  };
}

/**
 * Returns a list of human-readable warnings for missing-but-recommended config.
 * Never throws — the site must build on Vercel without secrets configured.
 */
export function validatePublicEnv(): string[] {
  const warnings: string[] = [];
  const env = getPublicEnv();

  if (!env.ga4MeasurementId) {
    warnings.push(
      "NEXT_PUBLIC_GA4_MEASUREMENT_ID is not set — analytics will be disabled."
    );
  }

  if (process.env.NODE_ENV !== "production") {
    for (const w of warnings) {
      // eslint-disable-next-line no-console
      console.warn(`[env] ${w}`);
    }
  }

  return warnings;
}
