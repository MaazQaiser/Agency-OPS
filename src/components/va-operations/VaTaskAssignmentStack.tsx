import { AvatarStack } from "@/components/user-profile/AvatarStack";

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
  const members = assignerIsSystem
    ? [{ userId: ownerId, name: ownerName }]
    : [
        { userId: ownerId, name: ownerName },
        { userId: assignerId, name: assignerName },
      ];

  return (
    <div className="va-task-assignment-stack">
      <div className="va-task-assignment-avatars">
        {assignerIsSystem ? (
          <>
            <AvatarStack members={members} maxVisible={1} size="sm" />
            <span className="va-task-assignment-system-badge" title={`Assigned by ${assignerName}`}>
              {assignerName.charAt(0).toUpperCase()}
            </span>
          </>
        ) : (
          <AvatarStack members={members} maxVisible={2} size="sm" />
        )}
      </div>
      <div className="va-task-assignment-labels">
        <span className="va-task-assignment-owner">{ownerName}</span>
        <span className="va-task-assignment-by">by {assignerName}</span>
      </div>
    </div>
  );
}
