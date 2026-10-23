import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  RotateCcw,
  Plus,
  MapPin,
  Users,
  TrendingUp,
  Camera,
  Building2,
  Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { handleImageError, getReportPhoto } from "../../utils/imageUtils";

function getStatusLabel(status) {
  switch (status) {
    case "engineer_review":      return "Engineer Review";
    case "builder_review":       return "Builder Review";
    case "contractor_revision":  return "Needs Revision";
    case "engineer_revision":    return "Engineer Revision";
    case "ready_to_publish":     return "Ready to Publish";
    case "published":            return "Published";
    case "approved":             return "Approved";
    default:                     return "Submitted";
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

  const inReview = myReports.filter(
    (r) => r.status === "engineer_review" || r.status === "builder_review"
  ).length;

  const published = myReports.filter((r) => r.status === "published").length;

  return (
    <div className="contractor-reports-page">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="contractor-reports-header">
        <div>
          <span className="page-eyebrow">CONTRACTOR WORKSPACE</span>
          <h1>Reports</h1>
          <p>
            Track every daily site report you've submitted for{" "}
            <strong>{project?.name}</strong>.
          </p>
        </div>

        <button
          className="primary-button cr-submit-cta"
          type="button"
          onClick={() => navigate("/submit-report")}
        >
          <Plus size={17} />
          Submit Daily Report
        </button>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <div className="cr-stats">
        <div className="cr-stat">
          <span>Total Submitted</span>
          <strong>{myReports.length}</strong>
        </div>
        <div className="cr-stat">
          <span>Under Review</span>
          <strong>{inReview}</strong>
        </div>
        <div className="cr-stat">
          <span>Needs Revision</span>
          <strong className={needsRevision.length > 0 ? "cr-stat-warn" : ""}>
            {needsRevision.length}
          </strong>
        </div>
        <div className="cr-stat">
          <span>Published</span>
          <strong className="cr-stat-green">{published}</strong>
        </div>
      </div>

      {/* ── Revision alert ─────────────────────────────────────────────── */}
      {needsRevision.length > 0 && (
        <section className="contractor-reports-alert">
          <div className="contractor-reports-alert-icon">
            <RotateCcw size={17} />
          </div>
          <div>
            <strong>
              {needsRevision.length} report
              {needsRevision.length > 1 ? "s" : ""} need revision
            </strong>
            <p>
              Review the feedback provided, update the report details or photos,
              and resubmit for Engineer review.
            </p>
          </div>
        </section>
      )}

      {/* ── Mobile hint banner ─────────────────────────────────────────── */}
      <div className="contractor-mobile-hint">
        <div className="cr-hint-icons">
          <Camera size={22} />
          <MapPin size={22} />
        </div>
        <div>
          <strong>Primary input: Mobile Camera</strong>
          <p>
            For accurate geo-tagged photographs, submit daily reports from your
            mobile device on-site. This portal is for monitoring and review.
          </p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => navigate("/submit-report")}
        >
          <Plus size={15} />
          New Report
        </button>
      </div>

      {/* ── Report list ────────────────────────────────────────────────── */}
      <section className="contractor-reports-list">
        {myReports.length === 0 ? (
          <div className="contractor-reports-empty">
            <Camera size={28} />
            <h2>No reports yet</h2>
            <p>
              Submit your first daily site report with photos, labour count and
              progress details.
            </p>
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate("/submit-report")}
            >
              <Plus size={16} />
              Submit First Report
            </button>
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
                    src={getReportPhoto(report, 0)}
                    alt={report.photos?.[0]?.label || report.title}
                    onError={handleImageError}
                  />
                </div>

                <div className="contractor-report-info">
                  <div className="contractor-report-heading">
                    <div>
                      <span>{report.id}</span>
                      <h2>{report.title || report.activity || "Site Report"}</h2>
                    </div>

                    <span
                      className={`contractor-report-status contractor-report-status-${report.status}`}
                    >
                      {getStatusLabel(report.status)}
                    </span>
                  </div>

                  {/* New mandatory fields summary */}
                  <div className="cr-report-fields">
                    {(report.buildingName || report.floor) && (
                      <span className="cr-report-field">
                        <Building2 size={12} />
                        {[report.buildingName, report.floor].filter(Boolean).join(" — ")}
                      </span>
                    )}
                    {report.activity && (
                      <span className="cr-report-field">
                        <Layers size={12} />
                        {report.activity}
                      </span>
                    )}
                    {report.labourCount !== undefined && (
                      <span className="cr-report-field">
                        <Users size={12} />
                        {report.labourCount} workers
                      </span>
                    )}
                    {report.progressPercent !== undefined && (
                      <span className="cr-report-field cr-report-field--progress">
                        <TrendingUp size={12} />
                        {report.progressPercent}% complete
                      </span>
                    )}
                    {report.photos?.some((p) => p.coords) && (
                      <span className="cr-report-field cr-report-field--geo">
                        <MapPin size={12} />
                        Geo-tagged
                      </span>
                    )}
                  </div>

                  <div className="contractor-report-meta">
                    <span>{report.location || report.floor}</span>
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
                      isRevision ? "button button-danger" : "secondary-button"
                    }
                    onClick={() => navigate(`/reports/${report.id}`)}
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
