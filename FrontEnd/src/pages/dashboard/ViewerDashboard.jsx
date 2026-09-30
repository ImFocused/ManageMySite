import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageSquare,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { demoUsers } from "../../data/mock";

export default function ViewerDashboard() {
  const navigate = useNavigate();
  const { project, reports } = useApp();

  const publishedReports = reports
    .filter((report) => report.status === "published")
    .slice(0, 3);

  const currentStage = "Structure";
  const completedStages = 1;
  const totalStages = 4;

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

        <SnapshotCard
          icon={<Users />}
          label="Project team"
          value="3 key roles"
          detail="Engineer, Contractor & Builder"
          className="team"
        />
      </div>

      {/* MINI TIMELINE */}

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
          <TimelineStage
            title="Foundation"
            status="Completed"
            progress={100}
            active
          />

          <TimelineStage
            title="Structure"
            status="In progress"
            progress={72}
            active
          />

          <TimelineStage
            title="Electrical"
            status="Upcoming"
            progress={0}
          />

          <TimelineStage
            title="Finishing"
            status="Upcoming"
            progress={0}
          />
        </div>

        <div className="viewer-timeline-footer">
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
                      src={report.photos?.[0]?.url}
                      alt={report.photos?.[0]?.label || report.title}
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

function TimelineStage({
  title,
  status,
  progress,
  active = false,
}) {
  return (
    <div className={`viewer-timeline-stage ${active ? "active" : ""}`}>
      <div className="viewer-timeline-stage-header">
        <div>
          <strong>{title}</strong>
          <span>{status}</span>
        </div>

        <strong>{progress}%</strong>
      </div>

      <div className="viewer-stage-track">
        <div
          className="viewer-stage-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
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