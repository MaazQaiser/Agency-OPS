"use client";

import { useCallback, useEffect, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import type { ComposeMode, ManualComposeValues } from "@/data/manualCompose";
import type { NewDraftFormValues } from "@/data/newDraftForm";
import { defaultNewDraftFormValues } from "@/data/newDraftForm";
import { cn } from "@/lib/cn";
import { ComposeModeSwitcher } from "./ComposeModeSwitcher";
import { ManualComposeView } from "./ManualComposeView";
import { NewDraftModal } from "./NewDraftModal";

type ComposeWorkspaceProps = {
  aiDraftingEnabled: boolean;
  aiDisabledTooltip?: string;
  initialMode?: ComposeMode;
  initialPrefill?: Partial<NewDraftFormValues>;
  startEmpty?: boolean;
  onClose: () => void;
  onSaveManual: (values: ManualComposeValues) => void;
  onSendManual: (values: ManualComposeValues) => void;
  onSaveAiDraft: (form: NewDraftFormValues, submitForReview: boolean) => void;
  onGenerateAiDraft: (form: NewDraftFormValues) => void;
  onToast: (message: string, variant?: "success" | "error") => void;
};

/**
 * Compose workspace with AI Draft ↔ Manual Compose mode switching.
 */
export function ComposeWorkspace({
  aiDraftingEnabled,
  aiDisabledTooltip,
  initialMode,
  initialPrefill,
  startEmpty = true,
  onClose,
  onSaveManual,
  onSendManual,
  onSaveAiDraft,
  onGenerateAiDraft,
  onToast,
}: ComposeWorkspaceProps) {
  const resolvedInitialMode: ComposeMode =
    initialMode ?? (aiDraftingEnabled ? "ai" : "manual");
  const [mode, setMode] = useState<ComposeMode>(
    aiDraftingEnabled ? resolvedInitialMode : "manual",
  );
  const [phase, setPhase] = useState<"empty" | "composing">(
    startEmpty ? "empty" : "composing",
  );
  const [aiModalOpen, setAiModalOpen] = useState(
    !startEmpty && (initialMode ?? (aiDraftingEnabled ? "ai" : "manual")) === "ai" && aiDraftingEnabled,
  );
  const [manualSeed, setManualSeed] = useState<Partial<ManualComposeValues> | undefined>(() =>
    initialPrefill
      ? {
          to: initialPrefill.clientName
            ? `${initialPrefill.clientName.toLowerCase().replace(/\s+/g, ".")}@client.com`
            : "",
          subject: "",
          body: initialPrefill.internalNotes ?? "",
        }
      : undefined,
  );

  useEffect(() => {
    if (!aiDraftingEnabled && mode === "ai") {
      setMode("manual");
    }
  }, [aiDraftingEnabled, mode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && phase === "empty") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, phase]);

  const handleModeChange = useCallback(
    (next: ComposeMode) => {
      if (next === "ai" && !aiDraftingEnabled) {
        onToast(aiDisabledTooltip ?? "AI drafting is currently unavailable.", "error");
        return;
      }
      setMode(next);
      if (phase === "empty") return;
      if (next === "ai") {
        setAiModalOpen(true);
      } else {
        setAiModalOpen(false);
      }
    },
    [aiDisabledTooltip, aiDraftingEnabled, onToast, phase],
  );

  const startManual = () => {
    setMode("manual");
    setPhase("composing");
    setAiModalOpen(false);
  };

  const startAi = () => {
    if (!aiDraftingEnabled) {
      onToast(aiDisabledTooltip ?? "AI drafting is currently unavailable.", "error");
      setMode("manual");
      setPhase("composing");
      return;
    }
    setMode("ai");
    setPhase("composing");
    setAiModalOpen(true);
  };

  const handleDiscard = () => {
    setManualSeed(undefined);
    setPhase("empty");
    setAiModalOpen(false);
    onToast("Draft discarded", "success");
  };

  return (
    <div
      className="va-ops-role-view send-center-tab send-center-compose-workspace"
      role="region"
      aria-labelledby="compose-workspace-title"
    >
      <header className="send-center-compose-workspace-header">
        <div className="send-center-compose-header-top">
          <div className="send-center-compose-header-left">
            <button
              type="button"
              className="send-center-compose-back-btn"
              onClick={onClose}
              aria-label="Back to Send Center"
            >
              <AppIcon name="chevron-down" size={16} strokeWidth={2.5} className="training-back-icon" />
            </button>
            <h2 id="compose-workspace-title" className="va-ops-role-title">
              Compose
            </h2>
          </div>
          <ComposeModeSwitcher
            mode={mode}
            onChange={handleModeChange}
            aiDisabled={!aiDraftingEnabled}
          />
        </div>
        <p className="va-ops-role-subtitle send-center-compose-header-subtitle">
          Switch between AI-assisted drafting and manual email composition.
        </p>
      </header>

      {phase === "empty" ? (
        <section className="va-ops-panel send-center-compose-empty" aria-label="Start a new email">
          <div className="send-center-compose-empty-illustration" aria-hidden="true">
            <AppIcon name="mail" size={36} strokeWidth={1.6} />
          </div>
          <h3 className="send-center-compose-empty-title">Start a New Email</h3>
          <p className="send-center-compose-empty-desc">
            Compose your message manually or switch to AI Draft mode to generate a draft.
          </p>
          <div className="send-center-compose-empty-actions">
            <button
              type="button"
              className="va-ops-action-btn send-center-proposal-save-btn"
              onClick={startManual}
            >
              Compose Manually
            </button>
            <button
              type="button"
              className={cn("va-ops-action-btn", !aiDraftingEnabled && "send-center-action-disabled")}
              onClick={startAi}
              disabled={!aiDraftingEnabled}
              title={!aiDraftingEnabled ? aiDisabledTooltip : undefined}
            >
              <AppIcon name="sparkles" size={14} strokeWidth={2.25} aria-hidden />
              Switch to AI Draft
            </button>
          </div>
        </section>
      ) : mode === "manual" ? (
        <ManualComposeView
          initialValues={manualSeed}
          onClose={onClose}
          onSaveDraft={(values) => {
            onSaveManual(values);
            setManualSeed(values);
          }}
          onSend={onSendManual}
          onDiscard={handleDiscard}
          onToast={onToast}
        />
      ) : (
        <section className="va-ops-panel send-center-compose-ai-entry" aria-label="AI draft compose">
          <div className="send-center-compose-ai-entry-copy">
            <h3 className="send-center-section-title">AI Draft</h3>
            <p>
              Use the draft form to capture client and coverage details, then generate an AI draft for
              review. AI never sends messages automatically.
            </p>
            <div className="send-center-compose-ai-entry-actions">
              <button
                type="button"
                className="va-ops-action-btn send-center-proposal-save-btn"
                onClick={() => setAiModalOpen(true)}
              >
                <AppIcon name="sparkles" size={14} strokeWidth={2.25} aria-hidden />
                Open AI Draft Form
              </button>
              <button type="button" className="va-ops-action-btn" onClick={startManual}>
                Switch to Manual Compose
              </button>
            </div>
          </div>
        </section>
      )}

      <NewDraftModal
        open={aiModalOpen && mode === "ai" && aiDraftingEnabled}
        initialValues={initialPrefill ?? defaultNewDraftFormValues()}
        onClose={() => {
          setAiModalOpen(false);
          if (phase === "composing" && mode === "ai") {
            setPhase("empty");
          }
        }}
        onSave={(form, submitForReview) => {
          setAiModalOpen(false);
          onSaveAiDraft(form, submitForReview);
        }}
        onGenerateAiDraft={(form) => {
          setAiModalOpen(false);
          onGenerateAiDraft(form);
        }}
        aiDraftingEnabled={aiDraftingEnabled}
        aiDisabledTooltip={aiDisabledTooltip}
      />
    </div>
  );
}
