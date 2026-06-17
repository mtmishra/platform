"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { setAnalyticsConsent } from "@leapmoney/analytics";

export interface ConsentState {
  /** Strictly necessary cookies are always on and cannot be disabled. */
  necessary: true;
  analytics: boolean;
}

interface ConsentContextValue {
  consent: ConsentState | null; // null = no decision yet
  decided: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (analytics: boolean) => void;
  reopen: () => void;
  showBanner: boolean;
}

const STORAGE_KEY = "lm_consent_v1";

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [decided, setDecided] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Hydrate from storage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsentState;
        setConsent(parsed);
        setDecided(true);
        setAnalyticsConsent(Boolean(parsed.analytics));
      } else {
        setShowBanner(true);
      }
    } catch {
      setShowBanner(true);
    }
  }, []);

  const persist = useCallback((next: ConsentState) => {
    setConsent(next);
    setDecided(true);
    setShowBanner(false);
    setAnalyticsConsent(next.analytics);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — consent applies for this session only */
    }
  }, []);

  const acceptAll = useCallback(
    () => persist({ necessary: true, analytics: true }),
    [persist]
  );
  const rejectAll = useCallback(
    () => persist({ necessary: true, analytics: false }),
    [persist]
  );
  const savePreferences = useCallback(
    (analytics: boolean) => persist({ necessary: true, analytics }),
    [persist]
  );
  const reopen = useCallback(() => setShowBanner(true), []);

  const value = useMemo<ConsentContextValue>(
    () => ({ consent, decided, acceptAll, rejectAll, savePreferences, reopen, showBanner }),
    [consent, decided, acceptAll, rejectAll, savePreferences, reopen, showBanner]
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within a ConsentProvider");
  return ctx;
}
