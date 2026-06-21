import { checklistClients, type ChecklistClient } from "@/data/coverageChecklist";
import { trackerSubmissions, type TrackerSubmission } from "@/data/submissionTracker";

export type CommercialHubSnapshot = {
  checklistClients: ChecklistClient[];
  trackerSubmissions: TrackerSubmission[];
};

let snapshot: CommercialHubSnapshot = {
  checklistClients: structuredClone(checklistClients),
  trackerSubmissions: structuredClone(trackerSubmissions),
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeCommercialHub(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCommercialHubSnapshot(): CommercialHubSnapshot {
  return snapshot;
}

export function setChecklistClients(clients: ChecklistClient[]) {
  snapshot = { ...snapshot, checklistClients: clients };
  emit();
}

export function setTrackerSubmissions(submissions: TrackerSubmission[]) {
  snapshot = { ...snapshot, trackerSubmissions: submissions };
  emit();
}

export function updateChecklistClient(
  clientId: string,
  updater: (client: ChecklistClient) => ChecklistClient,
) {
  setChecklistClients(
    snapshot.checklistClients.map((client) =>
      client.id === clientId ? updater(client) : client,
    ),
  );
}

export function updateTrackerSubmission(
  submissionId: string,
  updater: (submission: TrackerSubmission) => TrackerSubmission,
) {
  setTrackerSubmissions(
    snapshot.trackerSubmissions.map((submission) =>
      submission.id === submissionId ? updater(submission) : submission,
    ),
  );
}

export function getChecklistClient(clientId: string) {
  return snapshot.checklistClients.find((client) => client.id === clientId);
}

export function getTrackerSubmission(submissionId: string) {
  return snapshot.trackerSubmissions.find((submission) => submission.id === submissionId);
}
