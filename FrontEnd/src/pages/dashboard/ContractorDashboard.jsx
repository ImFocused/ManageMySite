import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function ContractorDashboard() {
  const navigate = useNavigate();
  const { user, project, reports } = useApp();

  const myReports = reports.filter(
    (report) => report.submittedBy === user?.name
  );

  const pending = myReports.filter(
    (report) =>
      report.status === "engineer_review" ||
      report.status === "builder_review"
  );

  const declined = myReports.filter(
    (report) =>
      report.status === "contractor_revision" ||
      report.status === "engineer_revision"
  );

  const published = myReports.filter(
    (report) => report.status === "published"
  );

  return (
    <div className="contractor-dashboard">
      <section className="contractor-dashboard-header">
        <div>
          <span className="page-eyebrow">CONTRACTOR WORKSPACE</span>
          <h1>Good morning, {user?.name?.split(" ")[0]}</h1>
          <p>
            Track your assigned work, submitted reports and review feedback.
          </p>
        </div>

        <div className="contractor-project-card">
          <span>ACTIVE PROJECT</span>
          <strong>{project?.name}</strong>
          <small>{project?.location}</small>
        </div>
      </section>

      <section className="contractor-stats-grid">
        <div className="contractor-stat-card">
          <div className="contractor-stat-icon">
            <FileText size={17} />
          </div>
          <div>
            <span>MY REPORTS</span>
            <strong>{myReports.length}</strong>
          </div>
        </div>

        <div className="contractor-stat-card">
          <div className="contractor-stat-icon">
            <Clock3 size={17} />
          </div>
          <div>
            <span>UNDER REVIEW</span>
            <strong>{pending.length}</strong>
          </div>
        </div>

        <div className="contractor-stat-card contractor-stat-warning">
          <div className="contractor-stat-icon">
            <RotateCcw size={17} />
          </div>
          <div>
            <span>NEEDS REVISION</span>
            <strong>{declined.length}</strong>
          </div>
        </div>

        <div className="contractor-stat-card">
          <div className="contractor-stat-icon">
            <CheckCircle2 size={17} />
          </div>
          <div>
            <span>PUBLISHED</span>
            <strong>{published.length}</strong>
          </div>
        </div>
      </section>

      <section className="contractor-dashboard-grid">
        <div className="contractor-panel contractor-work-panel">
          <div className="contractor-panel-header">
            <div>
              <span className="page-eyebrow">MY WORK</span>
              <h2>Assigned Work</h2>
            </div>

            <button
              className="contractor-text-button"
              onClick={() => navigate("/planning")}
            >
              View work
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="contractor-work-item">
            <div>
              <span className="contractor-work-code">TASK-018</span>
              <strong>Electrical Installation</strong>
              <small>Block A — First Floor</small>
            </div>

            <span className="contractor-work-status">IN PROGRESS</span>
          </div>

          <div className="contractor-work-item">
            <div>
              <span className="contractor-work-code">TASK-017</span>
              <strong>Internal Plastering</strong>
              <small>Block A — First Floor</small>
            </div>

            <span className="contractor-work-status">COMPLETED</span>
          </div>

          <div className="contractor-work-item">
            <div>
              <span className="contractor-work-code">TASK-016</span>
              <strong>Foundation Work</strong>
              <small>Block A — Foundation</small>
            </div>

            <span className="contractor-work-status">COMPLETED</span>
          </div>
        </div>

        <div className="contractor-panel">
          <div className="contractor-panel-header">
            <div>
              <span className="page-eyebrow">REPORT STATUS</span>
              <h2>Latest Activity</h2>
            </div>
          </div>

          <div className="contractor-activity-list">
            {myReports.slice(0, 4).map((report) => (
              <button
                className="contractor-activity-item"
                key={report.id}
                onClick={() => navigate(`/reports/${report.id}`)}
              >
                <div>
                  <strong>{report.title}</strong>
                  <span>{report.submittedAt}</span>
                </div>

                <span className={`contractor-status contractor-status-${report.status}`}>
                  {report.status === "engineer_review" && "Engineer Review"}
                  {report.status === "builder_review" && "Builder Review"}
                  {report.status === "contractor_revision" && "Needs Revision"}
                  {report.status === "engineer_revision" && "Engineer Revision"}
                  {report.status === "published" && "Published"}
                  {report.status === "approved" && "Approved"}
                </span>
              </button>
            ))}

            {myReports.length === 0 && (
              <div className="contractor-empty">
                <FileText size={20} />
                <span>No reports submitted yet.</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {declined.length > 0 && (
        <section className="contractor-revision-banner">
          <div>
            <span className="page-eyebrow">ACTION REQUIRED</span>
            <h2>{declined.length} report needs your attention</h2>
            <p>
              Review the feedback and resubmit the corrected report for
              Engineer review.
            </p>
          </div>

          <button
            className="button button-primary"
            onClick={() => navigate("/reports")}
          >
            Review Feedback
            <ArrowRight size={15} />
          </button>
        </section>
      )}

      <section className="contractor-submit-card">
        <div className="contractor-submit-icon">
          <Upload size={19} />
        </div>

        <div>
          <span className="page-eyebrow">FIELD REPORTING</span>
          <h2>Submit construction evidence</h2>
          <p>
            New field reports are captured through the ManageMySite mobile
            workflow. Your submitted reports will appear here for review and
            tracking.
          </p>
        </div>
      </section>
    </div>
  );
}