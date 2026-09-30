import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function BuilderReviewQueue() {
  const navigate = useNavigate();
  const { project, reports } = useApp();

  const pendingReports = reports.filter(
    (report) => report.status === "builder_review"
  );

  const readyToPublish = reports.filter(
    (report) => report.status === "ready_to_publish"
  );

  return (
    <div className="builder-review-page">
      <section className="builder-review-header">
        <div>
          <span className="page-eyebrow">BUILDER WORKSPACE</span>
          <h1>Builder Review</h1>
          <p>
            Review reports approved by the Engineer before they are published
            to project viewers.
          </p>
        </div>

        <div className="builder-review-project">
          <span>ACTIVE PROJECT</span>
          <strong>{project?.name}</strong>
          <small>{project?.location}</small>
        </div>
      </section>

      <section className="builder-review-summary">
        <div className="builder-review-stat">
          <div className="builder-review-stat-icon">
            <Clock3 size={17} />
          </div>
          <div>
            <span>AWAITING APPROVAL</span>
            <strong>{pendingReports.length}</strong>
          </div>
        </div>

        <div className="builder-review-stat">
          <div className="builder-review-stat-icon">
            <CheckCircle2 size={17} />
          </div>
          <div>
            <span>READY TO PUBLISH</span>
            <strong>{readyToPublish.length}</strong>
          </div>
        </div>

        <div className="builder-review-stat">
          <div className="builder-review-stat-icon">
            <FileCheck2 size={17} />
          </div>
          <div>
            <span>PUBLISHED</span>
            <strong>
              {reports.filter((report) => report.status === "published").length}
            </strong>
          </div>
        </div>
      </section>

      <section className="builder-review-workflow">
        <div className="builder-review-step active">
          <span>01</span>
          <div>
            <strong>Engineer Review</strong>
            <small>Technical evidence checked</small>
          </div>
        </div>

        <ArrowRight size={16} />

        <div className="builder-review-step active">
          <span>02</span>
          <div>
            <strong>Builder Approval</strong>
            <small>Final project review</small>
          </div>
        </div>

        <ArrowRight size={16} />

        <div className="builder-review-step">
          <span>03</span>
          <div>
            <strong>Publish</strong>
            <small>Visible to project viewers</small>
          </div>
        </div>
      </section>

      {pendingReports.length === 0 ? (
        <section className="builder-empty-state">
          <div className="builder-empty-icon">
            <CheckCircle2 size={22} />
          </div>
          <h2>No reports awaiting approval</h2>
          <p>
            Reports approved by the Engineer will appear here for your final
            review.
          </p>
        </section>
      ) : (
        <section className="builder-review-list">
          <div className="builder-review-list-header">
            <div>
              <span className="page-eyebrow">ACTION REQUIRED</span>
              <h2>Reports Awaiting Your Approval</h2>
            </div>
            <span className="builder-review-count">
              {pendingReports.length} pending
            </span>
          </div>

          {pendingReports.map((report) => (
            <article className="builder-review-card" key={report.id}>
              <div className="builder-review-photo">
                <img
                  src={report.photos?.[0]?.url}
                  alt={report.photos?.[0]?.label || report.title}
                />
              </div>

              <div className="builder-review-card-main">
                <div className="builder-review-card-top">
                  <div>
                    <span className="builder-report-id">{report.id}</span>
                    <h3>{report.title}</h3>
                  </div>

                  <span className="status-badge status-builder-review">
                    Engineer Approved
                  </span>
                </div>

                <p>{report.description}</p>

                <div className="builder-review-meta">
                  <span>{report.location}</span>
                  <span>Submitted by {report.submittedBy}</span>
                  <span>{report.submittedAt}</span>
                </div>

                {report.feedback && (
                  <div className="builder-engineer-feedback">
                    <MessageSquare size={15} />
                    <div>
                      <strong>Engineer feedback</strong>
                      <span>{report.feedback}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="builder-review-card-action">
                <button
                  className="button button-primary"
                  onClick={() => navigate(`/reports/${report.id}`)}
                >
                  Review Report
                  <ArrowRight size={15} />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {readyToPublish.length > 0 && (
        <section className="builder-publish-preview">
          <div>
            <span className="page-eyebrow">NEXT STEP</span>
            <h2>Ready to Publish</h2>
            <p>
              These reports have received Builder approval and can now be
              published to project viewers.
            </p>
          </div>

          <button
            className="button button-success"
            onClick={() =>
              navigate(`/reports/${readyToPublish[0].id}`)
            }
          >
            Open Publish Queue
            <ArrowRight size={15} />
          </button>
        </section>
      )}
    </div>
  );
}