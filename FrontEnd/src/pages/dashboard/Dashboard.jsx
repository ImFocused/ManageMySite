import {
  ArrowUpRight,
  Clock3,
  FileCheck2,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import EngineerDashboard from "./EngineerDashboard";
import ContractorDashboard from "./ContractorDashboard";
import ViewerDashboard from "./ViewerDashboard";

const defaultTimelineStages = [
  {
    id: "stage-1",
    title: "Earthwork (Excavation Soft & Hard Rock)",
    shortTitle: "Earthwork (Excavation)",
    status: "Completed",
    scheduleStatus: "on_time",
    scheduleLabel: "Completed 08 Jan 2026",
    progress: 100,
    completed: true,
  },
  {
    id: "stage-2",
    title: "Substructure (Footing PCC, Rebar & Concreting)",
    shortTitle: "Substructure (Footing)",
    status: "Completed",
    scheduleStatus: "on_time",
    scheduleLabel: "Completed 30 Jan 2026",
    progress: 100,
    completed: true,
  },
  {
    id: "stage-3",
    title: "Upto Plinth Beam (Reinforcement & Concreting)",
    shortTitle: "Upto Plinth Beam",
    status: "Completed",
    scheduleStatus: "on_time",
    scheduleLabel: "Completed 25 Feb 2026",
    progress: 100,
    completed: true,
  },
  {
    id: "stage-4",
    title: "Superstructure (5F Slab, Column & Beam RCC)",
    shortTitle: "Superstructure (5F RCC)",
    status: "In progress",
    scheduleStatus: "delayed",
    scheduleLabel: "Delayed (12 days) · 3rd Floor in progress",
    progress: 75,
    active: true,
  },
  {
    id: "stage-5",
    title: "Brickwork (B/W) & Internal/External Plaster",
    shortTitle: "Brickwork (B/w) & Plaster",
    status: "In progress",
    scheduleStatus: "delayed",
    scheduleLabel: "Delayed (14 days) · 2nd Floor Plastering",
    progress: 50,
    active: true,
  },
  {
    id: "stage-6",
    title: "MEP & Waterproofing (Electrical, Plumbing, Wet Areas)",
    shortTitle: "MEP & Waterproofing",
    status: "In progress",
    scheduleStatus: "delayed",
    scheduleLabel: "Conduit & Downtake plumbing active",
    progress: 35,
    active: true,
  },
  {
    id: "stage-7",
    title: "Paint Work (Putty, Primer) & Services (Lift, Fire)",
    shortTitle: "Paint & Services Handover",
    status: "Upcoming",
    scheduleStatus: "on_time",
    scheduleLabel: "Handover Target: 01 Jan 2028",
    progress: 10,
  },
];

export default function Dashboard() {
  const { demoRole, user, project, reports } = useApp();
  const navigate = useNavigate();

  if (demoRole === "engineer")     return <EngineerDashboard />;
  if (demoRole === "contractor")   return <ContractorDashboard />;
  if (demoRole === "viewer")       return <ViewerDashboard />;

  const roleGreeting =
    user?.roleLabel || (demoRole === "projectManager" ? "Project Manager" : "Builder");
  const projectName    = project?.name     || "Riverside Residence";
  const projectProgress = project?.progress ?? 68;

  const pendingReports  = (reports || []).filter(
    (r) => r.status === "engineer_review" || r.status === "builder_review"
  ).length;
  const publishedReports = (reports || []).filter((r) => r.status === "published").length;
  const stages = project?.timelineStages || defaultTimelineStages;

  return (
    <div className="dashboard-page">

      {/* INTRO */}
      <div className="page-intro">
        <div>
          <p className="eyebrow">PROJECT OVERVIEW</p>
          <h2>Good morning, {roleGreeting}.</h2>
          <p>Here&apos;s what&apos;s happening on {projectName} today.</p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate(`/projects/${project?.id || "private-001"}`)}
        >
          {projectName}
          <ArrowUpRight size={17} />
        </button>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard
          label="Overall Progress"
          value={`${projectProgress}%`}
          detail={project?.statusDetail || "+6% this month"}
          icon={<FileCheck2 />}
        />
        <StatCard
          label="Active Reports"
          value={(reports || []).length}
          detail={`${pendingReports} awaiting action`}
          icon={<Clock3 />}
        />
        <StatCard
          label="Team Members"
          value="7"
          detail="2 currently active"
          icon={<Users />}
        />
        <StatCard
          label="Published Updates"
          value={publishedReports}
          detail="Latest 2 hours ago"
          icon={<MapPin />}
        />
      </div>

      {/* CONSTRUCTION PROGRESS TIMELINE (AS IN VIEWER POV / SCREENSHOT) */}
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

      {/* MAIN GRID */}
      <div className="dashboard-grid">

        {/* WORKFLOW PANEL */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">WORKFLOW</p>
              <h3>Report approval</h3>
            </div>
            <button
              className="text-button"
              onClick={() => navigate(demoRole === "builder" ? "/builder-review" : "/reports")}
            >
              View all
            </button>
          </div>

          <div className="workflow-list">
            {(reports || []).slice(0, 5).map((r) => {
              const statusMap = {
                engineer_review: { label: "Engineer Review", cls: "review" },
                builder_review:  { label: "Awaiting Builder", cls: "pending" },
                approved:        { label: "Approved", cls: "approved" },
                published:       { label: "Published", cls: "published" },
              };
              const st = statusMap[r.status] || { label: r.status, cls: "pending" };
              const dateStr = r.submittedAt?.split(",")?.[0] || "Recent";
              return (
                <WorkflowItem
                  key={r.id}
                  title={r.title}
                  subtitle={`Report #${r.id} · ${r.location}`}
                  status={st.label}
                  statusClass={st.cls}
                  time={dateStr}
                  onClick={() => navigate(`/reports/${r.id}`)}
                />
              );
            })}
          </div>
        </section>

        {/* PROGRESS PANEL */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">PROJECT STATUS</p>
              <h3>Current progress</h3>
            </div>
            <button className="text-button" onClick={() => navigate("/planning")}>
              Full timeline
            </button>
          </div>

          <div className="progress-container">
            <div className="progress-header">
              <span>Overall completion</span>
              <strong>{projectProgress}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${projectProgress}%` }} />
            </div>
          </div>

          <div className="milestone-list">
            {stages.map((stage, idx) => (
              <div className="milestone-item" key={stage.id || idx}>
                <div className={`milestone-dot ${stage.completed ? "done" : ""}`} />
                <div>
                  <strong>{stage.shortTitle || stage.title}</strong>
                  <span>{stage.status} · {stage.progress}% {stage.scheduleLabel ? `— ${stage.scheduleLabel}` : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}

/* -------- sub-components -------- */

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

function StatCard({ label, value, detail, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
    </div>
  );
}

function WorkflowItem({ title, subtitle, status, statusClass, time, onClick }) {
  return (
    <div
      className="workflow-item"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className="workflow-indicator" />
      <div className="workflow-info">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="workflow-right">
        <span className={`status-chip ${statusClass}`}>{status}</span>
        {time && <span className="workflow-time">{time}</span>}
      </div>
    </div>
  );
}
