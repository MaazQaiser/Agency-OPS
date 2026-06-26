"use client";

import { cn } from "@/lib/cn";
import type { RetentionLocale } from "@/data/retentionI18n";
import { useRetentionLocale } from "@/components/retention/RetentionLanguageProvider";
import { useEntitlements } from "@/hooks/useEntitlements";

const OPTIONS: { id: RetentionLocale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "kr", label: "KR" },
];

export function RetentionLanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, switching } = useRetentionLocale();
  const { hasFeature } = useEntitlements();
  const options = hasFeature("korean-department") ? OPTIONS : OPTIONS.filter((o) => o.id === "en");

  if (options.length <= 1) return null;

  return (
    <div
      className={cn("retention-lang-toggle", className)}
      role="group"
      aria-label="Retention hub language"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={cn(
            "retention-lang-toggle-btn",
            locale === option.id && "active",
            switching && locale !== option.id && "retention-lang-toggle-btn--dim",
          )}
          aria-pressed={locale === option.id}
          disabled={switching}
          onClick={() => setLocale(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
