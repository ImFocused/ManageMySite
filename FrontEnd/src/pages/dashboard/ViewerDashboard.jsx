import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  MapPin,
  MessageSquare,
  FileCheck2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { demoUsers } from "../../data/mock";
import { handleImageError, getReportPhoto } from "../../utils/imageUtils";

const defaultTimelineStages = [
  {
    id: "stage-1",
    title: "Earthwork (Excavation)",
    status: "Completed",
    scheduleStatus: "on_time",
    scheduleLabel: "Completed 08 Jan 2026",
    progress: 100,
    completed: true,
  },
  {
    id: "stage-2",
    title: "Substructure (Footing)",
    status: "Completed",
    scheduleStatus: "on_time",
    scheduleLabel: "Completed 30 Jan 2026",
    progress: 100,
    completed: true,
  },
  {
    id: "stage-3",
    title: "Upto Plinth Beam",
    status: "Completed",
    scheduleStatus: "on_time",
    scheduleLabel: "Completed 25 Feb 2026",
    progress: 100,
    completed: true,
  },
  {
    id: "stage-4",
    title: "Superstructure (5F RCC)",
    status: "In progress",
    scheduleStatus: "delayed",
    scheduleLabel: "Delayed (12 days) · 3rd Floor",
    progress: 75,
    active: true,
  },
  {
    id: "stage-5",
    title: "Brickwork (B/w) & Plaster",
    status: "In progress",
    scheduleStatus: "delayed",
    scheduleLabel: "Delayed (14 days)",
    progress: 50,
    active: true,
  },
  {
    id: "stage-6",
    title: "MEP & Waterproofing",
    status: "In progress",
    scheduleStatus: "delayed",
    scheduleLabel: "Active rough-in",
    progress: 35,
    active: true,
  },
  {
    id: "stage-7",
    title: "Paint & Services Handover",
    status: "Upcoming",
    scheduleStatus: "on_time",
    scheduleLabel: "Target 01 Jan 2028",
    progress: 10,
  },
];

export default function ViewerDashboard() {
  const navigate = useNavigate();
  const { project, reports } = useApp();

  const publishedReports = reports
    .filter((report) => report.status === "published")
    .slice(0, 3);

  const currentStage = "Structure";
  const completedStages = 1;

  const currentProjectStatus = project?.status || "Delayed";
  const stages = project?.timelineStages || defaultTimelineStages;

  return (
    <div className="dashboard-page viewer-dashboard">
      {/* PROJECT HEADER */}
      <div className="viewer-project-header">
        <div>
          <p className="eyebrow">PROJECT OVERVIEW</p>

          <h1>{project?.name || "Riverside Residence"}</h1>

          <div className="viewer-project-location">
            <MapPin size={16} />
            <span>
              {project?.location || "Andheri East, Mumbai"}
            </span>
          </div>
        </div>

        <div className="viewer-header-actions">
          <button
            className="secondary-button"
            onClick={() => navigate("/queries")}
          >
            <MessageSquare size={16} />
            Raise a Query
          </button>

          <button
            className="primary-button"
            onClick={() => navigate("/planning")}
          >
            View Progress
            <ArrowUpRight size={17} />
          </button>
        </div>
      </div>

      {/* PROGRESS SUMMARY */}
      <section className="viewer-progress-card">
        <div className="viewer-progress-main">
          <div>
            <p className="eyebrow">OVERALL PROGRESS</p>

            <div className="viewer-progress-value">
              {project?.progress || 68}%
            </div>

            <p className="viewer-progress-description">
              Construction is currently in the{" "}
              <strong>{currentStage}</strong> stage.
            </p>
          </div>

          <div className="viewer-progress-ring">
            <div className="viewer-progress-ring-inner">
              <strong>{project?.progress || 68}%</strong>
              <span>complete</span>
            </div>
          </div>
        </div>

        <div className="viewer-progress-track">
          <div
            className="viewer-progress-fill"
            style={{
              width: `${project?.progress || 68}%`,
            }}
          />
        </div>

        <div className="viewer-progress-meta">
          <div>
            <span>Project started</span>
            <strong>{project?.startDate || "12 Jan 2026"}</strong>
          </div>

          <div>
            <span>Expected completion</span>
            <strong>{project?.endDate || "30 Nov 2026"}</strong>
          </div>

          <div>
            <span>Current stage</span>
            <strong>{currentStage}</strong>
          </div>
        </div>
      </section>

      {/* PROJECT SNAPSHOT */}
      <div className="viewer-section-heading">
        <div>
          <p className="eyebrow">AT A GLANCE</p>
          <h2>Where the project stands</h2>
        </div>
      </div>

      <div className="viewer-snapshot-grid">
        <SnapshotCard
          icon={<CheckCircle2 />}
          label="Completed"
          value={`${completedStages} phase`}
          detail="Foundation work completed"
          className="completed"
        />

        <SnapshotCard
          icon={<Clock3 />}
          label="In progress"
          value={currentStage}
          detail="Structural work underway"
          className="active"
        />

        <SnapshotCard
          icon={<CalendarDays />}
          label="Upcoming"
          value="Electrical"
          detail="Next major phase"
          className="upcoming"
        />

        {/* PROJECT STATUS NOTIFICATION BOX (REPLACED PROJECT TEAM) */}
        <ProjectStatusNotificationCard
          status={currentProjectStatus}
          detail={
            currentProjectStatus === "Delayed"
              ? project?.statusDetail || "Delayed by 12 days — recovery plan active"
              : project?.statusDetail || "All construction phases tracking to schedule"
          }
        />
      </div>

      {/* MINI TIMELINE BELOW AT A GLANCE */}
      <section className="panel viewer-timeline-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">PROJECT TIMELINE</p>
            <h3>Construction progress</h3>
          </div>

          <button
            className="text-button"
            onClick={() => navigate("/planning")}
          >
            Open full Gantt
            <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="viewer-timeline">
          {stages.map((stage) => (
            <TimelineStage
              key={stage.id}
              id={stage.id}
              title={stage.shortTitle || stage.title}
              status={stage.status}
              scheduleStatus={stage.scheduleStatus}
              scheduleLabel={stage.scheduleLabel}
              progress={stage.progress}
              active={stage.active}
              onClick={() => navigate("/planning")}
            />
          ))}
        </div>

        <div className="viewer-timeline-footer">
          <div className="footer-legend-group">
            <span className="legend-title">Phase:</span>
            <span>
              <span className="timeline-dot completed" />
              Completed
            </span>

            <span>
              <span className="timeline-dot active" />
              In progress
            </span>

            <span>
              <span className="timeline-dot upcoming" />
              Upcoming
            </span>
          </div>

          <span className="legend-divider">|</span>

          <div className="footer-legend-group">
            <span className="legend-title">Schedule Status:</span>
            <span>
              <span className="timeline-dot on-time" />
              On Time
            </span>

            <span>
              <span className="timeline-dot delayed" />
              Delayed
            </span>
          </div>
        </div>
      </section>

      {/* LOWER CONTENT */}
      <div className="viewer-content-grid">
        {/* PUBLISHED UPDATES */}
        <section className="panel viewer-updates-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">LATEST UPDATES</p>
              <h3>Published project updates</h3>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("/reports")}
            >
              View all
              <ArrowUpRight size={15} />
            </button>
          </div>

          {publishedReports.length === 0 ? (
            <div className="viewer-empty-state">
              <FileEmptyState />
              <strong>No updates published yet</strong>
              <span>
                Published construction updates will appear here.
              </span>
            </div>
          ) : (
            <div className="viewer-update-list">
              {publishedReports.map((report) => (
                <button
                  type="button"
                  className="viewer-update-card"
                  key={report.id}
                  onClick={() => navigate(`/reports/${report.id}`)}
                >
                  <div className="viewer-update-image">
                    <img
                      src={getReportPhoto(report, 0)}
                      alt={report.photos?.[0]?.label || report.title}
                      onError={handleImageError}
                    />
                  </div>

                  <div className="viewer-update-content">
                    <div className="viewer-update-topline">
                      <span className="viewer-published-chip">
                        Published
                      </span>

                      <span>{report.submittedAt}</span>
                    </div>

                    <h4>{report.title}</h4>

                    <p>
                      {report.description}
                    </p>

                    <span className="viewer-update-link">
                      View update
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* PROJECT TEAM */}
        <section className="panel viewer-team-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">PROJECT TEAM</p>
              <h3>People working on your project</h3>
            </div>
          </div>

          <div className="viewer-team-list">
            <TeamMember
              name={demoUsers.engineer.name}
              role="Engineer"
              initials="PS"
            />

            <TeamMember
              name={demoUsers.contractor.name}
              role="Contractor"
              initials="AP"
            />

            <TeamMember
              name={demoUsers.builder.name}
              role="Builder"
              initials="RS"
            />
          </div>

          <div className="viewer-team-note">
            Your project team manages construction, reviews,
            approvals and published progress updates.
          </div>
        </section>
      </div>

      {/* QUERY CTA */}
      <section className="viewer-query-card">
        <div>
          <p className="eyebrow">NEED MORE INFORMATION?</p>

          <h2>Have a question about the project?</h2>

          <p>
            Raise a query with the project team and keep your
            communication in one place.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/queries")}
        >
          <MessageSquare size={17} />
          Raise a Query
        </button>
      </section>
    </div>
  );
}

function SnapshotCard({
  icon,
  label,
  value,
  detail,
  className,
}) {
  return (
    <div className={`viewer-snapshot-card ${className}`}>
      <div className="viewer-snapshot-icon">
        {icon}
      </div>

      <span>{label}</span>

      <strong>{value}</strong>

      <small>{detail}</small>
    </div>
  );
}

function ProjectStatusNotificationCard({ status, detail }) {
  const isDelayed = status === "Delayed";

  return (
    <div
      className={`viewer-snapshot-card status-notification-card ${
        isDelayed ? "status-delayed-card" : "status-ontime-card"
      }`}
    >
      <div className="status-card-top-row">
        <div
          className={`viewer-snapshot-icon ${
            isDelayed ? "icon-delayed" : "icon-ontime"
          }`}
        >
          {isDelayed ? (
            <AlertTriangle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
        </div>

        <span
          className={`status-notification-badge ${
            isDelayed ? "delayed" : "on-time"
          }`}
        >
          {isDelayed ? "Notice: Delayed" : "Notice: On Track"}
        </span>
      </div>

      <span className="status-card-label">Project status</span>

      <strong
        className={`status-card-value ${
          isDelayed ? "delayed" : "on-time"
        }`}
      >
        {status}
      </strong>

      <div
        className={`status-notification-banner ${
          isDelayed ? "delayed" : "on-time"
        }`}
      >
        <span className="notification-dot-indicator" />
        <p className="notification-text">
          {detail}
        </p>
      </div>
    </div>
  );
}

function TimelineStage({
  id,
  title,
  status,
  scheduleStatus = "on_time",
  scheduleLabel,
  progress,
  active = false,
  onClick,
}) {
  const isDelayed = scheduleStatus === "delayed";

  return (
    <div
      className={`viewer-timeline-stage ${active ? "active" : ""} ${
        isDelayed ? "stage-delayed" : "stage-ontime"
      }`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick();
        }
      }}
    >
      <div className="viewer-timeline-stage-header">
        <div>
          <div className="stage-title-row">
            <strong>{title}</strong>
            <span
              className={`timeline-schedule-chip ${
                isDelayed ? "delayed" : "on-time"
              }`}
            >
              {isDelayed ? (
                <AlertTriangle size={11} />
              ) : (
                <CheckCircle2 size={11} />
              )}
              {isDelayed ? "Delayed" : "On Time"}
            </span>
          </div>

          <div className="stage-status-row">
            <span className="stage-phase-label">{status}</span>
            {isDelayed && scheduleLabel && (
              <span className="stage-delay-tag">{scheduleLabel}</span>
            )}
          </div>
        </div>

        <strong className="stage-percent">{progress}%</strong>
      </div>

      <div className="viewer-stage-track">
        <div
          className={`viewer-stage-fill ${
            isDelayed ? "fill-delayed" : "fill-ontime"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {isDelayed ? (
        <div className="stage-delayed-alert">
          <Clock3 size={12} />
          <span>Notice: Task is running behind schedule</span>
        </div>
      ) : (
        <div className="stage-ontime-notice">
          <CheckCircle2 size={12} />
          <span>Notice: Task is on schedule</span>
        </div>
      )}
    </div>
  );
}

function TeamMember({ name, role, initials }) {
  return (
    <div className="viewer-team-member">
      <div className="viewer-team-avatar">
        {initials}
      </div>

      <div>
        <strong>{name}</strong>
        <span>{role}</span>
      </div>
    </div>
  );
}

function FileEmptyState() {
  return (
    <div className="viewer-empty-icon">
      <FileCheck2 size={22} />
    </div>
  );
}
