import { createContext, useContext, useState } from "react";
import {
  demoUsers,
  demoMemberships,
  projects,
  reports as initialReports,
} from "../data/mock";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [demoRole, setDemoRole] = useState(
    localStorage.getItem("demoRole") || "builder"
  );

  const [reports, setReports] = useState(initialReports);

  const user = demoUsers[demoRole];
  const membership = demoMemberships[demoRole];

  const project = projects.find(
    (item) => item.id === membership?.projectId
  );

  function changeDemoRole(role) {
    localStorage.setItem("demoRole", role);
    setDemoRole(role);
  }

  function updateReport(reportId, updates) {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              ...updates,
            }
          : report
      )
    );
  }

  function approveReport(reportId, feedback = "") {
    updateReport(reportId, {
      status: "builder_review",
      feedback,
      engineerReviewedAt: new Date().toISOString(),
      engineerReviewedBy: user?.name || "Engineer",
    });
  }

  function declineReport(reportId, reason) {
    updateReport(reportId, {
      status: "contractor_revision",
      feedback: reason,
      declineReason: reason,
      engineerReviewedAt: new Date().toISOString(),
      engineerReviewedBy: user?.name || "Engineer",
    });
  }

  function builderApproveReport(reportId, feedback = "") {
    updateReport(reportId, {
      status: "ready_to_publish",
      feedback,
      builderReviewedAt: new Date().toISOString(),
      builderReviewedBy: user?.name || "Builder",
    });
  }

  function builderDeclineReport(reportId, reason) {
    updateReport(reportId, {
      status: "engineer_revision",
      feedback: reason,
      declineReason: reason,
      builderReviewedAt: new Date().toISOString(),
      builderReviewedBy: user?.name || "Builder",
    });
  }

  function publishReport(reportId) {
    updateReport(reportId, {
      status: "published",
      publishedAt: new Date().toISOString(),
      publishedBy: user?.name || "Builder",
    });
  }

  function resubmitReport(reportId, description = "") {
    updateReport(reportId, {
      status: "engineer_review",
      description,
      resubmittedAt: new Date().toISOString(),
      declineReason: "",
      feedback: "",
    });
  }

  return (
    <AppContext.Provider
      value={{
        demoRole,
        changeDemoRole,
        user,
        membership,
        project,

        reports,
        updateReport,

        approveReport,
        declineReport,

        builderApproveReport,
        builderDeclineReport,
        publishReport,

        resubmitReport,
      }}
    >
    {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}