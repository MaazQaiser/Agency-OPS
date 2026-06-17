"use client";

import { useEffect, useState } from "react";
import { ThemePickerPanel } from "@/components/theme/ThemePickerPanel";
import type { ThemeId } from "@/lib/themes";

type ThemePickerModalProps = {
  open: boolean;
  currentTheme: ThemeId;
  onContinue: (theme: ThemeId) => void;
};

export function ThemePickerModal({ open, currentTheme, onContinue }: ThemePickerModalProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId>(currentTheme);

  useEffect(() => {
    if (open) {
      setActiveTheme(currentTheme);
    }
  }, [open, currentTheme]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="theme-modal-overlay" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="theme-modal-title">
        <ThemePickerPanel currentTheme={activeTheme} onContinue={onContinue} />
      </div>
    </div>
  );
}
