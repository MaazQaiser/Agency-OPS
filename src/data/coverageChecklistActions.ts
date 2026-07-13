import {
  applyAddCoverage,
  applyMarkChecklistComplete,
  applyUploadDocument,
  syncTrackerFromChecklist,
  type AddCoveragePayload,
  type ChecklistClient,
  type UploadDocumentPayload,
} from "@/data/coverageChecklist";
import {
  getCommercialHubSnapshot,
  updateChecklistClient,
  updateTrackerSubmission,
} from "@/data/commercialHubStore";
import { requiredMarketCount } from "@/data/submissionTracker";

export function commitChecklistUpdate(
  clientId: string,
  updater: (client: ChecklistClient) => ChecklistClient,
  options?: { sentToProducer?: boolean },
) {
  const snapshot = getCommercialHubSnapshot();
  const current = snapshot.checklistClients.find((client) => client.id === clientId);
  if (!current) return null;

  const nextClient = updater(current);
  const submission = snapshot.trackerSubmissions.find((row) => row.id === current.submissionId);

  updateChecklistClient(clientId, () => nextClient);

  if (submission) {
    updateTrackerSubmission(submission.id, (row) => {
      const synced = syncTrackerFromChecklist(nextClient, row, options);
      if (!options?.sentToProducer) return synced;

      return {
        ...synced,
        status: "Pending Producer Approval",
        nextAction: "Producer Approval",
        producerNotes: [
          ...row.producerNotes,
          `Coverage checklist sent to producer: ${nextClient.clientName}`,
        ],
        binding: {
          quoteSelected: row.binding?.quoteSelected ?? false,
          producerApproved: false,
          clientApproved: row.binding?.clientApproved ?? false,
          docsComplete: nextClient.requiredDocuments.every((doc) => doc.status === "Received"),
          paymentReady: row.binding?.paymentReady ?? false,
          approvalStatus: "Pending Producer Approval",
        },
      };
    });
  }

  return nextClient;
}

export function saveCoverage(clientId: string, payload: AddCoveragePayload) {
  return commitChecklistUpdate(clientId, (client) => applyAddCoverage(client, payload));
}

export function uploadDocument(clientId: string, payload: UploadDocumentPayload) {
  return commitChecklistUpdate(clientId, (client) => applyUploadDocument(client, payload));
}

export function markChecklistComplete(clientId: string) {
  return commitChecklistUpdate(clientId, (client) => applyMarkChecklistComplete(client));
}

export function sendToProducer(clientId: string) {
  return commitChecklistUpdate(clientId, (client) => client, { sentToProducer: true });
}

export function getLinkedSubmissionMarkets(clientId: string) {
  const snapshot = getCommercialHubSnapshot();
  const client = snapshot.checklistClients.find((row) => row.id === clientId);
  if (!client) return 0;

  const submission = snapshot.trackerSubmissions.find((row) => row.id === client.submissionId);
  return submission?.marketsSubmitted ?? 0;
}

export { requiredMarketCount };
