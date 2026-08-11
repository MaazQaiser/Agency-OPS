"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  CURRENT_COMPOSE_USER,
  defaultManualComposeValues,
  manualComposeCategories,
  manualComposePriorities,
  manualComposeTemplates,
  manualComposeToolbarActions,
  type ManualComposeValues,
} from "@/data/manualCompose";
import { toastMessages } from "@/lib/toastMessages";
import { cn } from "@/lib/cn";

type ManualComposeViewProps = {
  initialValues?: Partial<ManualComposeValues>;
  onClose: () => void;
  onSaveDraft: (values: ManualComposeValues) => void;
  onSend: (values: ManualComposeValues) => void;
  onDiscard: () => void;
  onToast: (message: string, variant?: "success" | "error") => void;
  className?: string;
};

/**
 * Clean enterprise email composer for Manual Compose mode.
 * Intentionally excludes AI panels, badges, and compliance chrome.
 */
export function ManualComposeView({
  initialValues,
  onClose,
  onSaveDraft,
  onSend,
  onDiscard,
  onToast,
  className,
}: ManualComposeViewProps) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [values, setValues] = useState<ManualComposeValues>(() =>
    defaultManualComposeValues(initialValues),
  );
  const [lastSavedLabel, setLastSavedLabel] = useState("Just now");
  const [showCcBcc, setShowCcBcc] = useState(
    Boolean(initialValues?.cc || initialValues?.bcc),
  );

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

  const update = <K extends keyof ManualComposeValues>(key: K, value: ManualComposeValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const canSend = useMemo(
    () => Boolean(values.to.trim() && values.subject.trim() && values.body.trim()),
    [values.body, values.subject, values.to],
  );

  const wrapSelection = (before: string, after = before) => {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = values.body.slice(start, end) || "text";
    const next =
      values.body.slice(0, start) + before + selected + after + values.body.slice(end);
    update("body", next);
    window.requestAnimationFrame(() => {
      el.focus();
      const cursor = start + before.length + selected.length + after.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  const handleToolbar = (actionId: string) => {
    switch (actionId) {
      case "bold":
        wrapSelection("**", "**");
        break;
      case "italic":
        wrapSelection("_", "_");
        break;
      case "underline":
        wrapSelection("__", "__");
        break;
      case "bullet":
        update("body", `${values.body}${values.body.endsWith("\n") || !values.body ? "" : "\n"}- `);
        break;
      case "number":
        update("body", `${values.body}${values.body.endsWith("\n") || !values.body ? "" : "\n"}1. `);
        break;
      case "link":
        wrapSelection("[", "](https://)");
        break;
      case "attach":
        update("attachmentName", "policy-summary.pdf");
        onToast("File attached", "success");
        break;
      case "template": {
        const tpl = manualComposeTemplates[0];
        setValues((prev) => ({
          ...prev,
          subject: prev.subject || tpl.subject,
          body: prev.body ? `${prev.body}\n\n${tpl.body}` : tpl.body,
        }));
        onToast(`Inserted template: ${tpl.label}`, "success");
        break;
      }
      case "emoji":
        update("body", `${values.body}${values.body ? " " : ""}✓`);
        break;
      case "signature":
        update(
          "body",
          `${values.body}${values.body.endsWith("\n") || !values.body ? "" : "\n\n"}Best regards,\n${CURRENT_COMPOSE_USER}\nAgency OS`,
        );
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    setLastSavedLabel("Just now");
    onSaveDraft(values);
  };

  const handleSend = () => {
    if (!canSend) {
      onToast(toastMessages.intake.missingFields, "error");
      return;
    }
    onSend(values);
  };

  return (
    <div className={cn("send-center-manual-compose", className)}>
      <div className="send-center-manual-layout">
      <section className="va-ops-panel send-center-manual-editor-panel" aria-label="Email composer">
        <div className="send-center-manual-fields">
          <label className="send-center-manual-field">
            <span>To</span>
            <input
              type="text"
              className="intake-form-input"
              value={values.to}
              onChange={(e) => update("to", e.target.value)}
              placeholder="recipient@client.com"
              aria-label="To"
            />
          </label>

          {!showCcBcc ? (
            <button
              type="button"
              className="send-center-manual-cc-toggle"
              onClick={() => setShowCcBcc(true)}
            >
              Cc / Bcc
            </button>
          ) : (
            <>
              <label className="send-center-manual-field">
                <span>Cc</span>
                <input
                  type="text"
                  className="intake-form-input"
                  value={values.cc}
                  onChange={(e) => update("cc", e.target.value)}
                  placeholder="cc@agency.com"
                  aria-label="Cc"
                />
              </label>
              <label className="send-center-manual-field">
                <span>Bcc</span>
                <input
                  type="text"
                  className="intake-form-input"
                  value={values.bcc}
                  onChange={(e) => update("bcc", e.target.value)}
                  placeholder="bcc@agency.com"
                  aria-label="Bcc"
                />
              </label>
            </>
          )}

          <label className="send-center-manual-field">
            <span>Subject</span>
            <input
              type="text"
              className="intake-form-input"
              value={values.subject}
              onChange={(e) => update("subject", e.target.value)}
              placeholder="Email subject"
              aria-label="Subject"
            />
          </label>

          <div className="send-center-manual-field-row">
            <label className="send-center-manual-field">
              <span>Priority</span>
              <select
                className="intake-form-input"
                value={values.priority}
                onChange={(e) => update("priority", e.target.value as ManualComposeValues["priority"])}
              >
                {manualComposePriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
            <label className="send-center-manual-field">
              <span>Category</span>
              <select
                className="intake-form-input"
                value={values.category}
                onChange={(e) => update("category", e.target.value as ManualComposeValues["category"])}
              >
                {manualComposeCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="send-center-manual-toolbar" role="toolbar" aria-label="Formatting toolbar">
          {manualComposeToolbarActions.map((action) => (
            <button
              key={action.id}
              type="button"
              className="send-center-manual-toolbar-btn"
              title={action.label}
              aria-label={action.label}
              onClick={() => handleToolbar(action.id)}
            >
              {action.textMark ? (
                <span className="send-center-manual-toolbar-mark">{action.textMark}</span>
              ) : (
                <AppIcon name={action.icon!} size={14} strokeWidth={2.25} aria-hidden />
              )}
            </button>
          ))}
        </div>

        <label className="send-center-manual-body-field">
          <span>Message</span>
          <textarea
            ref={bodyRef}
            className="intake-form-input intake-form-textarea send-center-manual-body"
            value={values.body}
            onChange={(e) => update("body", e.target.value)}
            rows={14}
            placeholder="Write your message…"
            aria-label="Message body"
          />
        </label>

        <div className="send-center-manual-attachments">
          <button
            type="button"
            className="va-ops-action-btn"
            onClick={() => handleToolbar("attach")}
          >
            <AppIcon name="upload" size={14} strokeWidth={2} aria-hidden />
            Attachments
          </button>
          {values.attachmentName && (
            <span className="send-center-manual-attachment-chip">
              <AppIcon name="file-text" size={12} strokeWidth={2} aria-hidden />
              {values.attachmentName}
            </span>
          )}
        </div>
      </section>

      <aside className="send-center-manual-sidebar" aria-label="Draft details">
        <section className="va-ops-panel send-center-manual-draft-card" aria-label="Manual draft details">
          <div className="send-center-proposal-card-header">
            <h3 className="send-center-section-title">Manual Draft</h3>
            <span className="badge badge-violet">Draft</span>
          </div>
          <dl className="send-center-manual-draft-meta">
            <div>
              <dt>Created by</dt>
              <dd>{CURRENT_COMPOSE_USER}</dd>
            </div>
            <div>
              <dt>Mode</dt>
              <dd>Manual</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Draft</dd>
            </div>
            <div>
              <dt>Last Saved</dt>
              <dd>{lastSavedLabel}</dd>
            </div>
          </dl>
        </section>
      </aside>
      </div>

      <footer className="send-center-proposal-sticky-bar send-center-manual-action-bar" aria-label="Compose actions">
        <div className="send-center-proposal-sticky-inner">
          <button type="button" className="va-ops-action-btn" onClick={onDiscard}>
            Discard
          </button>
          <button type="button" className="va-ops-action-btn" onClick={handleSave}>
            Save Draft
          </button>
          <button
            type="button"
            className="va-ops-action-btn send-center-proposal-save-btn"
            onClick={handleSend}
          >
            Send Email
          </button>
        </div>
      </footer>
    </div>
  );
}
