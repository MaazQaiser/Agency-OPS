"use client";

import { useEffect, useRef, useState } from "react";

export type LiveSubmission = {
  id: string;
  name: string;
  type: "PL" | "Commercial";
  source: string;
  receivedAt: string;
  isNew?: boolean;
};

type LiveSubmissionPulseProps = {
  submission: LiveSubmission;
  onClearNew?: (id: string) => void;
};

/**
 * Intake Forms Signature Element: Live submission pulse card
 * When a new form submission arrives via webhook, the card pulses once in hub amber.
 * A "LIVE" badge appears for 10 seconds then fades.
 */
export function LiveSubmissionPulse({ submission, onClearNew }: LiveSubmissionPulseProps) {
  const [showLive, setShowLive] = useState(submission.isNew ?? false);
  const [pulsing, setPulsing] = useState(submission.isNew ?? false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (submission.isNew) {
      setShowLive(true);
      setPulsing(true);
      timerRef.current = setTimeout(() => {
        setShowLive(false);
        setPulsing(false);
        onClearNew?.(submission.id);
      }, 10_000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [submission.id, submission.isNew, onClearNew]);

  return (
    <div className={`live-submission-card${pulsing ? " live-submission-card--pulse" : ""}`}>
      <div className="live-submission-card-header">
        <div className="live-submission-name">{submission.name}</div>
        {showLive && (
          <div className="live-submission-badge" aria-label="New live submission">
            LIVE
          </div>
        )}
      </div>
      <div className="live-submission-meta">
        <span className={`live-submission-type badge-${submission.type === "Commercial" ? "teal" : "blue"}`}>
          {submission.type}
        </span>
        <span className="live-submission-source">{submission.source}</span>
        <span className="live-submission-time">{submission.receivedAt}</span>
      </div>
    </div>
  );
}
