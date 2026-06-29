import { VaTeamPresenceStrip } from "./VaTeamPresenceStrip";
import { VaTodayTimelineStrip } from "./VaTodayTimelineStrip";

export function VaOpsTopStrips() {
  return (
    <div className="va-ops-top-strips">
      <VaTeamPresenceStrip />
      <VaTodayTimelineStrip />
    </div>
  );
}
