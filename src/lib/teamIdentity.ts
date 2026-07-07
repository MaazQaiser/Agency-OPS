import type { UserPresenceStatus } from "@/data/userProfiles";
import type { TeamMemberStatus } from "@/data/vaOperations";
import { getNameInitials } from "@/lib/nameInitials";

export type TeamAvatarStatus = "online" | "away" | "busy" | "offline";

export type AvatarVisualMode = "photo" | "animated" | "initials";

export type TeamIdentity = {
  id: string;
  name: string;
  role: string;
  ringGradient: string;
  photoUrl: string;
  /** Optional animated avatar asset (gif/webp/lottie poster) */
  animatedAvatarUrl?: string;
  aliases: string[];
  defaultStatus: TeamAvatarStatus;
};

/** Premium role-based gradient rings — persistent identity layer */
const RINGS = {
  valerie: "linear-gradient(135deg, #3B82F6, #60A5FA)",
  tracie: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
  sarah: "linear-gradient(135deg, #14B8A6, #2DD4BF)",
  kat: "linear-gradient(135deg, #F59E0B, #FCD34D)",
  jojo: "linear-gradient(135deg, #6366F1, #818CF8)",
  pedroVa: "linear-gradient(135deg, #06B6D4, #22D3EE)",
  arminda: "linear-gradient(135deg, #F43F5E, #FB7185)",
  eva: "linear-gradient(135deg, #AAD0E7, #8FC4E3)",
  neutral: "linear-gradient(135deg, #7AAFC8, #5A8FA8)",
} as const;

export const ROLE_RING_GRADIENTS = {
  producer: RINGS.sarah,
  va: RINGS.valerie,
  owner: RINGS.eva,
  finance: "linear-gradient(135deg, #10B981, #34D399)",
  training: RINGS.kat,
  neutral: RINGS.neutral,
} as const;

export function resolveRoleRingGradient(role: string): string {
  const r = role.toLowerCase();
  if (r.includes("valerie") || r.includes("retention english")) return RINGS.valerie;
  if (r.includes("tracie") || r.includes("korean")) return RINGS.tracie;
  if (r.includes("sarah") || r.includes("sales") || r.includes("producer")) return RINGS.sarah;
  if (r.includes("kat") || r.includes("dialer")) return RINGS.kat;
  if (r.includes("jojo") || r.includes("brokerage va1")) return RINGS.jojo;
  if (r.includes("pedro") && r.includes("va")) return RINGS.pedroVa;
  if (r.includes("arminda")) return RINGS.arminda;
  if (r.includes("eva") || r.includes("owner")) return RINGS.eva;
  if (r.includes("finance") || r.includes("trust") || r.includes("billing")) return ROLE_RING_GRADIENTS.finance;
  if (r.includes("training") || r.includes("coach")) return ROLE_RING_GRADIENTS.training;
  if (r.includes("va") || r.includes("dialer") || r.includes("brokerage") || r.includes("research") || r.includes("retention")) {
    return ROLE_RING_GRADIENTS.va;
  }
  return ROLE_RING_GRADIENTS.neutral;
}

const TEAM_PHOTO_FILES: Record<string, string> = {
  eva: "eva.jpg",
  "eva-chong": "eva-chong.jpg",
  "valerie-martinez": "valerie-martinez.jpg",
  "tracie-wong": "tracie-wong.png",
  "sarah-chen": "sarah-chen.jpg",
  sara: "sara.jpg",
  jaffer: "jaffer.jpeg",
  jojo: "jojo.jpg",
  "pedro-va": "pedro-va.jpeg",
  "pedro-alvarez": "pedro-alvarez.jpeg",
  "mike-torres": "mike-torres.jpeg",
  kat: "kat.jpg",
  "arminda-ops": "arminda-ops.jpg",
  kyle: "kyle.jpg",
  hassan: "hassan.jpg",
  "kyle-nguyen": "kyle-nguyen.jpg",
};

export const TEAM_PHOTO_SOURCE_MAP: Record<string, string> = {
  "Eva.jpg": "eva-chong",
  "Valerie.jpg": "valerie-martinez",
  "Tracie.png": "tracie-wong",
  "Sarah.jpg": "sarah-chen",
  "Jaffer hussain.jpeg": "jaffer",
  "joanna.jpg": "jojo",
  "pedro torres.jpeg": "pedro-va",
  "Profile Photo.jpg": "kat",
  "Profile photo (1).jpg": "arminda-ops",
};

function teamPhotoPath(memberId: string) {
  const file = TEAM_PHOTO_FILES[memberId] ?? `${memberId}.jpg`;
  return `/team/${file}`;
}

export const TEAM_IDENTITIES: TeamIdentity[] = [
  {
    id: "valerie-martinez",
    name: "Valerie",
    role: "Retention English",
    ringGradient: RINGS.valerie,
    photoUrl: teamPhotoPath("valerie-martinez"),
    aliases: ["valerie", "valerie martinez"],
    defaultStatus: "online",
  },
  {
    id: "tracie-wong",
    name: "Tracie",
    role: "Retention Korean",
    ringGradient: RINGS.tracie,
    photoUrl: teamPhotoPath("tracie-wong"),
    aliases: ["tracie", "tracie wong"],
    defaultStatus: "online",
  },
  {
    id: "sarah-chen",
    name: "Sarah",
    role: "Sales",
    ringGradient: RINGS.sarah,
    photoUrl: teamPhotoPath("sarah-chen"),
    aliases: ["sarah", "sarah chen"],
    defaultStatus: "online",
  },
  {
    id: "kat",
    name: "Kat",
    role: "Dialer VA",
    ringGradient: RINGS.kat,
    photoUrl: teamPhotoPath("kat"),
    aliases: [],
    defaultStatus: "online",
  },
  {
    id: "jojo",
    name: "JoJo",
    role: "Brokerage VA1",
    ringGradient: RINGS.jojo,
    photoUrl: teamPhotoPath("jojo"),
    aliases: ["jojo-martinez", "jojo martinez"],
    defaultStatus: "online",
  },
  {
    id: "pedro-va",
    name: "Pedro",
    role: "Brokerage VA2",
    ringGradient: RINGS.pedroVa,
    photoUrl: teamPhotoPath("pedro-va"),
    aliases: ["pedro va"],
    defaultStatus: "online",
  },
  {
    id: "arminda-ops",
    name: "Arminda",
    role: "AZ Operations",
    ringGradient: RINGS.arminda,
    photoUrl: teamPhotoPath("arminda-ops"),
    aliases: ["arminda", "arminda ops"],
    defaultStatus: "online",
  },
  {
    id: "eva-chong",
    name: "Eva Chong",
    role: "Agency Owner",
    ringGradient: RINGS.eva,
    photoUrl: teamPhotoPath("eva-chong"),
    aliases: ["eva", "eva chong", "Eva"],
    defaultStatus: "online",
  },
  {
    id: "jaffer",
    name: "Jaffer",
    role: "Research VA",
    ringGradient: RINGS.neutral,
    photoUrl: teamPhotoPath("jaffer"),
    aliases: ["hamad"],
    defaultStatus: "online",
  },
  {
    id: "sara",
    name: "Sarah",
    role: "Retention VA",
    ringGradient: RINGS.valerie,
    photoUrl: teamPhotoPath("sara"),
    aliases: ["sara"],
    defaultStatus: "online",
  },
  {
    id: "kyle",
    name: "Kyle",
    role: "Automation Builder",
    ringGradient: RINGS.jojo,
    photoUrl: teamPhotoPath("kyle"),
    aliases: [],
    defaultStatus: "away",
  },
  {
    id: "hassan",
    name: "Hassan",
    role: "Developer",
    ringGradient: RINGS.neutral,
    photoUrl: teamPhotoPath("hassan"),
    aliases: [],
    defaultStatus: "away",
  },
  {
    id: "mike-torres",
    name: "Mike Torres",
    role: "Licensed Producer",
    ringGradient: RINGS.sarah,
    photoUrl: teamPhotoPath("mike-torres"),
    aliases: ["mike", "mike torres", "chris"],
    defaultStatus: "busy",
  },
  {
    id: "kyle-nguyen",
    name: "Kyle Nguyen",
    role: "Operations Manager",
    ringGradient: RINGS.jojo,
    photoUrl: teamPhotoPath("kyle-nguyen"),
    aliases: ["kyle nguyen"],
    defaultStatus: "online",
  },
  {
    id: "pedro-alvarez",
    name: "Pedro Alvarez",
    role: "Licensed Producer",
    ringGradient: RINGS.pedroVa,
    photoUrl: teamPhotoPath("pedro-alvarez"),
    aliases: ["pedro alvarez", "pedro ramirez"],
    defaultStatus: "online",
  },
];

const byId = Object.fromEntries(TEAM_IDENTITIES.map((t) => [t.id, t])) as Record<string, TeamIdentity>;

const aliasIndex: Record<string, string> = {};
for (const member of TEAM_IDENTITIES) {
  aliasIndex[member.id.toLowerCase()] = member.id;
  aliasIndex[member.name.toLowerCase()] = member.id;
  for (const alias of member.aliases) {
    aliasIndex[alias.toLowerCase()] = member.id;
  }
}

const PRODUCER_PEDRO_CONTEXTS = new Set(["pedro alvarez", "pedro ramirez", "pedro-alvarez"]);

export function normalizeTeamKey(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveTeamIdentity(userIdOrName: string, context?: { preferVa?: boolean }): TeamIdentity | undefined {
  const key = normalizeTeamKey(userIdOrName);
  if (!key) return undefined;

  if (key === "pedro" || key === "pedro-va") {
    return context?.preferVa ? byId["pedro-va"] : byId["pedro-alvarez"] ?? byId["pedro-va"];
  }
  if (PRODUCER_PEDRO_CONTEXTS.has(key)) return byId["pedro-alvarez"];

  const id = byId[key]?.id ?? aliasIndex[key];
  return id ? byId[id] : undefined;
}

export function resolveAvatarVisual(
  identity: TeamIdentity | undefined,
  photoError: boolean,
  imageSrc?: string,
): AvatarVisualMode {
  if ((imageSrc || identity?.photoUrl) && !photoError) return "photo";
  if (identity?.animatedAvatarUrl) return "animated";
  return "initials";
}

export function getGeneratedInitialAvatar(name: string, ringGradient?: string): { initials: string; gradient: string } {
  return {
    initials: getNameInitials(name),
    gradient: ringGradient ?? RINGS.neutral,
  };
}

export function teamMemberStatusToAvatar(status: TeamMemberStatus): TeamAvatarStatus {
  if (status === "active") return "online";
  if (status === "away") return "away";
  return "offline";
}

export function presenceToAvatarStatus(status: UserPresenceStatus): TeamAvatarStatus {
  return status;
}

export function vaPresenceToAvatarStatus(status: "online" | "on-call" | "busy" | "offline"): TeamAvatarStatus {
  if (status === "on-call") return "busy";
  return status;
}

export function getTeamPhotoUrl(userIdOrName: string): string | undefined {
  return resolveTeamIdentity(userIdOrName)?.photoUrl;
}

export function getTeamRingGradient(userIdOrName: string): string | undefined {
  return resolveTeamIdentity(userIdOrName)?.ringGradient;
}
