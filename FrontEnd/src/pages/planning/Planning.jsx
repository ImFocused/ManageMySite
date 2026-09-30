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
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { projects } from "../../data/mock";
import { useState } from "react";

const planningMilestones = [
  {
    id: 1,
    name: "Foundation",
    short: "Foundation",
    start: "12 Jan 2026",
    end: "28 Feb 2026",
    progress: 100,
    status: "completed",
  },
  {
    id: 2,
    name: "Structural Work",
    short: "Structure",
    start: "01 Mar 2026",
    end: "30 Jun 2026",
    progress: 100,
    status: "completed",
  },
  {
    id: 3,
    name: "Electrical Installation",
    short: "Electrical",
    start: "01 Jul 2026",
    end: "15 Oct 2026",
    progress: 72,
    status: "in_progress",
  },
  {
    id: 4,
    name: "Plumbing",
    short: "Plumbing",
    start: "15 Sep 2026",
    end: "31 Oct 2026",
    progress: 20,
    status: "upcoming",
  },
  {
    id: 5,
    name: "Internal Finishing",
    short: "Finishing",
    start: "01 Oct 2026",
    end: "30 Nov 2026",
    progress: 0,
    status: "upcoming",
  },
];

const viewerGanttGroups = [
  {
    id: "foundation",
    name: "Foundation",
    progress: 100,
    status: "completed",
    start: "2026-01-12",
    end: "2026-02-28",
    tasks: [
      {
        name: "Excavation",
        start: "2026-01-12",
        end: "2026-01-28",
        progress: 100,
        status: "completed",
      },
      {
        name: "Footings & foundation",
        start: "2026-01-29",
        end: "2026-02-18",
        progress: 100,
        status: "completed",
      },
      {
        name: "Foundation inspection",
        start: "2026-02-19",
        end: "2026-02-28",
        progress: 100,
        status: "completed",
        milestone: true,
      },
    ],
  },

  {
    id: "structure",
    name: "Structure",
    progress: 72,
    status: "in_progress",
    start: "2026-03-01",
    end: "2026-06-30",
    tasks: [
      {
        name: "Columns",
        start: "2026-03-01",
        end: "2026-04-30",
        progress: 100,
        status: "completed",
      },
      {
        name: "Slabs",
        start: "2026-05-01",
        end: "2026-06-15",
        progress: 100,
        status: "completed",
      },
      {
        name: "Masonry",
        start: "2026-06-16",
        end: "2026-06-30",
        progress: 72,
        status: "in_progress",
      },
    ],
  },

  {
    id: "electrical",
    name: "Electrical",
    progress: 72,
    status: "in_progress",
    start: "2026-07-01",
    end: "2026-10-15",
    tasks: [
      {
        name: "Electrical conduits",
        start: "2026-07-01",
        end: "2026-08-31",
        progress: 100,
        status: "completed",
      },
      {
        name: "Wiring installation",
        start: "2026-09-01",
        end: "2026-10-15",
        progress: 55,
        status: "in_progress",
      },
    ],
  },

  {
    id: "plumbing",
    name: "Plumbing",
    progress: 20,
    status: "upcoming",
    start: "2026-09-15",
    end: "2026-10-31",
    tasks: [
      {
        name: "Plumbing rough-in",
        start: "2026-09-15",
        end: "2026-10-15",
        progress: 35,
        status: "in_progress",
      },
      {
        name: "Testing & inspection",
        start: "2026-10-16",
        end: "2026-10-31",
        progress: 0,
        status: "upcoming",
        milestone: true,
      },
    ],
  },

  {
    id: "finishing",
    name: "Finishing",
    progress: 0,
    status: "upcoming",
    start: "2026-10-01",
    end: "2026-11-30",
    tasks: [
      {
        name: "Internal finishing",
        start: "2026-10-01",
        end: "2026-10-31",
        progress: 0,
        status: "upcoming",
      },
      {
        name: "Final finishing & handover",
        start: "2026-11-01",
        end: "2026-11-30",
        progress: 0,
        status: "upcoming",
        milestone: true,
      },
    ],
  },
];

const GANTT_START = new Date("2026-01-12T00:00:00Z");
const GANTT_END = new Date("2026-11-30T23:59:59Z");

function getGanttPosition(start, end) {
  const startDate = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T23:59:59Z`);

  const totalDuration =
    GANTT_END.getTime() - GANTT_START.getTime();

  const startOffset =
    startDate.getTime() - GANTT_START.getTime();

  const duration =
    endDate.getTime() - startDate.getTime();

  const left = (startOffset / totalDuration) * 100;
  const width = (duration / totalDuration) * 100;

  return {
    left: Math.max(0, left),
    width: Math.max(1, width),
  };
}

const workItems = [
  {
    id: 1,
    title: "Electrical installation",
    location: "Block A — First Floor",
    owner: "Arjun Patil",
    due: "15 Oct 2026",
    status: "In Progress",
    statusClass: "in-progress",
  },
  {
    id: 2,
    title: "Plumbing rough-in",
    location: "Block A — Ground Floor",
    owner: "Arjun Patil",
    due: "31 Oct 2026",
    status: "Upcoming",
    statusClass: "upcoming",
  },
  {
    id: 3,
    title: "Internal plastering",
    location: "Block A — First Floor",
    owner: "Arjun Patil",
    due: "05 Oct 2026",
    status: "Awaiting Review",
    statusClass: "review",
  },
  {
    id: 4,
    title: "Finishing preparation",
    location: "Block A — All Floors",
    owner: "Arjun Patil",
    due: "15 Nov 2026",
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
    case "engineer":
      return {
        eyebrow: "ENGINEERING SCHEDULE",
        title: "Planning",
        description:
          "Review planned construction work and the milestones relevant to engineering review.",
        primaryLabel: "Engineering Milestones",
      };

    case "contractor":
      return {
        eyebrow: "MY WORK",
        title: "My Work",
        description:
          "Track assigned construction work, upcoming deadlines, and work currently under review.",
        primaryLabel: "Assigned Work",
      };

    case "projectManager":
      return {
        eyebrow: "PROJECT MONITORING",
        title: "Planning",
        description:
          "Monitor project schedule, active work, upcoming milestones, and potential delays.",
        primaryLabel: "Schedule Monitoring",
      };

    case "viewer":
      return {
        eyebrow: "PROJECT PROGRESS",
        title: "Progress",
        description:
          "Follow the major construction milestones and expected project completion.",
        primaryLabel: "Construction Timeline",
      };

    default:
      return {
        eyebrow: "PROJECT SCHEDULE",
        title: "Planning",
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

function ViewerGantt() {
  const [expandedGroups, setExpandedGroups] = useState(
    viewerGanttGroups.map((group) => group.id)
  );

  function toggleGroup(id) {
    setExpandedGroups((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  return (
    <section className="viewer-gantt-panel">
      <div className="viewer-gantt-header">
        <div>
          <p className="section-kicker">DETAILED PROJECT SCHEDULE</p>
          <h2>Construction Gantt</h2>
          <p>
            Follow each major construction activity from start to
            completion.
          </p>
        </div>

        <div className="viewer-gantt-legend">
          <span>
            <i className="gantt-legend-dot completed" />
            Completed
          </span>

          <span>
            <i className="gantt-legend-dot active" />
            In progress
          </span>

          <span>
            <i className="gantt-legend-dot upcoming" />
            Upcoming
          </span>
        </div>
      </div>

      <div className="viewer-gantt-scroll">
        <div className="viewer-gantt">
          <div className="gantt-label-column">
            <div className="gantt-label-header">
              WORK BREAKDOWN
            </div>

            {viewerGanttGroups.map((group) => {
              const expanded = expandedGroups.includes(group.id);

              return (
                <div key={group.id}>
                  <button
                    type="button"
                    className="gantt-group-label"
                    onClick={() => toggleGroup(group.id)}
                  >
                    {expanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}

                    <strong>{group.name}</strong>

                    <span>{group.progress}%</span>
                  </button>

                  {expanded &&
                    group.tasks.map((task) => (
                      <div
                        className="gantt-task-label"
                        key={task.name}
                      >
                        {task.milestone && (
                          <Flag size={12} />
                        )}

                        <span>{task.name}</span>
                      </div>
                    ))}
                </div>
              );
            })}
          </div>

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
            </div>

            <div className="gantt-chart-body">
              {viewerGanttGroups.map((group) => {
                const expanded = expandedGroups.includes(group.id);

                return (
                  <div key={group.id}>
                    <div className="gantt-group-row">
                      {(() => {
                        const position = getGanttPosition(
                          group.start,
                          group.end
                        );

                        return (
                          <div
                            className={`gantt-group-bar ${group.status}`}
                            style={{
                              left: `${position.left}%`,
                              width: `${position.width}%`,
                            }}
                          >
                            <div
                              className="gantt-progress-fill"
                              style={{
                                width: `${group.progress}%`,
                              }}
                            />

                            {group.progress > 0 && (
                              <span>{group.progress}%</span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    

                    {expanded &&
                      group.tasks.map((task) => (
                        <div className="gantt-task-row">
                            {(() => {
                              const position = getGanttPosition(
                                task.start,
                                task.end
                              );

                              return (
                                <div
                                  className={`gantt-task-bar ${task.status}`}
                                  style={{
                                    left: `${position.left}%`,
                                    width: `${position.width}%`,
                                  }}
                                >
                                  <div
                                    className="gantt-progress-fill"
                                    style={{
                                      width: `${task.progress}%`,
                                    }}
                                  />

                                  {task.progress > 20 && (
                                    <span>{task.progress}%</span>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                      ))}
                  </div>
                );
              })}

              <div className="gantt-today-line">
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="viewer-gantt-footer">
        <div>
          <strong>Project period</strong>
          <span>12 Jan 2026 — 30 Nov 2026</span>
        </div>

        <div>
          <strong>Overall progress</strong>
          <span>68% complete</span>
        </div>

        <div>
          <strong>Expected completion</strong>
          <span>30 Nov 2026</span>
        </div>
      </div>
    </section>
  );
}

export default function Planning() {
  const { demoRole, project } = useApp();

  const activeProject = project || projects[0];
  const content = getRoleContent(demoRole);
  const visibleWork = getVisibleWork(demoRole);

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

                    <span className={`timeline-status-label ${milestone.status}`}>
                      {milestone.status === "completed"
                        ? "Completed"
                        : milestone.status === "in_progress"
                        ? "In Progress"
                        : "Upcoming"}
                    </span>
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

      {demoRole === "viewer" && (
        <ViewerGantt />
      )}
    </div>
  );
}