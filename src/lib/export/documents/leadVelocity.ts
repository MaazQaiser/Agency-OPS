import { seedLeadVelocityRecords } from "@/data/leadVelocity";
import { downloadCsv } from "../csv";

export function exportLeadVelocityCsv(): void {
  downloadCsv(
    `lead-velocity-${new Date().toISOString().slice(0, 10)}`,
    [
      "Lead",
      "Business",
      "VA",
      "Producer",
      "Source",
      "First Response",
      "Status",
      "Conversion %",
      "Total Cycle",
    ],
    seedLeadVelocityRecords.map((r) => [
      r.leadName,
      r.businessName,
      r.assignedVa,
      r.assignedProducer,
      r.leadSource,
      r.firstResponseTime,
      r.currentStatus,
      r.conversionProbability,
      r.totalCycleTime,
    ]),
  );
}
