import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Flag,
  SlidersHorizontal,
  RefreshCw,
  Info,
  Sparkles,
  Layers,
  X,
  Lock,
  Edit3,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { projects } from "../../data/mock";
import { useState } from "react";

const planningMilestones = [
  {
    id: 1,
    name: "Earthwork (Excavation)",
    short: "Earthwork",
    start: "01 Jan 2026",
    end: "08 Jan 2026",
    progress: 100,
    status: "completed",
    scheduleStatus: "on_time",
  },
  {
    id: 2,
    name: "Substructure (SUBSTRUC)",
    short: "Substructure",
    start: "09 Jan 2026",
    end: "30 Jan 2026",
    progress: 100,
    status: "completed",
    scheduleStatus: "on_time",
  },
  {
    id: 3,
    name: "Upto Plinth (Beam)",
    short: "Plinth Beam",
    start: "01 Feb 2026",
    end: "25 Feb 2026",
    progress: 100,
    status: "completed",
    scheduleStatus: "on_time",
  },
  {
    id: 4,
    name: "Superstructure (5 Floors)",
    short: "Superstructure",
    start: "01 Mar 2026",
    end: "30 Sep 2026",
    progress: 74,
    status: "in_progress",
    scheduleStatus: "delayed",
  },
  {
    id: 5,
    name: "MEP & Waterproofing",
    short: "MEP / Waterpr.",
    start: "01 Jul 2026",
    end: "31 Oct 2026",
    progress: 58,
    status: "in_progress",
    scheduleStatus: "delayed",
  },
  {
    id: 6,
    name: "Finishing & Handover",
    short: "Finishing",
    start: "01 Oct 2026",
    end: "01 Jan 2028",
    progress: 15,
    status: "in_progress",
    scheduleStatus: "on_time",
  },
];

const GANTT_START = new Date("2026-01-01T00:00:00Z");
const GANTT_END = new Date("2026-12-31T23:59:59Z");

function getGanttPosition(start, end) {
  if (!start || !end) return { left: 0, width: 0 };
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T23:59:59Z`);

  const totalDuration = GANTT_END.getTime() - GANTT_START.getTime();
  const startOffset = startDate.getTime() - GANTT_START.getTime();
  const duration = endDate.getTime() - startDate.getTime();

  const left = (startOffset / totalDuration) * 100;
  const width = (duration / totalDuration) * 100;

  return {
    left: Math.max(0, Math.min(100, left)),
    width: Math.max(0.6, Math.min(100 - left, width)),
  };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
}

const workItems = [
  {
    id: 1,
    title: "AAC Block Brickwork (B/w - 3rd Floor)",
    location: "Block A — Third Floor",
    owner: "Arjun Patil",
    due: "15 Oct 2026",
    status: "In Progress",
    statusClass: "in-progress",
  },
  {
    id: 2,
    title: "Internal Plastering (1st & 2nd Floor)",
    location: "Block A — Floors 1-2",
    owner: "Arjun Patil",
    due: "20 Oct 2026",
    status: "In Progress",
    statusClass: "in-progress",
  },
  {
    id: 3,
    title: "Terrace Waterproofing & Ponding Test",
    location: "Block A — Roof Terrace",
    owner: "Arjun Patil",
    due: "25 Oct 2026",
    status: "Awaiting Review",
    statusClass: "review",
  },
  {
    id: 4,
    title: "External Downtake Plumbing & Fire Riser",
    location: "External Shafts A & B",
    owner: "Arjun Patil",
    due: "05 Nov 2026",
    status: "Upcoming",
    statusClass: "upcoming",
  },
  {
    id: 5,
    title: "Interior Paint Work (Putty & Primer)",
    location: "Block A — 1st Floor Flats",
    owner: "Arjun Patil",
    due: "20 Nov 2026",
    status: "Upcoming",
    statusClass: "upcoming",
  },
  {
    id: 6,
    title: "Passenger Lift Well Framing & Shaft QA",
    location: "Core Lift Shaft",
    owner: "Arjun Patil",
    due: "15 Dec 2026",
    status: "Upcoming",
    statusClass: "upcoming",
  },
];

function MilestoneIcon({ status }) {
  if (status === "completed") {
    return <CheckCircle2 size={19} />;
  }
  if (status === "in_progress") {
    return <Clock3 size={19} />;
  }
  return <Circle size={19} />;
}

function getRoleContent(role) {
  switch (role) {
    case "builder":
      return {
        eyebrow: "PROJECT MASTER SCHEDULE",
        title: "Progress",
        description:
          "Manage milestone deadlines, monitor construction progress, and adjust task delays.",
        primaryLabel: "Master Timeline",
      };

    case "engineer":
      return {
        eyebrow: "ENGINEERING SCHEDULE",
        title: "Progress",
        description:
          "Review planned construction work and the milestones relevant to engineering review.",
        primaryLabel: "Engineering Milestones",
      };

    case "contractor":
      return {
        eyebrow: "CONSTRUCTION PROGRESS",
        title: "Progress",
        description:
          "Track assigned construction work, upcoming deadlines, and work currently under review.",
        primaryLabel: "Assigned Work",
      };

    case "projectManager":
      return {
        eyebrow: "PROJECT MONITORING",
        title: "Progress",
        description:
          "Monitor project schedule, active work, upcoming milestones, and potential delays.",
        primaryLabel: "Schedule Monitoring",
      };

    case "viewer":
      return {
        eyebrow: "PROJECT PROGRESS",
        title: "Progress",
        description:
          "Follow the major construction milestones and compare expected vs actual completion.",
        primaryLabel: "Construction Timeline",
      };

    default:
      return {
        eyebrow: "PROJECT SCHEDULE",
        title: "Progress",
        description:
          "Track the construction schedule, milestones, and upcoming work across the project.",
        primaryLabel: "Project Timeline",
      };
  }
}

function getVisibleWork(role) {
  if (role === "viewer") return [];
  if (role === "engineer") {
    return workItems.filter(
      (item) =>
        item.status === "Awaiting Review" ||
        item.status === "In Progress"
    );
  }
  if (role === "contractor") {
    return workItems;
  }
  return workItems;
}

function ConstructionGantt({
  canEditSchedule,
  ganttGroups = [],
  updateGanttTaskDelay,
  resetGanttSchedule,
}) {
  const [expandedGroups, setExpandedGroups] = useState(
    ganttGroups.map((group) => group.id)
  );
  const [filterMode, setFilterMode] = useState("all"); // "all" | "delayed" | "ontime"
  const [comparisonMode, setComparisonMode] = useState(true); // show baseline vs actual
  const [showSimulator, setShowSimulator] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("s-masonry");
  const [simDays, setSimDays] = useState(22);
  const [simReason, setSimReason] = useState(
    "Supply chain shortage of AAC blocks & mortar mix delivery lag"
  );
  const [inspectedTask, setInspectedTask] = useState(null);

  function toggleGroup(id) {
    setExpandedGroups((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  // Aggregate statistics
  const allTasks = ganttGroups.flatMap((g) => g.tasks || []);
  const delayedTasks = allTasks.filter((t) => t.scheduleStatus === "delayed");
  const onTimeTasks = allTasks.filter((t) => t.scheduleStatus !== "delayed");
  const totalDelayDays = delayedTasks.reduce(
    (acc, t) => acc + (t.delayDays || 0),
    0
  );

  // Filter groups
  const filteredGroups = ganttGroups.filter((group) => {
    if (filterMode === "delayed") {
      return (
        group.scheduleStatus === "delayed" ||
        (group.tasks || []).some((t) => t.scheduleStatus === "delayed")
      );
    }
    if (filterMode === "ontime") {
      return (
        group.scheduleStatus === "on_time" &&
        (group.tasks || []).every((t) => t.scheduleStatus === "on_time")
      );
    }
    return true;
  });

  return (
    <section className="viewer-gantt-panel">
      {/* HEADER */}
      <div className="viewer-gantt-header">
        <div>
          <div className="viewer-gantt-title-row">
            <p className="section-kicker">CONSTRUCTION TIMELINE</p>
            <span className="gantt-live-pill">
              <span className="gantt-pulse-dot" /> Live Schedule
            </span>

            {canEditSchedule ? (
              <span className="gantt-builder-badge">
                <Edit3 size={11} /> Builder Authoring Enabled
              </span>
            ) : (
              <span className="gantt-readonly-pill">
                <Lock size={11} /> Read-Only (Builder Managed)
              </span>
            )}
          </div>
          <h2>Construction Gantt — Expected vs Actual</h2>
          <p>
            Compare planned milestone targets with current site progress.
            Schedule delays and slippages are highlighted in{" "}
            <strong style={{ color: "var(--red)" }}>red</strong>.
            {!canEditSchedule && " (Only Builder can update or modify schedule delays)"}
          </p>
        </div>

        <div className="viewer-gantt-actions">
          {/* Builder ONLY has authority to alter or simulate delays */}
          {canEditSchedule && (
            <button
              type="button"
              className={`gantt-action-btn ${showSimulator ? "active" : ""}`}
              onClick={() => setShowSimulator(!showSimulator)}
              title="Builder authority: Modify or record task delays"
            >
              <SlidersHorizontal size={14} />
              <span>{showSimulator ? "Close Editor" : "Manage Delays"}</span>
            </button>
          )}

          <button
            type="button"
            className={`gantt-action-btn ${comparisonMode ? "active" : ""}`}
            onClick={() => setComparisonMode(!comparisonMode)}
            title="Toggle Baseline vs Actual comparative view"
          >
            <Layers size={14} />
            <span>{comparisonMode ? "Dual Baseline On" : "Single View"}</span>
          </button>
        </div>
      </div>

      {/* HEALTH METRIC STRIP */}
      <div className="gantt-health-strip">
        <div className="gantt-health-card">
          <span className="health-label">SCHEDULE HEALTH</span>
          <div className="health-value-row">
            <span
              className={`health-pill ${
                delayedTasks.length > 0 ? "delayed" : "healthy"
              }`}
            >
              {delayedTasks.length > 0 ? (
                <>
                  <AlertTriangle size={13} /> {delayedTasks.length} Tasks Delayed
                </>
              ) : (
                <>
                  <CheckCircle2 size={13} /> 100% On Schedule
                </>
              )}
            </span>
          </div>
          <span className="health-sub">
            {onTimeTasks.length} of {allTasks.length} activities on track
          </span>
        </div>

        <div className="gantt-health-card alert">
          <span className="health-label">SCHEDULE SLIPPAGE (RED)</span>
          <div className="health-value-row">
            <strong className="health-num red">+{totalDelayDays} Days</strong>
          </div>
          <span className="health-sub">
            Cumulative delay variance across all phases
          </span>
        </div>

        <div className="gantt-health-card">
          <span className="health-label">HANDOVER TARGET</span>
          <div className="health-value-row">
            <strong className="health-num">30 Nov 2026</strong>
            <span className="health-forecast red">
              → Forecast 22 Dec 2026
            </span>
          </div>
          <span className="health-sub">
            Affected by masonry & electrical delays
          </span>
        </div>

        <div className="gantt-health-card">
          <span className="health-label">FILTER TIMELINE</span>
          <div className="gantt-filter-buttons">
            <button
              type="button"
              className={`gantt-filter-btn ${
                filterMode === "all" ? "active" : ""
              }`}
              onClick={() => setFilterMode("all")}
            >
              All ({allTasks.length})
            </button>
            <button
              type="button"
              className={`gantt-filter-btn red ${
                filterMode === "delayed" ? "active" : ""
              }`}
              onClick={() => setFilterMode("delayed")}
            >
              Delayed ({delayedTasks.length})
            </button>
            <button
              type="button"
              className={`gantt-filter-btn green ${
                filterMode === "ontime" ? "active" : ""
              }`}
              onClick={() => setFilterMode("ontime")}
            >
              On Track ({onTimeTasks.length})
            </button>
          </div>
        </div>
      </div>

      {/* DELAY SIMULATOR / ALTERATION DRAWER — BUILDER ONLY */}
      {canEditSchedule && showSimulator && (
        <div className="gantt-simulator-card">
          <div className="sim-header">
            <div>
              <div className="sim-badge">
                <Sparkles size={13} /> Builder Schedule Management
              </div>
              <h4>Manage Activity Delays & Slippages</h4>
              <p>
                As Builder, you have exclusive authority to record, update, or resolve
                activity delays. Changes reflect in real time for all project members.
              </p>
            </div>
            <button
              type="button"
              className="sim-close-btn"
              onClick={() => setShowSimulator(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="sim-controls-grid">
            <div className="sim-field">
              <label>Select Activity to Update</label>
              <select
                value={selectedTaskId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedTaskId(id);
                  const found = allTasks.find((t) => t.id === id);
                  if (found) {
                    setSimDays(found.delayDays || 0);
                    setSimReason(found.delayReason || "");
                  }
                }}
              >
                {ganttGroups.map((group) => (
                  <optgroup label={group.name} key={group.id}>
                    {(group.tasks || []).map((task) => (
                      <option value={task.id} key={task.id}>
                        {task.name}{" "}
                        {task.delayDays > 0
                          ? `(Current: +${task.delayDays}d)`
                          : "(On Time)"}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="sim-field">
              <label>
                Delay Days: <strong>+{simDays} Days</strong>
              </label>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={simDays}
                onChange={(e) => setSimDays(parseInt(e.target.value, 10))}
              />
              <div className="sim-presets">
                <button
                  type="button"
                  className={simDays === 0 ? "active" : ""}
                  onClick={() => setSimDays(0)}
                >
                  On Time (0d)
                </button>
                <button
                  type="button"
                  className={simDays === 7 ? "active" : ""}
                  onClick={() => setSimDays(7)}
                >
                  +7d
                </button>
                <button
                  type="button"
                  className={simDays === 14 ? "active" : ""}
                  onClick={() => setSimDays(14)}
                >
                  +14d
                </button>
                <button
                  type="button"
                  className={simDays === 21 ? "active" : ""}
                  onClick={() => setSimDays(21)}
                >
                  +21d
                </button>
                <button
                  type="button"
                  className={simDays === 30 ? "active" : ""}
                  onClick={() => setSimDays(30)}
                >
                  +30d
                </button>
              </div>
            </div>

            <div className="sim-field">
              <label>Root Cause / Reason for Delay</label>
              <input
                type="text"
                placeholder="e.g. Material shortage, heavy monsoon, inspection delay"
                value={simReason}
                onChange={(e) => setSimReason(e.target.value)}
              />
            </div>
          </div>

          <div className="sim-footer">
            <button
              type="button"
              className="primary-button"
              style={{ background: "var(--red)", borderColor: "var(--red)" }}
              onClick={() => {
                if (updateGanttTaskDelay) {
                  updateGanttTaskDelay(selectedTaskId, simDays, simReason);
                }
              }}
            >
              Update Activity Schedule
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                if (resetGanttSchedule) resetGanttSchedule();
                setSimDays(0);
                setSimReason("");
              }}
            >
              <RefreshCw size={13} /> Reset All to Baseline
            </button>
          </div>
        </div>
      )}

      {/* LEGEND BAR */}
      <div className="viewer-gantt-legend-bar">
        <div className="legend-items">
          <span className="legend-item">
            <i className="gantt-legend-dot completed" />
            Completed
          </span>
          <span className="legend-item">
            <i className="gantt-legend-dot active" />
            In Progress (On Time)
          </span>
          <span className="legend-item">
            <i className="gantt-legend-dot delayed" />
            <strong style={{ color: "var(--red)" }}>
              Delayed / Slippage (Red)
            </strong>
          </span>
          <span className="legend-item">
            <i className="gantt-legend-dot baseline" />
            Expected Baseline (Planned Target)
          </span>
          <span className="legend-item">
            <i className="gantt-legend-dot upcoming" />
            Upcoming
          </span>
        </div>

        <div className="legend-hint">
          <Info size={13} />
          Click any task row or red bar to inspect delay variance
        </div>
      </div>

      {/* SCROLLABLE GANTT CHART */}
      <div className="viewer-gantt-scroll">
        <div className="viewer-gantt">
          {/* LEFT: WORK BREAKDOWN COLUMN */}
          <div className="gantt-label-column">
            <div className="gantt-label-header">
              <span>WORK BREAKDOWN</span>
              <span>SCHEDULE STATUS</span>
            </div>

            {filteredGroups.map((group) => {
              const expanded = expandedGroups.includes(group.id);
              const isGroupDelayed = group.scheduleStatus === "delayed";

              return (
                <div key={group.id} className="gantt-group-label-block">
                  <button
                    type="button"
                    className={`gantt-group-label ${
                      isGroupDelayed ? "is-delayed" : ""
                    }`}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="gantt-group-left">
                      {expanded ? (
                        <ChevronDown size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                      <strong>{group.name}</strong>
                    </div>

                    <div className="gantt-group-right">
                      {isGroupDelayed ? (
                        <span className="gantt-badge-delay">
                          <AlertTriangle size={11} /> +{group.delayDays}d
                        </span>
                      ) : (
                        <span className="gantt-badge-ontime">
                          <CheckCircle2 size={11} /> On Time
                        </span>
                      )}
                      <span className="gantt-group-pct">{group.progress}%</span>
                    </div>
                  </button>

                  {expanded &&
                    (group.tasks || []).map((task) => {
                      const isTaskDelayed = task.scheduleStatus === "delayed";
                      const isSelected = inspectedTask?.id === task.id;

                      return (
                        <div
                          className={`gantt-task-label ${
                            isTaskDelayed ? "is-delayed" : ""
                          } ${isSelected ? "selected" : ""}`}
                          key={task.id}
                          onClick={() => setInspectedTask(task)}
                          title="Click to view expected vs actual dates and delay breakdown"
                        >
                          <div className="gantt-task-left">
                            {task.milestone ? (
                              <Flag
                                size={12}
                                className={isTaskDelayed ? "red" : "navy"}
                              />
                            ) : isTaskDelayed ? (
                              <AlertTriangle size={12} className="red" />
                            ) : task.status === "completed" ? (
                              <CheckCircle2 size={12} className="green" />
                            ) : (
                              <Circle size={10} className="muted" />
                            )}
                            <span className="task-name-text">{task.name}</span>
                          </div>

                          <div className="gantt-task-right">
                            {isTaskDelayed ? (
                              <span className="gantt-task-delay-tag">
                                +{task.delayDays}d late
                              </span>
                            ) : task.status === "completed" ? (
                              <span className="gantt-task-ok-tag">Done</span>
                            ) : (
                              <span className="gantt-task-ontrack-tag">
                                On Track
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>

          {/* RIGHT: CHART TIMELINE */}
          <div className="gantt-chart-column">
            <div className="gantt-month-header">
              <span>JAN</span>
              <span>FEB</span>
              <span>MAR</span>
              <span>APR</span>
              <span>MAY</span>
              <span>JUN</span>
              <span>JUL</span>
              <span>AUG</span>
              <span>SEP</span>
              <span>OCT</span>
              <span>NOV</span>
              <span>DEC</span>
            </div>

            <div className="gantt-chart-body">
              {filteredGroups.map((group) => {
                const expanded = expandedGroups.includes(group.id);
                const isGroupDelayed = group.scheduleStatus === "delayed";

                // Expected & actual positions
                const expectedPos = getGanttPosition(
                  group.expectedStart,
                  group.expectedEnd
                );
                const actualPos = getGanttPosition(
                  group.actualStart,
                  group.actualEnd
                );

                // Delay extension in red (from expectedEnd to actualEnd)
                const delayPos = isGroupDelayed
                  ? getGanttPosition(group.expectedEnd, group.actualEnd)
                  : { left: 0, width: 0 };

                return (
                  <div key={group.id} className="gantt-row-container">
                    {/* GROUP ROW */}
                    <div
                      className={`gantt-group-row ${
                        comparisonMode ? "dual-mode" : ""
                      }`}
                    >
                      {/* EXPECTED BASELINE TRACK (Dashed Ghost Bar) */}
                      {comparisonMode && (
                        <div
                          className="gantt-baseline-bar"
                          style={{
                            left: `${expectedPos.left}%`,
                            width: `${expectedPos.width}%`,
                          }}
                          title={`Expected Target: ${formatDate(
                            group.expectedStart
                          )} — ${formatDate(group.expectedEnd)}`}
                        >
                          <span className="baseline-text">
                            Expected: {formatDate(group.expectedEnd)}
                          </span>
                        </div>
                      )}

                      {/* ACTUAL / CURRENT SCHEDULE BAR */}
                      <div
                        className={`gantt-group-bar ${group.status} ${
                          isGroupDelayed ? "has-delay" : ""
                        }`}
                        style={{
                          left: `${actualPos.left}%`,
                          width: `${
                            isGroupDelayed
                              ? expectedPos.width
                              : actualPos.width
                          }%`,
                        }}
                      >
                        <div
                          className="gantt-progress-fill"
                          style={{ width: `${group.progress}%` }}
                        />
                        {group.progress > 0 && (
                          <span className="gantt-bar-label">
                            {group.progress}%
                          </span>
                        )}
                      </div>

                      {/* RED DELAY SLIPPAGE PORTION */}
                      {isGroupDelayed && delayPos.width > 0 && (
                        <div
                          className="gantt-delay-extension group"
                          style={{
                            left: `${delayPos.left}%`,
                            width: `${delayPos.width}%`,
                          }}
                          title={`Schedule Delay: +${group.delayDays} days late`}
                        >
                          <span className="delay-label">
                            <AlertTriangle size={11} /> +{group.delayDays}d
                            Delay
                          </span>
                        </div>
                      )}
                    </div>

                    {/* TASK ROWS */}
                    {expanded &&
                      (group.tasks || []).map((task) => {
                        const isTaskDelayed = task.scheduleStatus === "delayed";
                        const taskExpPos = getGanttPosition(
                          task.expectedStart,
                          task.expectedEnd
                        );
                        const taskActPos = getGanttPosition(
                          task.actualStart,
                          task.actualEnd
                        );
                        const taskDelayPos = isTaskDelayed
                          ? getGanttPosition(task.expectedEnd, task.actualEnd)
                          : { left: 0, width: 0 };

                        return (
                          <div
                            className={`gantt-task-row ${
                              comparisonMode ? "dual-mode" : ""
                            }`}
                            key={task.id}
                            onClick={() => setInspectedTask(task)}
                          >
                            {/* BASELINE EXPECTED TRACK */}
                            {comparisonMode && (
                              <div
                                className="gantt-baseline-bar task"
                                style={{
                                  left: `${taskExpPos.left}%`,
                                  width: `${taskExpPos.width}%`,
                                }}
                                title={`Expected: ${formatDate(
                                  task.expectedStart
                                )} — ${formatDate(task.expectedEnd)}`}
                              >
                                <span className="baseline-text">
                                  Target: {formatDate(task.expectedEnd)}
                                </span>
                              </div>
                            )}

                            {/* ACTUAL PROGRESS BAR */}
                            <div
                              className={`gantt-task-bar ${task.status} ${
                                isTaskDelayed ? "has-delay" : ""
                              }`}
                              style={{
                                left: `${taskActPos.left}%`,
                                width: `${
                                  isTaskDelayed
                                    ? taskExpPos.width
                                    : taskActPos.width
                                }%`,
                              }}
                            >
                              <div
                                className="gantt-progress-fill"
                                style={{ width: `${task.progress}%` }}
                              />
                              {task.progress > 20 && (
                                <span className="gantt-bar-label">
                                  {task.progress}%
                                </span>
                              )}
                            </div>

                            {/* RED DELAY EXTENSION BAR (Actual > Expected) */}
                            {isTaskDelayed && taskDelayPos.width > 0 && (
                              <div
                                className="gantt-delay-extension task"
                                style={{
                                  left: `${taskDelayPos.left}%`,
                                  width: `${taskDelayPos.width}%`,
                                }}
                                title={`Delayed by ${task.delayDays} days: ${
                                  task.delayReason || "Unforeseen site delay"
                                }`}
                              >
                                <span className="delay-label">
                                  <AlertTriangle size={10} /> +
                                  {task.delayDays}d
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })}

              {/* TODAY REFERENCE LINE */}
              <div className="gantt-today-line">
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TASK INSPECTION CARD MODAL — READ ONLY FOR NON-BUILDERS, WITH EDIT TRIGGER FOR BUILDER */}
      {inspectedTask && (
        <div
          className="gantt-inspection-banner"
          style={{
            borderColor:
              inspectedTask.scheduleStatus === "delayed"
                ? "var(--red)"
                : "var(--border)",
          }}
        >
          <div className="insp-header">
            <div className="insp-title-col">
              <span className="eyebrow">ACTIVITY SCHEDULE DETAILS</span>
              <h3>
                {inspectedTask.name}{" "}
                {inspectedTask.milestone && (
                  <span className="milestone-badge">Milestone</span>
                )}
              </h3>
            </div>

            <div className="insp-status-col">
              {inspectedTask.scheduleStatus === "delayed" ? (
                <div className="insp-delay-badge">
                  <AlertTriangle size={15} />
                  <span>
                    Delayed by <strong>+{inspectedTask.delayDays} Days</strong>
                  </span>
                </div>
              ) : (
                <div className="insp-ontime-badge">
                  <CheckCircle2 size={15} />
                  <span>On Schedule</span>
                </div>
              )}

              {/* Builder shortcut to adjust this task */}
              {canEditSchedule && (
                <button
                  type="button"
                  className="secondary-button"
                  style={{ fontSize: "11px", padding: "5px 10px" }}
                  onClick={() => {
                    setSelectedTaskId(inspectedTask.id);
                    setSimDays(inspectedTask.delayDays || 0);
                    setSimReason(inspectedTask.delayReason || "");
                    setShowSimulator(true);
                  }}
                >
                  <Edit3 size={12} /> Adjust Task Delay
                </button>
              )}

              <button
                type="button"
                className="sim-close-btn"
                onClick={() => setInspectedTask(null)}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div className="insp-grid">
            <div className="insp-card">
              <span className="insp-card-label">EXPECTED (PLANNED)</span>
              <strong>
                {formatDate(inspectedTask.expectedStart)} —{" "}
                {formatDate(inspectedTask.expectedEnd)}
              </strong>
              <small>Original baseline timeline</small>
            </div>

            <div
              className={`insp-card ${
                inspectedTask.scheduleStatus === "delayed" ? "danger" : ""
              }`}
            >
              <span className="insp-card-label">ACTUAL / CURRENT REVISED</span>
              <strong
                style={{
                  color:
                    inspectedTask.scheduleStatus === "delayed"
                      ? "var(--red)"
                      : "var(--navy)",
                }}
              >
                {formatDate(inspectedTask.actualStart)} —{" "}
                {formatDate(inspectedTask.actualEnd)}
              </strong>
              <small>
                {inspectedTask.scheduleStatus === "delayed"
                  ? `Slippage: +${inspectedTask.delayDays} days in red`
                  : "On target"}
              </small>
            </div>

            <div className="insp-card">
              <span className="insp-card-label">PROGRESS & STATUS</span>
              <strong>{inspectedTask.progress}% Complete</strong>
              <small>
                {inspectedTask.status === "completed"
                  ? "Phase verified"
                  : inspectedTask.status === "in_progress"
                  ? "Active on site"
                  : "Upcoming"}
              </small>
            </div>

            {inspectedTask.delayReason && (
              <div className="insp-card reason full-width">
                <span className="insp-card-label">
                  ROOT CAUSE / IMPACT NOTES
                </span>
                <p>{inspectedTask.delayReason}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="viewer-gantt-footer">
        <div>
          <strong>Original Project Period</strong>
          <span>12 Jan 2026 — 30 Nov 2026</span>
        </div>

        <div>
          <strong>Overall Construction Progress</strong>
          <span>68% complete</span>
        </div>

        <div>
          <strong>Current Handover Forecast</strong>
          <span style={{ color: "var(--red)" }}>
            22 Dec 2026 (+22 days delay)
          </span>
        </div>
      </div>
    </section>
  );
}

export default function Planning() {
  const {
    demoRole,
    project,
    ganttGroups,
    updateGanttTaskDelay,
    resetGanttSchedule,
  } = useApp();

  const activeProject = project || projects[0];
  const content = getRoleContent(demoRole);
  const visibleWork = getVisibleWork(demoRole);
  const canEditSchedule = demoRole === "builder";

  const completedMilestones = planningMilestones.filter(
    (item) => item.status === "completed"
  ).length;

  return (
    <div className="planning-page">
      <section className="planning-header">
        <div>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p className="planning-description">{content.description}</p>
        </div>

        <div className="planning-project-meta">
          <div className="planning-project-name">
            {activeProject.name}
          </div>
          <div className="planning-project-location">
            {activeProject.location}
          </div>
        </div>
      </section>

      <section className="planning-summary-grid">
        <div className="planning-summary-card">
          <span>PROJECT PROGRESS</span>
          <strong>{activeProject.progress}%</strong>

          <div className="planning-progress-track">
            <div
              className="planning-progress-fill"
              style={{ width: `${activeProject.progress}%` }}
            />
          </div>
        </div>

        <div className="planning-summary-card">
          <span>MILESTONES</span>
          <strong>
            {completedMilestones}/{planningMilestones.length}
          </strong>
          <p>Major milestones completed</p>
        </div>

        <div className="planning-summary-card">
          <span>EXPECTED COMPLETION</span>
          <strong>{activeProject.endDate}</strong>
          <p>Current project target</p>
        </div>

        {demoRole === "projectManager" && (
          <div className="planning-summary-card warning">
            <span>SCHEDULE ATTENTION</span>
            <strong>1</strong>
            <p>Item needs monitoring</p>
          </div>
        )}
      </section>

      <section className="planning-main-grid">
        <div className="planning-panel timeline-panel">
          <div className="planning-panel-header">
            <div>
              <p className="section-kicker">{content.primaryLabel}</p>
              <h2>Project Timeline</h2>
            </div>

            <CalendarDays size={20} />
          </div>

          <div className="timeline-months">
            <span>JAN</span>
            <span>MAR</span>
            <span>MAY</span>
            <span>JUL</span>
            <span>SEP</span>
            <span>NOV</span>
          </div>

          <div className="timeline">
            {planningMilestones.map((milestone) => (
              <div className="timeline-row" key={milestone.id}>
                <div className="timeline-status">
                  <MilestoneIcon status={milestone.status} />
                </div>

                <div className="timeline-info">
                  <div className="timeline-title-row">
                    <strong>{milestone.name}</strong>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className={`timeline-status-label ${milestone.status}`}>
                        {milestone.status === "completed"
                          ? "Completed"
                          : milestone.status === "in_progress"
                          ? "In Progress"
                          : "Upcoming"}
                      </span>

                      <span
                        className={`timeline-schedule-chip ${
                          milestone.scheduleStatus === "delayed"
                            ? "delayed"
                            : "on-time"
                        }`}
                      >
                        {milestone.scheduleStatus === "delayed" ? (
                          <AlertTriangle size={11} />
                        ) : (
                          <CheckCircle2 size={11} />
                        )}
                        {milestone.scheduleStatus === "delayed"
                          ? "Delayed"
                          : "On Time"}
                      </span>
                    </div>
                  </div>

                  <span>
                    {milestone.start} — {milestone.end}
                  </span>
                </div>

                <div className="timeline-progress">
                  <div className="timeline-bar">
                    <div
                      className={`timeline-bar-fill ${milestone.status}`}
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>

                  <strong>{milestone.progress}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {demoRole !== "viewer" && (
          <div className="planning-panel work-panel">
            <div className="planning-panel-header">
              <div>
                <p className="section-kicker">
                  {demoRole === "contractor"
                    ? "CURRENT ASSIGNMENTS"
                    : demoRole === "projectManager"
                    ? "SCHEDULE MONITORING"
                    : "UPCOMING WORK"}
                </p>

                <h2>
                  {demoRole === "contractor"
                    ? "Assigned Work"
                    : "Upcoming Work"}
                </h2>
              </div>

              <ArrowRight size={19} />
            </div>

            <div className="work-list">
              {visibleWork.map((item) => (
                <div className="work-item" key={item.id}>
                  <div className="work-item-main">
                    <strong>{item.title}</strong>
                    <span>{item.location}</span>
                  </div>

                  <div className="work-item-side">
                    <span className={`work-status ${item.statusClass}`}>
                      {item.status}
                    </span>

                    <small>Due {item.due}</small>
                  </div>
                </div>
              ))}
            </div>

            {demoRole === "projectManager" && (
              <div className="planning-attention">
                <AlertTriangle size={17} />
                <div>
                  <strong>Monitor plastering review</strong>
                  <span>
                    Work is awaiting review before the next activity can
                    proceed.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* CONSTRUCTION GANTT — AVAILABLE ACROSS ALL ROLES (EDITABLE BY BUILDER ONLY) */}
      <ConstructionGantt
        canEditSchedule={canEditSchedule}
        ganttGroups={ganttGroups}
        updateGanttTaskDelay={updateGanttTaskDelay}
        resetGanttSchedule={resetGanttSchedule}
      />
    </div>
  );
}
