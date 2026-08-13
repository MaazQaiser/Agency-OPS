import { VaTeamPresenceStrip } from "./VaTeamPresenceStrip";
import { VaTodayTimelineStrip } from "./VaTodayTimelineStrip";

type VaOpsTopStripsProps = {
  showPresence?: boolean;
  showTimeline?: boolean;
};

export function VaOpsTopStrips({ showPresence = true, showTimeline = true }: VaOpsTopStripsProps) {
  if (!showPresence && !showTimeline) return null;

  return (
    <div className="va-ops-top-strips">
      {showPresence && <VaTeamPresenceStrip />}
      {showTimeline && <VaTodayTimelineStrip />}
    </div>
  );
}
