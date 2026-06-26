import { RetentionLanguageProvider } from "@/components/retention/RetentionLanguageProvider";
import { RetentionPageContent } from "@/components/retention/RetentionPageContent";

export default function RetentionPage() {
  return (
    <RetentionLanguageProvider>
      <RetentionPageContent />
    </RetentionLanguageProvider>
  );
}
