"use client";

import { useState } from "react";
import { themeOptions, type ThemeId } from "@/lib/themes";

type ThemePickerPanelProps = {
  currentTheme: ThemeId;
  onContinue: (theme: ThemeId) => void;
  className?: string;
};

export function ThemePickerPanel({ currentTheme, onContinue, className }: ThemePickerPanelProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>(currentTheme);

  return (
    <div className={className ?? "theme-modal"}>
      <div className="theme-modal-header">
        <h2 id="theme-modal-title" className="theme-modal-title">
          Choose your theme
        </h2>
        <p className="theme-modal-subtitle">
          Pick a look for Agency OPS before you enter the dashboard. You can change this anytime
          from profile settings.
        </p>
      </div>

      <div className="theme-modal-grid" role="listbox" aria-label="Theme options">
        {themeOptions.map((option) => {
          const isSelected = selectedTheme === option.id;

          return (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`theme-option${isSelected ? " selected" : ""}`}
              onClick={() => setSelectedTheme(option.id)}
            >
              <span
                className="theme-option-preview"
                style={{
                  background: `linear-gradient(135deg, ${option.swatch[0]} 0%, ${option.swatch[1]} 52%, ${option.swatch[2]} 100%)`,
                }}
              />
              <span className="theme-option-label">{option.label}</span>
              <span className="theme-option-description">{option.description}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="theme-modal-continue"
        onClick={() => onContinue(selectedTheme)}
      >
        Continue to dashboard
      </button>
    </div>
  );
}
