import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Layers,
  ClipboardList,
  Users,
  Camera,
  MapPin,
  TrendingUp,
  MessageSquare,
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { handleImageError, FALLBACK_CONSTRUCTION_IMAGE } from "../../utils/imageUtils";

// ─── mock floor list ──────────────────────────────────────────────────────────
const FLOORS = [
  "Basement",
  "Ground Floor",
  "First Floor",
  "Second Floor",
  "Third Floor",
  "Roof / Terrace",
];

const ACTIVITIES = [
  "Excavation in Soft Rock",
  "Excavation in Hard Rock",
  "PCC for Footing",
  "Footing Reinforcement Work",
  "Footing Concreting",
  "Plinth Beam Reinforcement",
  "Plinth Beam Concreting",
  "Reinforcement of Slab, Column & Beams",
  "Concreting of Slab, Column & Beams",
  "Brickwork (B/w AAC Blocks)",
  "Internal Plastering",
  "External Plastering & Elevation",
  "Electrical Work & Conduits",
  "Plumbing & Drainage",
  "Waterproofing (Terrace & Wet Areas)",
  "Paint Work (Putty, Primer, Paint)",
  "Services (Downtake Plumbing, Fire, Lift)",
  "Tiling & Flooring",
  "Shuttering / Formwork",
  "Backfilling & Compaction",
  "Other",
];

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepDot({ step, currentStep, label }) {
  const done = currentStep > step;
  const active = currentStep === step;
  return (
    <div className={`sr-step ${active ? "sr-step--active" : ""} ${done ? "sr-step--done" : ""}`}>
      <div className="sr-step-dot">
        {done ? <CheckCircle2 size={14} /> : <span>{step}</span>}
      </div>
      <span className="sr-step-label">{label}</span>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function FormSection({ icon: Icon, step, title, children }) {
  return (
    <section className="sr-section">
      <div className="sr-section-header">
        <span className="sr-section-icon">
          <Icon size={17} />
        </span>
        <div>
          <span className="sr-section-step">STEP {step}</span>
          <h3 className="sr-section-title">{title}</h3>
        </div>
      </div>
      <div className="sr-section-body">{children}</div>
    </section>
  );
}

// ─── Geo-tagged photo card ────────────────────────────────────────────────────
function PhotoCard({ photo, index, onRemove }) {
  return (
    <div className="sr-photo-card">
      <img
        src={photo.preview || FALLBACK_CONSTRUCTION_IMAGE}
        alt={`Site photo ${index + 1}`}
        className="sr-photo-img"
        onError={handleImageError}
      />
      <div className="sr-photo-meta">
        <div className="sr-photo-coords">
          <MapPin size={12} />
          {photo.coords
            ? `${photo.coords.lat.toFixed(5)}, ${photo.coords.lng.toFixed(5)}`
            : "Location not captured"}
        </div>
        <span className="sr-photo-label">Photo {index + 1}</span>
      </div>
      <button
        type="button"
        className="sr-photo-remove"
        onClick={() => onRemove(index)}
        aria-label="Remove photo"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SubmitReport() {
  const navigate = useNavigate();
  const { project, submitReport, user } = useApp();
  const fileRef = useRef(null);

  // form state
  const [form, setForm] = useState({
    buildingName: project?.name || "Riverside Residence",
    floor: "",
    activity: "",
    labourCount: "",
    progressPercent: "",
    progressNote: "",
    feedback: "",
  });

  const [photos, setPhotos] = useState([]);
  const [geoStatus, setGeoStatus] = useState("idle"); // idle | fetching | ok | denied
  const [pendingCoords, setPendingCoords] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // ── geo ────────────────────────────────────────────────────────────────────
  function requestGeo() {
    setGeoStatus("fetching");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPendingCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setGeoStatus("ok");
      },
      () => setGeoStatus("denied"),
      { timeout: 10000 }
    );
  }

  // ── photos ─────────────────────────────────────────────────────────────────
  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotos((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            file,
            preview: ev.target.result,
            coords: pendingCoords,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
    setErrors((er) => ({ ...er, photos: undefined }));
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  // ── validation ─────────────────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!form.buildingName.trim()) errs.buildingName = "Building name is required.";
    if (!form.floor) errs.floor = "Select a floor.";
    if (!form.activity) errs.activity = "Select an activity.";
    if (!form.labourCount || isNaN(form.labourCount) || Number(form.labourCount) < 0)
      errs.labourCount = "Enter a valid labour count.";
    if (photos.length === 0) errs.photos = "At least one site photograph is required.";
    if (!form.progressPercent || isNaN(form.progressPercent))
      errs.progressPercent = "Enter progress as a number (0–100).";
    return errs;
  }

  // ── submit ─────────────────────────────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`sr-${firstKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    // Simulate async submit
    setTimeout(() => {
      const newReport = {
        title: `${form.activity} — ${form.floor}`,
        location: `${form.buildingName} — ${form.floor}`,
        buildingName: form.buildingName,
        floor: form.floor,
        activity: form.activity,
        labourCount: Number(form.labourCount),
        progressPercent: Number(form.progressPercent),
        progressNote: form.progressNote,
        description: form.progressNote || `${form.activity} completed on ${form.floor} for ${form.buildingName}.`,
        feedback: form.feedback,
        status: "engineer_review",
        photos: photos.map((p, i) => ({
          id: i + 1,
          label: `${form.activity} — Photo ${i + 1}`,
          url: p.preview || FALLBACK_CONSTRUCTION_IMAGE,
          coords: p.coords,
        })),
      };

      submitReport(newReport, form, user);
      setSubmitting(false);
      setSubmitted(true);
    }, 1000);
  }

  // ── success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="sr-success">
        <div className="sr-success-icon">
          <CheckCircle2 size={44} />
        </div>
        <h2>Report Submitted</h2>
        <p>
          Your site report for <strong>{form.buildingName} — {form.floor}</strong> has been
          submitted and is now in the Engineer's review queue.
        </p>
        <div className="sr-success-actions">
          <button
            className="primary-button"
            onClick={() => navigate("/contractor-reports")}
          >
            View My Reports
          </button>
          <button
            className="secondary-button"
            onClick={() => {
              setSubmitted(false);
              setForm({
                buildingName: project?.name || "Riverside Residence",
                floor: "",
                activity: "",
                labourCount: "",
                progressPercent: "",
                progressNote: "",
                feedback: "",
              });
              setPhotos([]);
              setGeoStatus("idle");
              setPendingCoords(null);
            }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  const progress = Number(form.progressPercent) || 0;

  return (
    <div className="sr-page">
      {/* Back */}
      <button
        type="button"
        className="workspace-back-button"
        onClick={() => navigate("/contractor-reports")}
      >
        <ArrowLeft size={16} />
        Back to My Reports
      </button>

      {/* Header */}
      <div className="sr-header">
        <div>
          <span className="page-eyebrow">CONTRACTOR WORKSPACE</span>
          <h2>Submit Daily Site Report</h2>
          <p>
            Fill in all required fields. Photographs with location coordinates are
            mandatory — use your mobile camera for best results.
          </p>
        </div>
      </div>

      {/* Step bar */}
      <div className="sr-steps">
        <StepDot step={1} currentStep={form.buildingName && form.floor && form.activity ? 2 : 1} label="Location" />
        <div className="sr-steps-divider" />
        <StepDot step={2} currentStep={form.labourCount ? 3 : form.buildingName && form.floor && form.activity ? 2 : 1} label="Labour" />
        <div className="sr-steps-divider" />
        <StepDot step={3} currentStep={photos.length > 0 ? 4 : form.labourCount ? 3 : 1} label="Photos" />
        <div className="sr-steps-divider" />
        <StepDot step={4} currentStep={form.progressPercent ? 5 : photos.length > 0 ? 4 : 1} label="Progress" />
        <div className="sr-steps-divider" />
        <StepDot step={5} currentStep={5} label="Submit" />
      </div>

      <form className="sr-form" onSubmit={handleSubmit} noValidate>

        {/* ── STEP 1: Location ────────────────────────────────────────────── */}
        <FormSection icon={Building2} step={1} title="Building & Location">
          <div className="sr-field-row">
            {/* Building name */}
            <div className="sr-field" id="sr-buildingName">
              <label htmlFor="buildingName">
                Building Name <span className="sr-required">*</span>
              </label>
              <input
                id="buildingName"
                type="text"
                placeholder="e.g. Riverside Residence"
                value={form.buildingName}
                onChange={(e) => field("buildingName", e.target.value)}
                className={errors.buildingName ? "sr-input-error" : ""}
              />
              {errors.buildingName && (
                <span className="sr-error">{errors.buildingName}</span>
              )}
            </div>

            {/* Floor */}
            <div className="sr-field" id="sr-floor">
              <label htmlFor="floor">
                Floor / Level <span className="sr-required">*</span>
              </label>
              <div className="sr-select-wrap">
                <select
                  id="floor"
                  value={form.floor}
                  onChange={(e) => field("floor", e.target.value)}
                  className={errors.floor ? "sr-input-error" : ""}
                >
                  <option value="">Select floor…</option>
                  {FLOORS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="sr-select-icon" />
              </div>
              {errors.floor && <span className="sr-error">{errors.floor}</span>}
            </div>
          </div>

          {/* Activity */}
          <div className="sr-field" id="sr-activity">
            <label htmlFor="activity">
              Activity / Task Name <span className="sr-required">*</span>
            </label>
            <div className="sr-select-wrap">
              <select
                id="activity"
                value={form.activity}
                onChange={(e) => field("activity", e.target.value)}
                className={errors.activity ? "sr-input-error" : ""}
              >
                <option value="">Select activity…</option>
                {ACTIVITIES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <ChevronDown size={15} className="sr-select-icon" />
            </div>
            {errors.activity && <span className="sr-error">{errors.activity}</span>}
          </div>
        </FormSection>

        {/* ── STEP 2: Labour ──────────────────────────────────────────────── */}
        <FormSection icon={Users} step={2} title="Daily Attendance & Labour">
          <div className="sr-field-row">
            <div className="sr-field" id="sr-labourCount">
              <label htmlFor="labourCount">
                Total Workers on Site Today <span className="sr-required">*</span>
              </label>
              <input
                id="labourCount"
                type="number"
                min="0"
                placeholder="e.g. 24"
                value={form.labourCount}
                onChange={(e) => field("labourCount", e.target.value)}
                className={errors.labourCount ? "sr-input-error" : ""}
              />
              {errors.labourCount && (
                <span className="sr-error">{errors.labourCount}</span>
              )}
              <span className="sr-hint">Include both skilled and unskilled workers.</span>
            </div>
          </div>
        </FormSection>

        {/* ── STEP 3: Photos ──────────────────────────────────────────────── */}
        <FormSection icon={Camera} step={3} title="Site Photographs with Location">
          {/* Geo capture */}
          <div className="sr-geo-bar">
            <div className="sr-geo-info">
              <MapPin size={15} />
              <div>
                <strong>Location Coordinates</strong>
                <span>
                  {geoStatus === "idle" && "Capture your GPS location before adding photos."}
                  {geoStatus === "fetching" && "Getting your location…"}
                  {geoStatus === "ok" &&
                    `Captured: ${pendingCoords.lat.toFixed(5)}, ${pendingCoords.lng.toFixed(5)} (±${Math.round(pendingCoords.accuracy)}m)`}
                  {geoStatus === "denied" && "Location access denied. Photos will be added without coordinates."}
                </span>
              </div>
            </div>
            <button
              type="button"
              className={`sr-geo-btn ${geoStatus === "ok" ? "sr-geo-btn--ok" : ""}`}
              onClick={requestGeo}
              disabled={geoStatus === "fetching"}
            >
              {geoStatus === "fetching" ? (
                <><Loader2 size={14} className="sr-spin" /> Getting location…</>
              ) : geoStatus === "ok" ? (
                <><CheckCircle2 size={14} /> Location captured</>
              ) : (
                <><MapPin size={14} /> Capture Location</>
              )}
            </button>
          </div>

          <div className="sr-photos-area" id="sr-photos">
            {photos.length > 0 && (
              <div className="sr-photo-grid">
                {photos.map((photo, i) => (
                  <PhotoCard key={photo.id} photo={photo} index={i} onRemove={removePhoto} />
                ))}
              </div>
            )}

            <button
              type="button"
              className={`sr-photo-upload ${errors.photos ? "sr-photo-upload--error" : ""}`}
              onClick={() => fileRef.current?.click()}
            >
              <Camera size={26} />
              <strong>Add Photos</strong>
              <span>
                {geoStatus === "ok"
                  ? "Photos will be tagged with your current location"
                  : "Capture location first for geo-tagged photos"}
              </span>
              <span className="sr-photo-hint">
                <Upload size={13} /> Tap to select from camera or gallery
              </span>
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {errors.photos && (
            <span className="sr-error sr-error--block">
              <AlertCircle size={13} /> {errors.photos}
            </span>
          )}

          <p className="sr-hint sr-hint--mt">
            Photographs must show actual on-site work progress. Minimum 1 photo required.
          </p>
        </FormSection>

        {/* ── STEP 4: Progress ────────────────────────────────────────────── */}
        <FormSection icon={TrendingUp} step={4} title="Progress Information">
          <div className="sr-field" id="sr-progressPercent">
            <label htmlFor="progressPercent">
              Activity Completion (%) <span className="sr-required">*</span>
            </label>
            <div className="sr-progress-field">
              <input
                id="progressPercent"
                type="range"
                min="0"
                max="100"
                step="5"
                value={form.progressPercent || 0}
                onChange={(e) => field("progressPercent", e.target.value)}
                className="sr-range"
              />
              <span className="sr-progress-value">{form.progressPercent || 0}%</span>
            </div>
            <div className="sr-progress-track-preview">
              <div
                className="sr-progress-track-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            {errors.progressPercent && (
              <span className="sr-error">{errors.progressPercent}</span>
            )}
          </div>

          <div className="sr-field">
            <label htmlFor="progressNote">Progress Notes</label>
            <textarea
              id="progressNote"
              placeholder="Describe what was accomplished today, any blockers, quality observations…"
              rows={3}
              value={form.progressNote}
              onChange={(e) => field("progressNote", e.target.value)}
            />
            <span className="sr-hint">Optional but recommended for Engineer review.</span>
          </div>
        </FormSection>

        {/* ── STEP 5: Feedback / Instructions ─────────────────────────────── */}
        <FormSection icon={MessageSquare} step={5} title="Feedback / Instructions">
          <div className="sr-field">
            <label htmlFor="feedback">
              Additional Notes or Instructions
            </label>
            <textarea
              id="feedback"
              placeholder="Any specific issues, safety observations, material shortages, or instructions from site supervisor…"
              rows={4}
              value={form.feedback}
              onChange={(e) => field("feedback", e.target.value)}
            />
            <span className="sr-hint">
              This will be visible to the Engineer and Builder during review.
            </span>
          </div>
        </FormSection>

        {/* ── Summary & submit ─────────────────────────────────────────────── */}
        <div className="sr-submit-bar">
          <div className="sr-submit-summary">
            <span className="sr-required-note">
              <AlertCircle size={13} /> All fields marked * are mandatory.
            </span>
            {Object.keys(errors).length > 0 && (
              <span className="sr-error">
                Please fix the highlighted errors above before submitting.
              </span>
            )}
          </div>

          <div className="sr-submit-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/contractor-reports")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button sr-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <><Loader2 size={16} className="sr-spin" /> Submitting…</>
              ) : (
                <>Submit Report</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
