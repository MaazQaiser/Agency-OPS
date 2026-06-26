import { seedNotifications } from "@/data/notifications";
import { downloadCsv } from "../csv";

export function exportNotificationHistoryCsv(): void {
  downloadCsv(
    `notification-history-${new Date().toISOString().slice(0, 10)}`,
    ["ID", "Title", "Type", "Priority", "Status", "Hub", "Time"],
    seedNotifications.map((n) => [
      n.id,
      n.title,
      n.type,
      n.priority,
      n.status,
      n.module,
      n.timestamp,
    ]),
  );
}
