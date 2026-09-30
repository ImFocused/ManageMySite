import { useNavigate } from "react-router-dom";
import {
  FileText,
  ChevronRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Eye,
  MapPin,
  ArrowUpRight,
} from "lucide-react";


import { useApp } from "../../context/AppContext";

function getStatusLabel(status) {
  const labels = {
    engineer_review: "Engineer Review",
    builder_review: "Builder Review",
    approved: "Approved",
    published: "Published",
    declined: "Declined",
  };

  return labels[status] || status;
}

function getStatusClass(status) {
  if (
    status === "approved" ||
    status === "published"
  ) {
    return "status-approved";
  }

  if (status === "declined") {
    return "status-declined";
  }

  return "status-review";
}

function getPageContent(role) {
  switch (role) {
    case "engineer":
      return {
        eyebrow: "ENGINEER WORKSPACE",
        title: "Review Queue",
        description:
          "Review contractor submissions, construction proof and site evidence.",
      };

    case "builder":
      return {
        eyebrow: "BUILDER WORKSPACE",
        title: "Reports",
        description:
          "Review engineer-approved reports before publishing updates to viewers.",
      };

    case "contractor":
      return {
        eyebrow: "CONTRACTOR WORKSPACE",
        title: "My Reports",
        description:
          "Track your submitted reports, review feedback and resubmission status.",
      };

    case "projectManager":
      return {
        eyebrow: "PROJECT MONITORING",
        title: "Reports",
        description:
          "Monitor report progress, review queues and outstanding submissions.",
      };

    case "viewer":
      return {
        eyebrow: "PROJECT UPDATES",
        title: "Construction Updates",
        description:
          "View construction progress and published site updates.",
      };

    default:
      return {
        eyebrow: "PROJECT REPORTS",
        title: "Reports",
        description:
          "Review construction updates, submitted proof, feedback and approval status.",
      };
  }
}

function getReportsForRole(role, reports) {
  switch (role) {
    case "engineer":
      return reports.filter(
        (report) =>
          report.status === "engineer_review" ||
          report.status === "builder_review" ||
          report.status === "approved" ||
          report.status === "published"
      );

    case "builder":
      return reports.filter(
        (report) =>
          report.status === "builder_review" ||
          report.status === "approved" ||
          report.status === "published"
      );

    case "contractor":
      return reports;

    case "projectManager":
      return reports;

    case "viewer":
      return reports.filter(
        (report) => report.status === "published"
      );

    default:
      return reports;
  }
}

export default function Reports() {
  const navigate = useNavigate();

  const { demoRole, reports, project } = useApp();

  const content = getPageContent(demoRole);

  const visibleReports = getReportsForRole(
    demoRole, reports
  );

  const awaitingEngineerReview =
    reports.filter(
      (report) =>
        report.status === "engineer_review"
    ).length;

  const awaitingBuilderReview =
    reports.filter(
      (report) =>
        report.status === "builder_review"
    ).length;

  const publishedReports =
    reports.filter(
      (report) =>
        report.status === "published"
    ).length;

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="page-intro">
        <div>
          <p className="eyebrow">
            {content.eyebrow}
          </p>

          <h2>{content.title}</h2>

          <p>{content.description}</p>
        </div>
      </div>

      {/* ROLE-SPECIFIC SUMMARY */}

      {demoRole === "engineer" && (
        <div className="reports-summary">

          <div className="report-summary-card">
            <span>Waiting for Review</span>
            <strong>
              {awaitingEngineerReview}
            </strong>
          </div>

          <div className="report-summary-card">
            <span>Reviewed Reports</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status !==
                    "engineer_review"
                ).length
              }
            </strong>
          </div>

          <div className="report-summary-card">
            <span>Published</span>
            <strong>{publishedReports}</strong>
          </div>

        </div>
      )}

      {demoRole === "builder" && (
        <div className="reports-summary">

          <div className="report-summary-card">
            <span>Waiting for Approval</span>
            <strong>
              {awaitingBuilderReview}
            </strong>
          </div>

          <div className="report-summary-card">
            <span>Approved</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status ===
                      "approved" ||
                    report.status ===
                      "published"
                ).length
              }
            </strong>
          </div>

          <div className="report-summary-card">
            <span>Published</span>
            <strong>{publishedReports}</strong>
          </div>

        </div>
      )}

      {demoRole === "contractor" && (
        <div className="reports-summary">

          <div className="report-summary-card">
            <span>My Reports</span>
            <strong>{reports.length}</strong>
          </div>

          <div className="report-summary-card">
            <span>Under Review</span>
            <strong>
              {
                reports.filter(
                  (report) =>
                    report.status ===
                      "engineer_review" ||
                    report.status ===
                      "builder_review"
                ).length
              }
            </strong>
          </div>

          <div className="report-summary-card">
            <span>Published</span>
            <strong>{publishedReports}</strong>
          </div>

        </div>
      )}

      {demoRole === "projectManager" && (
        <div className="reports-summary">

          <div className="report-summary-card">
            <span>Total Reports</span>
            <strong>{reports.length}</strong>
          </div>

          <div className="report-summary-card">
            <span>Awaiting Action</span>
            <strong>
              {awaitingEngineerReview +
                awaitingBuilderReview}
            </strong>
          </div>

          <div className="report-summary-card">
            <span>Published</span>
            <strong>{publishedReports}</strong>
          </div>

        </div>
      )}

      {demoRole === "viewer" && (
        <div className="reports-summary">

          <div className="report-summary-card">
            <span>Published Updates</span>
            <strong>{publishedReports}</strong>
          </div>

          <div className="report-summary-card">
            <span>Project Progress</span>
            <strong>{project?.progress || 68}%</strong>
          </div>

        </div>
      )}

      {/* REPORT LIST */}

      

      {demoRole === "viewer" ? (
        <div className="viewer-updates-list">
          {visibleReports.length === 0 ? (
            <div className="empty-reports">
              <FileText size={28} />

              <h3>No published updates yet</h3>

              <p>
                Published construction updates will appear here
                once they have completed the project approval process.
              </p>
            </div>
          ) : (
            visibleReports.map((report) => (
              <article
                className="viewer-report-card"
                key={report.id}
              >
                <div className="viewer-report-photo">
                  {report.photos?.[0]?.url ? (
                    <img
                      src={report.photos[0].url}
                      alt={
                        report.photos[0].label ||
                        report.title
                      }
                    />
                  ) : (
                    <FileText size={28} />
                  )}

                  <span className="viewer-report-photo-count">
                    {report.photos?.length || 0} photo
                    {report.photos?.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="viewer-report-content">
                  <div className="viewer-report-topline">
                    <span className="viewer-published-badge">
                      <CheckCircle2 size={13} />
                      Published
                    </span>

                    <span className="viewer-report-date">
                      {report.submittedAt}
                    </span>
                  </div>

                  <h3>{report.title}</h3>

                  <div className="viewer-report-location">
                    <MapPin size={14} />
                    {report.location || "Project site"}
                  </div>

                  <p>
                    {report.description}
                  </p>

                  <div className="viewer-report-footer">
                    <span>
                      Published update
                    </span>

                    <button
                      type="button"
                      className="viewer-report-view-button"
                      onClick={() =>
                        navigate(`/reports/${report.id}`)
                      }
                    >
                      View Update
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="reports-list">
          {visibleReports.length === 0 ? (
            <div className="empty-reports">
              <FileText size={28} />

              <h3>No reports available</h3>

              <p>
                There are currently no reports
                requiring your attention.
              </p>
            </div>
          ) : (
            visibleReports.map((report) => (
              <div
                className="report-list-card"
                key={report.id}
              >
                <div className="report-icon">
                  <FileText size={20} />
                </div>

                <div className="report-main">
                  <div className="report-title-row">
                    <div>
                      <span className="report-id">
                        REPORT #{report.id}
                      </span>

                      <h3>{report.title}</h3>
                    </div>

                    <span
                      className={`report-status ${getStatusClass(
                        report.status
                      )}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </div>

                  <p>{report.location}</p>

                  <div className="report-meta">
                    <span>
                      Submitted by{" "}
                      {report.submittedBy}
                    </span>

                    <span>
                      <Clock3 size={13} />
                      {report.submittedAt}
                    </span>

                    <span>
                      {report.photos.length} photo
                      {report.photos.length !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>
                </div>

                <button
                  className="report-view-button"
                  onClick={() =>
                    navigate(`/reports/${report.id}`)
                  }
                >
                  {demoRole === "projectManager" ? (
                    <>
                      View Report
                      <ChevronRight size={17} />
                    </>
                  ) : (
                    <>
                      View Report
                      <ChevronRight size={17} />
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}