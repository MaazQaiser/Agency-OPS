import {
  getLanguageBadgeCode,
  hasBilingualSupport,
  needsLanguageSupport,
  type ClientLanguageProfile,
  type SupportedLanguage,
} from "@/data/bilingualClient";
import { cn } from "@/lib/cn";

type LanguageBadgeProps = {
  language: SupportedLanguage;
  className?: string;
};

export function LanguageBadge({ language, className }: LanguageBadgeProps) {
  return (
    <span className={cn("badge badge-blue bilingual-lang-badge", className)} title={language}>
      {getLanguageBadgeCode(language)}
    </span>
  );
}

type BilingualSupportBadgeProps = {
  profile: ClientLanguageProfile;
  compact?: boolean;
};

export function BilingualSupportBadge({ profile, compact = false }: BilingualSupportBadgeProps) {
  if (needsLanguageSupport(profile)) {
    return (
      <span className="badge badge-red bilingual-support-badge" title="No bilingual VA assigned">
        {compact ? "Needs Support" : "Needs Language Support"}
      </span>
    );
  }
  if (profile.preferredLanguage !== "English" && hasBilingualSupport(profile)) {
    return (
      <span className="badge badge-green bilingual-support-badge" title={`Bilingual VA: ${profile.assignedBilingualVa}`}>
        {compact ? "Bilingual" : "Bilingual Supported"}
      </span>
    );
  }
  return null;
}

type ClientLanguageBadgesProps = {
  profile: ClientLanguageProfile;
  showSecondary?: boolean;
  compact?: boolean;
  className?: string;
};

export function ClientLanguageBadges({
  profile,
  showSecondary = true,
  compact = false,
  className,
}: ClientLanguageBadgesProps) {
  return (
    <span className={cn("bilingual-badge-group", className)}>
      <LanguageBadge language={profile.preferredLanguage} />
      {showSecondary && profile.secondaryLanguage && (
        <LanguageBadge language={profile.secondaryLanguage} className="bilingual-secondary-badge" />
      )}
      <BilingualSupportBadge profile={profile} compact={compact} />
    </span>
  );
}

type LanguageMismatchWarningProps = {
  message: string;
};

export function LanguageMismatchWarning({ message }: LanguageMismatchWarningProps) {
  return (
    <div className="bilingual-mismatch-warning" role="alert">
      <span className="badge badge-red">Language Mismatch</span>
      <span>{message}</span>
    </div>
  );
}
