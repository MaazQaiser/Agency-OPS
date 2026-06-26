import { dailyAccountability, priorityQueue } from "@/data/commercialSubmissions";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";

export function DailyAccountabilityTab() {
  return (
    <>
      <div className="section-header">
        <div className="section-title">Daily Accountability</div>
        <div className="section-sub">May 14, 2026 · Wednesday</div>
      </div>

      <div className="accountability-grid">
        {dailyAccountability.map((card) => (
          <div key={card.name} className="acc-card">
            <div className="acc-name">
              <TeamAvatar name={card.name} size="sm" preferVa={card.name === "Pedro"} />
              {card.name}
            </div>
            <div className="acc-row"><span className="acc-metric">Subs touched</span><span className="acc-val">{card.subsTouched}</span></div>
            <div className="acc-row"><span className="acc-metric">Markets hit</span><span className="acc-val">{card.marketsHit}</span></div>
            <div className="acc-row"><span className="acc-metric">Follow-ups done</span><span className="acc-val">{card.followUpsDone}</span></div>
            <div className="acc-row"><span className="acc-metric">Docs collected</span><span className="acc-val">{card.docsCollected}</span></div>
            <div className="acc-row">
              <span className="acc-metric">Overdue cleared</span>
              <span className="acc-val" style={card.overdueColor === "red" ? { color: "var(--red)" } : card.overdueColor === "green" ? { color: "var(--green)" } : undefined}>{card.overdueCleared}</span>
            </div>
            <div style={{ marginTop: 8 }}><span className={`badge badge-${card.badgeVariant}`}>{card.badge}</span></div>
          </div>
        ))}
      </div>

      <hr className="divider" />

      <div className="section-header">
        <div className="section-title">Today&apos;s Priority Queue</div>
        <div className="section-sub">Sorted by Urgency</div>
      </div>

      <div className="alert-list">
        {priorityQueue.map((item) => (
          <div key={item.title} className={`alert-box alert-${item.variant}`}>
            <div className={`alert-dot dot-${item.variant}`} />
            <div className="alert-text">
              <div className="alert-title">{item.title}</div>
              <div className="alert-body">{item.body}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
