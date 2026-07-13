"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import {
  trainingPriorityOptions,
  trainingResourceOptions,
  trainingTeamMemberOptions,
  validateAssignTraining,
  type AssignTrainingPayload,
  type TrainingPriority,
} from "@/data/trainingHubActions";

type AssignTrainingModalProps = {
  open: boolean;
  onClose: () => void;
  onAssign: (payload: AssignTrainingPayload) => void;
};

const emptyForm: AssignTrainingPayload = {
  training: "",
  users: [],
  dueDate: "",
  priority: "Medium",
};

export function AssignTrainingModal({ open, onClose, onAssign }: AssignTrainingModalProps) {
  const toast = useToast();
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

  const toggleUser = (user: string) => {
    setForm((prev) => ({
      ...prev,
      users: prev.users.includes(user)
        ? prev.users.filter((name) => name !== user)
        : [...prev.users, user],
    }));
    setError(null);
  };

  const handleAssign = () => {
    const validation = validateAssignTraining(form);
    if (!validation.ok) {
      setError(validation.error ?? "Unable to assign training.");
      return;
    }

    onAssign(form);
    toast.success(toastMessages.training.assignmentSent);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close assign training modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Assign training">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Assign Training</h2>
            <p className="va-ops-modal-subtitle">Assign an Insurance Town resource to team members with a due date.</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Select Training *</span>
            <select
              className="intake-form-input"
              value={form.training}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, training: e.target.value }));
                setError(null);
              }}
            >
              <option value="">Select training resource</option>
              {trainingResourceOptions.map((training) => (
                <option key={training} value={training}>{training}</option>
              ))}
            </select>
          </label>

          <fieldset className="intake-form-field intake-form-yesno">
            <legend className="intake-form-label">Select User(s) *</legend>
            <div className="intake-form-checkboxes">
              {trainingTeamMemberOptions.map((user) => (
                <label key={user} className="intake-form-checkbox">
                  <input
                    type="checkbox"
                    checked={form.users.includes(user)}
                    onChange={() => toggleUser(user)}
                  />
                  {user}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="intake-form-field">
            <span className="intake-form-label">Due Date *</span>
            <input
              className="intake-form-input"
              type="date"
              value={form.dueDate}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, dueDate: e.target.value }));
                setError(null);
              }}
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Priority</span>
            <select
              className="intake-form-input"
              value={form.priority}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, priority: e.target.value as TrainingPriority }));
                setError(null);
              }}
            >
              {trainingPriorityOptions.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </label>

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>

        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleAssign}>
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
