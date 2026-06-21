"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  workflowActionTypes,
  workflowAssignToOptions,
  workflowConditions,
  workflowTriggerTypes,
  type CreateWorkflowPayload,
} from "@/data/automationBuilder";

type CreateWorkflowModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: CreateWorkflowPayload) => void;
};

const emptyForm: CreateWorkflowPayload = {
  name: "",
  triggerType: "",
  condition: "",
  actionType: "",
  assignTo: "",
};

export function CreateWorkflowModal({ open, onClose, onSave }: CreateWorkflowModalProps) {
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
    if (!form.name.trim() || !form.triggerType || !form.condition || !form.actionType || !form.assignTo) {
      setError("All fields are required.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close create workflow modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Create workflow">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Create Workflow</h2>
            <p className="va-ops-modal-subtitle">Define trigger, condition, and action for a new automation.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>
        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Workflow Name *</span>
            <input
              className="intake-form-input"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Renewal Reminder Flow"
            />
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Trigger Type *</span>
            <select
              className="intake-form-input"
              value={form.triggerType}
              onChange={(e) => setForm((prev) => ({ ...prev, triggerType: e.target.value }))}
            >
              <option value="">Select trigger</option>
              {workflowTriggerTypes.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Condition *</span>
            <select
              className="intake-form-input"
              value={form.condition}
              onChange={(e) => setForm((prev) => ({ ...prev, condition: e.target.value }))}
            >
              <option value="">Select condition</option>
              {workflowConditions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Action Type *</span>
            <select
              className="intake-form-input"
              value={form.actionType}
              onChange={(e) => setForm((prev) => ({ ...prev, actionType: e.target.value }))}
            >
              <option value="">Select action</option>
              {workflowActionTypes.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="intake-form-field">
            <span className="intake-form-label">Assign To *</span>
            <select
              className="intake-form-input"
              value={form.assignTo}
              onChange={(e) => setForm((prev) => ({ ...prev, assignTo: e.target.value }))}
            >
              <option value="">Select assignee</option>
              {workflowAssignToOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>
        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>
            Save Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
