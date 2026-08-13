import { HubShell } from "@/components/layout/HubShell";
import { CommercialModule } from "@/components/commercial/CommercialModule";

export default function CommercialPage() {
  return (
    <HubShell hub="commercial" className="module-commercial">
      <CommercialModule />
    </HubShell>
  );
}
