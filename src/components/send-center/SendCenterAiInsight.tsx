import { AppIcon } from "@/components/ui/AppIcon";

export type SendCenterAiInsightItem = {
  id: string;
  title: string;
  detail: string;
  why?: string;
  actionLabel?: string;
  actionId?: string;
};

type SendCenterAiInsightProps = {
  title?: string;
  insights: readonly SendCenterAiInsightItem[];
  onAction?: (actionId: string, insightId: string) => void;
};

export function SendCenterAiInsight({ title = "AI Insights", insights, onAction }: SendCenterAiInsightProps) {
  return (
    <section className="va-ops-panel send-center-ai-panel" aria-label={title}>
      <div className="send-center-ai-panel-header">
        <AppIcon name="sparkles" size={16} strokeWidth={2} />
        <h3 className="send-center-ai-panel-title">{title}</h3>
      </div>
      <ul className="send-center-ai-list">
        {insights.map((insight) => (
          <li key={insight.id} className="send-center-ai-action-block">
            <div className="send-center-ai-action-body">
              <strong className="send-center-ai-action-title">{insight.title}</strong>
              <p className="send-center-ai-action-detail">{insight.detail}</p>
              {insight.why ? (
                <p className="send-center-ai-action-why">
                  <span className="send-center-ai-action-why-label">Why it matters</span>
                  {insight.why}
                </p>
              ) : null}
            </div>
            {insight.actionLabel && insight.actionId ? (
              <button
                type="button"
                className="send-center-ai-action-cta"
                onClick={() => onAction?.(insight.actionId!, insight.id)}
              >
                {insight.actionLabel}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
