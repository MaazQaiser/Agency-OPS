import { TeamAvatar } from "@/components/user-profile/TeamAvatar";

type VaTaskAssignmentStackProps = {
  ownerId?: string;
  ownerName: string;
  assignerId?: string;
  assignerName: string;
  assignerIsSystem?: boolean;
};

export function VaTaskAssignmentStack({
  ownerId,
  ownerName,
  assignerId,
  assignerName,
  assignerIsSystem = false,
}: VaTaskAssignmentStackProps) {
  return (
    <div className="va-task-assignment-stack">
      <div className="va-task-assignment-avatars">
        <TeamAvatar
          userId={ownerId}
          name={ownerName}
          size="sm"
          showStatus={false}
          aria-label={`Assigned to ${ownerName}`}
        />
        {assignerIsSystem ? (
          <span className="va-task-assignment-system-badge" title={`Assigned by ${assignerName}`}>
            {assignerName.charAt(0).toUpperCase()}
          </span>
        ) : (
          <TeamAvatar
            userId={assignerId}
            name={assignerName}
            size="xs"
            showStatus={false}
            className="va-task-assignment-assigner"
            aria-label={`Assigned by ${assignerName}`}
          />
        )}
      </div>
      <div className="va-task-assignment-labels">
        <span className="va-task-assignment-owner">{ownerName}</span>
        <span className="va-task-assignment-by">by {assignerName}</span>
      </div>
    </div>
  );
}
