import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

function getStatusLabel(status) {
  switch (status) {
    case "engineer_review":
      return "Engineer Review";
    case "builder_review":
      return "Builder Review";
    case "contractor_revision":
      return "Needs Revision";
    case "engineer_revision":
      return "Engineer Revision";
    case "ready_to_publish":
      return "Ready to Publish";
    case "published":
      return "Published";
    case "approved":
      return "Approved";
    default:
      return "Submitted";
  }
}

export default function ContractorReports() {
  const navigate = useNavigate();
  const { user, project, reports } = useApp();

  const myReports = reports.filter(
    (report) => report.submittedBy === user?.name
  );

  const needsRevision = myReports.filter(
    (report) =>
      report.status === "contractor_revision" ||
      report.status === "engineer_revision"
  );

  return (
    <div className="contractor-reports-page">
      <section className="contractor-reports-header">
        <div>
          <span className="page-eyebrow">CONTRACTOR WORKSPACE</span>
          <h1>My Reports</h1>
          <p>
            Track every report you have submitted for {project?.name}.
          </p>
        </div>

        <div className="contractor-reports-summary">
          <span>MY REPORTS</span>
          <strong>{myReports.length}</strong>
        </div>
      </section>

      {needsRevision.length > 0 && (
        <section className="contractor-reports-alert">
          <div className="contractor-reports-alert-icon">
            <RotateCcw size={17} />
          </div>

          <div>
            <strong>
              {needsRevision.length} report
              {needsRevision.length > 1 ? "s" : ""} needs revision
            </strong>
            <p>
              Open the report to review the feedback and resubmit it to the
              Engineer.
            </p>
          </div>
        </section>
      )}

      <section className="contractor-reports-list">
        {myReports.length === 0 ? (
          <div className="contractor-reports-empty">
            <CheckCircle2 size={22} />
            <h2>No reports yet</h2>
            <p>
              Reports submitted through the field workflow will appear here.
            </p>
          </div>
        ) : (
          myReports.map((report) => {
            const isRevision =
              report.status === "contractor_revision" ||
              report.status === "engineer_revision";

            return (
              <article
                className={`contractor-report-row ${
                  isRevision ? "contractor-report-row-revision" : ""
                }`}
                key={report.id}
              >
                <div className="contractor-report-thumb">
                  <img
                    src={report.photos?.[0]?.url}
                    alt={report.photos?.[0]?.label || report.title}
                  />
                </div>

                <div className="contractor-report-info">
                  <div className="contractor-report-heading">
                    <div>
                      <span>{report.id}</span>
                      <h2>{report.title}</h2>
                    </div>

                    <span
                      className={`contractor-report-status contractor-report-status-${report.status}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </div>

                  <p>{report.description}</p>

                  <div className="contractor-report-meta">
                    <span>{report.location}</span>
                    <span>{report.submittedAt}</span>
                  </div>

                  {isRevision && report.feedback && (
                    <div className="contractor-report-feedback">
                      <RotateCcw size={14} />
                      <div>
                        <strong>Feedback</strong>
                        <p>{report.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="contractor-report-action">
                  <button
                    className={
                      isRevision
                        ? "button button-danger"
                        : "button button-secondary"
                    }
                    onClick={() =>
                      navigate(`/reports/${report.id}`)
                    }
                  >
                    {isRevision ? "Review & Resubmit" : "View Report"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}