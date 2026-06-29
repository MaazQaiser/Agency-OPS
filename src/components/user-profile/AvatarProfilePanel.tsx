"use client";

import { useEffect, useMemo, useState } from "react";
import { AppIcon } from "@/components/ui/AppIcon";
import {
  loadManagerNotes,
  presenceClass,
  presenceLabels,
  saveManagerNotes,
  type UserProfile,
  type PerformancePeriod,
} from "@/data/userProfiles";
import { usePermissions } from "@/components/permissions/PermissionProvider";
import { TeamAvatar } from "@/components/user-profile/TeamAvatar";
import { VaOpsDrawerRoot } from "@/components/ui/VaOpsDrawerRoot";
import { presenceToAvatarStatus } from "@/lib/teamIdentity";
import { KpiSkeletonGrid, ProfileSkeleton } from "@/components/shared/loading";
import { cn } from "@/lib/cn";

type AvatarProfilePanelProps = {
  profile: UserProfile;
  loading: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onAction: (action: string, profile: UserProfile) => void;
  onNotesSave: (notes: string) => void;
};

type TrendPeriod = "today" | "week" | "month";

const trendLabels: Record<TrendPeriod, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
};

function PerformanceBars({ period }: { period: PerformancePeriod }) {
  return (
    <div className="avatar-profile-trend-metrics">
      <div className="avatar-profile-trend-metric">
        <div className="avatar-profile-trend-metric-head">
          <span>Completion %</span>
          <strong>{period.completion}%</strong>
        </div>
        <div className="avatar-profile-trend-bar">
          <span style={{ width: `${period.completion}%` }} />
        </div>
      </div>
      <div className="avatar-profile-trend-metric">
        <div className="avatar-profile-trend-metric-head">
          <span>SLA %</span>
          <strong>{period.sla}%</strong>
        </div>
        <div className="avatar-profile-trend-bar sla">
          <span style={{ width: `${period.sla}%` }} />
        </div>
      </div>
      <div className="avatar-profile-trend-metric">
        <div className="avatar-profile-trend-metric-head">
          <span>Response time</span>
          <strong>{period.responseTime}</strong>
        </div>
      </div>
    </div>
  );
}

export function AvatarProfilePanel({
  profile,
  loading,
  onClose,
  onNavigate,
  onAction,
  onNotesSave,
}: AvatarProfilePanelProps) {
  const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("today");
  const [notes, setNotes] = useState(profile.managerNotes);
  const [notesDirty, setNotesDirty] = useState(false);
  const { can } = usePermissions();
  const canAssign = can("action:assign-tasks");
  const canManageTeam = can("action:reassign-tasks") || can("action:escalate-queues");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    const saved = loadManagerNotes(profile.id);
    setNotes(saved ?? profile.managerNotes);
    setNotesDirty(false);
  }, [profile]);

  const trendData = profile.performanceTrend[trendPeriod];

  const roleControls = useMemo(
    () =>
      canManageTeam
        ? [
            "Reassign workload",
            "Override priority",
            "Pause assignments",
            "Mark unavailable",
            "Escalate",
          ]
        : [],
    [canManageTeam],
  );

  return (
    <VaOpsDrawerRoot className="avatar-profile-root">
      <button
        type="button"
        className="va-ops-drawer-backdrop avatar-profile-backdrop"
        aria-label="Close profile"
        onClick={onClose}
      />
      <aside className="va-ops-drawer avatar-profile-panel" role="dialog" aria-modal="true" aria-label={`${profile.name} profile`}>
        <header className="avatar-profile-header">
          <div className="avatar-profile-header-main">
            <TeamAvatar
              userId={profile.id}
              name={profile.name}
              size="xl"
              status={presenceToAvatarStatus(profile.status)}
              imageSrc={profile.avatarUrl}
              showTooltip={false}
            />
            <div>
              <h2>{profile.name}</h2>
              <p className="avatar-profile-role">{profile.role}</p>
              <div className="avatar-profile-status-row">
                <span className={cn("badge", presenceClass[profile.status])}>
                  {presenceLabels[profile.status]}
                </span>
                <span className="avatar-profile-meta-pill">{profile.department}</span>
              </div>
              <div className="avatar-profile-meta-grid">
                <span><strong>Shift</strong> {profile.shiftStatus}</span>
                <span><strong>Queue</strong> {profile.currentQueue}</span>
              </div>
            </div>
          </div>
          <button type="button" className="va-ops-drawer-close" aria-label="Close" onClick={onClose}>
            <AppIcon name="close" size={18} strokeWidth={2.25} />
          </button>
        </header>

        <div className="avatar-profile-header-actions">
          {canAssign && (
          <button type="button" className="va-ops-action-btn" onClick={() => onAction("Assign Task", profile)}>
            Assign Task
          </button>
          )}
          <button type="button" className="va-ops-action-btn" onClick={() => onAction("Message", profile)}>
            Message
          </button>
          <button type="button" className="va-ops-action-btn" onClick={() => onAction("View Full Profile", profile)}>
            View Full Profile
          </button>
        </div>

        <div className="avatar-profile-body">
          {loading ? (
            <div className="avatar-profile-skeleton" aria-busy="true" aria-label="Loading profile">
              <ProfileSkeleton />
              <KpiSkeletonGrid count={4} className="avatar-profile-kpi-skeleton" />
            </div>
          ) : (
            <>
              <section className="avatar-profile-section" aria-label="Live KPI snapshot">
                <h3 className="avatar-profile-section-title">Live KPI Snapshot</h3>
                <div className="avatar-profile-kpi-grid">
                  {profile.kpis.map((kpi) => (
                    <button
                      key={kpi.id}
                      type="button"
                      className="avatar-profile-kpi-card"
                      onClick={() => kpi.route && onNavigate(kpi.route)}
                      disabled={!kpi.route}
                    >
                      <span className="avatar-profile-kpi-value">{kpi.value}</span>
                      <span className="avatar-profile-kpi-label">{kpi.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="avatar-profile-section" aria-label="Current workload">
                <h3 className="avatar-profile-section-title">Current Workload</h3>
                {profile.workload.length === 0 ? (
                  <p className="avatar-profile-empty">No active workload items.</p>
                ) : (
                  <ul className="avatar-profile-workload-list">
                    {profile.workload.map((item) => (
                      <li key={item.id}>
                        <button type="button" className={cn("avatar-profile-workload-item", item.overdue && "overdue")} onClick={() => onNavigate(item.route)}>
                          <span className="avatar-profile-workload-label">{item.label}</span>
                          <span className="avatar-profile-workload-detail">{item.detail}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="avatar-profile-section" aria-label="Recent activity">
                <h3 className="avatar-profile-section-title">Recent Activity</h3>
                {profile.recentActivity.length === 0 ? (
                  <p className="avatar-profile-empty">No recent activity recorded.</p>
                ) : (
                  <ol className="avatar-profile-activity-list">
                    {profile.recentActivity.map((item) => (
                      <li key={item.id} className="avatar-profile-activity-item">
                        <span className="avatar-profile-activity-dot" aria-hidden="true" />
                        <div>
                          <button
                            type="button"
                            className="avatar-profile-activity-text"
                            onClick={() => item.route && onNavigate(item.route)}
                          >
                            {item.text}
                          </button>
                          <div className="avatar-profile-activity-meta">
                            <time>{item.timestamp}</time>
                            <span>{item.module}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>

              <section className="avatar-profile-section" aria-label="Performance trend">
                <div className="avatar-profile-section-head">
                  <h3 className="avatar-profile-section-title">Performance Trend</h3>
                  <div className="avatar-profile-trend-tabs">
                    {(Object.keys(trendLabels) as TrendPeriod[]).map((period) => (
                      <button
                        key={period}
                        type="button"
                        className={cn("avatar-profile-trend-tab", trendPeriod === period && "active")}
                        onClick={() => setTrendPeriod(period)}
                      >
                        {trendLabels[period]}
                      </button>
                    ))}
                  </div>
                </div>
                <PerformanceBars period={trendData} />
              </section>

              <section className="avatar-profile-section" aria-label="Manager notes">
                <h3 className="avatar-profile-section-title">Notes</h3>
                {canManageTeam ? (
                  <>
                    <textarea
                      className="avatar-profile-notes-input"
                      rows={4}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        setNotesDirty(true);
                      }}
                      placeholder="Internal manager notes…"
                    />
                    {notesDirty && (
                      <button
                        type="button"
                        className="va-ops-action-btn avatar-profile-notes-save"
                        onClick={() => {
                          saveManagerNotes(profile.id, notes);
                          onNotesSave(notes);
                          setNotesDirty(false);
                        }}
                      >
                        Save notes
                      </button>
                    )}
                  </>
                ) : (
                  <p className="avatar-profile-notes-readonly">
                    {notes || "No manager notes on file."}
                  </p>
                )}
              </section>

              {roleControls.length > 0 && (
                <section className="avatar-profile-section" aria-label="Role controls">
                  <h3 className="avatar-profile-section-title">Role Controls</h3>
                  <div className="avatar-profile-role-controls">
                    {roleControls.map((control) => (
                      <button
                        key={control}
                        type="button"
                        className="va-ops-action-btn"
                        onClick={() => onAction(control, profile)}
                      >
                        {control}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </aside>
    </VaOpsDrawerRoot>
  );
}
