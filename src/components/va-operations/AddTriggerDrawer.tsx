"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { triggerSourceOptions, type AddTriggerPayload } from "@/data/automationBuilder";
import { cn } from "@/lib/cn";

type AddTriggerDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: AddTriggerPayload) => void;
};

const emptyForm: AddTriggerPayload = {
  name: "",
  source: "",
  delayTime: "",
  condition: "",
  enabled: true,
};

export function AddTriggerDrawer({ open, onClose, onSave }: AddTriggerDrawerProps) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm);
    setError(null);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    if (!form.name.trim() || !form.source || !form.delayTime.trim()) {
      setError("Trigger name, source, and delay time are required.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close add trigger drawer" onClick={onClose} />
      <aside className="va-ops-drawer" role="dialog" aria-modal="true" aria-label="Add trigger">
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar va-ops-workflow-avatar" aria-hidden="true">
              <AppIcon name="target" size={20} strokeWidth={2} />
            </span>
            <div>
              <div className="va-ops-drawer-name">Add Trigger</div>
              <div className="va-ops-drawer-role">Configure a new workflow trigger</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Trigger Name *</span>
            <input
              className="intake-form-input"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. High-priority lead alert"
            />
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Trigger Source *</span>
            <select
              className="intake-form-input"
              value={form.source}
              onChange={(e) => setForm((prev) => ({ ...prev, source: e.target.value }))}
            >
              <option value="">Select source</option>
              {triggerSourceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Delay Time *</span>
            <input
              className="intake-form-input"
              value={form.delayTime}
              onChange={(e) => setForm((prev) => ({ ...prev, delayTime: e.target.value }))}
              placeholder="e.g. 5 minutes"
            />
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Trigger Condition</span>
            <input
              className="intake-form-input"
              value={form.condition}
              onChange={(e) => setForm((prev) => ({ ...prev, condition: e.target.value }))}
              placeholder="e.g. Only if lead is unassigned"
            />
          </label>
          <label className="intake-form-field va-ops-toggle-field">
            <span className="intake-form-label">Enable Trigger</span>
            <button
              type="button"
              role="switch"
              aria-checked={form.enabled}
              className={cn("va-ops-toggle", form.enabled && "active")}
              onClick={() => setForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
            >
              <span className="va-ops-toggle-thumb" />
              <span className="va-ops-toggle-label">{form.enabled ? "Enabled" : "Disabled"}</span>
            </button>
          </label>
          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>

        <div className="va-ops-drawer-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>
            Save Trigger
          </button>
        </div>
      </aside>
    </div>
  );
}
