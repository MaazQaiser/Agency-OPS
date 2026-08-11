"use client";

import type { RefObject } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import { splitBodyIntoSegments, type BodySegment } from "@/data/aiDraftReview";
import { cn } from "@/lib/cn";

type OutboundEmailEditorProps = {
  subject: string;
  body: string;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  highlightGenerated?: boolean;
  readOnly?: boolean;
  /** When true, coverage paragraphs show lock affordance and are not editable. */
  lockCoverageSections?: boolean;
  /** When true, coverage paragraphs are highlighted with compliance chrome (still editable unless locked). */
  highlightCoverageSections?: boolean;
  bodyRef?: RefObject<HTMLTextAreaElement | null>;
  className?: string;
};

function joinSegments(segments: BodySegment[]): string {
  return segments.map((segment) => segment.text).join("\n\n");
}

function CoverageHighlightedBody({
  segments,
  highlightGenerated,
  readOnly,
  locked,
  onSegmentsChange,
  bodyRef,
}: {
  segments: BodySegment[];
  highlightGenerated: boolean;
  readOnly: boolean;
  locked: boolean;
  onSegmentsChange: (next: BodySegment[]) => void;
  bodyRef?: RefObject<HTMLTextAreaElement | null>;
}) {
  const updateSegment = (id: string, text: string) => {
    onSegmentsChange(segments.map((segment) => (segment.id === id ? { ...segment, text } : segment)));
  };

  return (
    <div
      className={cn(
        "send-center-email-locked-body send-center-email-coverage-body",
        highlightGenerated && "send-center-ai-draft-field--generated",
      )}
      aria-label={
        locked
          ? "Email message body (read-only during licensed review)"
          : "Email message body with coverage highlights"
      }
    >
      {segments.map((segment, index) => (
        <div
          key={segment.id}
          className={cn(
            "send-center-email-segment",
            segment.isCoverage && "send-center-email-segment--coverage",
            segment.isCoverage && locked && "send-center-email-segment--coverage-locked",
          )}
        >
          {segment.isCoverage && (
            <div className="send-center-email-segment-coverage-header">
              <div className="send-center-email-segment-coverage-label">
                <AppIcon name="shield" size={12} strokeWidth={2.25} aria-hidden />
                <span>Coverage Content</span>
              </div>
              <p className="send-center-email-segment-coverage-note">
                {locked ? "Awaiting licensed review" : "Requires approval before send"}
              </p>
            </div>
          )}

          {locked ? (
            <p className="send-center-email-segment-text">{segment.text}</p>
          ) : (
            <textarea
              ref={index === 0 ? bodyRef : undefined}
              className="intake-form-input intake-form-textarea send-center-email-segment-input"
              value={segment.text}
              onChange={(e) => updateSegment(segment.id, e.target.value)}
              rows={Math.max(3, Math.min(10, segment.text.split("\n").length + 1))}
              readOnly={readOnly}
              aria-label={segment.isCoverage ? "Coverage paragraph" : "Message paragraph"}
            />
          )}

          {segment.isCoverage && locked && (
            <div className="send-center-email-segment-inline-warn" role="note">
              <span aria-hidden="true">⚠</span>
              <span>Awaiting Licensed Review</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Outbound email editor for Send Center AI Draft Review.
 * Reuses intake form field patterns — not a new design-system surface.
 */
export function OutboundEmailEditor({
  subject,
  body,
  onSubjectChange,
  onBodyChange,
  highlightGenerated = false,
  readOnly = false,
  lockCoverageSections = false,
  highlightCoverageSections = false,
  bodyRef,
  className,
}: OutboundEmailEditorProps) {
  const useCoverageView = lockCoverageSections || highlightCoverageSections;
  const segments = useCoverageView ? splitBodyIntoSegments(body) : null;

  return (
    <div className={cn("send-center-email-editor", className)}>
      <label className="intake-form-field intake-form-field-full">
        <span className="intake-form-label">Subject</span>
        <input
          type="text"
          className={cn(
            "intake-form-input",
            highlightGenerated && "send-center-ai-draft-field--generated",
          )}
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          readOnly={readOnly}
          aria-label="Email subject"
        />
      </label>
      <div className="intake-form-field intake-form-field-full">
        <span className="intake-form-label" id="send-center-email-body-label">
          Message
        </span>
        {useCoverageView && segments ? (
          <CoverageHighlightedBody
            segments={segments}
            highlightGenerated={highlightGenerated}
            readOnly={readOnly}
            locked={lockCoverageSections}
            bodyRef={bodyRef}
            onSegmentsChange={(next) => onBodyChange(joinSegments(next))}
          />
        ) : (
          <textarea
            ref={bodyRef}
            className={cn(
              "intake-form-input intake-form-textarea send-center-email-editor-body",
              highlightGenerated && "send-center-ai-draft-field--generated",
            )}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            rows={14}
            readOnly={readOnly}
            aria-labelledby="send-center-email-body-label"
            aria-label="Email message body"
          />
        )}
      </div>
    </div>
  );
}
