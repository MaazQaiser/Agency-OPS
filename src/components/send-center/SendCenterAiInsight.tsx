import { AppIcon } from "@/components/ui/AppIcon";

type AiInsight = {
  id: string;
  title: string;
  detail: string;
};

type SendCenterAiInsightProps = {
  title?: string;
  insights: readonly AiInsight[];
};

export function SendCenterAiInsight({ title = "AI Insights", insights }: SendCenterAiInsightProps) {
  return (
    <section className="va-ops-panel send-center-ai-panel" aria-label={title}>
      <div className="send-center-ai-panel-header">
        <AppIcon name="sparkles" size={16} strokeWidth={2} />
        <h3 className="send-center-ai-panel-title">{title}</h3>
      </div>
      <ul className="send-center-ai-list">
        {insights.map((insight) => (
          <li key={insight.id} className="send-center-ai-item">
            <strong>{insight.title}</strong>
            <span>{insight.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
