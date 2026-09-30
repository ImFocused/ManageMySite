import {
  ArrowUpRight,
  Clock3,
  FileCheck2,
  Users,
  MapPin,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import EngineerDashboard from "./EngineerDashboard";
import ContractorDashboard from "./ContractorDashboard";
import ViewerDashboard from "./ViewerDashboard";

export default function Dashboard() {
    const { demoRole } = useApp();

    if (demoRole === "engineer") {
    return <EngineerDashboard />;
    }
    if (demoRole === "contractor") {
    return <ContractorDashboard />;
    }
    if(demoRole === "viewer") {
    return <ViewerDashboard />;
    }
  return (
    <div className="dashboard-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">PROJECT OVERVIEW</p>

          <h2>Good morning, Builder.</h2>

          <p>
            Here's what's happening on Riverside Residence today.
          </p>
        </div>

        <button className="primary-button">
          View Project
          <ArrowUpRight size={17} />
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Overall Progress"
          value="68%"
          detail="+6% this month"
          icon={<FileCheck2 />}
        />

        <StatCard
          label="Active Reports"
          value="24"
          detail="6 awaiting review"
          icon={<Clock3 />}
        />

        <StatCard
          label="Team Members"
          value="7"
          detail="2 currently active"
          icon={<Users />}
        />

        <StatCard
          label="Published Updates"
          value="18"
          detail="Latest 2 hours ago"
          icon={<MapPin />}
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">WORKFLOW</p>
              <h3>Report approval</h3>
            </div>

            <button className="text-button">
              View all
            </button>
          </div>

          <div className="workflow-list">
            <WorkflowItem
              title="Column reinforcement"
              subtitle="Report #R-024"
              status="Awaiting Builder"
              statusClass="pending"
            />

            <WorkflowItem
              title="Electrical conduit"
              subtitle="Report #R-023"
              status="Approved"
              statusClass="approved"
            />

            <WorkflowItem
              title="Plastering — Block A"
              subtitle="Report #R-022"
              status="Engineer Review"
              statusClass="review"
            />

            <WorkflowItem
              title="Foundation inspection"
              subtitle="Report #R-021"
              status="Published"
              statusClass="published"
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">PROJECT STATUS</p>
              <h3>Current progress</h3>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-header">
              <span>Overall completion</span>
              <strong>68%</strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: "68%" }}
              />
            </div>
          </div>

          <div className="milestone-list">
            <Milestone
              title="Foundation"
              status="Completed"
            />

            <Milestone
              title="Structure"
              status="In progress"
            />

            <Milestone
              title="Electrical"
              status="In progress"
            />

            <Milestone
              title="Finishing"
              status="Upcoming"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, detail, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-label">{label}</div>

      <div className="stat-value">{value}</div>

      <div className="stat-detail">{detail}</div>
    </div>
  );
}

function WorkflowItem({
  title,
  subtitle,
  status,
  statusClass,
}) {
  return (
    <div className="workflow-item">
      <div className="workflow-indicator" />

      <div className="workflow-info">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

      <span className={`status-chip ${statusClass}`}>
        {status}
      </span>
    </div>
  );
}

function Milestone({ title, status }) {
  return (
    <div className="milestone-item">
      <div className="milestone-dot" />

      <div>
        <strong>{title}</strong>
        <span>{status}</span>
      </div>
    </div>
  );
}