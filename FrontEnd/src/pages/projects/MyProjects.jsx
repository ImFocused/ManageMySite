import { useNavigate } from "react-router-dom";
import { projects } from "../../data/mock";
import { useApp } from "../../context/AppContext";

function ProjectCard({ project, roleLabel }) {
  const navigate = useNavigate();

  return (
    <div className="project-card">
      <div className="project-card-top">
        <span className="project-type">PRIVATE PROJECT</span>
        <span className="project-role">{roleLabel}</span>
      </div>

      <h2>{project.name}</h2>

      <p className="project-location">{project.location}</p>

      <div className="project-progress">
        <div className="project-progress-header">
          <span>Project progress</span>
          <strong>{project.progress}%</strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="project-dates">
        <div>
          <span>Started</span>
          <strong>{project.startDate}</strong>
        </div>

        <div>
          <span>Expected completion</span>
          <strong>{project.endDate}</strong>
        </div>
      </div>

      <button
        className="project-open-button"
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        Open Project
        <span>→</span>
      </button>
    </div>
  );
}

export default function MyProjects() {
  const { demoRole, user } = useApp();

  const canCreateProject = demoRole === "builder";

  return (
    <div className="page-container">
      <div className="projects-page-header">
        <div>
          <p className="eyebrow">PRIVATE PROJECTS</p>
          <h1>My Projects</h1>
          <p>
            Projects you're currently involved in as {user.roleLabel.toLowerCase()}.
          </p>
        </div>

        {canCreateProject && (
          <button
            className="primary-button"
            onClick={() => navigate("/projects/new")}
          >
            <span>+</span>
            Create New Project
          </button>
        )}
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            roleLabel={user.roleLabel}
          />
        ))}
      </div>
    </div>
  );
}