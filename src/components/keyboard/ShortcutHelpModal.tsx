"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  keyboardShortcutCatalog,
  shortcutCategoryLabels,
  type ShortcutCategory,
  type ShortcutDefinition,
} from "@/data/keyboardShortcuts";
import { formatShortcutKeys } from "@/lib/keyboardShortcutUtils";
import { cn } from "@/lib/cn";

type ShortcutHelpModalProps = {
  open: boolean;
  onClose: () => void;
};

const sectionOrder: ShortcutCategory[] = [
  "global",
  "commercial",
  "send-center",
  "finance",
  "training",
  "carrier",
  "va-ops",
  "system",
  "notifications",
  "detail",
  "modals",
];

export function ShortcutHelpModal({ open, onClose }: ShortcutHelpModalProps) {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setMounted(false);
      return;
    }
    requestAnimationFrame(() => {
      setMounted(true);
      inputRef.current?.focus();
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return keyboardShortcutCatalog;
    return keyboardShortcutCatalog.filter(
      (s) =>
        s.label.toLowerCase().includes(q) ||
        s.keys.toLowerCase().includes(q) ||
        shortcutCategoryLabels[s.category].toLowerCase().includes(q),
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<ShortcutCategory, ShortcutDefinition[]>();
    for (const section of sectionOrder) {
      const items = filtered.filter((s) => s.category === section);
      if (items.length > 0) map.set(section, items);
    }
    return map;
  }, [filtered]);

  if (!open) return null;

  return (
    <>
      <div
        className={cn("ops-shortcut-help-backdrop", mounted && "visible")}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn("ops-shortcut-help", mounted && "visible")}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        data-shortcut-ignore
      >
        <header className="ops-shortcut-help-header">
          <div>
            <h2 className="ops-shortcut-help-title">Keyboard Shortcuts</h2>
            <p className="ops-shortcut-help-sub">Speed layer for Agency OPS power users</p>
          </div>
          <button type="button" className="ops-shortcut-help-close" onClick={onClose} aria-label="Close">
            <AppIcon name="close" size={18} strokeWidth={2} />
          </button>
        </header>

        <label className="ops-shortcut-help-search">
          <AppIcon name="search" size={16} strokeWidth={2} />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search shortcuts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search shortcuts"
          />
          <kbd className="ops-shortcut-hint">ESC</kbd>
        </label>

        <div className="ops-shortcut-help-body">
          {grouped.size === 0 ? (
            <p className="ops-shortcut-help-empty">No shortcuts match your search.</p>
          ) : (
            Array.from(grouped.entries()).map(([category, items]) => (
              <section key={category} className="ops-shortcut-help-section" aria-label={shortcutCategoryLabels[category]}>
                <h3 className="ops-shortcut-help-section-title">{shortcutCategoryLabels[category]}</h3>
                <ul className="ops-shortcut-help-list">
                  {items.map((item) => (
                    <li key={item.id} className="ops-shortcut-help-item">
                      <span className="ops-shortcut-help-label">{item.label}</span>
                      <kbd className="ops-shortcut-kbd">{formatShortcutKeys(item.keys)}</kbd>
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>

        <footer className="ops-shortcut-help-footer">
          Press <kbd className="ops-shortcut-kbd">?</kbd> anytime to open this guide
        </footer>
      </div>
    </>
  );
}
