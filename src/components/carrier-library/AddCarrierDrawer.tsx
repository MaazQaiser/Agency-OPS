"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  addCarrierProductOptions,
  addCarrierProductStatusOptions,
  addCarrierStateOptions,
  addCarrierStateStatusOptions,
  addCarrierVerticalOptions,
  createEmptyProductRow,
  emptyAddCarrierForm,
  standardRequiredDocuments,
  validateAddCarrierForm,
  type AddCarrierForm,
  type AddCarrierStateRow,
} from "@/data/addCarrier";
import type { RiskType, SubmissionMethod } from "@/data/carrierLibrary";
import { FormSkeleton } from "@/components/shared/loading";
import { useDrawerLoading } from "@/hooks/useTabLoading";
import { cn } from "@/lib/cn";

type AddCarrierDrawerProps = {
  open: boolean;
  onClose: () => void;
  onSave: (form: AddCarrierForm) => void;
  onSaveDraft: (form: AddCarrierForm) => void;
};

const submissionMethods: SubmissionMethod[] = ["Portal", "Broker Portal", "Email", "Wholesaler"];
const riskTypes: RiskType[] = ["Preferred", "Standard", "High Risk"];

export function AddCarrierDrawer({ open, onClose, onSave, onSaveDraft }: AddCarrierDrawerProps) {
  const loading = useDrawerLoading(open);
  const [form, setForm] = useState<AddCarrierForm>(emptyAddCarrierForm);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm(emptyAddCarrierForm);
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

  const updateProduct = (id: string, patch: Partial<AddCarrierForm["products"][number]>) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    }));
    setError(null);
  };

  const addProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [...prev.products, createEmptyProductRow()],
    }));
  };

  const removeProduct = (id: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.length > 1
        ? prev.products.filter((row) => row.id !== id)
        : prev.products,
    }));
  };

  const toggleState = (state: string) => {
    setForm((prev) => {
      const exists = prev.states.find((row) => row.state === state);
      if (exists) {
        return { ...prev, states: prev.states.filter((row) => row.state !== state) };
      }
      return {
        ...prev,
        states: [...prev.states, { state, status: "Active" }],
      };
    });
    setError(null);
  };

  const updateStateStatus = (state: string, status: AddCarrierStateRow["status"]) => {
    setForm((prev) => ({
      ...prev,
      states: prev.states.map((row) => (row.state === state ? { ...row, status } : row)),
    }));
  };

  const toggleDocument = (doc: string) => {
    setForm((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.includes(doc)
        ? prev.requiredDocuments.filter((item) => item !== doc)
        : [...prev.requiredDocuments, doc],
    }));
  };

  const addCustomDocument = () => {
    const trimmed = form.customDocument.trim();
    if (!trimmed) return;
    setForm((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.includes(trimmed)
        ? prev.requiredDocuments
        : [...prev.requiredDocuments, trimmed],
      customDocument: "",
    }));
  };

  const handleSave = () => {
    const validation = validateAddCarrierForm(form);
    if (!validation.ok) {
      setError(validation.error ?? "Unable to save carrier.");
      return;
    }
    onSave(form);
    onClose();
  };

  const handleSaveDraft = () => {
    onSaveDraft(form);
  };

  return (
    <div className="va-ops-drawer-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close add carrier drawer" onClick={onClose} />
      <aside className="va-ops-drawer va-ops-drawer-wide" role="dialog" aria-modal="true" aria-label="Add carrier">
        <div className="va-ops-drawer-header">
          <div className="va-ops-drawer-member">
            <span className="va-ops-drawer-avatar va-ops-workflow-avatar" aria-hidden="true">
              <AppIcon name="plus" size={20} strokeWidth={2} />
            </span>
            <div>
              <div className="va-ops-drawer-name">Add Carrier</div>
              <div className="va-ops-drawer-role">Create a new carrier market profile</div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-drawer-body add-carrier-drawer-body">
          {loading ? (
            <FormSkeleton fields={8} />
          ) : (
            <>
          <section className="add-carrier-section">
            <div className="va-ops-drawer-section-label">Carrier Information</div>
            <label className="intake-form-field">
              <span className="intake-form-label">Carrier Name *</span>
              <input
                className="intake-form-input"
                value={form.carrierName}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, carrierName: e.target.value }));
                  setError(null);
                }}
                placeholder="e.g. Acme Insurance"
              />
            </label>
            <label className="intake-form-field">
              <span className="intake-form-label">Submission Method *</span>
              <select
                className="intake-form-input"
                value={form.submissionMethod}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, submissionMethod: e.target.value as SubmissionMethod | "" }));
                  setError(null);
                }}
              >
                <option value="">Select method</option>
                {submissionMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </label>
            <label className="intake-form-field">
              <span className="intake-form-label">MGA Contact Name *</span>
              <input
                className="intake-form-input"
                value={form.mgaContactName}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, mgaContactName: e.target.value }));
                  setError(null);
                }}
              />
            </label>
            <div className="add-carrier-field-row">
              <label className="intake-form-field">
                <span className="intake-form-label">Email *</span>
                <input
                  className="intake-form-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    setError(null);
                  }}
                />
              </label>
              <label className="intake-form-field">
                <span className="intake-form-label">Phone</span>
                <input
                  className="intake-form-input"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </label>
            </div>
            <label className="intake-form-field">
              <span className="intake-form-label">Response SLA (days) *</span>
              <input
                className="intake-form-input"
                type="number"
                min={1}
                value={form.responseSlaDays}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, responseSlaDays: e.target.value }));
                  setError(null);
                }}
                placeholder="e.g. 3"
              />
            </label>
          </section>

          <section className="add-carrier-section">
            <div className="add-carrier-section-header">
              <div className="va-ops-drawer-section-label">Product Appetite</div>
              <button type="button" className="va-ops-action-btn" onClick={addProduct}>Add Product</button>
            </div>
            <div className="add-carrier-product-list">
              {form.products.map((product, index) => (
                <article key={product.id} className="add-carrier-product-card">
                  <div className="add-carrier-product-card-header">
                    <span className="add-carrier-product-index">Product {index + 1}</span>
                    {form.products.length > 1 && (
                      <button type="button" className="va-ops-action-btn" onClick={() => removeProduct(product.id)}>
                        Remove
                      </button>
                    )}
                  </div>
                  <label className="intake-form-field">
                    <span className="intake-form-label">Product Type</span>
                    <select
                      className="intake-form-input"
                      value={product.productType}
                      onChange={(e) => updateProduct(product.id, { productType: e.target.value })}
                    >
                      <option value="">Select product</option>
                      {addCarrierProductOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="intake-form-field">
                    <span className="intake-form-label">Vertical Appetite</span>
                    <select
                      className="intake-form-input"
                      value={product.verticalAppetite}
                      onChange={(e) => updateProduct(product.id, { verticalAppetite: e.target.value })}
                    >
                      <option value="">Select vertical</option>
                      {addCarrierVerticalOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <div className="add-carrier-field-row">
                    <label className="intake-form-field">
                      <span className="intake-form-label">Risk Type</span>
                      <select
                        className="intake-form-input"
                        value={product.riskType}
                        onChange={(e) => updateProduct(product.id, { riskType: e.target.value as RiskType })}
                      >
                        {riskTypes.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <label className="intake-form-field">
                      <span className="intake-form-label">Status</span>
                      <select
                        className="intake-form-input"
                        value={product.status}
                        onChange={(e) => updateProduct(product.id, { status: e.target.value as typeof product.status })}
                      >
                        {addCarrierProductStatusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="add-carrier-section">
            <div className="va-ops-drawer-section-label">State Availability</div>
            <div className="add-carrier-state-grid">
              {addCarrierStateOptions.map((state) => {
                const selected = form.states.find((row) => row.state === state);
                return (
                  <div key={state} className={cn("add-carrier-state-row", selected && "selected")}>
                    <label className="intake-form-checkbox">
                      <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        onChange={() => toggleState(state)}
                      />
                      {state}
                    </label>
                    {selected && (
                      <select
                        className="intake-form-input add-carrier-state-select"
                        value={selected.status}
                        onChange={(e) => updateStateStatus(state, e.target.value as AddCarrierStateRow["status"])}
                        aria-label={`${state} status`}
                      >
                        {addCarrierStateStatusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="add-carrier-section">
            <div className="va-ops-drawer-section-label">Underwriting Guidelines</div>
            <div className="add-carrier-field-row">
              <label className="intake-form-field">
                <span className="intake-form-label">Minimum Premium</span>
                <input
                  className="intake-form-input"
                  value={form.guidelines.minimumPremium}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    guidelines: { ...prev.guidelines, minimumPremium: e.target.value },
                  }))}
                  placeholder="e.g. $2,500"
                />
              </label>
              <label className="intake-form-field">
                <span className="intake-form-label">Max Revenue</span>
                <input
                  className="intake-form-input"
                  value={form.guidelines.maxRevenue}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    guidelines: { ...prev.guidelines, maxRevenue: e.target.value },
                  }))}
                  placeholder="e.g. $5M"
                />
              </label>
            </div>
            <div className="add-carrier-field-row">
              <label className="intake-form-field">
                <span className="intake-form-label">Max Payroll</span>
                <input
                  className="intake-form-input"
                  value={form.guidelines.maxPayroll}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    guidelines: { ...prev.guidelines, maxPayroll: e.target.value },
                  }))}
                  placeholder="e.g. $1.5M"
                />
              </label>
              <label className="intake-form-field">
                <span className="intake-form-label">Years in Business</span>
                <input
                  className="intake-form-input"
                  value={form.guidelines.yearsInBusiness}
                  onChange={(e) => setForm((prev) => ({
                    ...prev,
                    guidelines: { ...prev.guidelines, yearsInBusiness: e.target.value },
                  }))}
                  placeholder="e.g. 2+"
                />
              </label>
            </div>
            <label className="intake-form-field">
              <span className="intake-form-label">Loss History Rules</span>
              <textarea
                className="intake-form-input intake-form-textarea"
                rows={2}
                value={form.guidelines.lossHistoryRules}
                onChange={(e) => setForm((prev) => ({
                  ...prev,
                  guidelines: { ...prev.guidelines, lossHistoryRules: e.target.value },
                }))}
              />
            </label>
            <label className="intake-form-field">
              <span className="intake-form-label">Excluded Risks</span>
              <textarea
                className="intake-form-input intake-form-textarea"
                rows={2}
                value={form.guidelines.excludedRisks}
                onChange={(e) => setForm((prev) => ({
                  ...prev,
                  guidelines: { ...prev.guidelines, excludedRisks: e.target.value },
                }))}
              />
            </label>
          </section>

          <section className="add-carrier-section">
            <div className="va-ops-drawer-section-label">Required Documents</div>
            <div className="intake-form-checkboxes add-carrier-doc-checkboxes">
              {standardRequiredDocuments.map((doc) => (
                <label key={doc} className="intake-form-checkbox">
                  <input
                    type="checkbox"
                    checked={form.requiredDocuments.includes(doc)}
                    onChange={() => toggleDocument(doc)}
                  />
                  {doc}
                </label>
              ))}
            </div>
            <div className="add-carrier-custom-doc">
              <label className="intake-form-field add-carrier-custom-doc-field">
                <span className="intake-form-label">Custom Add</span>
                <input
                  className="intake-form-input"
                  value={form.customDocument}
                  onChange={(e) => setForm((prev) => ({ ...prev, customDocument: e.target.value }))}
                  placeholder="Document name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomDocument();
                    }
                  }}
                />
              </label>
              <button type="button" className="va-ops-action-btn" onClick={addCustomDocument}>Add</button>
            </div>
          </section>

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
            </>
          )}
        </div>

        <div className="va-ops-drawer-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn" onClick={handleSaveDraft}>Save Draft</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleSave}>
            Save Carrier
          </button>
        </div>
      </aside>
    </div>
  );
}
