import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock3,
  User,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  Eye,

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
  if (status === "published" || status === "approved") {
    return "status-approved";
  }

  if (status === "declined") {
    return "status-declined";
  }

  return "status-review";
}

export default function ReportDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const {
  demoRole,
  reports,
  approveReport,
  declineReport,
  builderApproveReport,
  builderDeclineReport,
  publishReport,
  withdrawReport,
  resubmitReport,
  republishReport,
} = useApp();

  const report = reports.find(
    (item) => item.id === reportId
  );

  const [selectedPhotoIndex, setSelectedPhotoIndex] =
    useState(0);

  const [showPhotoViewer, setShowPhotoViewer] =
    useState(false);

  const [feedback, setFeedback] = useState("");

  if (!report) {
    return (
      <div className="placeholder-page">
        <p className="eyebrow">REPORT NOT FOUND</p>

        <h2>We couldn't find this report.</h2>

        <button
          className="primary-button"
          onClick={() => navigate("/reports")}
        >
          Back to Reports
        </button>
      </div>
    );
  }

  const selectedPhoto =
    report.photos[selectedPhotoIndex];

  const canEngineerReview =
    demoRole === "engineer" &&
    report.status === "engineer_review";

  const canBuilderReview =
    demoRole === "builder" &&
    report.status === "builder_review";
  
  const canPublish = 
        demoRole === "builder" && report.status === "ready_to_publish";

  const canWithdraw =
  demoRole === "builder" && report.status === "published";

  const canRepublish =
  demoRole === "builder" && report.status === "withdrawn";


  const canContractorResubmit =
  demoRole === "contractor" &&
  (report.status === "contractor_revision" ||
    report.status === "engineer_revision");

  const isContractor =
    demoRole === "contractor";

  const isProjectManager =
    demoRole === "projectManager";

  const isViewer =
    demoRole === "viewer";

  function nextPhoto() {
    setSelectedPhotoIndex(
      (current) =>
        (current + 1) % report.photos.length
    );
  }

  function previousPhoto() {
    setSelectedPhotoIndex(
      (current) =>
        (current - 1 + report.photos.length) %
        report.photos.length
    );
  }

  return (
    <div className="report-detail-page">

      {/* BACK */}

      <button
        className="workspace-back-button"
        onClick={() => navigate("/reports")}
      >
        <ArrowLeft size={16} />
        Back to Reports
      </button>

      {/* HEADER */}

      <section className="report-detail-header">

        <div>
          <span className="report-id">
            REPORT #{report.id}
          </span>

          <h2>{report.title}</h2>

          <p className="report-header-location">
            <MapPin size={15} />
            {report.location}
          </p>
        </div>

        <span
          className={`report-detail-status ${getStatusClass(
            report.status
          )}`}
        >
          {getStatusLabel(report.status)}
        </span>

      </section>

      {/* PHOTO EVIDENCE */}

      <section className="panel report-evidence-panel">

        <div className="panel-header">

          <div>
            <span className="panel-label">
              SITE EVIDENCE
            </span>

            <h3>Construction Photos</h3>
          </div>

          <span className="photo-count">
            {report.photos.length}{" "}
            {report.photos.length === 1
              ? "photo"
              : "photos"}
          </span>

        </div>

        <div className="evidence-viewer">

          <button
            className="evidence-main-photo"
            onClick={() =>
              setShowPhotoViewer(true)
            }
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.label}
            />

            <span className="photo-expand-hint">
              Click to inspect photo
            </span>
          </button>

          {report.photos.length > 1 && (
            <div className="evidence-thumbnails">

              <button
                className="photo-arrow"
                onClick={previousPhoto}
                aria-label="Previous photo"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="thumbnail-list">

                {report.photos.map(
                  (photo, index) => (
                    <button
                      key={photo.id}
                      className={`photo-thumbnail ${
                        index ===
                        selectedPhotoIndex
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedPhotoIndex(
                          index
                        )
                      }
                    >
                      <img
                        src={photo.url}
                        alt={photo.label}
                      />

                      <span>
                        {index + 1}
                      </span>
                    </button>
                  )
                )}

              </div>

              <button
                className="photo-arrow"
                onClick={nextPhoto}
                aria-label="Next photo"
              >
                <ChevronRight size={18} />
              </button>

            </div>
          )}

        </div>

      </section>

      {/* INFORMATION */}

      <section className="report-detail-grid">

        <div className="panel">

          <div className="panel-header">

            <div>
              <span className="panel-label">
                REPORT DETAILS
              </span>

              <h3>Work Information</h3>
            </div>

          </div>

          <div className="report-information">

            <FileDetail
              icon={<User size={17} />}
              label="Submitted by"
              value={report.submittedBy}
            />

            <FileDetail
              icon={<Clock3 size={17} />}
              label="Submitted"
              value={report.submittedAt}
            />

            <FileDetail
              icon={<MapPin size={17} />}
              label="Site location"
              value={report.location}
            />

          </div>

          <div className="report-description">

            <span>WORK DESCRIPTION</span>

            <p>{report.description}</p>

          </div>

        </div>

        {/* TIMELINE */}

        <div className="panel">

          <div className="panel-header">

            <div>
              <span className="panel-label">
                WORKFLOW
              </span>

              <h3>Approval Timeline</h3>
            </div>

          </div>

          <ReviewTimeline
            status={report.status}
          />

        </div>

      </section>

      {/* ROLE-SPECIFIC ACTION */}

      {canEngineerReview && (
        <ReviewActionPanel
          title="Engineer Review"
          eyebrow="ACTION REQUIRED"
          description="Review the construction evidence before approving this contractor submission."
          feedback={feedback}
          setFeedback={setFeedback}
          approveLabel="Approve Report"
          declineLabel="Decline Report"
          onApprove={() => {
            approveReport(report.id, feedback);
            navigate("/review-queue");
          }}
          onDecline={() => {
            declineReport(report.id, feedback);
            navigate("/reports");
          }}
        />
      )}

      {canBuilderReview && (
        <ReviewActionPanel
          title="Builder Approval"
          eyebrow="ACTION REQUIRED"
          description="This report has passed Engineer review and is ready for your final approval."
          feedback={feedback}
          setFeedback={setFeedback}
          approveLabel="Approve"
          declineLabel="Return to Engineer"
          onApprove={() => {
            builderApproveReport(report.id, feedback);
            navigate("/builder-review");
          }}
          onDecline={() => {
            builderDeclineReport(report.id, feedback);
            navigate("/builder-review");
          }}
        />
      )}

        

      {canPublish && (
        <section className="report-action-panel">
          <div className="report-action-panel-header">
            <div>
              <span className="page-eyebrow">READY TO PUBLISH</span>
              <h2>Publish to Viewers</h2>
              <p>
                This report has received final Builder approval and is ready to be
                shared with project viewers.
              </p>
            </div>
          </div>

          <div className="report-action-panel-footer">
            <button
              className="button button-success"
              onClick={() => {
                publishReport(report.id);
                navigate("/builder-review");
              }}
            >
              <CheckCircle2 size={17} />
              Publish to Viewers
            </button>
          </div>
        </section>
      )}

  
      {canWithdraw && (
        <WithdrawReportPanel
          report={report}
          onWithdraw={(reason) => {
            withdrawReport(report.id, reason);
            navigate("/builder-review");
          }}
        />
      )}

      
      {canRepublish && (
        <section className="report-action-panel">
          <div className="report-action-panel-header">
            <div>
              <span className="page-eyebrow">WITHDRAWN REPORT</span>
              <h2>Republish to Viewers</h2>
              <p>
                This will make the report visible to project viewers again.
                Its previous withdrawal record will be retained.
              </p>
            </div>
          </div>

          <div className="report-action-panel-footer">
            <button
              type="button"
              className="button button-success"
              onClick={() => {
                const confirmed = window.confirm(
                  "Are you sure you want to republish this report to viewers?"
                );

                if (!confirmed) return;

                republishReport(report.id);
                navigate("/reports");
              }}
            >
              Republish to Viewers
            </button>
          </div>
        </section>
      )}



      
      {/* CONTRACTOR */}

      {canContractorResubmit && (
        <section className="report-action-panel contractor-resubmit-panel">
          <div className="report-action-panel-header">
            <div>
              <span className="page-eyebrow">ACTION REQUIRED</span>
              <h2>Revise & Resubmit</h2>
              <p>
                Review the feedback below, make the required corrections, and
                resubmit this report for Engineer review.
              </p>
            </div>
          </div>

          {report.feedback && (
            <div className="contractor-resubmit-feedback">
              <RotateCcw size={16} />
              <div>
                <strong>Review feedback</strong>
                <p>{report.feedback}</p>
              </div>
            </div>
          )}

          <div className="report-action-panel-footer">
            <button
              className="button button-primary"
              onClick={() => {
                resubmitReport(report.id, report.description);
                navigate("/contractor-reports");
              }}
            >
              <RotateCcw size={17} />
              Resubmit for Review
            </button>
          </div>
        </section>
      )}

      {/* PROJECT MANAGER */}

      {isProjectManager && (
        <section className="panel role-information-panel">

          <span className="panel-label">
            PROJECT MONITORING
          </span>

          <h3>Report Monitoring</h3>

          <div className="monitoring-row">

            <div>
              <span>Current status</span>

              <strong>
                {getStatusLabel(
                  report.status
                )}
              </strong>
            </div>

            <div>
              <span>Submitted by</span>

              <strong>
                {report.submittedBy}
              </strong>
            </div>

            <div>
              <span>Waiting for action</span>

              <strong>
                {report.status ===
                "engineer_review"
                  ? "Engineer"
                  : report.status ===
                    "builder_review"
                  ? "Builder"
                  : "None"}
              </strong>
            </div>

          </div>

        </section>
      )}

      {/* VIEWER */}

      {isViewer && (
        <section className="panel viewer-update-panel">

          <span className="panel-label">
            PROJECT UPDATE
          </span>

          <h3>Construction Update</h3>

          {report.status === "published" ? (
            <div className="viewer-published">

              <CheckCircle2 size={20} />

              <div>
                <strong>
                  Published project update
                </strong>

                <span>
                  This construction report has been
                  approved and published by the
                  project team.
                </span>
              </div>

            </div>
          ) : (
            <div className="viewer-private-message">

              <Eye size={20} />

              <div>
                <strong>
                  This report is not published yet.
                </strong>

                <span>
                  Internal review information is only
                  visible to the project team.
                </span>
              </div>

            </div>
          )}

        </section>
      )}

      

      {/* FULL PHOTO VIEWER */}

      {showPhotoViewer && (
        <div
          className="photo-modal"
          onClick={() =>
            setShowPhotoViewer(false)
          }
        >

          <div
            className="photo-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="photo-modal-close"
              onClick={() =>
                setShowPhotoViewer(false)
              }
            >
              ×
            </button>

            <button
              className="photo-modal-arrow left"
              onClick={previousPhoto}
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.label}
            />

            <button
              className="photo-modal-arrow right"
              onClick={nextPhoto}
            >
              <ChevronRight size={24} />
            </button>

            <div className="photo-modal-caption">
              <strong>
                {selectedPhoto.label}
              </strong>

              <span>
                Photo {selectedPhotoIndex + 1} of{" "}
                {report.photos.length}
              </span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}


function WithdrawReportPanel({ report, onWithdraw }) {
  const [reason, setReason] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  function handleWithdraw() {
    if (!reason.trim()) return;
    onWithdraw(reason.trim());
  }

  return (
    <section className="report-action-panel">
      <div className="report-action-panel-header">
        <div>
          <span className="page-eyebrow">PUBLISHED UPDATE</span>
          <h2>Withdraw from Viewers</h2>
          <p>
            This will remove the report from the Viewer’s published updates.
            The report and its history will remain available to the project team.
          </p>
        </div>
      </div>

      <label className="review-feedback-label">
        Reason for withdrawal
      </label>

      <textarea
        className="review-feedback-input"
        placeholder="Explain why this report needs to be withdrawn..."
        value={reason}
        onChange={(event) => setReason(event.target.value)}
      />

      {!showConfirmation ? (
        <div className="report-action-panel-footer">
          <button
            type="button"
            className="button button-danger"
            disabled={!reason.trim()}
            onClick={() => setShowConfirmation(true)}
          >
            Withdraw from Viewers
          </button>
        </div>
      ) : (
        <div className="report-action-panel-footer">
          <p>Are you sure you want to withdraw this report?</p>
          <button
            type="button"
            className="button button-danger"
            onClick={handleWithdraw}
          >
            Confirm Withdrawal
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => setShowConfirmation(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}

function FileDetail({
  icon,
  label,
  value,
}) {
  return (
    <div className="file-detail">
      {icon}

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function ReviewTimeline({ status }) {
  const engineerDone =
    status !== "engineer_review";

  const builderDone =
    status === "approved" ||
    status === "published";

  const published =
    status === "published";

  return (
    <div className="review-timeline">

      <TimelineItem
        title="Contractor submitted"
        description="Report submitted with site evidence"
        active
      />

      <TimelineItem
        title="Engineer review"
        description={
          engineerDone
            ? "Engineer review completed"
            : "Waiting for Engineer review"
        }
        active={engineerDone}
      />

      <TimelineItem
        title="Builder review"
        description={
          builderDone
            ? "Builder review completed"
            : "Waiting for Builder approval"
        }
        active={builderDone}
      />

      <TimelineItem
        title="Published to viewers"
        description={
          published
            ? "Published project update"
            : "Not published yet"
        }
        active={published}
      />

    </div>
  );
}

function TimelineItem({
  title,
  description,
  active,
}) {
  return (
    <div
      className={`timeline-item ${
        active ? "active" : ""
      }`}
    >
      <div className="timeline-marker" />

      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}

function ReviewActionPanel({
  title,
  eyebrow,
  description,
  feedback,
  setFeedback,
  approveLabel,
  declineLabel,
  onApprove,
  onDecline,
}) {
  return (
    <section className="panel review-action-panel">
      <div className="review-action-header">
        <div>
          <span className="panel-label">
            {eyebrow}
          </span>

          <h3>{title}</h3>

          <p>{description}</p>
        </div>
      </div>

      <label className="review-feedback-label">
        Feedback / review note
      </label>

      <textarea
        className="review-feedback-input"
        placeholder="Add feedback for the report..."
        value={feedback}
        onChange={(event) =>
          setFeedback(event.target.value)
        }
      />

      <div className="review-action-note">
        <span>
          Feedback is optional when approving.
          A reason should be provided when declining.
        </span>
      </div>

      <div className="review-actions">
        <div className="report-action-panel-footer">
          <button
            type="button"
            className="button button-success"
            onClick={onApprove}
          >
            <CheckCircle2 size={17} />
            {approveLabel}
          </button>

          <button
            type="button"
            className="button button-danger"
            disabled={!feedback.trim()}
            onClick={onDecline}
          >
            <XCircle size={17} />
            {declineLabel}
          </button>
        </div>
      </div>
    </section>
  );
}