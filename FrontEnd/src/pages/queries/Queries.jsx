import { useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Clock,
  CheckCircle2,
  Building2,
  Layers,
  MapPin,
  AlertTriangle,
  Plus,
  X,
  Tag,
  HelpCircle,
  Info,
  Check,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const WORK_CATEGORIES = [
  {
    value: "Civil & Structural Work",
    label: "Civil & Structural Work",
    detail: "Foundation, RCC Columns, Beams, Slabs & Block Masonry",
  },
  {
    value: "Electrical & Power Systems",
    label: "Electrical & Power Systems",
    detail: "Conduits, Wiring, DB Panels, Meter Room & Substation",
  },
  {
    value: "Plumbing, Drainage & Sanitary",
    label: "Plumbing, Drainage & Sanitary",
    detail: "Pipes, Risers, Drainage, Water Supply & Pressure Testing",
  },
  {
    value: "Plastering, Tilework & Flooring",
    label: "Plastering, Tilework & Flooring",
    detail: "Internal Plaster, Wall Putty, Floor Tiles & Waterproofing",
  },
  {
    value: "Doors, Windows & Fabrication",
    label: "Doors, Windows & Fabrication",
    detail: "Aluminium Glazing, Frames, Balcony Railings & Grills",
  },
  {
    value: "Schedule, Progress & Handover",
    label: "Schedule, Progress & Handover",
    detail: "Timeline Questions, Delay Verification & Possession Inquiries",
  },
  {
    value: "Materials & Quality Specifications",
    label: "Materials & Quality Specifications",
    detail: "Cement Grade, AAC Block Specs, Brand Approvals & Lab Tests",
  },
  {
    value: "General Project Query",
    label: "General Project Query",
    detail: "Amenities, Site Access, Layout or Administrative Clarifications",
  },
];

const QUERY_TYPES = [
  "Inquiry / Clarification",
  "Site Observation / Concern",
  "Timeline & Handover Concern",
  "Customization / Modification Request",
  "Material Specification Check",
];

export default function Queries() {
  const { demoRole, queries = [], addQuery, respondToQuery, project, projects = [] } = useApp();
  const [search, setSearch] = useState("");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [queryProject, setQueryProject] = useState(project?.id || "private-001");
  const [workType, setWorkType] = useState("Civil & Structural Work");
  const [buildingWing, setBuildingWing] = useState("Block A");
  const [floorUnit, setFloorUnit] = useState("");
  const [queryType, setQueryType] = useState("Inquiry / Clarification");
  const [priority, setPriority] = useState("Normal");
  const [querySubject, setQuerySubject] = useState("");
  const [queryMessage, setQueryMessage] = useState("");

  // Response State (for Builder)
  const [activeQueryId, setActiveQueryId] = useState(null);
  const [responseText, setResponseText] = useState("");

  const isBuilder = demoRole === "builder";

  // Filter queries
  const filteredQueries = queries.filter((query) => {
    // Project filter
    if (selectedProjectFilter !== "all" && query.projectId !== selectedProjectFilter) {
      return false;
    }
    // Status filter
    if (selectedStatusFilter === "pending" && query.status === "Responded") {
      return false;
    }
    if (selectedStatusFilter === "responded" && query.status !== "Responded") {
      return false;
    }
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSubject = query.subject?.toLowerCase().includes(q);
      const matchMessage = query.message?.toLowerCase().includes(q);
      const matchWork = query.workType?.toLowerCase().includes(q);
      const matchProject = query.projectName?.toLowerCase().includes(q);
      const matchLoc = query.location?.toLowerCase().includes(q);
      return matchSubject || matchMessage || matchWork || matchProject || matchLoc;
    }
    return true;
  });

  const totalCount = queries.length;
  const pendingCount = queries.filter((q) => q.status !== "Responded").length;
  const respondedCount = queries.filter((q) => q.status === "Responded").length;

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!querySubject.trim() || !queryMessage.trim()) return;

    const chosenProj = projects.find((p) => p.id === queryProject) || project;

    const formattedLocation = [buildingWing, floorUnit].filter(Boolean).join(" — ") || "General Site Area";

    addQuery({
      projectId: queryProject,
      projectName: chosenProj?.name || "Riverside Residence",
      workType,
      location: formattedLocation,
      buildingWing,
      floorUnit,
      queryType,
      priority,
      subject: querySubject.trim(),
      message: queryMessage.trim(),
    });

    // Reset & close
    setShowForm(false);
    setQuerySubject("");
    setQueryMessage("");
    setFloorUnit("");
    setPriority("Normal");
  }

  return (
    <div className="queries-page">
      {/* ── HEADER ── */}
      <div className="queries-header">
        <div>
          <span className="page-eyebrow">PROJECT COMMUNICATION</span>
          <h2>{isBuilder ? "Viewer Queries & Requests" : "Project Queries"}</h2>
          <p>
            {isBuilder
              ? "Review site inquiries submitted by viewers with specific project, work category, and unit context."
              : "Ask the Builder specific questions regarding project progress, work categories, quality, and possession timelines."}
          </p>
        </div>

        {!isBuilder && (
          <button
            type="button"
            className="primary-button query-cta-btn"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            Submit Query
          </button>
        )}
      </div>

      {/* ── STATS SUMMARY STRIP ── */}
      <div className="queries-summary">
        <div className="queries-summary-card">
          <div className="qs-icon-box total">
            <MessageSquare size={18} />
          </div>
          <div>
            <span>Total Queries</span>
            <strong>{totalCount}</strong>
          </div>
        </div>

        <div className="queries-summary-card">
          <div className="qs-icon-box pending">
            <Clock size={18} />
          </div>
          <div>
            <span>Awaiting Response</span>
            <strong className="text-amber">{pendingCount}</strong>
          </div>
        </div>

        <div className="queries-summary-card">
          <div className="qs-icon-box resolved">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <span>Responded</span>
            <strong className="text-green">{respondedCount}</strong>
          </div>
        </div>
      </div>

      {/* ── MAIN QUERIES PANEL ── */}
      <section className="queries-panel">
        <div className="queries-panel-header">
          <div>
            <h3>{isBuilder ? "Incoming Queries" : "My Queries"}</h3>
            <p>
              {isBuilder
                ? "Showing questions with project and work category context"
                : "Questions submitted to the Builder with responses"}
            </p>
          </div>

          <div className="queries-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by work kind, unit, or question..."
            />
          </div>
        </div>

        {/* ── FILTER CONTROLS ── */}
        <div className="queries-filter-bar">
          <div className="qf-group">
            <span className="qf-label">Project:</span>
            <button
              type="button"
              className={`qf-pill ${selectedProjectFilter === "all" ? "active" : ""}`}
              onClick={() => setSelectedProjectFilter("all")}
            >
              All Projects ({queries.length})
            </button>
            {projects.map((p) => {
              const count = queries.filter((q) => q.projectId === p.id).length;
              return (
                <button
                  type="button"
                  key={p.id}
                  className={`qf-pill ${selectedProjectFilter === p.id ? "active" : ""}`}
                  onClick={() => setSelectedProjectFilter(p.id)}
                >
                  {p.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="qf-group">
            <span className="qf-label">Status:</span>
            <button
              type="button"
              className={`qf-pill ${selectedStatusFilter === "all" ? "active" : ""}`}
              onClick={() => setSelectedStatusFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className={`qf-pill ${selectedStatusFilter === "pending" ? "active" : ""}`}
              onClick={() => setSelectedStatusFilter("pending")}
            >
              Awaiting ({pendingCount})
            </button>
            <button
              type="button"
              className={`qf-pill ${selectedStatusFilter === "responded" ? "active" : ""}`}
              onClick={() => setSelectedStatusFilter("responded")}
            >
              Responded ({respondedCount})
            </button>
          </div>
        </div>

        {/* ── QUERIES LIST ── */}
        {filteredQueries.length === 0 ? (
          <div className="queries-empty">
            <MessageSquare size={32} />
            <strong>No queries found</strong>
            <p>
              {search.trim()
                ? "No queries match your search filter."
                : "There are currently no queries for this selection."}
            </p>
            {!isBuilder && (
              <button
                type="button"
                className="primary-button"
                style={{ marginTop: "12px" }}
                onClick={() => setShowForm(true)}
              >
                <Plus size={15} /> Submit a Project Query
              </button>
            )}
          </div>
        ) : (
          <div className="queries-list">
            {filteredQueries.map((query) => {
              const isPending = query.status !== "Responded";

              return (
                <div className="queries-card" key={query.id}>
                  {/* Card Header with Specific Badges */}
                  <div className="qc-header">
                    <div className="qc-badges-row">
                      <span className="qc-id">{query.id}</span>

                      {/* Project Badge */}
                      <span className="qc-badge project">
                        <Building2 size={11} />
                        {query.projectName}
                      </span>

                      {/* Kind of Work Badge */}
                      <span className="qc-badge work-type">
                        <Layers size={11} />
                        {query.workType}
                      </span>

                      {/* Location Badge */}
                      {query.location && (
                        <span className="qc-badge location">
                          <MapPin size={11} />
                          {query.location}
                        </span>
                      )}

                      {/* Query Type Badge */}
                      {query.queryType && (
                        <span className="qc-badge query-type">
                          <Tag size={10} />
                          {query.queryType}
                        </span>
                      )}

                      {/* Priority Tag */}
                      {query.priority === "High" && (
                        <span className="qc-priority-high">
                          <AlertTriangle size={11} /> High Urgency
                        </span>
                      )}
                    </div>

                    <span className={`qc-status-pill ${isPending ? "pending" : "resolved"}`}>
                      {isPending ? (
                        <>
                          <Clock size={12} /> Awaiting Builder Response
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} /> Responded
                        </>
                      )}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div className="qc-content">
                    <h4>{query.subject}</h4>
                    <p>{query.message}</p>
                  </div>

                  <div className="qc-footer-meta">
                    <span>
                      Submitted by <strong>{query.submittedBy}</strong>
                    </span>
                    <span>•</span>
                    <span>{query.submittedAt}</span>
                  </div>

                  {/* Builder Response Box */}
                  {query.response && (
                    <div className="query-response-box">
                      <div className="qrb-header">
                        <div className="qrb-title">
                          <CheckCircle2 size={15} className="text-green" />
                          <strong>Builder Response</strong>
                        </div>
                        <span className="qrb-meta">
                          {query.respondedBy || "Rahul Sharma (Builder)"} • {query.respondedAt}
                        </span>
                      </div>
                      <p>{query.response}</p>
                    </div>
                  )}

                  {/* Builder Action to Reply */}
                  {isBuilder && !query.response && (
                    <div className="query-reply-section">
                      {activeQueryId === query.id ? (
                        <form
                          className="query-reply-form"
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!responseText.trim()) return;
                            respondToQuery(query.id, responseText.trim());
                            setActiveQueryId(null);
                            setResponseText("");
                          }}
                        >
                          <label>Reply to Viewer regarding this {query.workType} query:</label>
                          <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Enter detailed clarification, site team feedback, or schedule mitigation..."
                            rows={3}
                            required
                            autoFocus
                          />
                          <div className="qrf-actions">
                            <button type="submit" className="primary-button">
                              <Send size={15} />
                              Send Response
                            </button>
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => {
                                setActiveQueryId(null);
                                setResponseText("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          type="button"
                          className="primary-button btn-reply"
                          onClick={() => setActiveQueryId(query.id)}
                        >
                          <Send size={14} />
                          Reply as Builder
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── MODAL: SUBMIT QUERY (VIEWER POV) ── */}
      {showForm && (
        <div className="team-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="team-modal query-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="team-modal-header">
              <div>
                <span className="modal-eyebrow">VIEWER COMMUNICATION</span>
                <h3>Submit Project Query to Builder</h3>
                <p>
                  Specify the project, exact kind of work, and location so the Builder has full context to respond.
                </p>
              </div>
              <button
                type="button"
                className="team-modal-close"
                onClick={() => setShowForm(false)}
                aria-label="Close query form"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="query-submit-form">
              {/* Field 1: Project Selection */}
              <div className="qform-row">
                <div className="qform-field full">
                  <label>
                    <Building2 size={13} /> Select Project *
                  </label>
                  <select
                    value={queryProject}
                    onChange={(e) => setQueryProject(e.target.value)}
                    required
                  >
                    {projects.map((p) => (
                      <option value={p.id} key={p.id}>
                        {p.name} — {p.location} (Private Project)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 2: Kind of Work */}
              <div className="qform-row">
                <div className="qform-field full">
                  <label>
                    <Layers size={13} /> Kind of Construction Work *
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    required
                  >
                    {WORK_CATEGORIES.map((cat) => (
                      <option value={cat.value} key={cat.value}>
                        {cat.label} — {cat.detail}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Field 3: Specific Location (Building + Floor/Unit) */}
              <div className="qform-row two-col">
                <div className="qform-field">
                  <label>
                    <MapPin size={13} /> Building / Wing / Block *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Block A, Tower 1, Villa 3"
                    value={buildingWing}
                    onChange={(e) => setBuildingWing(e.target.value)}
                    required
                  />
                </div>

                <div className="qform-field">
                  <label>
                    <MapPin size={13} /> Floor / Unit / Flat No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4th Floor · Flat 402, Ground Lobby"
                    value={floorUnit}
                    onChange={(e) => setFloorUnit(e.target.value)}
                  />
                </div>
              </div>

              {/* Field 4: Query Type & Urgency */}
              <div className="qform-row two-col">
                <div className="qform-field">
                  <label>
                    <HelpCircle size={13} /> Query Nature
                  </label>
                  <select
                    value={queryType}
                    onChange={(e) => setQueryType(e.target.value)}
                  >
                    {QUERY_TYPES.map((t) => (
                      <option value={t} key={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="qform-field">
                  <label>
                    <AlertTriangle size={13} /> Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Normal">Normal Inquiry</option>
                    <option value="High">High Urgency (Needs Prompt Attention)</option>
                  </select>
                </div>
              </div>

              {/* Field 5: Subject */}
              <div className="qform-row">
                <div className="qform-field full">
                  <label>Query Subject *</label>
                  <input
                    type="text"
                    placeholder="e.g. Clarification on electrical conduit delay & possession timeline"
                    value={querySubject}
                    onChange={(e) => setQuerySubject(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Field 6: Detailed Question */}
              <div className="qform-row">
                <div className="qform-field full">
                  <label>Detailed Question / Observation *</label>
                  <textarea
                    placeholder="Provide specific details about your query, observation, or question so the Builder can coordinate with site engineers..."
                    value={queryMessage}
                    onChange={(e) => setQueryMessage(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Informational Callout */}
              <div className="query-info-callout">
                <Info size={16} />
                <span>
                  <strong>Builder Context:</strong> Providing exact project details, work kind, and unit location helps the Builder quickly inspect site logs and provide an accurate answer.
                </span>
              </div>

              {/* Actions */}
              <div className="team-modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Send size={15} />
                  Submit Query to Builder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
