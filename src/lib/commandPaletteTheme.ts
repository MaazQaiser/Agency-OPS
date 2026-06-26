import type { AppIconName } from "@/components/ui/AppIcon";
import type { GlobalSearchResult, SearchResultType } from "@/data/globalSearch";

export type HubAccent =
  | "va"
  | "commercial"
  | "send"
  | "retention"
  | "carrier"
  | "epay"
  | "training"
  | "intake"
  | "default";

const hubAccentLookup: Record<string, HubAccent> = {
  "VA Operations": "va",
  "Commercial Hub": "commercial",
  "Send Center": "send",
  Retention: "retention",
  "Carrier Library": "carrier",
  ePayPolicy: "epay",
  "Training Hub": "training",
  "Intake Forms": "intake",
};

export function resolveHubAccent(hub: string): HubAccent {
  return hubAccentLookup[hub] ?? "default";
}

export function resultTypeIcon(type: SearchResultType): AppIconName {
  switch (type) {
    case "client":
      return "target";
    case "user":
      return "users";
    case "submission":
      return "clipboard";
    case "carrier":
      return "shield";
    case "training":
      return "trophy";
    case "invoice":
      return "dollar";
    case "document":
      return "file-text";
    case "task":
      return "flag";
    default:
      return "search";
  }
}

export function resultSubtitle(result: GlobalSearchResult): string {
  switch (result.type) {
    case "client": {
      const type = result.fields.find((f) => f.label === "Type")?.value;
      const stage = result.fields.find((f) => f.label === "Current Stage")?.value;
      return [type?.replace("Commercial Client", "Commercial"), stage].filter(Boolean).join(" · ");
    }
    case "user": {
      const role = result.fields.find((f) => f.label === "Role")?.value;
      const dept = result.fields.find((f) => f.label === "Department")?.value;
      return [role, dept].filter(Boolean).join(" · ");
    }
    case "carrier": {
      const products = result.fields.find((f) => f.label === "Products")?.value;
      return products ?? result.hub;
    }
    case "submission": {
      const coverage = result.fields.find((f) => f.label === "Coverage")?.value;
      const status = result.status;
      return [coverage, status].filter(Boolean).join(" · ");
    }
    case "invoice": {
      const client = result.fields.find((f) => f.label === "Client")?.value;
      const amount = result.fields.find((f) => f.label === "Amount")?.value;
      return [client, amount].filter(Boolean).join(" · ");
    }
    case "training": {
      const dept = result.fields.find((f) => f.label === "Department")?.value;
      const type = result.fields.find((f) => f.label === "Type")?.value;
      return [dept, type].filter(Boolean).join(" · ");
    }
    case "document": {
      const client = result.fields.find((f) => f.label === "Client")?.value;
      const type = result.fields.find((f) => f.label === "Type")?.value;
      return [client, type].filter(Boolean).join(" · ");
    }
    case "task": {
      const assigned = result.fields.find((f) => f.label === "Assigned")?.value;
      const due = result.fields.find((f) => f.label === "Due")?.value;
      return [assigned, due].filter(Boolean).join(" · ");
    }
    default:
      return result.hub;
  }
}

export function displayGroupLabel(group: string): string {
  if (group === "Users") return "Team";
  return group;
}

export function hubTagClass(hub: string): string {
  return `cmd-hub-tag cmd-hub-tag-${resolveHubAccent(hub)}`;
}

export function shortHubLabel(hub: string): string {
  return hub.replace(" Hub", "");
}
