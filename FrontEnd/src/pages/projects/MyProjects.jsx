import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Calendar, MapPin, Plus, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

function ProjectCard({ project, roleLabel, onOpen }) {
  const isDelayed = project.status === "Delayed";

  return (
    <div className="project-card">
      <div className="project-card-top">
        <span className="project-type">PRIVATE PROJECT</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            className={`project-status-pill ${
              isDelayed ? "delayed" : "on-time"
            }`}
          >
            {project.status || "On Time"}
          </span>
          <span className="project-role">{roleLabel}</span>
        </div>
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
        onClick={() => onOpen(project.id)}
      >
        Open Project
        <span>→</span>
      </button>
    </div>
  );
}

export default function MyProjects() {
  const { demoRole, user, projects = [], changeProject, addProject } = useApp();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formError, setFormError] = useState("");

  const canCreateProject = demoRole === "builder";

  function handleOpenProject(projectId) {
    if (changeProject) {
      changeProject(projectId);
    }
    if (demoRole === "viewer") {
      navigate("/dashboard");
    } else {
      navigate(`/projects/${projectId}`);
    }
  }

  function handleCreateProject(e) {
    e.preventDefault();
    if (!projectName.trim()) {
      setFormError("Please enter a valid project name.");
      return;
    }
    if (!location.trim()) {
      setFormError("Please enter a project location.");
      return;
    }

    if (addProject) {
      const newProj = addProject({
        name: projectName.trim(),
        location: location.trim(),
        startDate:
          startDate.trim() ||
          new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        endDate: endDate.trim() || "31 Dec 2027",
      });

      setShowCreateModal(false);
      setProjectName("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setFormError("");

      if (newProj?.id) {
        navigate(`/projects/${newProj.id}`);
      }
    }
  }

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
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} />
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
            onOpen={handleOpenProject}
          />
        ))}
      </div>

      {/* ── CREATE NEW PROJECT MODAL (BUILDER ONLY) ── */}
      {showCreateModal && (
        <div
          className="team-modal-backdrop"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="team-modal create-project-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="team-modal-header">
              <div>
                <span className="modal-eyebrow">BUILDER WORKSPACE</span>
                <h3>Create New Project</h3>
                <p>
                  Initialize a new private development with automated construction phases.
                </p>
              </div>
              <button
                type="button"
                className="team-modal-close"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="create-project-form">
              {formError && (
                <div className="create-project-error">
                  {formError}
                </div>
              )}

              <div className="cp-field">
                <label>
                  <Building2 size={13} /> Project Name *
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Skyline Towers Phase 2, Ocean Heights"
                  required
                  autoFocus
                />
              </div>

              <div className="cp-field">
                <label>
                  <MapPin size={13} /> Location & City *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  required
                />
              </div>

              <div className="cp-row two-col">
                <div className="cp-field">
                  <label>
                    <Calendar size={13} /> Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. 01 Nov 2026"
                  />
                </div>

                <div className="cp-field">
                  <label>
                    <Calendar size={13} /> Expected Completion
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="e.g. 31 Dec 2027"
                  />
                </div>
              </div>

              <div className="create-project-note">
                <Building2 size={16} />
                <div>
                  <strong>Private Project Classification</strong>
                  <span>
                    This project will be added to your active project portfolio as a private development with initialized foundation, superstructure, and handover milestones.
                  </span>
                </div>
              </div>

              <div className="team-modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Plus size={15} />
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
