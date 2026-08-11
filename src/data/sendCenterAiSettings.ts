/**
 * Mock Send Center AI drafting settings (frontend-only).
 * Enable the disabled experience via `?ai=disabled` on /send-center.
 */
export type SendCenterAiSettings = {
  draftingEnabled: boolean;
  statusLabel: "Active" | "Disabled";
  reason: string;
  lastUpdatedLabel: string;
  adminNoticeTitle: string;
  adminNoticeBody: string;
  disabledTooltip: string;
};

export const SEND_CENTER_AI_DISABLED_QUERY = "disabled";

export const sendCenterAiSettingsEnabled: SendCenterAiSettings = {
  draftingEnabled: true,
  statusLabel: "Active",
  reason: "Available for outbound drafting",
  lastUpdatedLabel: "Today • 8:00 AM",
  adminNoticeTitle: "Administrator Notice",
  adminNoticeBody: "AI drafting is enabled for this workspace.",
  disabledTooltip: "AI drafting is currently unavailable.",
};

export const sendCenterAiSettingsDisabled: SendCenterAiSettings = {
  draftingEnabled: false,
  statusLabel: "Disabled",
  reason: "Awaiting administrator activation",
  lastUpdatedLabel: "Today • 9:15 AM",
  adminNoticeTitle: "Administrator Notice",
  adminNoticeBody:
    "AI drafting will become available once compliance approval has been completed. No action required.",
  disabledTooltip: "AI drafting is currently unavailable.",
};

export const aiDisabledCapabilities = [
  "Compose manually",
  "Save drafts",
  "Attach documents",
  "Send approved emails",
] as const;

export function resolveSendCenterAiSettings(aiParam: string | null): SendCenterAiSettings {
  if (aiParam === SEND_CENTER_AI_DISABLED_QUERY || aiParam === "off" || aiParam === "0") {
    return sendCenterAiSettingsDisabled;
  }
  return sendCenterAiSettingsEnabled;
}
