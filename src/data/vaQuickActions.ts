import type { AppIconName } from "@/components/ui/AppIcon";
import { routes } from "@/lib/routes";

export type VaQuickActionId = "create-intake" | "assign-lead" | "add-az-note" | "send-reminder";

export type VaQuickActionDef = {
  id: VaQuickActionId;
  label: string;
  tooltip: string;
  icon: AppIconName;
  href?: string;
};

export const vaQuickActions: VaQuickActionDef[] = [
  {
    id: "create-intake",
    label: "Create Intake",
    tooltip: "Create Intake",
    icon: "plus",
    href: `${routes.intakeForms}?view=new-submission`,
  },
  {
    id: "assign-lead",
    label: "Assign Lead",
    tooltip: "Assign Lead",
    icon: "users",
    href: `${routes.vaOperations}?view=tasks`,
  },
  {
    id: "add-az-note",
    label: "Add AZ Note",
    tooltip: "Add AZ Note",
    icon: "file-text",
    href: `${routes.commercialHub}?view=submissions&action=create-note`,
  },
  {
    id: "send-reminder",
    label: "Send Reminder",
    tooltip: "Send Reminder",
    icon: "bell",
    href: `${routes.sendCenter}`,
  },
];
