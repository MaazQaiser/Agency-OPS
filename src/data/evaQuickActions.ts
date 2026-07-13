import type { AppIconName } from "@/components/ui/AppIcon";
import { submissions } from "@/data/commercialSubmissions";

export type EvaQuickActionId =
  | "ping-va"
  | "create-az-note"
  | "flag-follow-up"
  | "approve-transfer"
  | "trigger-workflow";

export type EvaQuickActionColor = "blue" | "teal" | "amber" | "green" | "violet";

export type EvaQuickActionDef = {
  id: EvaQuickActionId;
  label: string;
  tooltip: string;
  icon: AppIconName;
  color: EvaQuickActionColor;
};

export type EvaActionField =
  | {
      id: string;
      label: string;
      type: "text" | "textarea";
      placeholder: string;
      required?: boolean;
    }
  | {
      id: string;
      label: string;
      type: "select";
      placeholder?: string;
      required?: boolean;
      options: { value: string; label: string }[];
    };

export const evaTeamMembers = [
  { value: "pedro", label: "Pedro · Brokerage VA" },
  { value: "sarah", label: "Sarah · Personal Lines" },
  { value: "jazmin", label: "Jazmín · SDR / Commercial" },
  { value: "zahra", label: "Zahra · Farmers VA" },
  { value: "tracie", label: "Tracie · Commercial VA" },
  { value: "valerie", label: "Valerie · Retention VA" },
];

const clientOptions = submissions.map((s) => ({
  value: s.id,
  label: `${s.client} · ${s.id}`,
}));

const transferOptions = [
  { value: "xfer-2041", label: "Jazmín → Sarah · Personal lead handoff" },
  { value: "xfer-2038", label: "Pedro → Eva · Commercial quote review" },
  { value: "xfer-2035", label: "Zahra → Tracie · COI follow-up queue" },
];

export const evaQuickActions: EvaQuickActionDef[] = [
  {
    id: "ping-va",
    label: "Ping VA",
    tooltip: "Ping VA",
    icon: "bell",
    color: "blue",
  },
  {
    id: "create-az-note",
    label: "Create AZ Note",
    tooltip: "Create Note",
    icon: "file-text",
    color: "teal",
  },
  {
    id: "flag-follow-up",
    label: "Flag Follow-Up",
    tooltip: "Flag Follow-Up",
    icon: "flag",
    color: "amber",
  },
  {
    id: "approve-transfer",
    label: "Approve Transfer",
    tooltip: "Approve Transfer",
    icon: "arrow-right-left",
    color: "green",
  },
  {
    id: "trigger-workflow",
    label: "Trigger Workflow",
    tooltip: "Trigger Workflow",
    icon: "rocket",
    color: "violet",
  },
];

export const evaActionModalConfig: Record<
  EvaQuickActionId,
  {
    title: string;
    submitLabel: string;
    fields: EvaActionField[];
    successMessage: (values: Record<string, string>) => string;
  }
> = {
  "ping-va": {
    title: "Ping VA",
    submitLabel: "Send Ping",
    fields: [
      {
        id: "teamMember",
        label: "Team member",
        type: "select",
        required: true,
        options: evaTeamMembers,
      },
      {
        id: "message",
        label: "Quick message",
        type: "textarea",
        placeholder: "E.g. Please prioritize Martinez follow-up before EOD",
        required: true,
      },
    ],
    successMessage: (v) => `Ping sent to ${evaTeamMembers.find((m) => m.value === v.teamMember)?.label ?? "team member"}`,
  },
  "create-az-note": {
    title: "Create AZ Note",
    submitLabel: "Save Note",
    fields: [
      {
        id: "client",
        label: "Attach client",
        type: "select",
        required: true,
        options: clientOptions,
      },
      {
        id: "note",
        label: "Internal note",
        type: "textarea",
        placeholder: "Document context, next steps, or owner directive…",
        required: true,
      },
    ],
    successMessage: (v) => {
      const client = clientOptions.find((c) => c.value === v.client)?.label ?? "client";
      return `AZ note saved for ${client}`;
    },
  },
  "flag-follow-up": {
    title: "Flag Follow-Up",
    submitLabel: "Flag & Assign",
    fields: [
      {
        id: "submission",
        label: "Client / submission",
        type: "select",
        required: true,
        options: clientOptions,
      },
      {
        id: "urgency",
        label: "Urgency",
        type: "select",
        required: true,
        options: [
          { value: "critical", label: "Critical" },
          { value: "high", label: "High" },
          { value: "medium", label: "Medium" },
        ],
      },
      {
        id: "assignee",
        label: "Assign to",
        type: "select",
        required: true,
        options: evaTeamMembers,
      },
    ],
    successMessage: (v) =>
      `Follow-up flagged (${v.urgency ?? "high"}) for ${clientOptions.find((c) => c.value === v.submission)?.label ?? "submission"}`,
  },
  "approve-transfer": {
    title: "Approve Transfer",
    submitLabel: "Submit Decision",
    fields: [
      {
        id: "request",
        label: "Transfer request",
        type: "select",
        required: true,
        options: transferOptions,
      },
      {
        id: "decision",
        label: "Decision",
        type: "select",
        required: true,
        options: [
          { value: "approve", label: "Approve" },
          { value: "reject", label: "Reject" },
        ],
      },
      {
        id: "notes",
        label: "Notes (optional)",
        type: "textarea",
        placeholder: "Add routing context or rejection reason…",
      },
    ],
    successMessage: (v) =>
      `Transfer ${v.decision === "approve" ? "approved" : "rejected"}: ${transferOptions.find((t) => t.value === v.request)?.label ?? "request"}`,
  },
  "trigger-workflow": {
    title: "Trigger Workflow",
    submitLabel: "Run Workflow",
    fields: [
      {
        id: "workflow",
        label: "Workflow",
        type: "select",
        required: true,
        options: [
          { value: "intake-routing", label: "Intake → AgencyZoom routing" },
          { value: "payment-reminder", label: "ePay overdue reminder sequence" },
          { value: "training-assign", label: "Assign training bundle" },
          { value: "carrier-appetite-sync", label: "Carrier appetite sync" },
        ],
      },
      {
        id: "target",
        label: "Target client / record",
        type: "select",
        required: true,
        options: clientOptions,
      },
      {
        id: "notes",
        label: "Notes (optional)",
        type: "textarea",
        placeholder: "Add context for the automation run…",
      },
    ],
    successMessage: (v) =>
      `Workflow "${v.workflow ?? "automation"}" triggered for ${clientOptions.find((c) => c.value === v.target)?.label ?? "record"}`,
  },
};
