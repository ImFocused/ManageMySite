import {
  ClipboardCheck,
  FileCheck2,
  Clock3,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const recentActivity = [
  {
    id: 1,
    title: "Electrical Conduit",
    action: "Approved",
    time: "27 Sep 2026, 04:05 PM",
    type: "approved",
  },
  {
    id: 2,
    title: "Plastering — Block A",
    action: "Sent to Builder",
    time: "26 Sep 2026, 02:20 PM",
    type: "approved",
  },
  {
    id: 3,
    title: "Foundation Inspection",
    action: "Approved",
    time: "22 Sep 2026, 03:15 PM",
    type: "approved",
  },
];

export default function EngineerDashboard() {
  const navigate = useNavigate();
  const { user, project, reports } = useApp();

  const awaitingReview = reports.filter(
    (report) => report.status === "engineer_review"
  );

  const builderReview = reports.filter(
    (report) => report.status === "builder_review"
  );

  const approved = reports.filter(
    (report) => report.status === "approved"
  );

  const published = reports.filter(
    (report) => report.status === "published"
  );

  return (
    <div className="engineer-dashboard">

      {/* Header */}
      <section className="engineer-dashboard-header">
        <div>
          <p className="eyebrow">ENGINEER WORKSPACE</p>

          <h1>
            Good morning, {user?.name?.split(" ")[0] || "Engineer"}
          </h1>

          <p>
            Review submitted construction reports and keep project work moving
            through the approval workflow.
          </p>
        </div>

        <div className="engineer-project-card">
          <span>ACTIVE PROJECT</span>
          <strong>{project?.name || "Riverside Residence"}</strong>
          <small>
            {project?.location || "Andheri East, Mumbai"}
          </small>
        </div>
      </section>

      {/* Review alert */}
      {awaitingReview.length > 0 && (
        <section className="engineer-review-banner">
          <div className="engineer-review-banner-icon">
            <ClipboardCheck size={20} />
          </div>

          <div>
            <strong>
              {awaitingReview.length} report
              {awaitingReview.length > 1 ? "s" : ""} waiting for your review
            </strong>

            <span>
              Review the submitted evidence and either approve the report or
              return it to the Contractor with a reason.
            </span>
          </div>

          <button
            className="engineer-primary-button"
            onClick={() => navigate("/review-queue")}
          >
            Open Review Queue
            <ArrowRight size={15} />
          </button>
        </section>
      )}

      {/* Summary */}
      <section className="engineer-stats-grid">

        <div className="engineer-stat-card attention">
          <div className="engineer-stat-icon">
            <Clock3 size={18} />
          </div>

          <div>
            <span>WAITING FOR REVIEW</span>
            <strong>{awaitingReview.length}</strong>
            <small>Requires your action</small>
          </div>
        </div>

        <div className="engineer-stat-card">
          <div className="engineer-stat-icon">
            <FileCheck2 size={18} />
          </div>

          <div>
            <span>WITH BUILDER</span>
            <strong>{builderReview.length}</strong>
            <small>Engineer approved</small>
          </div>
        </div>

        <div className="engineer-stat-card">
          <div className="engineer-stat-icon">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <span>APPROVED</span>
            <strong>{approved.length}</strong>
            <small>Engineer approvals</small>
          </div>
        </div>

        <div className="engineer-stat-card">
          <div className="engineer-stat-icon">
            <FileCheck2 size={18} />
          </div>

          <div>
            <span>PUBLISHED</span>
            <strong>{published.length}</strong>
            <small>Visible to viewers</small>
          </div>
        </div>

      </section>

      {/* Project Context */}
      <section className="engineer-context-strip">

        <div className="engineer-context-item">
          <span>PROJECT PROGRESS</span>
          <strong>{project?.progress || 68}%</strong>
        </div>

        <div className="engineer-context-divider" />

        <div className="engineer-context-item">
          <span>ACTIVE PHASE</span>
          <strong>Electrical Installation</strong>
        </div>

        <div className="engineer-context-divider" />

        <div className="engineer-context-item">
          <span>NEXT REVIEW</span>
          <strong>
            {awaitingReview[0]?.title || "No pending review"}
          </strong>
        </div>

        <div className="engineer-context-divider" />

        <div className="engineer-context-item">
          <span>PROJECT END</span>
          <strong>{project?.endDate || "30 Nov 2026"}</strong>
        </div>

      </section>

      {/* Main */}
      <section className="engineer-dashboard-grid">

        {/* Review Queue */}
        <div className="engineer-panel">

          <div className="engineer-panel-header">
            <div>
              <p className="section-kicker">REQUIRES ATTENTION</p>
              <h2>Review Queue</h2>
            </div>

            <button
              className="engineer-text-button"
              onClick={() => navigate("/review-queue")}
            >
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          {awaitingReview.length === 0 ? (
            <div className="engineer-empty-state">
              <CheckCircle2 size={28} />
              <strong>You're all caught up</strong>
              <span>
                No reports are currently waiting for review.
              </span>
            </div>
          ) : (
            <div className="engineer-report-list">

              {awaitingReview.map((report) => (
                <button
                  className="engineer-report-row"
                  key={report.id}
                  onClick={() => navigate(`/reports/${report.id}`)}
                >

                  <div className="engineer-report-thumbnail">
                    <img
                      src={report.photos?.[0]?.url}
                      alt={
                        report.photos?.[0]?.label ||
                        report.title
                      }
                    />
                  </div>

                  <div className="engineer-report-info">
                    <strong>{report.title}</strong>
                    <span>{report.location}</span>

                    <small>
                      Submitted by {report.submittedBy} ·{" "}
                      {report.submittedAt}
                    </small>
                  </div>

                  <div className="engineer-report-status">
                    <span className="engineer-status-pill engineer-status-review">
                      Awaiting Review
                    </span>

                    <ArrowRight size={15} />
                  </div>

                </button>
              ))}

            </div>
          )}

        </div>

        {/* Workflow */}
        <div className="engineer-panel">

          <div className="engineer-panel-header">
            <div>
              <p className="section-kicker">WORKFLOW</p>
              <h2>Report Progress</h2>
            </div>
          </div>

          <div className="engineer-workflow">

            <div className="engineer-workflow-step active">
              <div className="engineer-workflow-icon">
                <ClipboardCheck size={17} />
              </div>

              <div>
                <strong>Engineer Review</strong>
                <span>{awaitingReview.length} waiting</span>
              </div>
            </div>

            <div className="engineer-workflow-line" />

            <div className="engineer-workflow-step">
              <div className="engineer-workflow-icon">
                <FileCheck2 size={17} />
              </div>

              <div>
                <strong>Builder Review</strong>
                <span>{builderReview.length} with Builder</span>
              </div>
            </div>

            <div className="engineer-workflow-line" />

            <div className="engineer-workflow-step">
              <div className="engineer-workflow-icon">
                <CheckCircle2 size={17} />
              </div>

              <div>
                <strong>Published</strong>
                <span>{published.length} published</span>
              </div>
            </div>

          </div>

          <div className="engineer-workflow-note">
            <AlertCircle size={15} />

            <span>
              Declined reports return to the Contractor for correction and
              resubmission.
            </span>
          </div>

        </div>

      </section>

      {/* Recent activity */}
      <section className="engineer-panel">

        <div className="engineer-panel-header">
          <div>
            <p className="section-kicker">ACTIVITY</p>
            <h2>Recent Review Activity</h2>
          </div>

          <MessageSquare size={18} />
        </div>

        <div className="engineer-activity-list">

          {recentActivity.map((activity) => (
            <div
              className="engineer-activity-row"
              key={activity.id}
            >

              <div className="engineer-activity-dot">
                <CheckCircle2 size={14} />
              </div>

              <div>
                <strong>{activity.title}</strong>
                <span>{activity.action}</span>
              </div>

              <time>{activity.time}</time>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}