import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/dashboard/Dashboard";
import MyProjects from "./pages/projects/MyProjects";
import ProjectWorkspace from "./pages/projects/ProjectWorkspace";
import Reports from "./pages/reports/Reports";
import ReportDetail from "./pages/reports/ReportDetail";
import Planning from "./pages/planning/Planning";
import ReviewQueue from "./pages/reports/ReviewQueue";

import "./App.css";

function Placeholder({ title }) {
  return (
    <div className="placeholder-page">
      <p className="eyebrow">MANAGEMYSITE</p>
      <h2>{title}</h2>
      <p>
        This section is part of the UI blueprint and will be
        built in the next step.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={
            <AppShell>
              <Dashboard />
            </AppShell>
          }
        />

        <Route
          path="/planning"
          element={
            <AppShell>
              <Planning />
            </AppShell>
          }
        />

        <Route
          path="/team"
          element={
            <AppShell>
              <Placeholder title="Team" />
            </AppShell>
          }
        />

        <Route
          path="/queries"
          element={
            <AppShell>
              <Placeholder title="Queries" />
            </AppShell>
          }
        />

        <Route
          path="/notifications"
          element={
            <AppShell>
              <Placeholder title="Notifications" />
            </AppShell>
          }
        />

        <Route
          path="/audit"
          element={
            <AppShell>
              <Placeholder title="Audit History" />
            </AppShell>
          }
        />

        <Route
          path="/settings"
          element={
            <AppShell>
              <Placeholder title="Settings" />
            </AppShell>
          }
        />

        <Route 
          path="/projects" 
          element={
            <AppShell>
              <MyProjects />
            </AppShell>
          }  
        />

        <Route
          path="/projects/:projectId"
          element={
          <AppShell>
            <ProjectWorkspace />
          </AppShell>
          }
        />

        <Route
          path="/review-queue"
          element={<AppShell><ReviewQueue /></AppShell>}
        />

        <Route
          path="/reports"
          element={
            <AppShell>
              <Reports />
            </AppShell>
          }
        />

        <Route
          path="/reports/:reportId"
          element={
            <AppShell>
              <ReportDetail />
            </AppShell>
          }
        />

        
      </Routes>
    </BrowserRouter>
  );
}