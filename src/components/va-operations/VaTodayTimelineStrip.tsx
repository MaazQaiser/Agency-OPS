"use client";

import { AppIcon, type AppIconName } from "@/components/ui/AppIcon";
import { todayTimeline, type TodayTimelineEventType } from "@/data/vaOperations";
import { cn } from "@/lib/cn";

const eventIcons: Record<TodayTimelineEventType, AppIconName> = {
  call: "phone",
  appointment: "clipboard",
  deadline: "flag",
  "follow-up": "refresh",
};

const eventLabels: Record<TodayTimelineEventType, string> = {
  call: "Call",
  appointment: "Appointment",
  deadline: "Deadline",
  "follow-up": "Follow-up",
};

export function VaTodayTimelineStrip() {
  return (
    <section className="va-ops-today-timeline-strip" aria-label="Today timeline">
      <header className="va-ops-today-timeline-header">
        <span className="va-ops-today-timeline-label">Today</span>
        <span className="va-ops-today-timeline-meta">
          {todayTimeline.length} scheduled touchpoint{todayTimeline.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="va-ops-today-timeline-stepper">
        <ol
          className="va-ops-today-timeline-track"
          style={{ "--timeline-steps": todayTimeline.length } as React.CSSProperties}
        >
          {todayTimeline.map((event) => (
            <li key={event.id} className="va-ops-today-timeline-step">
              <div className="va-ops-today-timeline-step-rail" aria-hidden="true">
                <span className="va-ops-today-timeline-marker" />
              </div>
              <article className="va-ops-today-timeline-card">
                <div className="va-ops-today-timeline-card-head">
                  <time className="va-ops-today-timeline-time" dateTime={event.time}>
                    {event.time}
                  </time>
                  <span className={cn("va-ops-today-timeline-type", `va-ops-today-timeline-type--${event.type}`)}>
                    <AppIcon name={eventIcons[event.type]} size={12} strokeWidth={2.25} />
                    {eventLabels[event.type]}
                  </span>
                </div>
                <p className="va-ops-today-timeline-text">{event.label}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
