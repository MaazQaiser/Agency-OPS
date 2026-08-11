import type { AppIconName } from "@/components/ui/AppIcon";
import type { AiDraftSession } from "./aiDraftReview";
import {
  formatAuditClock,
  formatAuditDayLabel,
  formatProposalId,
  type AuditActivityItem,
  type AuditVersion,
  type DraftAuditTrail,
} from "./aiDraftAuditTrail";

export type ProposalLogStatus =
  | "Draft"
  | "Pending Review"
  | "Approved"
  | "Rejected"
  | "Sent"
  | "Archived";

export type AiGenerationMeta = {
  provider: string;
  promptTemplate: string;
  confidence: "High" | "Medium" | "Low";
  wordCount: number;
  generationSeconds: number;
};

export const proposalLogStatusBadgeClass: Record<ProposalLogStatus, string> = {
  Draft: "badge-violet",
  "Pending Review": "badge-amber",
  Approved: "badge-green",
  Rejected: "badge-red",
  Sent: "badge-blue",
  Archived: "badge-gray",
};

export { formatProposalId };

export function countWords(text: string): number {
  const parts = text.trim().split(/\s+/).filter(Boolean);
  return parts.length;
}

export function buildAiGenerationMeta(
  session: AiDraftSession,
  trail: DraftAuditTrail,
): AiGenerationMeta {
  const wordCount = countWords(session.body) || countWords(trail.versions[0]?.body ?? "") || 482;
  return {
    provider: "Claude",
    promptTemplate: trail.templateUsed.includes("Follow")
      ? "Commercial Follow-up"
      : trail.templateUsed || "Commercial Follow-up",
    confidence: "High",
    wordCount,
    generationSeconds: 2.1,
  };
}

export function resolveProposalLogStatus(session: AiDraftSession): ProposalLogStatus {
  if (session.phase === "approved") return "Approved";
  if (session.licensedReviewGate === "waiting") return "Pending Review";
  if (session.requiresLicensedReview) return "Pending Review";
  if (session.auditTrail.events.some((e) => e.state === "sent")) return "Sent";
  return "Draft";
}

export function getVersionHistoryLabel(
  version: AuditVersion,
  all: AuditVersion[],
  selectedVersionId: string,
): string {
  const newest = Math.max(...all.map((v) => v.version));
  if (version.id === selectedVersionId && version.version === newest) return "Current Draft";
  if (version.status === "Generated" && version.version === 1) return "Original AI Draft";
  if (version.status === "Generated") return "Regenerated AI Draft";
  if (version.status === "Edited") return "Edited by User";
  if (version.status === "Approved") return "Approved Version";
  if (version.status === "Sent") return "Sent Version";
  return version.status;
}

export type ProposalActivityDisplay = {
  id: string;
  description: string;
  user: string;
  atMs: number;
  timeLabel: string;
  icon: AppIconName;
};

export function mapTrailActivityToFeed(
  activity: AuditActivityItem[],
): ProposalActivityDisplay[] {
  return [...activity]
    .sort((a, b) => b.atMs - a.atMs)
    .map((item) => {
      const lower = item.message.toLowerCase();
      let icon: AppIconName = "clipboard";
      let user = "System";
      if (lower.includes("generated")) {
        icon = "sparkles";
        user = "Claude AI";
      } else if (lower.includes("edited") || lower.includes("modified")) {
        icon = "file-text";
        user = item.message.split(" ")[0] || "User";
      } else if (lower.includes("approved")) {
        icon = "check";
        user = item.message.split(" ")[0] || "Producer";
      } else if (lower.includes("requested")) {
        icon = "user-check";
        user = item.message.split(" ")[0] || "User";
      } else if (lower.includes("sent")) {
        icon = "send";
        user = "Send Center";
      } else if (lower.includes("created")) {
        icon = "plus";
        user = item.message.split(" ")[0] || "User";
      }
      return {
        id: item.id,
        description: item.message.startsWith("✓") ? item.message : `✓ ${item.message}`,
        user,
        atMs: item.atMs,
        timeLabel: `${formatAuditDayLabel(item.atMs)} • ${formatAuditClock(item.atMs)}`,
        icon,
      };
    });
}

/** Seed richer mock activity lines for proposal log demos when trail is thin. */
export function enrichProposalActivityFeed(
  session: AiDraftSession,
  feed: ProposalActivityDisplay[],
): ProposalActivityDisplay[] {
  if (feed.length >= 4) return feed;
  const base = session.generatedAtMs;
  const extras: ProposalActivityDisplay[] = [
    {
      id: "mock-gen",
      description: "✓ Draft generated",
      user: "Claude AI",
      atMs: base,
      timeLabel: `${formatAuditDayLabel(base)} • ${formatAuditClock(base)}`,
      icon: "sparkles",
    },
    {
      id: "mock-edit",
      description: "✓ User edited greeting",
      user: "Maaz",
      atMs: base + 180_000,
      timeLabel: `${formatAuditDayLabel(base + 180_000)} • ${formatAuditClock(base + 180_000)}`,
      icon: "file-text",
    },
    {
      id: "mock-coverage",
      description: "✓ Coverage paragraph modified",
      user: "Maaz",
      atMs: base + 240_000,
      timeLabel: `${formatAuditDayLabel(base + 240_000)} • ${formatAuditClock(base + 240_000)}`,
      icon: "shield",
    },
  ];
  if (session.licensedReviewGate === "waiting" || session.requiresLicensedReview) {
    extras.push({
      id: "mock-req",
      description: "✓ Approval requested",
      user: "Maaz",
      atMs: base + 300_000,
      timeLabel: `${formatAuditDayLabel(base + 300_000)} • ${formatAuditClock(base + 300_000)}`,
      icon: "user-check",
    });
  }
  if (session.phase === "approved" || session.auditTrail.approvedBy) {
    const approver = session.auditTrail.approvedBy || session.licensedReviewer || "Sarah";
    extras.push({
      id: "mock-appr",
      description: `✓ ${approver} approved`,
      user: approver,
      atMs: base + 360_000,
      timeLabel: `${formatAuditDayLabel(base + 360_000)} • ${formatAuditClock(base + 360_000)}`,
      icon: "check",
    });
  }
  const merged = [...feed];
  for (const extra of extras) {
    if (!merged.some((m) => m.description.toLowerCase().includes(extra.description.slice(2).toLowerCase().slice(0, 12)))) {
      merged.push(extra);
    }
  }
  return merged.sort((a, b) => b.atMs - a.atMs);
}
