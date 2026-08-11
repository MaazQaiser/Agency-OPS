"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  aiDraftLanguageOptions,
  aiDraftTemplateOptions,
  aiDraftToneOptions,
  type AiDraftLanguage,
  type AiDraftTone,
} from "@/data/aiDraftReview";
import type { NewDraftFormValues } from "@/data/newDraftForm";
import { defaultNewDraftFormValues } from "@/data/newDraftForm";
import type { SendCenterAiSettings } from "@/data/sendCenterAiSettings";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";
import { AiDisabledAssistantCard } from "./AiDisabledAssistantCard";
import { AiDisabledBanner } from "./AiDisabledBanner";
import { ComplianceNoticeFooter } from "./ComplianceNoticeFooter";
import { OutboundEmailEditor } from "./OutboundEmailEditor";

type AiDisabledComposeViewProps = {
  settings: SendCenterAiSettings;
  initialValues?: Partial<NewDraftFormValues>;
  onClose: () => void;
  onSaveDraft: (form: NewDraftFormValues) => void;
  onSend: (form: NewDraftFormValues) => void;
  onToast: (message: string, variant?: "success" | "error") => void;
};

const AI_DISABLED_TOOLTIP = "AI drafting is currently unavailable.";

/**
 * Manual compose experience when Claude / AI drafting is disabled.
 * Send Center remains fully usable — only AI generation is blocked.
 */
export function AiDisabledComposeView({
  settings,
  initialValues,
  onClose,
  onSaveDraft,
  onSend,
  onToast,
}: AiDisabledComposeViewProps) {
  const [form, setForm] = useState<NewDraftFormValues>(() => ({
    ...defaultNewDraftFormValues(),
    ...initialValues,
  }));
  const [recipient, setRecipient] = useState(
    () => initialValues?.clientName?.trim() || "client@example.com",
  );
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const updateField = <K extends keyof NewDraftFormValues>(key: K, value: NewDraftFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const canSend = useMemo(
    () => Boolean(form.emailSubject.trim() && form.emailBody.trim() && recipient.trim()),
    [form.emailBody, form.emailSubject, recipient],
  );

  const handleMockAttach = () => {
    setAttachmentName("coverage-summary.pdf");
    onToast("Document attached", "success");
  };

  const handleSave = () => {
    onSaveDraft({
      ...form,
      clientName: form.clientName || recipient.split("@")[0] || "Manual Draft",
    });
  };

  const handleSend = () => {
    if (!canSend) {
      onToast(toastMessages.intake.missingFields, "error");
      return;
    }
    onSend({
      ...form,
      clientName: form.clientName || recipient.split("@")[0] || "Manual Draft",
    });
  };

  return (
    <div
      className="va-ops-role-view send-center-tab send-center-ai-disabled-compose"
      role="region"
      aria-labelledby="ai-disabled-compose-title"
    >
      <header className="send-center-ai-draft-header">
        <div className="send-center-ai-draft-header-left">
          <button
            type="button"
            className="training-detail-back"
            onClick={onClose}
            aria-label="Back to Send Center"
          >
            <AppIcon name="chevron-down" size={16} strokeWidth={2.5} className="training-back-icon" />
            Back
          </button>
          <div>
            <h2 id="ai-disabled-compose-title" className="va-ops-role-title send-center-ai-draft-title">
              Compose Email
            </h2>
            <p className="va-ops-role-subtitle">
              Manual composition is available while AI drafting is offline.
            </p>
          </div>
        </div>
        <div className="send-center-ai-draft-header-meta">
          <span className="badge badge-gray">AI Disabled</span>
        </div>
      </header>

      <AiDisabledBanner />

      <div className="send-center-proposal-grid send-center-ai-draft-grid send-center-ai-disabled-grid">
        <div className="send-center-proposal-main">
          <section className="va-ops-panel" aria-label="Manual email composer">
            <div className="send-center-proposal-card-header">
              <h3 className="send-center-section-title">Outbound Message</h3>
              <button
                type="button"
                className="va-ops-action-btn send-center-ai-disabled-generate"
                disabled
                title={settings.disabledTooltip || AI_DISABLED_TOOLTIP}
                aria-label="Generate AI Draft (disabled)"
              >
                <AppIcon name="lock" size={14} strokeWidth={2.25} aria-hidden />
                Generate AI Draft
                <span className="send-center-ai-disabled-generate-hint">Disabled</span>
                <span className="send-center-ai-disabled-generate-tooltip" role="tooltip">
                  {settings.disabledTooltip || AI_DISABLED_TOOLTIP}
                </span>
              </button>
            </div>

            <div className="intake-form-grid send-center-ai-disabled-compose-meta">
              <label className="intake-form-field">
                <span className="intake-form-label">Recipient</span>
                <input
                  type="email"
                  className="intake-form-input"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="name@client.com"
                  aria-label="Email recipient"
                />
              </label>
              <label className="intake-form-field">
                <span className="intake-form-label">Template</span>
                <select
                  className="intake-form-input"
                  value={form.selectedTemplate}
                  onChange={(e) => updateField("selectedTemplate", e.target.value)}
                >
                  <option value="">Select template</option>
                  {aiDraftTemplateOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="intake-form-field">
                <span className="intake-form-label">Tone</span>
                <select
                  className="intake-form-input"
                  value={form.tone}
                  onChange={(e) => updateField("tone", e.target.value as AiDraftTone)}
                >
                  {aiDraftToneOptions.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </label>
              <label className="intake-form-field">
                <span className="intake-form-label">Language</span>
                <select
                  className="intake-form-input"
                  value={form.language}
                  onChange={(e) => updateField("language", e.target.value as AiDraftLanguage)}
                >
                  {aiDraftLanguageOptions.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <OutboundEmailEditor
              subject={form.emailSubject}
              body={form.emailBody}
              onSubjectChange={(value) => updateField("emailSubject", value)}
              onBodyChange={(value) => updateField("emailBody", value)}
              highlightGenerated={false}
            />

            <div className="send-center-ai-disabled-attachments">
              <button type="button" className="va-ops-action-btn" onClick={handleMockAttach}>
                <AppIcon name="upload" size={14} strokeWidth={2} aria-hidden />
                Attach files
              </button>
              {attachmentName && (
                <span className="send-center-ai-disabled-attachment-chip">
                  <AppIcon name="file-text" size={12} strokeWidth={2} aria-hidden />
                  {attachmentName}
                </span>
              )}
            </div>

            <ComplianceNoticeFooter state="normal" />
          </section>
        </div>

        <aside className="send-center-proposal-sidebar send-center-ai-draft-sidebar" aria-label="AI assistant">
          <AiDisabledAssistantCard settings={settings} />
        </aside>
      </div>

      <footer className="send-center-proposal-sticky-bar" aria-label="Compose actions">
        <div className="send-center-proposal-sticky-inner">
          <button type="button" className="va-ops-action-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="va-ops-action-btn" onClick={handleSave}>
            Save Draft
          </button>
          <button
            type="button"
            className={cn("va-ops-action-btn", "send-center-proposal-save-btn")}
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
