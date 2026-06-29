"use client";

import { AppIcon } from "@/components/ui/AppIcon";
import { aiIntakeSuggestions } from "@/data/formBuilder";
import { cn } from "@/lib/cn";
import { useToast } from "@/hooks/useToast";

type IntakeAiAssistantProps = {
  className?: string;
  onSuggestCoverages?: () => void;
};

export function IntakeAiAssistant({ className, onSuggestCoverages }: IntakeAiAssistantProps) {
  const toast = useToast();

  const runAction = (id: string, label: string) => {
    if (id === "coverage" && onSuggestCoverages) {
      onSuggestCoverages();
    }
    toast.success(`AI: ${label}`);
  };

  return (
    <section className={cn("intake-ai-assistant", className)} aria-label="AI Intake Assistant">
      <div className="intake-ai-assistant-header">
        <AppIcon name="sparkles" size={16} strokeWidth={2} />
        <div>
          <h3 className="intake-ai-assistant-title">AI Intake Assistant</h3>
          <p className="intake-ai-assistant-sub">Embedded workflow helper</p>
        </div>
      </div>
      <ul className="intake-ai-assistant-actions">
        {aiIntakeSuggestions.map((action) => (
          <li key={action.id}>
            <button
              type="button"
              className="intake-ai-assistant-btn"
              onClick={() => runAction(action.id, action.label)}
            >
              <AppIcon name={action.icon} size={14} strokeWidth={2} />
              {action.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="intake-ai-assistant-insight">
        <strong>Insight</strong>
        <p>Payroll report missing — upload to auto-fill revenue and employee fields.</p>
      </div>
    </section>
  );
}
