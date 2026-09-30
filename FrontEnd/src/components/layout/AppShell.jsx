import { NavLink, useLocation } from "react-router-dom";

import {
  Building2,
  ChevronDown,
  Bell,
  Settings,
} from "lucide-react";

import { roleNavigation } from "../../data/navigation";
import { useApp } from "../../context/AppContext";

export default function AppShell({ children }) {
  const location = useLocation();

  const {
    demoRole,
    changeDemoRole,
    user,
    project,
  } = useApp();

  const navigation =
    roleNavigation[demoRole] || [];

  return (
    <div className="app-shell">
      <aside className="sidebar">

        {/* BRAND */}

        <div className="brand">
          <div className="brand-mark">
            <Building2
              size={20}
              strokeWidth={2.2}
            />
          </div>

          <div>
            <div className="brand-name">
              ManageMySite
            </div>

            <div className="brand-subtitle">
              Construction transparency
            </div>
          </div>
        </div>

        {/* PROJECT */}

        <div className="project-selector">

          <div className="project-icon">
            <Building2 size={17} />
          </div>

          <div className="project-selector-info">

            <span className="project-label">
              PROJECT
            </span>

            <strong>
              {project.name}
            </strong>

            <span className="project-type">
              {project.type === "private"
                ? "Private Project"
                : "Government Project"}
            </span>

          </div>

          <ChevronDown size={17} />

        </div>

        {/* NAVIGATION */}

        <nav className="sidebar-navigation">

          {navigation.map((group) => (

            <div
              className="nav-group"
              key={group.section}
            >

              <div className="nav-section-title">
                {group.section}
              </div>

              {group.items.map((item) => {

                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-item ${
                        isActive ? "active" : ""
                      }`
                    }
                  >
                    <Icon size={18} />

                    <span>
                      {item.label}
                    </span>
                  </NavLink>
                );
              })}

            </div>

          ))}

        </nav>

        {/* USER */}

        <div className="sidebar-user">

          <div className="avatar">
            {getInitials(user.name)}
          </div>

          <div className="sidebar-user-info">

            <strong>
              {user.roleLabel}
            </strong>

            <span>
              {user.name}
            </span>

          </div>

          <Settings size={17} />

        </div>

      </aside>

      <main className="main-area">

        {/* TOPBAR */}

        <header className="topbar">

          <div>

            <span className="breadcrumb">
              ManageMySite / {project.name}
            </span>

            <h1>
              {getPageTitle(
                location.pathname,
                user.role
              )}
            </h1>

          </div>

          <div className="topbar-actions">

            <button className="icon-button">
              <Bell size={19} />

              <span className="notification-dot" />
            </button>

            {/* DEVELOPMENT ROLE SWITCHER */}

            <div className="demo-role-switcher">

              <span className="demo-label">
                DEMO ROLE
              </span>

              <select
                value={demoRole}
                onChange={(event) =>
                  changeDemoRole(
                    event.target.value
                  )
                }
              >
                <option value="builder">
                  Builder
                </option>

                <option value="engineer">
                  Engineer
                </option>

                <option value="contractor">
                  Contractor
                </option>

                <option value="projectManager">
                  Project Manager
                </option>

                <option value="viewer">
                  Viewer
                </option>
              </select>

            </div>

            <div className="role-badge">

              <span className="role-avatar">
                {getInitials(user.name)}
              </span>

              <div>
                <strong>
                  {user.roleLabel}
                </strong>

                <span>
                  {project.type === "private"
                    ? "Private Project"
                    : "Government Project"}
                </span>
              </div>

              <ChevronDown size={15} />

            </div>

          </div>

        </header>

        <div className="page-content">
          {children}
        </div>

      </main>
    </div>
  );
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPageTitle(pathname, role) {
  if (pathname.startsWith("/reports")) {
    if (
      role === "engineer" ||
      role === "teamEngineer" ||
      role === "je" ||
      role === "de" ||
      role === "ee"
    ) {
      return "Review Queue";
    }

    return "Reports";
  }

  if (pathname.startsWith("/planning")) {
    return "Planning";
  }

  if (pathname.startsWith("/team")) {
    return "Team";
  }

  if (pathname.startsWith("/queries")) {
    return "Queries";
  }

  if (pathname.startsWith("/notifications")) {
    return "Notifications";
  }

  if (pathname.startsWith("/audit")) {
    return "Audit History";
  }

  if (pathname.startsWith("/settings")) {
    return "Settings";
  }

  return role === "viewer"
    ? "Project Overview"
    : "Project Dashboard";
}