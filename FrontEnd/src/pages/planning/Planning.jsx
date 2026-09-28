import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { projects } from "../../data/mock";

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
        <section className="viewer-completion-card">
          <div>
            <p className="section-kicker">EXPECTED COMPLETION</p>
            <h2>{activeProject.endDate}</h2>
            <p>
              The current project schedule targets completion by this date.
            </p>
          </div>

          <div className="viewer-completion-progress">
            <strong>{activeProject.progress}%</strong>
            <span>Complete</span>
          </div>
        </section>
      )}
    </div>
  );
}