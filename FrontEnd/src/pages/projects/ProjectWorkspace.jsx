import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  FileText,
  Clock3,
} from "lucide-react";

import { projects } from "../../data/mock";
import { useApp } from "../../context/AppContext";

export default function ProjectWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { user } = useApp();

  const project = projects.find(
    (item) => item.id === projectId
  );

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
          <div className="workspace-project-type">
            PRIVATE PROJECT
          </div>

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
            <span className="workspace-label">
              OVERALL PROJECT PROGRESS
            </span>

            <strong>{project.progress}%</strong>
          </div>

          <div className="workspace-progress-status">
            Project in progress
          </div>
        </div>

        <div className="workspace-progress-track">
          <div
            className="workspace-progress-fill"
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

        <div className="workspace-info-card">
          <Users size={20} />

          <div>
            <span>Project Team</span>
            <strong>7 Members</strong>
          </div>
        </div>

      </section>

      <section className="workspace-content-grid">

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                PROJECT STATUS
              </span>

              <h3>Construction Progress</h3>
            </div>
          </div>

          <div className="workspace-status-list">

            <div className="workspace-status-item">
              <span className="status-dot complete" />
              <div>
                <strong>Foundation</strong>
                <span>Completed</span>
              </div>
            </div>

            <div className="workspace-status-item">
              <span className="status-dot active" />
              <div>
                <strong>Structure</strong>
                <span>In progress</span>
              </div>
            </div>

            <div className="workspace-status-item">
              <span className="status-dot active" />
              <div>
                <strong>Electrical</strong>
                <span>In progress</span>
              </div>
            </div>

            <div className="workspace-status-item">
              <span className="status-dot upcoming" />
              <div>
                <strong>Finishing</strong>
                <span>Upcoming</span>
              </div>
            </div>

          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                RECENT ACTIVITY
              </span>

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