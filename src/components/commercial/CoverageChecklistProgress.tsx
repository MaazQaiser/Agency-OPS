import { AppIcon } from "@/components/ui/AppIcon";
import {
  coverageChecklistRiskLabels,
  type CoverageChecklistProgress as ProgressData,
  type CoverageChecklistRiskState,
} from "@/lib/coverageChecklistProgress";
import { cn } from "@/lib/cn";

const riskClass: Record<CoverageChecklistRiskState, string> = {
  low: "coverage-checklist-risk--low",
  medium: "coverage-checklist-risk--medium",
  high: "coverage-checklist-risk--high",
  blocked: "coverage-checklist-risk--blocked",
};

const riskIcon = {
  low: "check",
  medium: "triangle-alert",
  high: "triangle-alert",
  blocked: "x",
} as const;

type CoverageChecklistProgressProps = {
  progress: ProgressData;
  variant?: "compact" | "panel";
  className?: string;
  title?: string;
};

export function CoverageChecklistProgress({
  progress,
  variant = "panel",
  className,
  title = "Coverage Checklist Progress",
}: CoverageChecklistProgressProps) {
  if (variant === "compact") {
    return (
      <div className={cn("coverage-checklist-progress-compact", className)}>
        <div className="coverage-checklist-progress-compact-top">
          <span className="coverage-checklist-progress-pct">{progress.completionPercent}%</span>
          <span className={cn("coverage-checklist-risk-badge", riskClass[progress.riskState])}>
            {coverageChecklistRiskLabels[progress.riskState]}
          </span>
        </div>
        <div
          className="progress-bar coverage-checklist-progress-bar"
          role="progressbar"
          aria-valuenow={progress.completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${progress.completionPercent}% checklist complete`}
        >
          <div
            className={cn("progress-fill", `coverage-checklist-progress-fill--${progress.riskState}`)}
            style={{ width: `${progress.completionPercent}%` }}
          />
        </div>
        <span className="coverage-checklist-progress-missing-hint">
          {progress.missingDocs.length === 0
            ? "All required docs received"
            : `${progress.missingDocs.length} missing`}
        </span>
      </div>
    );
  }

  return (
    <section
      className={cn("coverage-checklist-progress-panel", className)}
      aria-label={title}
    >
      <div className="coverage-checklist-progress-panel-head">
        <div>
          <h4 className="coverage-checklist-progress-title">{title}</h4>
          <p className="coverage-checklist-progress-sub">
            {progress.receivedCount} of {progress.requiredCount} items complete
          </p>
        </div>
        <span className={cn("coverage-checklist-risk-badge", riskClass[progress.riskState])}>
          <AppIcon name={riskIcon[progress.riskState]} size={12} strokeWidth={2.25} />
          {coverageChecklistRiskLabels[progress.riskState]}
        </span>
      </div>

      <div className="coverage-checklist-progress-metrics">
        <div className="coverage-checklist-progress-metric">
          <span className="coverage-checklist-progress-metric-label">Completion</span>
          <strong className="coverage-checklist-progress-metric-value">
            {progress.completionPercent}%
          </strong>
        </div>
        <div className="coverage-checklist-progress-metric">
          <span className="coverage-checklist-progress-metric-label">Required</span>
          <strong className="coverage-checklist-progress-metric-value">
            {progress.requiredCount}
          </strong>
        </div>
        <div className="coverage-checklist-progress-metric">
          <span className="coverage-checklist-progress-metric-label">Missing</span>
          <strong
            className={cn(
              "coverage-checklist-progress-metric-value",
              progress.missingDocs.length > 0 && "is-missing",
            )}
          >
            {progress.missingDocs.length}
          </strong>
        </div>
      </div>

      <div
        className="progress-bar coverage-checklist-progress-bar coverage-checklist-progress-bar--panel"
        role="progressbar"
        aria-valuenow={progress.completionPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn("progress-fill", `coverage-checklist-progress-fill--${progress.riskState}`)}
          style={{ width: `${progress.completionPercent}%` }}
        />
      </div>

      <div className="coverage-checklist-progress-lists">
        <div className="coverage-checklist-progress-list-block">
          <div className="coverage-checklist-progress-list-label">Required docs</div>
          <ul className="coverage-checklist-progress-doc-list">
            {progress.requiredDocs.map((doc) => {
              const isMissing = progress.missingDocs.includes(doc);
              const isPending = progress.pendingDocs.includes(doc);
              return (
                <li
                  key={doc}
                  className={cn(
                    isMissing && "missing",
                    isPending && "pending",
                    !isMissing && !isPending && "complete",
                  )}
                >
                  {doc}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="coverage-checklist-progress-list-block">
          <div className="coverage-checklist-progress-list-label">Missing docs</div>
          {progress.missingDocs.length === 0 ? (
            <p className="coverage-checklist-progress-empty">None — checklist clear for bind</p>
          ) : (
            <ul className="coverage-checklist-progress-doc-list missing-only">
              {progress.missingDocs.map((doc) => (
                <li key={doc} className="missing">
                  {doc}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
