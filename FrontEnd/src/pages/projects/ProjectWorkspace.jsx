import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  FileText,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { useApp } from "../../context/AppContext";

export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { user, projects = [] } = useApp();

  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return (
      <div className="placeholder-page">
        <p className="eyebrow">PROJECT NOT FOUND</p>
        <h2>We couldn't find this project.</h2>

        <button
          className="primary-button"
          onClick={() => navigate("/projects")}
        >
          Back to My Projects
        </button>
      </div>
    );
  }

  const isDelayed = project.status === "Delayed";
  const stages = project.timelineStages || [
    {
      id: "stage-1",
      title: "Foundation",
      status: "Completed",
      scheduleStatus: "on_time",
      scheduleLabel: "On Time",
    },
    {
      id: "stage-2",
      title: "Structure",
      status: "In progress",
      scheduleStatus: "delayed",
      scheduleLabel: "Delayed",
    },
    {
      id: "stage-3",
      title: "Electrical",
      status: "In progress",
      scheduleStatus: "delayed",
      scheduleLabel: "Delayed",
    },
    {
      id: "stage-4",
      title: "Finishing",
      status: "Upcoming",
      scheduleStatus: "on_time",
      scheduleLabel: "On Time",
    },
  ];

  return (
    <div className="workspace-page">
      <button
        className="workspace-back-button"
        onClick={() => navigate("/projects")}
      >
        <ArrowLeft size={16} />
        Back to My Projects
      </button>

      <section className="workspace-header">
        <div>
          <div className="workspace-project-type">PRIVATE PROJECT</div>

          <h2>{project.name}</h2>

          <div className="workspace-location">
            <MapPin size={15} />
            {project.location}
          </div>
        </div>

        <div className="workspace-role">
          <span>Your role</span>
          <strong>{user.roleLabel}</strong>
        </div>
      </section>

      <section className="workspace-progress-card">
        <div className="workspace-progress-top">
          <div>
            <span className="workspace-label">OVERALL PROJECT PROGRESS</span>
            <strong>{project.progress}%</strong>
          </div>

          <div
            className={`workspace-progress-status ${
              isDelayed ? "status-delayed-text" : "status-ontime-text"
            }`}
          >
            {project.statusDetail || (isDelayed ? "Project delayed" : "Project on time")}
          </div>
        </div>

        <div className="workspace-progress-track">
          <div
            className={`workspace-progress-fill ${
              isDelayed ? "fill-delayed" : ""
            }`}
            style={{
              width: `${project.progress}%`,
            }}
          />
        </div>
      </section>

      <section className="workspace-info-grid">
        <div className="workspace-info-card">
          <CalendarDays size={20} />

          <div>
            <span>Project Start</span>
            <strong>{project.startDate}</strong>
          </div>
        </div>

        <div className="workspace-info-card">
          <Clock3 size={20} />

          <div>
            <span>Expected Completion</span>
            <strong>{project.endDate}</strong>
          </div>
        </div>

        <div className="workspace-info-card">
          <FileText size={20} />

          <div>
            <span>Reports</span>
            <strong>24 Reports</strong>
          </div>
        </div>

        {/* PROJECT STATUS BOX (NOTIFICATION FOR VIEWERS) */}
        <div
          className={`workspace-info-card workspace-status-box ${
            isDelayed ? "delayed" : "on-time"
          }`}
        >
          {isDelayed ? (
            <AlertTriangle size={20} className="status-icon-alert" />
          ) : (
            <CheckCircle2 size={20} className="status-icon-check" />
          )}

          <div>
            <span>Project Status</span>
            <strong
              className={`workspace-status-val ${
                isDelayed ? "delayed" : "on-time"
              }`}
            >
              {project.status || "On Time"}
            </strong>
            <small className="workspace-status-note">
              {project.statusDetail || (isDelayed ? "Delayed by 12 days" : "Tracking on schedule")}
            </small>
          </div>
        </div>
      </section>

      <section className="workspace-content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">PROJECT STATUS</span>
              <h3>Construction Progress</h3>
            </div>
          </div>

          <div className="workspace-status-list">
            {stages.map((stage) => {
              const isStageDelayed = stage.scheduleStatus === "delayed";
              return (
                <div className="workspace-status-item" key={stage.id}>
                  <span
                    className={`status-dot ${
                      stage.status === "Completed"
                        ? "complete"
                        : stage.status === "In progress"
                        ? "active"
                        : "upcoming"
                    }`}
                  />
                  <div className="workspace-status-text">
                    <strong>{stage.title}</strong>
                    <span>{stage.status}</span>
                  </div>

                  <div className="workspace-task-schedule-wrap">
                    <span
                      className={`task-schedule-badge ${
                        isStageDelayed ? "delayed" : "on-time"
                      }`}
                    >
                      {isStageDelayed ? (
                        <AlertTriangle size={11} />
                      ) : (
                        <CheckCircle2 size={11} />
                      )}
                      {isStageDelayed ? "Delayed" : "On Time"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">RECENT ACTIVITY</span>
              <h3>Latest Updates</h3>
            </div>
          </div>

          <div className="workspace-activity">
            <div>
              <strong>Column reinforcement</strong>
              <span>Report #R-024</span>
            </div>

            <div>
              <strong>Electrical conduit</strong>
              <span>Report #R-023</span>
            </div>

            <div>
              <strong>Plastering — Block A</strong>
              <span>Report #R-022</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
