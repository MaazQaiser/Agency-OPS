import {
  activeFollowUps,
  clientDecisionQueue,
  clientObjections,
  outreachActivity,
  quoteFollowUps,
  type ActiveFollowUp,
  type ClientDecisionItem,
  type ClientObjection,
  type OutreachActivity,
  type OutreachClientProfile,
  type OutreachPriority,
  type OutreachReminder,
  type ProducerQueueItem,
  type QuoteFollowUp,
} from "@/data/outreachQueue";

export type OutreachSnapshot = {
  activeFollowUps: ActiveFollowUp[];
  quoteFollowUps: QuoteFollowUp[];
  clientDecisionQueue: ClientDecisionItem[];
  clientObjections: ClientObjection[];
  outreachActivity: OutreachActivity[];
  reminders: OutreachReminder[];
  producerQueue: ProducerQueueItem[];
};

let snapshot: OutreachSnapshot = {
  activeFollowUps: structuredClone(activeFollowUps),
  quoteFollowUps: structuredClone(quoteFollowUps),
  clientDecisionQueue: structuredClone(clientDecisionQueue),
  clientObjections: structuredClone(clientObjections),
  outreachActivity: structuredClone(outreachActivity),
  reminders: [],
  producerQueue: [],
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeOutreachHub(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getOutreachSnapshot(): OutreachSnapshot {
  return snapshot;
}

export function setOutreachSnapshot(next: OutreachSnapshot) {
  snapshot = next;
  emit();
}

export function updateOutreachSnapshot(updater: (current: OutreachSnapshot) => OutreachSnapshot) {
  setOutreachSnapshot(updater(snapshot));
}

export function prependActivity(message: string) {
  updateOutreachSnapshot((current) => ({
    ...current,
    outreachActivity: [
      { id: `act-${Date.now()}`, message, timeAgo: "Just now" },
      ...current.outreachActivity,
    ],
  }));
}
