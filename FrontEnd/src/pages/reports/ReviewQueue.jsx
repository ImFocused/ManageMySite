import {
  ClipboardCheck,
  Clock3,
  ArrowRight,
  MapPin,
  User,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useApp } from "../../context/AppContext";

function getWaitingTime(submittedAt) {
  if (submittedAt.includes("28 Sep 2026")) {
    return "Today";
  }

  if (submittedAt.includes("27 Sep 2026")) {
    return "1 day ago";
  }

  return "Several days ago";
}

export default function ReviewQueue() {
  const navigate = useNavigate();
  const { project,reports } = useApp();

  const waitingReports = reports.filter(
    (report) => report.status === "engineer_review"
  );

  const recentlyReviewed = reports.filter(
    (report) =>
      report.status === "approved" ||
      report.status === "builder_review"
  );

  return (
    <div className="review-queue-page">

      {/* Header */}
      <section className="review-queue-header">
        <div>
          <p className="eyebrow">ENGINEER WORKSPACE</p>

          <h1>Review Queue</h1>

          <p>
            Review Contractor submissions, verify the submitted evidence,
            and move approved work to Builder review.
          </p>
        </div>

        <div className="review-queue-project">
          <span>ACTIVE PROJECT</span>
          <strong>
            {project?.name || "Riverside Residence"}
          </strong>
          <small>
            {project?.location || "Andheri East, Mumbai"}
          </small>
        </div>
      </section>

      {/* Queue summary */}
      <section className="review-queue-summary">

        <div className="review-queue-summary-main">
          <div className="review-queue-summary-icon">
            <ClipboardCheck size={21} />
          </div>

          <div>
            <span>WAITING FOR YOUR REVIEW</span>
            <strong>{waitingReports.length}</strong>
            <p>
              {waitingReports.length === 1
                ? "report requires your attention"
                : "reports require your attention"}
            </p>
          </div>
        </div>

        <div className="review-queue-summary-side">
          <span>REVIEW FLOW</span>

          <div className="review-flow-mini">
            <strong>Contractor</strong>
            <ArrowRight size={13} />
            <strong className="active">Engineer</strong>
            <ArrowRight size={13} />
            <strong>Builder</strong>
          </div>
        </div>

      </section>

      {/* Waiting reports */}
      <section className="review-queue-panel">

        <div className="review-queue-panel-header">
          <div>
            <p className="section-kicker">ACTION REQUIRED</p>
            <h2>Reports Waiting for Review</h2>
          </div>

          <span className="review-queue-count">
            {waitingReports.length}
          </span>
        </div>

        {waitingReports.length === 0 ? (
          <div className="review-queue-empty">
            <div className="review-queue-empty-icon">
              <CheckCircle2 size={28} />
            </div>

            <strong>You're all caught up</strong>

            <p>
              There are no Contractor reports waiting for your review.
            </p>

            <button
              className="review-queue-secondary-button"
              onClick={() => navigate("/reports")}
            >
              View All Reports
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="review-queue-list">

            {waitingReports.map((report) => (
              <article
                className="review-queue-card"
                key={report.id}
              >
                <div className="review-queue-photo">
                  <img
                    src={report.photos?.[0]?.url}
                    alt={
                      report.photos?.[0]?.label ||
                      report.title
                    }
                  />

                  <span>
                    {report.photos?.length || 0} photos
                  </span>
                </div>

                <div className="review-queue-card-content">

                  <div className="review-queue-card-top">
                    <div>
                      <span className="review-queue-report-id">
                        {report.id}
                      </span>

                      <h3>{report.title}</h3>
                    </div>

                    <span className="review-queue-status">
                      Awaiting Review
                    </span>
                  </div>

                  <p className="review-queue-description">
                    {report.description}
                  </p>

                  <div className="review-queue-meta">

                    <span>
                      <MapPin size={13} />
                      {report.location}
                    </span>

                    <span>
                      <User size={13} />
                      {report.submittedBy}
                    </span>

                    <span>
                      <CalendarDays size={13} />
                      {report.submittedAt}
                    </span>

                  </div>

                  <div className="review-queue-card-footer">

                    <div className="review-queue-waiting">
                      <Clock3 size={13} />
                      <span>
                        Submitted {getWaitingTime(report.submittedAt)}
                      </span>
                    </div>

                    <button
                      className="review-queue-review-button"
                      onClick={() =>
                        navigate(`/reports/${report.id}`)
                      }
                    >
                      Review Report
                      <ArrowRight size={15} />
                    </button>

                  </div>

                </div>
              </article>
            ))}

          </div>
        )}

      </section>

      {/* Recently reviewed */}
      <section className="review-queue-panel">

        <div className="review-queue-panel-header">
          <div>
            <p className="section-kicker">RECENT ACTIVITY</p>
            <h2>Recently Reviewed</h2>
          </div>

          <button
            className="review-queue-view-button"
            onClick={() => navigate("/reports")}
          >
            View all reports
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="review-queue-recent-list">

          {recentlyReviewed.map((report) => (
            <button
              className="review-queue-recent-row"
              key={report.id}
              onClick={() =>
                navigate(`/reports/${report.id}`)
              }
            >
              <div className="review-queue-recent-icon">
                <CheckCircle2 size={15} />
              </div>

              <div>
                <strong>{report.title}</strong>
                <span>{report.location}</span>
              </div>

              <span
                className={
                  report.status === "builder_review"
                    ? "review-queue-builder-status"
                    : "review-queue-approved-status"
                }
              >
                {report.status === "builder_review"
                  ? "With Builder"
                  : "Approved"}
              </span>

              <ArrowRight size={15} />

            </button>
          ))}

        </div>

      </section>

    </div>
  );
}