import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FileText,
  ChevronRight,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Eye,
  MapPin,
  ArrowUpRight,
  Building2,
  Plus,
  Layers,
} from "lucide-react";

import { useApp } from "../../context/AppContext";

function getStatusLabel(status) {
  const labels = {
    engineer_review: "Engineer Review",
    builder_review: "Builder Review",
    contractor_revision: "Needs Revision",
    engineer_revision: "Engineer Revision",
    approved: "Approved",
    published: "Published",
    declined: "Declined",
    withdrawn: "Withdrawn",
  };

  return labels[status] || status;
}

function getStatusClass(status) {
  if (status === "approved" || status === "published") {
    return "status-approved";
  }

  if (status === "declined" || status === "withdrawn") {
    return "status-declined";
  }

  return "status-review";
}

function getPageContent(role) {
  switch (role) {
    case "engineer":
      return {
        eyebrow: "ENGINEER WORKSPACE",
        title: "Reports",
        description:
          "Review contractor submissions, construction proof and site evidence classified by project.",
      };

    case "builder":
      return {
        eyebrow: "BUILDER WORKSPACE",
        title: "Reports",
        description:
          "Select a project to review engineer-approved reports before publishing updates to viewers.",
      };

    case "contractor":
      return {
        eyebrow: "CONTRACTOR WORKSPACE",
        title: "Reports",
        description:
          "Select a project to track submitted daily site reports, review feedback, and submit updates.",
      };

    case "projectManager":
      return {
        eyebrow: "PROJECT MONITORING",
        title: "Reports",
        description:
          "Monitor report progress, review queues and outstanding submissions classified by project.",
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
          "Review construction updates, submitted proof, feedback and approval status classified by project.",
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
      return reports.filter((report) => report.status === "published");

    default:
      return reports;
  }
}

export default function Reports() {
  const navigate = useNavigate();
  const { demoRole, reports, project, projects = [], changeProject } = useApp();

  const content = getPageContent(demoRole);

  // Default to active project ID
  const [selectedProjectId, setSelectedProjectId] = useState(
    project?.id || "private-001"
  );

  function handleSelectProject(id) {
    setSelectedProjectId(id);
    if (changeProject && id !== "all") {
      changeProject(id);
    }
  }

  // Filter reports by selected project
  const projectFilteredReports =
    selectedProjectId === "all"
      ? reports
      : reports.filter(
          (r) => (r.projectId || "private-001") === selectedProjectId
        );

  const visibleReports = getReportsForRole(demoRole, projectFilteredReports);

  const activeSelectedProject =
    projects.find((p) => p.id === selectedProjectId) || project;

  // Project metrics
  const getProjectReportCount = (projId) => {
    return reports.filter(
      (r) => (r.projectId || "private-001") === projId
    ).length;
  };

  const getProjectPendingCount = (projId) => {
    return reports.filter(
      (r) =>
        (r.projectId || "private-001") === projId &&
        (r.status === "engineer_review" || r.status === "builder_review")
    ).length;
  };

  // Status breakdown for current selection
  const awaitingEngineerReview = projectFilteredReports.filter(
    (report) => report.status === "engineer_review"
  ).length;

  const awaitingBuilderReview = projectFilteredReports.filter(
    (report) => report.status === "builder_review"
  ).length;

  const publishedReports = projectFilteredReports.filter(
    (report) => report.status === "published"
  ).length;

  const approvedReports = projectFilteredReports.filter(
    (report) => report.status === "approved" || report.status === "published"
  ).length;

  const withdrawnReports = projectFilteredReports.filter(
    (report) => report.status === "withdrawn"
  ).length;

  return (
    <div className="reports-page">
      {/* HEADER */}
      <div className="page-intro">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
      </div>

      {/* PROJECT CLASSIFICATION SELECTOR — (FOR ALL ROLES EXCEPT VIEWER) */}
      {demoRole !== "viewer" && (
        <section className="reports-project-selector-section">
          <div className="reports-selector-top">
            <div>
              <span className="section-kicker">CLASSIFY BY PROJECT</span>
              <h3>Select Project to View Reports</h3>
              <p>
                First select a project below to inspect its classified report
                count, review queue, and site evidence.
              </p>
            </div>

            <div className="reports-project-pill-filters">
              <button
                type="button"
                className={`project-pill-filter ${
                  selectedProjectId === "all" ? "active" : ""
                }`}
                onClick={() => handleSelectProject("all")}
              >
                All Projects ({reports.length})
              </button>
              {projects.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  className={`project-pill-filter ${
                    selectedProjectId === p.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectProject(p.id)}
                >
                  {p.name} ({getProjectReportCount(p.id)})
                </button>
              ))}
            </div>
          </div>

          <div className="reports-project-cards-grid">
            {projects.map((p) => {
              const count = getProjectReportCount(p.id);
              const pending = getProjectPendingCount(p.id);
              const isSelected = selectedProjectId === p.id;

              return (
                <div
                  key={p.id}
                  className={`reports-project-card ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleSelectProject(p.id)}
                >
                  <div className="rpc-top">
                    <div className="rpc-icon">
                      <Building2 size={18} />
                    </div>
                    <span className="rpc-type-badge private">
                      Private Project
                    </span>
                  </div>

                  <div className="rpc-body">
                    <h4>{p.name}</h4>
                    <span className="rpc-location">
                      <MapPin size={12} /> {p.location}
                    </span>
                  </div>

                  <div className="rpc-footer">
                    <div className="rpc-count-box">
                      <strong>{count}</strong>
                      <span>Total Reports</span>
                    </div>

                    {pending > 0 ? (
                      <span className="rpc-pending-badge">
                        <Clock3 size={11} /> {pending} in review
                      </span>
                    ) : (
                      <span className="rpc-uptodate-badge">
                        <CheckCircle2 size={11} /> Up to date
                      </span>
                    )}
                  </div>

                  <div className="rpc-select-bar">
                    <span>
                      {isSelected
                        ? "✓ Showing Classified Reports"
                        : "Select Project to View"}
                    </span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CLASSIFIED REPORTS SUB-HEADER & STATS */}
      <div className="reports-classified-header">
        <div className="rch-left">
          <span className="section-kicker">
            {selectedProjectId === "all"
              ? "ALL PROJECTS"
              : `PROJECT: ${activeSelectedProject?.name?.toUpperCase()}`}
          </span>
          <h2>
            {selectedProjectId === "all"
              ? "All Site Reports"
              : `${activeSelectedProject?.name} Reports`}
          </h2>
          <span className="rch-subtitle">
            Showing <strong>{visibleReports.length}</strong> reports classified under{" "}
            {selectedProjectId === "all"
              ? "all projects"
              : activeSelectedProject?.name}
          </span>
        </div>

        {demoRole === "contractor" && (
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/submit-report")}
          >
            <Plus size={16} /> Submit Daily Report
          </button>
        )}
      </div>

      {/* ROLE-SPECIFIC SUMMARY STRIP (Calculated for Selected Project) */}
      {demoRole === "engineer" && (
        <div className="reports-summary">
          <div className="report-summary-card">
            <span>Waiting for Review</span>
            <strong>{awaitingEngineerReview}</strong>
          </div>

          <div className="report-summary-card">
            <span>Reviewed Reports</span>
            <strong>
              {
                projectFilteredReports.filter(
                  (report) => report.status !== "engineer_review"
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
            <strong>{awaitingBuilderReview}</strong>
          </div>

          <div className="report-summary-card">
            <span>Approved</span>
            <strong>{approvedReports}</strong>
          </div>

          <div className="report-summary-card">
            <span>Published</span>
            <strong>{publishedReports}</strong>
          </div>

          <div className="report-summary-card">
            <span>Withdrawn</span>
            <strong>{withdrawnReports}</strong>
          </div>
        </div>
      )}

      {demoRole === "contractor" && (
        <div className="reports-summary">
          <div className="report-summary-card">
            <span>Project Reports</span>
            <strong>{projectFilteredReports.length}</strong>
          </div>

          <div className="report-summary-card">
            <span>Under Review</span>
            <strong>
              {
                projectFilteredReports.filter(
                  (report) =>
                    report.status === "engineer_review" ||
                    report.status === "builder_review"
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
            <span>Project Reports</span>
            <strong>{projectFilteredReports.length}</strong>
          </div>

          <div className="report-summary-card">
            <span>Awaiting Action</span>
            <strong>
              {awaitingEngineerReview + awaitingBuilderReview}
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
            <strong>{activeSelectedProject?.progress || 68}%</strong>
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
                Published construction updates will appear here once they have
                completed the project approval process.
              </p>
            </div>
          ) : (
            visibleReports.map((report) => (
              <article className="viewer-report-card" key={report.id}>
                <div className="viewer-report-photo">
                  {report.photos?.[0]?.url ? (
                    <img
                      src={report.photos[0].url}
                      alt={report.photos[0].label || report.title}
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

                  <p>{report.description}</p>

                  <div className="viewer-report-footer">
                    <span>Published update</span>

                    <button
                      type="button"
                      className="viewer-report-view-button"
                      onClick={() => navigate(`/reports/${report.id}`)}
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
              <h3>No reports found for this project</h3>
              <p>
                There are currently no reports submitted under{" "}
                <strong>{activeSelectedProject?.name}</strong>.
              </p>
            </div>
          ) : (
            visibleReports.map((report) => {
              const reportProj =
                projects.find(
                  (p) => p.id === (report.projectId || "private-001")
                ) || activeSelectedProject;

              return (
                <div className="report-list-card" key={report.id}>
                  <div className="report-icon">
                    <FileText size={20} />
                  </div>

                  <div className="report-main">
                    <div className="report-title-row">
                      <div>
                        <div className="report-header-badges">
                          <span className="report-id">
                            REPORT #{report.id}
                          </span>
                          <span className="report-project-tag">
                            <Building2 size={11} /> {reportProj?.name}
                          </span>
                        </div>

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
                        Submitted by {report.submittedBy}
                      </span>

                      <span>
                        <Clock3 size={13} />
                        {report.submittedAt}
                      </span>

                      <span>
                        {report.photos?.length || 0} photo
                        {report.photos?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <button
                    className="report-view-button"
                    onClick={() => navigate(`/reports/${report.id}`)}
                  >
                    View Report
                    <ChevronRight size={17} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* WITHDRAWN REPORTS — BUILDER ONLY */}
      {demoRole === "builder" && (
        <section className="withdrawn-reports-section">
          <div className="withdrawn-reports-header">
            <div>
              <h2>Withdrawn Reports</h2>
              <p>Reports removed from Viewer access in {activeSelectedProject?.name}</p>
            </div>
            <span className="withdrawn-count">{withdrawnReports}</span>
          </div>

          {withdrawnReports === 0 ? (
            <div className="withdrawn-empty">
              No withdrawn reports for this project.
            </div>
          ) : (
            <div className="reports-list">
              {projectFilteredReports
                .filter((report) => report.status === "withdrawn")
                .map((report) => (
                  <div className="report-list-card" key={report.id}>
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

                        <span className="report-status">Withdrawn</span>
                      </div>

                      <p>{report.location}</p>

                      <div className="report-meta">
                        <span>
                          Withdrawn by {report.withdrawnBy || "Builder"}
                        </span>
                        <span>
                          {report.withdrawalReason || "No reason recorded"}
                        </span>
                      </div>
                    </div>

                    <button
                      className="report-view-button"
                      onClick={() => navigate(`/reports/${report.id}`)}
                    >
                      View Report
                      <ChevronRight size={17} />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
