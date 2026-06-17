"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemePickerPanel } from "@/components/theme/ThemePickerPanel";
import {
  applyTheme,
  clearPickThemeCookie,
  persistTheme,
  readPickThemeCookie,
  readStoredTheme,
} from "@/lib/themeUtils";
import type { ThemeId } from "@/lib/themes";

export function ThemeWelcomeScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    applyTheme(readStoredTheme());

    if (!readPickThemeCookie()) {
      router.replace("/dashboard");
      return;
    }

    setReady(true);
  }, [router]);

  const handleContinue = (selectedTheme: ThemeId) => {
    persistTheme(selectedTheme);
    clearPickThemeCookie();
    router.replace("/dashboard");
  };

  if (!ready) {
    return (
      <div className="theme-welcome-page">
        <div className="theme-welcome-loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="theme-welcome-page">
      <ThemePickerPanel currentTheme={theme} onContinue={handleContinue} />
    </div>
  );
}
