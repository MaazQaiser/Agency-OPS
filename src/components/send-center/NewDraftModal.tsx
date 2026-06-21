"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormSkeleton, LoadingButton } from "@/components/shared/loading";
import { useDrawerLoading } from "@/hooks/useTabLoading";
import { useModalCommand } from "@/hooks/useShortcutAction";
import { useToast } from "@/hooks/useToast";
import { toastMessages } from "@/lib/toastMessages";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  clearAutosavedDraft,
  computeDraftTotal,
  defaultNewDraftFormValues,
  formatCurrency,
  loadAutosavedDraft,
  parseCurrency,
  newDraftCarrierOptions,
  newDraftClientOptions,
  newDraftPolicyTypes,
  newDraftProducerOptions,
  newDraftProductTypes,
  newDraftRequiredDocuments,
  newDraftSubmissionTypes,
  saveAutosavedDraft,
  validateNewDraftForm,
  type NewDraftFormErrors,
  type NewDraftFormValues,
} from "@/data/newDraftForm";
import type { SendPriority } from "@/data/sendCenter";
import { cn } from "@/lib/cn";

type NewDraftModalProps = {
  open: boolean;
  initialValues?: Partial<NewDraftFormValues>;
  onClose: () => void;
  onSave: (form: NewDraftFormValues, submitForReview: boolean) => void;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="intake-form-error" role="alert">{message}</span>;
}

export function NewDraftModal({ open, initialValues, onClose, onSave }: NewDraftModalProps) {
  const [form, setForm] = useState<NewDraftFormValues>(defaultNewDraftFormValues);
  const [errors, setErrors] = useState<NewDraftFormErrors>({});
  const [dirty, setDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const initialLoadRef = useRef(false);
  const modalLoading = useDrawerLoading(open);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const totalCost = useMemo(() => computeDraftTotal(form), [form]);

  const updateField = <K extends keyof NewDraftFormValues>(key: K, value: NewDraftFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const toggleDocument = (docId: string) => {
    setForm((prev) => ({
      ...prev,
      requiredDocuments: {
        ...prev.requiredDocuments,
        [docId]: !prev.requiredDocuments[docId],
      },
    }));
    setDirty(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.requiredDocuments;
      return next;
    });
  };

  const resetForm = useCallback(() => {
    setForm(defaultNewDraftFormValues());
    setErrors({});
    setDirty(false);
    setLastSavedAt(null);
    clearAutosavedDraft();
  }, []);

  useEffect(() => {
    if (!open) {
      initialLoadRef.current = false;
      return;
    }

    if (!initialLoadRef.current) {
      const saved = loadAutosavedDraft();
      if (initialValues) {
        setForm({ ...defaultNewDraftFormValues(), ...initialValues });
        setDirty(true);
      } else if (saved) {
        setForm(saved);
        setDirty(true);
      } else {
        setForm(defaultNewDraftFormValues());
        setDirty(false);
      }
      setErrors({});
      initialLoadRef.current = true;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") event.preventDefault();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || !dirty) return;

    const timer = window.setInterval(() => {
      setAutoSaving(true);
      saveAutosavedDraft(form);
      setLastSavedAt(new Date());
      window.setTimeout(() => setAutoSaving(false), 600);
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [open, dirty, form]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (submitForReview: boolean) => {
    const validation = validateNewDraftForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 360));
    clearAutosavedDraft();
    onSave(form, submitForReview);
    resetForm();
    toast.success(
      submitForReview ? toastMessages.sendCenter.submittedForReview : toastMessages.sendCenter.draftSaved,
    );
    setSubmitting(false);
  };

  useModalCommand(
    {
      save: () => void handleSubmit(false),
      "save-draft": () => {
        saveAutosavedDraft(form);
        setLastSavedAt(new Date());
        toast.success("Draft saved");
      },
      submit: () => void handleSubmit(true),
    },
    open,
  );

  if (!open) return null;

  return (
    <div className="va-ops-modal-root send-center-new-draft-root" role="presentation">
      <div className="va-ops-drawer-backdrop send-center-new-draft-backdrop" aria-hidden="true" />
      <div
        className="va-ops-modal va-ops-modal-wide send-center-new-draft-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Create new draft"
        data-shortcut-ignore
      >
        <div className="va-ops-modal-header send-center-new-draft-header">
          <div>
            <div className="send-center-new-draft-title-row">
              <h2 className="va-ops-modal-title">Create New Draft</h2>
              {(dirty || autoSaving) && (
                <span className={cn("send-center-new-draft-status", autoSaving && "saving")}>
                  {autoSaving ? "Saving…" : "Unsaved changes"}
                </span>
              )}
              {lastSavedAt && !autoSaving && (
                <span className="send-center-new-draft-saved-at">
                  Auto-saved {lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </span>
              )}
            </div>
            <p className="va-ops-modal-subtitle">Start a new client proposal draft</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={handleClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="send-center-new-draft-body">
          {modalLoading ? (
            <FormSkeleton fields={8} label="Loading draft form" />
          ) : (
          <>
          <div className="send-center-new-draft-form">
            <section className="send-center-new-draft-section">
              <h3 className="send-center-new-draft-section-title">Client Information</h3>
              <div className="intake-form-grid">
                <label className="intake-form-field">
                  <span className="intake-form-label">Client Name <span className="intake-form-required">*</span></span>
                  <input
                    type="text"
                    className="intake-form-input"
                    list="new-draft-clients"
                    value={form.clientName}
                    onChange={(e) => updateField("clientName", e.target.value)}
                    placeholder="Search or enter client"
                  />
                  <datalist id="new-draft-clients">
                    {newDraftClientOptions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <FieldError message={errors.clientName} />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Business Name</span>
                  <input
                    type="text"
                    className="intake-form-input"
                    value={form.businessName}
                    onChange={(e) => updateField("businessName", e.target.value)}
                    placeholder="Legal business name"
                  />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Policy Type <span className="intake-form-required">*</span></span>
                  <select
                    className="intake-form-input"
                    value={form.policyType}
                    onChange={(e) => updateField("policyType", e.target.value)}
                  >
                    <option value="">Select policy type</option>
                    {newDraftPolicyTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <FieldError message={errors.policyType} />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Effective Date</span>
                  <input
                    type="date"
                    className="intake-form-input"
                    value={form.effectiveDate}
                    onChange={(e) => updateField("effectiveDate", e.target.value)}
                  />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Renewal Date</span>
                  <input
                    type="date"
                    className="intake-form-input"
                    value={form.renewalDate}
                    onChange={(e) => updateField("renewalDate", e.target.value)}
                  />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Producer Assigned <span className="intake-form-required">*</span></span>
                  <select
                    className="intake-form-input"
                    value={form.producerAssigned}
                    onChange={(e) => updateField("producerAssigned", e.target.value)}
                  >
                    <option value="">Select producer</option>
                    {newDraftProducerOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <FieldError message={errors.producerAssigned} />
                </label>
              </div>
            </section>

            <section className="send-center-new-draft-section">
              <h3 className="send-center-new-draft-section-title">Coverage Setup</h3>
              <div className="intake-form-grid">
                <label className="intake-form-field">
                  <span className="intake-form-label">Carrier <span className="intake-form-required">*</span></span>
                  <input
                    type="text"
                    className="intake-form-input"
                    list="new-draft-carriers"
                    value={form.carrier}
                    onChange={(e) => updateField("carrier", e.target.value)}
                    placeholder="Search or enter carrier"
                  />
                  <datalist id="new-draft-carriers">
                    {newDraftCarrierOptions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <FieldError message={errors.carrier} />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Product Type</span>
                  <select
                    className="intake-form-input"
                    value={form.productType}
                    onChange={(e) => updateField("productType", e.target.value)}
                  >
                    <option value="">Select product type</option>
                    {newDraftProductTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Coverage Limit</span>
                  <input
                    type="text"
                    className="intake-form-input"
                    value={form.coverageLimit}
                    onChange={(e) => updateField("coverageLimit", e.target.value)}
                    placeholder="e.g. $1M / $2M"
                  />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Deductible</span>
                  <input
                    type="text"
                    className="intake-form-input"
                    value={form.deductible}
                    onChange={(e) => updateField("deductible", e.target.value)}
                    placeholder="e.g. $1,000"
                  />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Premium Estimate <span className="intake-form-required">*</span></span>
                  <input
                    type="text"
                    className="intake-form-input"
                    value={form.premiumEstimate}
                    onChange={(e) => updateField("premiumEstimate", e.target.value)}
                    placeholder="e.g. 18420"
                  />
                  <FieldError message={errors.premiumEstimate} />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Broker Fee</span>
                  <input
                    type="text"
                    className="intake-form-input"
                    value={form.brokerFee}
                    onChange={(e) => updateField("brokerFee", e.target.value)}
                    placeholder="e.g. 925"
                  />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">Taxes / Fees</span>
                  <input
                    type="text"
                    className="intake-form-input"
                    value={form.taxesFees}
                    onChange={(e) => updateField("taxesFees", e.target.value)}
                    placeholder="e.g. 1104"
                  />
                </label>
              </div>
            </section>

            <section className="send-center-new-draft-section">
              <h3 className="send-center-new-draft-section-title">Submission Info</h3>
              <div className="intake-form-grid">
                <label className="intake-form-field">
                  <span className="intake-form-label">Submission Type <span className="intake-form-required">*</span></span>
                  <select
                    className="intake-form-input"
                    value={form.submissionType}
                    onChange={(e) => updateField("submissionType", e.target.value)}
                  >
                    <option value="">Select submission type</option>
                    {newDraftSubmissionTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <FieldError message={errors.submissionType} />
                </label>
                <label className="intake-form-field">
                  <span className="intake-form-label">MGA Contact</span>
                  <input
                    type="text"
                    className="intake-form-input"
                    value={form.mgaContact}
                    onChange={(e) => updateField("mgaContact", e.target.value)}
                    placeholder="Name · MGA"
                  />
                </label>
                <fieldset className="intake-form-field intake-form-field-full send-center-new-draft-priority">
                  <legend className="intake-form-label">Priority</legend>
                  <div className="send-center-new-draft-priority-options">
                    {(["Low", "Medium", "High"] as SendPriority[]).map((level) => (
                      <label key={level} className="send-center-new-draft-priority-option">
                        <input
                          type="radio"
                          name="draft-priority"
                          checked={form.priority === level}
                          onChange={() => updateField("priority", level)}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset className="intake-form-field intake-form-field-full">
                  <legend className="intake-form-label">
                    Required Documents <span className="intake-form-required">*</span>
                  </legend>
                  <div className="send-center-new-draft-checklist">
                    {newDraftRequiredDocuments.map((doc) => (
                      <label key={doc.id} className="send-center-new-draft-check-item">
                        <input
                          type="checkbox"
                          checked={Boolean(form.requiredDocuments[doc.id])}
                          onChange={() => toggleDocument(doc.id)}
                        />
                        {doc.label}
                      </label>
                    ))}
                  </div>
                  <FieldError message={errors.requiredDocuments} />
                </fieldset>
              </div>
            </section>

            <section className="send-center-new-draft-section">
              <h3 className="send-center-new-draft-section-title">Notes</h3>
              <div className="intake-form-grid">
                <label className="intake-form-field intake-form-field-full">
                  <span className="intake-form-label">Internal Notes</span>
                  <textarea
                    className="intake-form-input intake-form-textarea"
                    value={form.internalNotes}
                    onChange={(e) => updateField("internalNotes", e.target.value)}
                    rows={3}
                  />
                </label>
                <label className="intake-form-field intake-form-field-full">
                  <span className="intake-form-label">Special Conditions</span>
                  <textarea
                    className="intake-form-input intake-form-textarea"
                    value={form.specialConditions}
                    onChange={(e) => updateField("specialConditions", e.target.value)}
                    rows={2}
                  />
                </label>
                <label className="intake-form-field intake-form-field-full">
                  <span className="intake-form-label">Client Requests</span>
                  <textarea
                    className="intake-form-input intake-form-textarea"
                    value={form.clientRequests}
                    onChange={(e) => updateField("clientRequests", e.target.value)}
                    rows={2}
                  />
                </label>
              </div>
            </section>
          </div>

          <aside className="send-center-new-draft-preview" aria-label="Live draft summary">
            <h3 className="send-center-new-draft-preview-title">Draft Summary</h3>
            <dl className="send-center-new-draft-preview-list">
              <div><dt>Client</dt><dd>{form.clientName || "—"}</dd></div>
              <div><dt>Policy</dt><dd>{form.policyType || "—"}</dd></div>
              <div><dt>Carrier</dt><dd>{form.carrier || "—"}</dd></div>
              <div><dt>Premium</dt><dd>{form.premiumEstimate ? formatCurrency(parseCurrency(form.premiumEstimate)) : "—"}</dd></div>
              <div><dt>Fees</dt><dd>{form.brokerFee ? formatCurrency(parseCurrency(form.brokerFee)) : "—"}</dd></div>
              <div><dt>Total Cost</dt><dd className="send-center-new-draft-preview-total">{formatCurrency(totalCost)}</dd></div>
              <div><dt>Priority</dt><dd><span className={cn("badge", form.priority === "High" ? "badge-red" : form.priority === "Medium" ? "badge-yellow" : "badge-blue")}>{form.priority}</span></dd></div>
            </dl>
          </aside>
          </>
          )}
        </div>

        <div className="va-ops-modal-footer send-center-new-draft-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <div className="send-center-new-draft-footer-primary">
            <LoadingButton
              className="va-ops-role-action-btn"
              loading={submitting}
              loadingLabel="Submitting…"
              onClick={() => void handleSubmit(true)}
            >
              Save &amp; Submit for Review
            </LoadingButton>
            <LoadingButton
              className="va-ops-role-action-btn intake-form-continue-btn"
              loading={submitting}
              loadingLabel="Saving…"
              onClick={() => void handleSubmit(false)}
            >
              Save Draft
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}
