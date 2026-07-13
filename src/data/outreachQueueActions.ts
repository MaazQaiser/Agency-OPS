import {
  defaultDrawer,
  type ActiveFollowUp,
  type AddFollowUpPayload,
  type AssignProducerPayload,
  type CreateReminderPayload,
  type OutreachReminder,
  type ProducerQueueItem,
  type SendQuoteReminderPayload,
} from "@/data/outreachQueue";
import { prependActivity, updateOutreachSnapshot } from "@/data/outreachHubStore";

export function saveFollowUp(payload: AddFollowUpPayload) {
  const followUp: ActiveFollowUp = {
    id: `ofu-${Date.now()}`,
    client: payload.client,
    type: payload.followUpType,
    coverage: "Commercial",
    assigned: "JoJo",
    due: payload.dueDate,
    priority: payload.priority,
    nextAction: payload.notes.trim() || "Follow up with client",
    cta: "Open",
    drawer: {
      ...defaultDrawer(payload.client),
      notes: payload.notes.trim() ? [payload.notes.trim()] : [],
      contactHistory: [
        { action: `Follow-up created: ${payload.followUpType}`, date: "Today", by: "JoJo" },
      ],
    },
  };

  updateOutreachSnapshot((current) => ({
    ...current,
    activeFollowUps: [followUp, ...current.activeFollowUps],
  }));

  prependActivity(`Follow-up added for ${payload.client}: ${payload.followUpType}`);
}

export function saveReminder(payload: CreateReminderPayload) {
  const reminder: OutreachReminder = {
    id: `rem-${Date.now()}`,
    reminderType: payload.reminderType,
    date: payload.date,
    time: payload.time,
    assignedTo: payload.assignedTo,
    message: payload.message.trim() || payload.reminderType,
  };

  updateOutreachSnapshot((current) => ({
    ...current,
    reminders: [reminder, ...current.reminders],
  }));

  prependActivity(`Reminder scheduled for ${payload.assignedTo}: ${payload.reminderType}`);
}

export function sendQuoteReminder(payload: SendQuoteReminderPayload) {
  const nowLabel = "Just now";

  updateOutreachSnapshot((current) => ({
    ...current,
    quoteFollowUps: current.quoteFollowUps.map((row) =>
      row.client === payload.client
        ? {
            ...row,
            lastContact: nowLabel,
            status: "Followed Up",
            nextStep: payload.channel === "email" ? "Await client reply" : "SMS sent: monitor reply",
          }
        : row,
    ),
    clientDecisionQueue: current.clientDecisionQueue.map((row) =>
      row.client === payload.client ? { ...row, lastContact: nowLabel } : row,
    ),
    activeFollowUps: current.activeFollowUps.map((row) =>
      row.client === payload.client
        ? {
            ...row,
            nextAction: "Await client response",
            drawer: {
              ...row.drawer,
              contactHistory: [
                {
                  action: `Quote reminder sent via ${payload.channel.toUpperCase()}`,
                  date: "Today",
                  by: "JoJo",
                },
                ...row.drawer.contactHistory,
              ],
            },
          }
        : row,
    ),
  }));

  prependActivity(`Quote reminder sent to ${payload.client} via ${payload.channel.toUpperCase()}`);
}

export function assignProducer(payload: AssignProducerPayload) {
  const item: ProducerQueueItem = {
    id: `pq-${Date.now()}`,
    client: payload.client,
    producer: payload.producer,
    priority: payload.priority,
    notes: payload.notes.trim() || "Assigned from Outreach Queue",
    assignedAt: "Today",
  };

  updateOutreachSnapshot((current) => ({
    ...current,
    producerQueue: [item, ...current.producerQueue],
    activeFollowUps: current.activeFollowUps.map((row) =>
      row.client === payload.client
        ? {
            ...row,
            priority: payload.priority,
            drawer: {
              ...row.drawer,
              producer: payload.producer,
              notes: payload.notes.trim()
                ? [...row.drawer.notes, `Producer assigned: ${payload.producer}`]
                : row.drawer.notes,
            },
          }
        : row,
    ),
    quoteFollowUps: current.quoteFollowUps.map((row) =>
      row.client === payload.client
        ? { ...row, nextStep: `Producer ${payload.producer} assigned` }
        : row,
    ),
  }));

  prependActivity(`${payload.producer} assigned to ${payload.client} for closing`);
}
