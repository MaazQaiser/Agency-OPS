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
import { DEFAULT_THEME_ID, type ThemeId } from "@/lib/themes";
import { applyTheme, persistTheme, readStoredTheme } from "@/lib/themeUtils";
import { ThemePickerModal } from "./ThemePickerModal";

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  openThemePicker: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME_ID);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    setThemeState(storedTheme);
    applyTheme(storedTheme);
    setHydrated(true);
  }, []);

  const setTheme = useCallback((nextTheme: ThemeId) => {
    setThemeState(nextTheme);
    persistTheme(nextTheme);
  }, []);

  const openThemePicker = useCallback(() => {
    setPickerOpen(true);
  }, []);

  const handleContinue = useCallback(
    (selectedTheme: ThemeId) => {
      setTheme(selectedTheme);
      setPickerOpen(false);
    },
    [setTheme],
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      openThemePicker,
    }),
    [theme, setTheme, openThemePicker],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {hydrated && (
        <ThemePickerModal
          open={pickerOpen}
          currentTheme={theme}
          onContinue={handleContinue}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
