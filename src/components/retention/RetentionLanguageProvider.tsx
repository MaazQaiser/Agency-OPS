"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DM_Sans, Noto_Sans_KR } from "next/font/google";
import {
  RETENTION_LOCALE_STORAGE_KEY,
  getRetentionCopy,
  type RetentionCopy,
  type RetentionLocale,
} from "@/data/retentionI18n";
import { useSubscription } from "@/components/subscription/SubscriptionProvider";

const retentionEnFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-retention-en",
  weight: ["400", "500", "600", "700"],
});

const retentionKrFont = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-retention-kr",
  weight: ["400", "500", "600", "700"],
});

type RetentionLanguageContextValue = {
  locale: RetentionLocale;
  setLocale: (locale: RetentionLocale) => void;
  switching: boolean;
  copy: RetentionCopy;
};

const RetentionLanguageContext = createContext<RetentionLanguageContextValue | null>(null);

function loadLocale(): RetentionLocale {
  if (typeof window === "undefined") return "en";
  try {
    const raw = localStorage.getItem(RETENTION_LOCALE_STORAGE_KEY);
    return raw === "kr" ? "kr" : "en";
  } catch {
    return "en";
  }
}

export function RetentionLanguageProvider({ children }: { children: ReactNode }) {
  const { hasFeature, hydrated: subscriptionHydrated } = useSubscription();
  const [locale, setLocaleState] = useState<RetentionLocale>("en");
  const [hydrated, setHydrated] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    if (!subscriptionHydrated) return;
    const loaded = loadLocale();
    const allowed = loaded === "kr" && !hasFeature("korean-department") ? "en" : loaded;
    setLocaleState(allowed);
    if (allowed !== loaded) {
      try {
        localStorage.setItem(RETENTION_LOCALE_STORAGE_KEY, allowed);
      } catch {
        /* ignore */
      }
    }
    setHydrated(true);
  }, [hasFeature, subscriptionHydrated]);

  const setLocale = useCallback(
    (next: RetentionLocale) => {
      if (next === "kr" && !hasFeature("korean-department")) return;
      if (next === locale) return;
      setSwitching(true);
      window.setTimeout(() => {
        setLocaleState(next);
        try {
          localStorage.setItem(RETENTION_LOCALE_STORAGE_KEY, next);
        } catch {
          /* ignore */
        }
        window.setTimeout(() => setSwitching(false), 180);
      }, 140);
    },
    [hasFeature, locale],
  );

  const copy = useMemo(() => getRetentionCopy(locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      switching,
      copy,
    }),
    [locale, setLocale, switching, copy],
  );

  if (!hydrated) {
    return (
      <div
        className={`${retentionEnFont.variable} ${retentionKrFont.variable} module-retention retention-locale-root`}
        data-retention-locale="en"
      >
        {children}
      </div>
    );
  }

  return (
    <RetentionLanguageContext.Provider value={value}>
      <div
        className={`${retentionEnFont.variable} ${retentionKrFont.variable} module-retention retention-locale-root`}
        data-retention-locale={locale}
        data-retention-switching={switching ? "true" : undefined}
      >
        {children}
      </div>
    </RetentionLanguageContext.Provider>
  );
}

export function useRetentionLocale() {
  const ctx = useContext(RetentionLanguageContext);
  if (!ctx) {
    return {
      locale: "en" as RetentionLocale,
      setLocale: () => {},
      switching: false,
      copy: getRetentionCopy("en"),
    };
  }
  return ctx;
}
