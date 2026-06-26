import { teamMembers, type TeamMember, type TeamMemberStatus } from "./vaOperations";
import { routes } from "@/lib/routes";
import { getTeamPhotoUrl } from "@/lib/teamIdentity";

export type UserProfileRoleType = "va" | "producer" | "owner";

export type UserPresenceStatus = "online" | "busy" | "away" | "offline";

export type UserProfileKpi = {
  id: string;
  label: string;
  value: string | number;
  route?: string;
};

export type UserWorkloadItem = {
  id: string;
  label: string;
  detail: string;
  route: string;
  overdue?: boolean;
};

export type UserActivityItem = {
  id: string;
  text: string;
  timestamp: string;
  module: string;
  route?: string;
};

export type PerformancePeriod = {
  completion: number;
  sla: number;
  responseTime: string;
};

export type UserProfile = {
  id: string;
  name: string;
  role: string;
  roleType: UserProfileRoleType;
  department: string;
  shiftStatus: string;
  currentQueue: string;
  status: UserPresenceStatus;
  avatarUrl?: string;
  kpis: UserProfileKpi[];
  workload: UserWorkloadItem[];
  recentActivity: UserActivityItem[];
  performanceTrend: {
    today: PerformancePeriod;
    week: PerformancePeriod;
    month: PerformancePeriod;
  };
  managerNotes: string;
};

const statusMap: Record<TeamMemberStatus, UserPresenceStatus> = {
  active: "online",
  away: "away",
  offline: "offline",
};

function mapVaKpis(member: TeamMember): UserProfileKpi[] {
  switch (member.roleType) {
    case "dialer": {
      const s = member.stats as { callsMade: number; speedToLead: string; dncFlags: number; transfers: number };
      return [
        { id: "tasks", label: "Tasks completed today", value: 14, route: `${routes.vaOperations}?view=tasks` },
        { id: "calls", label: "Calls handled", value: s.callsMade, route: `${routes.vaOperations}?view=activity` },
        { id: "stl", label: "Speed to lead", value: s.speedToLead, route: routes.vaOperations },
        { id: "dnc", label: "DNC issues", value: s.dncFlags, route: `${routes.vaOperations}?view=dnc-log` },
        { id: "conv", label: "Conversion support rate", value: "68%", route: routes.vaOperations },
      ];
    }
    case "research":
      return [
        { id: "tasks", label: "Tasks completed today", value: 11, route: `${routes.vaOperations}?view=tasks` },
        { id: "calls", label: "Records completed", value: (member.stats as { recordsCompleted: number }).recordsCompleted },
        { id: "stl", label: "Queue load", value: (member.stats as { queueLoad: number }).queueLoad },
        { id: "dnc", label: "Missing data flags", value: (member.stats as { missingData: number }).missingData },
        { id: "conv", label: "Enrichment rate", value: "84%" },
      ];
    default:
      return [
        { id: "tasks", label: "Tasks completed today", value: 9, route: `${routes.vaOperations}?view=tasks` },
        { id: "calls", label: "Items worked", value: (member.stats as { submissionsWorked?: number }).submissionsWorked ?? 6 },
        { id: "stl", label: "Follow-ups due", value: (member.stats as { followUpsDue?: number }).followUpsDue ?? 2 },
        { id: "dnc", label: "Overdue items", value: 1 },
        { id: "conv", label: "Completion rate", value: "91%" },
      ];
  }
}

function buildVaProfile(member: TeamMember): UserProfile {
  const departments: Record<string, string> = {
    dialer: "Dialer Operations",
    research: "Research & Intake",
    brokerage: "Brokerage Team",
    retention: "Retention",
    automation: "Automation & Integrations",
    developer: "Engineering",
    sales: "Sales Support",
  };

  return {
    id: member.id,
    name: member.name,
    role: member.role,
    roleType: "va",
    department: departments[member.roleType] ?? "VA Operations",
    shiftStatus: member.status === "active" ? "On shift" : member.status === "away" ? "Break" : "Off shift",
    currentQueue: member.roleType === "dialer" ? "Inbound leads" : member.roleType === "brokerage" ? "Commercial submissions" : "General tasks",
    status: statusMap[member.status],
    avatarUrl: getTeamPhotoUrl(member.id),
    kpis: mapVaKpis(member),
    workload: [
      { id: "w1", label: "Active tasks", detail: `${Math.max(3, member.recentActions.length + 2)} open`, route: `${routes.vaOperations}?view=tasks` },
      { id: "w2", label: "Assigned submissions", detail: member.roleType === "brokerage" ? "3 submissions" : "—", route: `${routes.commercialHub}?view=submissions`, overdue: member.roleType === "brokerage" },
      { id: "w3", label: "Pending approvals", detail: "1 awaiting review", route: `${routes.vaOperations}?view=approvals` },
      { id: "w4", label: "Follow-ups due", detail: "2 due today", route: `${routes.commercialHub}?view=follow-ups` },
      { id: "w5", label: "Overdue items", detail: member.status === "away" ? "0 overdue" : "1 overdue", route: `${routes.vaOperations}?view=tasks`, overdue: member.status !== "away" },
    ],
    recentActivity: member.recentActions.map((a, i) => ({
      id: `act-${member.id}-${i}`,
      text: a.text,
      timestamp: a.time,
      module: "VA Operations",
      route: routes.vaOperations,
    })),
    performanceTrend: {
      today: { completion: 88, sla: 94, responseTime: member.roleType === "dialer" ? "2m 11s" : "12m" },
      week: { completion: 85, sla: 91, responseTime: "14m" },
      month: { completion: 82, sla: 89, responseTime: "16m" },
    },
    managerNotes: member.recentNotes.join("\n"),
  };
}

const producerProfiles: UserProfile[] = [
  {
    id: "eva-chong",
    name: "Eva Chong",
    role: "Agency Owner / Producer",
    roleType: "owner",
    department: "Executive",
    shiftStatus: "On shift",
    currentQueue: "Owner approvals",
    status: "online",
    kpis: [
      { id: "k1", label: "Pending approvals", value: 5, route: `${routes.vaOperations}?view=approvals` },
      { id: "k2", label: "Team utilization", value: "87%", route: routes.vaOperations },
      { id: "k3", label: "Revenue tracked", value: "$284K", route: routes.commercialHub },
      { id: "k4", label: "Overdue escalations", value: 3, route: `${routes.commercialHub}?view=submissions` },
    ],
    workload: [
      { id: "w1", label: "Active tasks", detail: "4 owner reviews", route: `${routes.vaOperations}?view=tasks` },
      { id: "w2", label: "Assigned submissions", detail: "6 active pipeline", route: `${routes.commercialHub}?view=submissions` },
      { id: "w3", label: "Pending approvals", detail: "5 awaiting sign-off", route: `${routes.sendCenter}?view=approved`, overdue: true },
      { id: "w4", label: "Follow-ups due", detail: "2 client follow-ups", route: `${routes.sendCenter}?view=sent` },
      { id: "w5", label: "Overdue items", detail: "1 SLA breach", route: routes.commercialHub, overdue: true },
    ],
    recentActivity: [
      { id: "a1", text: "Approved Martinez proposal", timestamp: "1h ago", module: "Send Center", route: routes.sendCenter },
      { id: "a2", text: "Reviewed team utilization report", timestamp: "3h ago", module: "VA Operations", route: routes.vaOperations },
      { id: "a3", text: "Cleared DNC flag on lead #4821", timestamp: "Yesterday", module: "VA Operations", route: routes.vaOperations },
    ],
    performanceTrend: {
      today: { completion: 92, sla: 96, responseTime: "8m" },
      week: { completion: 89, sla: 94, responseTime: "11m" },
      month: { completion: 87, sla: 92, responseTime: "13m" },
    },
    managerNotes: "Focus on Martinez bind this week. Pedro covering Kim Auto Shop submission.",
    avatarUrl: getTeamPhotoUrl("eva-chong"),
  },
  {
    id: "mike-torres",
    name: "Mike Torres",
    role: "Licensed Producer",
    roleType: "producer",
    department: "Commercial Production",
    shiftStatus: "On shift",
    currentQueue: "Quote review",
    status: "busy",
    kpis: [
      { id: "k1", label: "Quotes reviewed", value: 8, route: `${routes.commercialHub}?view=quote-review` },
      { id: "k2", label: "Draft approvals", value: 3, route: `${routes.sendCenter}?view=pending-review` },
      { id: "k3", label: "Sent proposals", value: 5, route: `${routes.sendCenter}?view=sent` },
      { id: "k4", label: "Bound policies", value: 2, route: `${routes.commercialHub}?view=ready-to-bind` },
    ],
    workload: [
      { id: "w1", label: "Active tasks", detail: "Kim Auto Shop quote", route: `${routes.commercialHub}?view=quote-review` },
      { id: "w2", label: "Assigned submissions", detail: "2 open submissions", route: `${routes.commercialHub}?view=submissions` },
      { id: "w3", label: "Pending approvals", detail: "1 draft review", route: `${routes.sendCenter}?view=pending-review` },
      { id: "w4", label: "Follow-ups due", detail: "1 carrier follow-up", route: `${routes.commercialHub}?view=follow-ups` },
      { id: "w5", label: "Overdue items", detail: "0 overdue", route: `${routes.commercialHub}?view=submissions` },
    ],
    recentActivity: [
      { id: "a1", text: "Reviewed Kim Auto commercial auto quote", timestamp: "45m ago", module: "Commercial Hub", route: `${routes.commercialHub}?view=quote-review` },
      { id: "a2", text: "Approved draft for client review", timestamp: "2h ago", module: "Send Center", route: routes.sendCenter },
    ],
    performanceTrend: {
      today: { completion: 86, sla: 93, responseTime: "22m" },
      week: { completion: 84, sla: 90, responseTime: "28m" },
      month: { completion: 81, sla: 88, responseTime: "31m" },
    },
    managerNotes: "Strong commercial auto pipeline. Follow up on Kim Auto vehicle schedule.",
    avatarUrl: getTeamPhotoUrl("mike-torres"),
  },
  {
    id: "kyle-nguyen",
    name: "Kyle Nguyen",
    role: "Licensed Producer",
    roleType: "producer",
    department: "Commercial Production",
    shiftStatus: "On shift",
    currentQueue: "Bind requests",
    status: "online",
    kpis: [
      { id: "k1", label: "Quotes reviewed", value: 5, route: `${routes.commercialHub}?view=quote-review` },
      { id: "k2", label: "Draft approvals", value: 2, route: `${routes.sendCenter}?view=pending-review` },
      { id: "k3", label: "Sent proposals", value: 4, route: `${routes.sendCenter}?view=sent` },
      { id: "k4", label: "Bound policies", value: 3, route: `${routes.commercialHub}?view=ready-to-bind` },
    ],
    workload: [
      { id: "w1", label: "Active tasks", detail: "Westside WC bind", route: `${routes.commercialHub}?view=ready-to-bind` },
      { id: "w2", label: "Assigned submissions", detail: "1 bind pending", route: `${routes.commercialHub}?view=submissions` },
      { id: "w3", label: "Pending approvals", detail: "0 pending", route: `${routes.sendCenter}?view=approved` },
      { id: "w4", label: "Follow-ups due", detail: "COI request due", route: `${routes.commercialHub}?view=follow-ups`, overdue: true },
      { id: "w5", label: "Overdue items", detail: "0 overdue", route: routes.commercialHub },
    ],
    recentActivity: [
      { id: "a1", text: "Bound Rivera Construction WC policy", timestamp: "4h ago", module: "Commercial Hub", route: `${routes.commercialHub}?view=ready-to-bind` },
      { id: "a2", text: "Sent payment reminder to client", timestamp: "Yesterday", module: "ePayPolicy", route: routes.epayPolicy },
    ],
    performanceTrend: {
      today: { completion: 90, sla: 95, responseTime: "18m" },
      week: { completion: 88, sla: 93, responseTime: "21m" },
      month: { completion: 85, sla: 91, responseTime: "24m" },
    },
    managerNotes: "WC specialist — prioritize bind queue and COI requests.",
    avatarUrl: getTeamPhotoUrl("kyle-nguyen"),
  },
  {
    id: "pedro-alvarez",
    name: "Pedro Alvarez",
    role: "Licensed Producer",
    roleType: "producer",
    department: "Commercial Production",
    shiftStatus: "On shift",
    currentQueue: "New business",
    status: "online",
    kpis: [
      { id: "k1", label: "Quotes reviewed", value: 6, route: `${routes.commercialHub}?view=quote-review` },
      { id: "k2", label: "Draft approvals", value: 4, route: `${routes.sendCenter}?view=pending-review` },
      { id: "k3", label: "Sent proposals", value: 3, route: `${routes.sendCenter}?view=sent` },
      { id: "k4", label: "Bound policies", value: 1, route: `${routes.commercialHub}?view=ready-to-bind` },
    ],
    workload: [
      { id: "w1", label: "Active tasks", detail: "Pacific Dental BOP", route: routes.sendCenter },
      { id: "w2", label: "Assigned submissions", detail: "Submission #2048", route: `${routes.commercialHub}?view=submissions` },
      { id: "w3", label: "Pending approvals", detail: "2 drafts", route: `${routes.sendCenter}?view=approved` },
      { id: "w4", label: "Follow-ups due", detail: "Loss runs chase", route: `${routes.commercialHub}?view=missing-docs`, overdue: true },
      { id: "w5", label: "Overdue items", detail: "1 overdue doc", route: `${routes.commercialHub}?view=missing-docs`, overdue: true },
    ],
    recentActivity: [
      { id: "a1", text: "Updated Martinez submission", timestamp: "2h ago", module: "Commercial Hub", route: routes.commercialHub },
      { id: "a2", text: "Submitted BOP quote request", timestamp: "8m ago", module: "Commercial Hub", route: routes.commercialHub },
    ],
    performanceTrend: {
      today: { completion: 83, sla: 89, responseTime: "25m" },
      week: { completion: 80, sla: 87, responseTime: "29m" },
      month: { completion: 78, sla: 85, responseTime: "32m" },
    },
    managerNotes: "Assigned to submission #2048. Missing loss runs for Kim Auto.",
    avatarUrl: getTeamPhotoUrl("pedro-alvarez"),
  },
  {
    id: "tracie-wong",
    name: "Tracie",
    role: "Retention Korean",
    roleType: "va",
    department: "Retention",
    shiftStatus: "On shift",
    currentQueue: "Renewal outreach",
    status: "online",
    avatarUrl: getTeamPhotoUrl("tracie-wong"),
    kpis: [
      { id: "k1", label: "Renewals saved", value: 4, route: routes.retention },
      { id: "k2", label: "PIF retention", value: "91.8%", route: routes.retention },
      { id: "k3", label: "Cancellation saves", value: 2, route: routes.retention },
      { id: "k4", label: "Cross-sell points", value: 64, route: routes.retention },
    ],
    workload: [
      { id: "w1", label: "Active tasks", detail: "3 renewal calls", route: routes.retention },
      { id: "w2", label: "Assigned submissions", detail: "2 renewals", route: routes.commercialHub },
      { id: "w3", label: "Pending approvals", detail: "0 pending", route: routes.sendCenter },
      { id: "w4", label: "Follow-ups due", detail: "1 renewal reminder", route: routes.commercialHub },
      { id: "w5", label: "Overdue items", detail: "0 overdue", route: routes.retention },
    ],
    recentActivity: [
      { id: "a1", text: "Sent renewal proposal to Seoul Restaurant", timestamp: "5h ago", module: "Send Center", route: routes.sendCenter },
    ],
    performanceTrend: {
      today: { completion: 87, sla: 92, responseTime: "20m" },
      week: { completion: 85, sla: 90, responseTime: "23m" },
      month: { completion: 83, sla: 88, responseTime: "26m" },
    },
    managerNotes: "Korean retention queue — restaurant program renewals.",
  },
  {
    id: "valerie-martinez",
    name: "Valerie",
    role: "Retention English",
    roleType: "va",
    department: "Retention",
    shiftStatus: "On shift",
    currentQueue: "English retention queue",
    status: "online",
    avatarUrl: getTeamPhotoUrl("valerie-martinez"),
    kpis: [
      { id: "k1", label: "Renewals saved", value: 7, route: routes.retention },
      { id: "k2", label: "PIF retention", value: "94.2%", route: routes.retention },
      { id: "k3", label: "Cancellation saves", value: 7, route: routes.retention },
      { id: "k4", label: "Cross-sell points", value: 142, route: routes.retention },
    ],
    workload: [
      { id: "w1", label: "Active tasks", detail: "4 renewal saves", route: routes.retention },
      { id: "w2", label: "Assigned submissions", detail: "Rivera WC", route: routes.commercialHub },
      { id: "w3", label: "Pending approvals", detail: "0 pending", route: routes.sendCenter },
      { id: "w4", label: "Follow-ups due", detail: "2 due today", route: routes.retention },
      { id: "w5", label: "Overdue items", detail: "0 overdue", route: routes.retention },
    ],
    recentActivity: [
      { id: "a1", text: "Completed retention save call", timestamp: "1h ago", module: "Retention", route: routes.retention },
    ],
    performanceTrend: {
      today: { completion: 91, sla: 95, responseTime: "14m" },
      week: { completion: 89, sla: 93, responseTime: "16m" },
      month: { completion: 87, sla: 91, responseTime: "18m" },
    },
    managerNotes: "English retention lead — cross-sell focus this month.",
  },
  {
    id: "sarah-chen",
    name: "Sarah",
    role: "Sales",
    roleType: "va",
    department: "Sales Support",
    shiftStatus: "On shift",
    currentQueue: "Life referrals",
    status: "online",
    avatarUrl: getTeamPhotoUrl("sarah-chen"),
    kpis: [
      { id: "k1", label: "Referrals received", value: 4, route: routes.production },
      { id: "k2", label: "Quotes started", value: 3, route: routes.production },
      { id: "k3", label: "Policies bound", value: 1, route: routes.production },
      { id: "k4", label: "Pipeline value", value: "$42K", route: routes.production },
    ],
    workload: [
      { id: "w1", label: "Active tasks", detail: "2 life referrals", route: routes.production },
      { id: "w2", label: "Assigned submissions", detail: "—", route: routes.commercialHub },
      { id: "w3", label: "Pending approvals", detail: "0 pending", route: routes.sendCenter },
      { id: "w4", label: "Follow-ups due", detail: "1 callback", route: routes.production },
      { id: "w5", label: "Overdue items", detail: "0 overdue", route: routes.production },
    ],
    recentActivity: [
      { id: "a1", text: "Logged life referral from retention team", timestamp: "3h ago", module: "Production", route: routes.production },
    ],
    performanceTrend: {
      today: { completion: 84, sla: 90, responseTime: "18m" },
      week: { completion: 82, sla: 88, responseTime: "21m" },
      month: { completion: 80, sla: 86, responseTime: "24m" },
    },
    managerNotes: "Life sales pipeline — prioritize retention referrals.",
  },
  {
    id: "arminda-ops",
    name: "Arminda",
    role: "AZ Operations",
    roleType: "va",
    department: "Arizona Operations",
    shiftStatus: "On shift",
    currentQueue: "AZ service queue",
    status: "online",
    avatarUrl: getTeamPhotoUrl("arminda-ops"),
    kpis: [
      { id: "k1", label: "Service tickets", value: 6, route: routes.vaOperations },
      { id: "k2", label: "COI requests", value: 3, route: routes.commercialHub },
      { id: "k3", label: "Endorsements", value: 2, route: routes.commercialHub },
      { id: "k4", label: "SLA compliance", value: "96%", route: routes.vaOperations },
    ],
    workload: [
      { id: "w1", label: "Active tasks", detail: "4 AZ service items", route: routes.vaOperations },
      { id: "w2", label: "Assigned submissions", detail: "1 endorsement", route: routes.commercialHub },
      { id: "w3", label: "Pending approvals", detail: "0 pending", route: routes.sendCenter },
      { id: "w4", label: "Follow-ups due", detail: "1 COI due", route: routes.commercialHub },
      { id: "w5", label: "Overdue items", detail: "0 overdue", route: routes.vaOperations },
    ],
    recentActivity: [
      { id: "a1", text: "Processed AZ COI request", timestamp: "2h ago", module: "Commercial Hub", route: routes.commercialHub },
    ],
    performanceTrend: {
      today: { completion: 88, sla: 94, responseTime: "16m" },
      week: { completion: 86, sla: 92, responseTime: "18m" },
      month: { completion: 84, sla: 90, responseTime: "20m" },
    },
    managerNotes: "AZ ops coverage — COI and endorsement priority.",
  },
];

const vaProfiles = teamMembers.map((member) => {
  const profile = buildVaProfile(member);
  if (member.id === "pedro") {
    return { ...profile, id: "pedro-va", name: "Pedro", role: "Brokerage VA" };
  }
  return profile;
});

/** Brokerage VA Pedro vs producer Pedro Alvarez — separate profile ids */

export const userProfiles: UserProfile[] = [...producerProfiles, ...vaProfiles];

export const userProfilesById: Record<string, UserProfile> = Object.fromEntries(
  userProfiles.map((p) => [p.id, p]),
);

const nameAliases: Record<string, string> = {
  eva: "eva-chong",
  "eva chong": "eva-chong",
  mike: "mike-torres",
  "mike torres": "mike-torres",
  kyle: "kyle-nguyen",
  "kyle nguyen": "kyle-nguyen",
  pedro: "pedro-alvarez",
  "pedro alvarez": "pedro-alvarez",
  "pedro-va": "pedro-va",
  tracie: "tracie-wong",
  "tracie wong": "tracie-wong",
  valerie: "valerie-martinez",
  "valerie martinez": "valerie-martinez",
  sarah: "sarah-chen",
  "sarah chen": "sarah-chen",
  arminda: "arminda-ops",
  jojo: "jojo",
  "jojo-martinez": "jojo",
  "jojo martinez": "jojo",
  chris: "mike-torres",
  kat: "kat",
  jaffer: "jaffer",
  sara: "sara",
  hassan: "hassan",
  hamad: "jaffer",
};

export function normalizeUserKey(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveUserProfile(userIdOrName: string): UserProfile | undefined {
  const key = normalizeUserKey(userIdOrName);
  if (userProfilesById[key]) return userProfilesById[key];
  const aliasId = nameAliases[key];
  if (aliasId && userProfilesById[aliasId]) return userProfilesById[aliasId];
  return userProfiles.find((p) => normalizeUserKey(p.name) === key);
}

export const presenceLabels: Record<UserPresenceStatus, string> = {
  online: "Online",
  busy: "Busy",
  away: "Away",
  offline: "Offline",
};

export const presenceClass: Record<UserPresenceStatus, string> = {
  online: "badge-green",
  busy: "badge-yellow",
  away: "badge-amber",
  offline: "badge-gray",
};

export const USER_PROFILE_NOTES_KEY = "agency-ops-user-profile-notes";

export function loadManagerNotes(userId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_PROFILE_NOTES_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw) as Record<string, string>;
    return all[userId] ?? null;
  } catch {
    return null;
  }
}

export function saveManagerNotes(userId: string, notes: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(USER_PROFILE_NOTES_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    all[userId] = notes;
    localStorage.setItem(USER_PROFILE_NOTES_KEY, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}
