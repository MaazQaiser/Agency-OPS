"use client";

import { useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  DOCUMENT_UPLOAD_OPTIONS,
  validateUploadDocument,
  type ChecklistClient,
  type UploadDocumentPayload,
} from "@/data/coverageChecklist";

type UploadDocumentModalProps = {
  open: boolean;
  client: ChecklistClient | null;
  onClose: () => void;
  onUpload: (payload: UploadDocumentPayload, file: File) => void;
};

const emptyPayload: UploadDocumentPayload = {
  documentType: "",
  fileName: "",
  notes: "",
};

export function UploadDocumentModal({ open, client, onClose, onUpload }: UploadDocumentModalProps) {
  const [form, setForm] = useState<UploadDocumentPayload>(emptyPayload);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm(emptyPayload);
    setFile(null);
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

  if (!open || !client) return null;

  const handleUpload = () => {
    const validation = validateUploadDocument(form, file);
    if (!validation.ok) {
      setError(validation.error ?? "Unable to upload document.");
      return;
    }

    if (!file) return;

    onUpload({ ...form, fileName: file.name }, file);
    onClose();
  };

  return (
    <div className="va-ops-modal-root" role="presentation">
      <button type="button" className="va-ops-drawer-backdrop" aria-label="Close upload modal" onClick={onClose} />
      <div className="va-ops-modal" role="dialog" aria-modal="true" aria-label="Upload required document">
        <div className="va-ops-modal-header">
          <div>
            <h2 className="va-ops-modal-title">Upload Required Document</h2>
            <p className="va-ops-modal-subtitle">{client.clientName}</p>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </div>

        <div className="va-ops-modal-body">
          <label className="intake-form-field">
            <span className="intake-form-label">Document Type *</span>
            <select
              className="intake-form-input"
              value={form.documentType}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, documentType: e.target.value }));
                setError(null);
              }}
            >
              <option value="">Select document type</option>
              {DOCUMENT_UPLOAD_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Upload File *</span>
            <input
              className="intake-form-input"
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                const nextFile = e.target.files?.[0] ?? null;
                setFile(nextFile);
                setError(null);
              }}
            />
          </label>

          <label className="intake-form-field">
            <span className="intake-form-label">Notes</span>
            <textarea
              className="intake-form-input intake-form-textarea"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </label>

          {error && <div className="add-market-alert add-market-alert-error">{error}</div>}
        </div>

        <div className="va-ops-modal-footer">
          <button type="button" className="va-ops-role-action-btn" onClick={onClose}>Cancel</button>
          <button type="button" className="va-ops-role-action-btn intake-form-continue-btn" onClick={handleUpload}>
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}
