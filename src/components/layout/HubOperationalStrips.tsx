import { FolioProgressBar } from "./FolioProgressBar";
import { OwnerIntelligenceStrip } from "./OwnerIntelligenceStrip";

export function HubOperationalStrips() {
  return (
    <div className="hub-operational-strips">
      <FolioProgressBar />
      <OwnerIntelligenceStrip />
    </div>
  );
}
