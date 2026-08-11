import type { AppIconName } from "@/components/ui/AppIcon";
import type { SendPriority } from "./sendCenter";

export type ComposeMode = "ai" | "manual";

export type ManualComposePriority = SendPriority;

export type ManualComposeCategory =
  | "General"
  | "Quote Follow-up"
  | "Renewal"
  | "Claims"
  | "Onboarding";

export type ManualComposeValues = {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  priority: ManualComposePriority;
  category: ManualComposeCategory;
  attachmentName: string | null;
};

export const manualComposeCategories: ManualComposeCategory[] = [
  "General",
  "Quote Follow-up",
  "Renewal",
  "Claims",
  "Onboarding",
];

export const manualComposePriorities: ManualComposePriority[] = ["Low", "Medium", "High"];

export const CURRENT_COMPOSE_USER = "Maaz";

export const defaultManualComposeValues = (
  prefill?: Partial<ManualComposeValues>,
): ManualComposeValues => ({
  to: prefill?.to ?? "",
  cc: prefill?.cc ?? "",
  bcc: prefill?.bcc ?? "",
  subject: prefill?.subject ?? "",
  body: prefill?.body ?? "",
  priority: prefill?.priority ?? "Medium",
  category: prefill?.category ?? "General",
  attachmentName: prefill?.attachmentName ?? null,
});

export type ComposeToolbarAction = {
  id: string;
  label: string;
  icon?: AppIconName;
  textMark?: string;
};

export const manualComposeToolbarActions: ComposeToolbarAction[] = [
  { id: "bold", label: "Bold", textMark: "B" },
  { id: "italic", label: "Italic", textMark: "I" },
  { id: "underline", label: "Underline", textMark: "U" },
  { id: "bullet", label: "Bullet List", icon: "clipboard" },
  { id: "number", label: "Number List", icon: "clipboard" },
  { id: "link", label: "Insert Link", icon: "globe" },
  { id: "attach", label: "Attach File", icon: "upload" },
  { id: "template", label: "Insert Template", icon: "file-text" },
  { id: "emoji", label: "Emoji", icon: "sparkles" },
  { id: "signature", label: "Signature", icon: "user-check" },
];

export const manualComposeTemplates = [
  {
    id: "tpl-followup",
    label: "Quote Follow-up",
    subject: "Following up on your insurance quote",
    body: "Hi,\n\nI wanted to follow up on the quote we prepared for your review. Please let me know if you have any questions or would like to schedule a quick call.\n\nBest regards,",
  },
  {
    id: "tpl-renewal",
    label: "Renewal Reminder",
    subject: "Your policy renewal is coming up",
    body: "Hello,\n\nYour policy renewal window is approaching. I’ve attached a summary of recommended options for your review.\n\nThank you,",
  },
] as const;
