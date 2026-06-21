export type SupportedLanguage =
  | "English"
  | "Spanish"
  | "Korean"
  | "Arabic"
  | "French"
  | "Mandarin"
  | "Urdu"
  | "Vietnamese"
  | "Portuguese";

export type TranslationStatus = "Not Required" | "Pending" | "In Progress" | "Complete" | "Mismatch";

export type BilingualQueueStatus = "New" | "Assigned" | "In Progress" | "Waiting" | "Resolved";

export type ClientLanguageProfile = {
  clientKey: string;
  displayName: string;
  preferredLanguage: SupportedLanguage;
  secondaryLanguage: SupportedLanguage | null;
  interpreterNeeded: boolean;
  assignedBilingualVa: string | null;
  communicationRestriction: string | null;
  proposalLanguagePreference: SupportedLanguage;
  billingLanguage: SupportedLanguage;
};

export type ProposalLanguageMeta = {
  proposalLanguage: SupportedLanguage;
  translationStatus: TranslationStatus;
  clientPreferredLanguage: SupportedLanguage;
};

export type BilingualQueueItem = {
  id: string;
  client: string;
  clientKey: string;
  language: SupportedLanguage;
  assignedVa: string;
  status: BilingualQueueStatus;
  priority: "High" | "Medium" | "Low";
  module: string;
  notes: string;
};

export type BilingualAlert = {
  id: string;
  title: string;
  detail: string;
  severity: "critical" | "warning" | "info";
  clientKey?: string;
  module: string;
  route?: string;
};

export const supportedLanguages: SupportedLanguage[] = [
  "English",
  "Spanish",
  "Korean",
  "Arabic",
  "French",
  "Mandarin",
  "Urdu",
  "Vietnamese",
  "Portuguese",
];

export const languageBadgeCodes: Record<SupportedLanguage, string> = {
  English: "EN",
  Spanish: "ES",
  Korean: "KR",
  Arabic: "AR",
  French: "FR",
  Mandarin: "ZH",
  Urdu: "UR",
  Vietnamese: "VI",
  Portuguese: "PT",
};

export const bilingualVaOptions = ["JoJo", "Pedro", "Valerie", "Tracie", "Unassigned"];

export const bilingualLanguageFilterOptions = ["All Languages", ...supportedLanguages];

export const bilingualSupportFilterOptions = ["All Support", "Bilingual Supported", "Needs Language Support"];

export const translationStatusFilterOptions = [
  "All Translation Statuses",
  "Not Required",
  "Pending",
  "In Progress",
  "Complete",
  "Mismatch",
];

export const translationStatusClass: Record<TranslationStatus, string> = {
  "Not Required": "badge-gray",
  Pending: "badge-yellow",
  "In Progress": "badge-blue",
  Complete: "badge-green",
  Mismatch: "badge-red",
};

export const BILINGUAL_STORAGE_KEY = "agency-ops-bilingual-clients";

export type BilingualClientOverrides = Record<string, Partial<ClientLanguageProfile>>;

function normalizeClientKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function profile(
  displayName: string,
  preferred: SupportedLanguage,
  secondary: SupportedLanguage | null,
  interpreter: boolean,
  bilingualVa: string | null,
  restriction: string | null,
  proposalLang?: SupportedLanguage,
  billingLang?: SupportedLanguage,
): ClientLanguageProfile {
  return {
    clientKey: normalizeClientKey(displayName),
    displayName,
    preferredLanguage: preferred,
    secondaryLanguage: secondary,
    interpreterNeeded: interpreter,
    assignedBilingualVa: bilingualVa,
    communicationRestriction: restriction,
    proposalLanguagePreference: proposalLang ?? preferred,
    billingLanguage: billingLang ?? preferred,
  };
}

export const seedClientLanguageProfiles: ClientLanguageProfile[] = [
  profile("Martinez Landscaping", "Spanish", "English", false, "Pedro", null),
  profile("Kim Auto Shop", "Korean", "English", false, "JoJo", null),
  profile("Greenline Logistics", "Korean", "English", false, "JoJo", "Call before 5 PM KST"),
  profile("Atlas Roofing", "Mandarin", "English", true, null, "Interpreter required for binding"),
  profile("Atlas Roofing", "Urdu", "English", false, "Tracie", null),
  profile("Atlas Roofing", "English", "Spanish", false, "Pedro", null),
  profile("Rivera Construction", "Spanish", "English", false, "Pedro", null),
  profile("Greenline Logistics", "Portuguese", "English", false, "Tracie", null),
  profile("Atlas Roofing", "English", null, false, null, null),
  profile("Nguyen Retail Group", "Vietnamese", "English", false, null, null),
  profile("Torres Manufacturing", "Spanish", "English", false, null, null),
  profile("Carlos Martinez", "Spanish", "English", false, "Pedro", null),
  profile("David Kim", "Korean", "English", false, "JoJo", null),
  profile("Min Park", "Korean", "English", false, "JoJo", null),
  profile("James Rivera", "Spanish", "English", false, "Pedro", null),
  profile("Robert Chen", "Mandarin", "English", true, null, "Interpreter required"),
  profile("Sarah Nguyen", "Vietnamese", "English", false, null, null),
  profile("Michael Torres", "Spanish", "English", false, null, null),
  profile("Angela Lopez", "Spanish", "English", false, "Pedro", null),
];

export const seedBilingualQueue: BilingualQueueItem[] = [
  {
    id: "bq-1",
    client: "Atlas Roofing",
    clientKey: normalizeClientKey("Atlas Roofing"),
    language: "Mandarin",
    assignedVa: "Unassigned",
    status: "Waiting",
    priority: "High",
    module: "Commercial Hub",
    notes: "No bilingual VA assigned — interpreter needed for intake.",
  },
  {
    id: "bq-2",
    client: "Kim Auto Shop",
    clientKey: normalizeClientKey("Kim Auto Shop"),
    language: "Korean",
    assignedVa: "JoJo",
    status: "In Progress",
    priority: "High",
    module: "Intake Forms",
    notes: "Intake incomplete — Korean labels required for signed app.",
  },
  {
    id: "bq-3",
    client: "Martinez Landscaping",
    clientKey: normalizeClientKey("Martinez Landscaping"),
    language: "Spanish",
    assignedVa: "Pedro",
    status: "Assigned",
    priority: "Medium",
    module: "Send Center",
    notes: "Proposal translation pending review.",
  },
  {
    id: "bq-4",
    client: "Nguyen Retail Group",
    clientKey: normalizeClientKey("Nguyen Retail Group"),
    language: "Vietnamese",
    assignedVa: "Unassigned",
    status: "New",
    priority: "Medium",
    module: "VA Operations",
    notes: "New lead — Vietnamese preferred, no bilingual VA assigned.",
  },
  {
    id: "bq-5",
    client: "Greenline Logistics",
    clientKey: normalizeClientKey("Greenline Logistics"),
    language: "Portuguese",
    assignedVa: "Tracie",
    status: "In Progress",
    priority: "Low",
    module: "ePayPolicy",
    notes: "Payment reminder not localized to Portuguese.",
  },
  {
    id: "bq-6",
    client: "Torres Manufacturing",
    clientKey: normalizeClientKey("Torres Manufacturing"),
    language: "Spanish",
    assignedVa: "Unassigned",
    status: "New",
    priority: "High",
    module: "Commercial Hub",
    notes: "New Ricochet lead — Spanish preferred, unassigned 45+ mins.",
  },
];

export const seedProposalLanguageMeta: Record<string, ProposalLanguageMeta> = {
  "prop-martinez": {
    proposalLanguage: "English",
    translationStatus: "Mismatch",
    clientPreferredLanguage: "Spanish",
  },
  "prop-kim": {
    proposalLanguage: "English",
    translationStatus: "Pending",
    clientPreferredLanguage: "Korean",
  },
  "prop-greenline": {
    proposalLanguage: "English",
    translationStatus: "Not Required",
    clientPreferredLanguage: "English",
  },
  "prop-rivera": {
    proposalLanguage: "Spanish",
    translationStatus: "Complete",
    clientPreferredLanguage: "Spanish",
  },
  "prop-atlas": {
    proposalLanguage: "English",
    translationStatus: "Not Required",
    clientPreferredLanguage: "English",
  },
};

export const bilingualAlerts: BilingualAlert[] = [
  {
    id: "bl-1",
    title: "Client has no bilingual support assigned",
    detail: "Atlas Roofing requires Mandarin support — no bilingual VA assigned.",
    severity: "critical",
    clientKey: normalizeClientKey("Atlas Roofing"),
    module: "VA Operations",
  },
  {
    id: "bl-2",
    title: "Proposal sent in wrong language",
    detail: "Martinez Landscaping proposal sent in English — client prefers Spanish.",
    severity: "critical",
    clientKey: normalizeClientKey("Martinez Landscaping"),
    module: "Send Center",
  },
  {
    id: "bl-3",
    title: "Intake incomplete due to language mismatch",
    detail: "Kim Auto Shop intake blocked — Korean labels needed for signed application.",
    severity: "warning",
    clientKey: normalizeClientKey("Kim Auto Shop"),
    module: "Intake Forms",
  },
  {
    id: "bl-4",
    title: "Payment reminder not localized",
    detail: "Greenline Logistics payment reminder sent in English — billing language is Portuguese.",
    severity: "warning",
    clientKey: normalizeClientKey("Greenline Logistics"),
    module: "ePayPolicy",
  },
];

export const intakeStep1LabelsEn: Record<string, string> = {
  businessName: "Business Name",
  dbaName: "DBA",
  ownerName: "Owner Name",
  email: "Email",
  phone: "Phone",
  address: "Business Address",
  state: "State",
  yearsInBusiness: "Years in Business",
  preferredLanguage: "Preferred Client Language",
  fullName: "Full Name",
  selectState: "Select state",
};

export const intakeStep1LabelsEs: Record<string, string> = {
  businessName: "Nombre del Negocio",
  dbaName: "Nombre Comercial (DBA)",
  ownerName: "Nombre del Propietario",
  email: "Correo Electrónico",
  phone: "Teléfono",
  address: "Dirección del Negocio",
  state: "Estado",
  yearsInBusiness: "Años en el Negocio",
  preferredLanguage: "Idioma Preferido del Cliente",
  fullName: "Nombre Completo",
  selectState: "Seleccionar estado",
};

export function getIntakeStep1Label(key: string, language: SupportedLanguage): string {
  if (language === "Spanish") return intakeStep1LabelsEs[key] ?? intakeStep1LabelsEn[key] ?? key;
  return intakeStep1LabelsEn[key] ?? key;
}

export function loadBilingualOverrides(): BilingualClientOverrides {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BILINGUAL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BilingualClientOverrides) : {};
  } catch {
    return {};
  }
}

export function saveBilingualOverrides(overrides: BilingualClientOverrides): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BILINGUAL_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    /* ignore */
  }
}

export function mergeClientProfiles(base: ClientLanguageProfile[], overrides: BilingualClientOverrides): ClientLanguageProfile[] {
  return base.map((p) => {
    const o = overrides[p.clientKey];
    return o ? { ...p, ...o } : p;
  });
}

export function getClientLanguage(clientName: string, profiles?: ClientLanguageProfile[]): ClientLanguageProfile {
  const list = profiles ?? mergeClientProfiles(seedClientLanguageProfiles, loadBilingualOverrides());
  const key = normalizeClientKey(clientName);
  const found = list.find((p) => p.clientKey === key);
  if (found) return found;
  return {
    clientKey: key,
    displayName: clientName,
    preferredLanguage: "English",
    secondaryLanguage: null,
    interpreterNeeded: false,
    assignedBilingualVa: null,
    communicationRestriction: null,
    proposalLanguagePreference: "English",
    billingLanguage: "English",
  };
}

export function hasBilingualSupport(profile: ClientLanguageProfile): boolean {
  return profile.preferredLanguage === "English" || Boolean(profile.assignedBilingualVa);
}

export function needsLanguageSupport(profile: ClientLanguageProfile): boolean {
  return profile.preferredLanguage !== "English" && !profile.assignedBilingualVa;
}

export function getLanguageBadgeCode(language: SupportedLanguage): string {
  return languageBadgeCodes[language];
}

export function getProposalLanguageMeta(proposalId: string): ProposalLanguageMeta | null {
  return seedProposalLanguageMeta[proposalId] ?? null;
}

export function isProposalLanguageMismatch(meta: ProposalLanguageMeta): boolean {
  return meta.proposalLanguage !== meta.clientPreferredLanguage;
}

export const translateLanguagePairs: Array<[SupportedLanguage, SupportedLanguage]> = [
  ["English", "Spanish"],
  ["English", "Korean"],
  ["English", "Arabic"],
];

export function getTranslatePairLabel(from: SupportedLanguage, to: SupportedLanguage): string {
  return `${languageBadgeCodes[from]} ↔ ${languageBadgeCodes[to]}`;
}

export function matchesLanguageFilter(profile: ClientLanguageProfile, language: string): boolean {
  if (language === "All Languages") return true;
  return profile.preferredLanguage === language || profile.secondaryLanguage === language;
}

export function matchesBilingualSupportFilter(profile: ClientLanguageProfile, filter: string): boolean {
  if (filter === "All Support") return true;
  if (filter === "Bilingual Supported") return hasBilingualSupport(profile);
  if (filter === "Needs Language Support") return needsLanguageSupport(profile);
  return true;
}

export function matchesTranslationFilter(status: TranslationStatus, filter: string): boolean {
  if (filter === "All Translation Statuses") return true;
  return status === filter;
}

export { normalizeClientKey };
