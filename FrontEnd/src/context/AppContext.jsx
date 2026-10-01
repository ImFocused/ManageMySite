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
  const [queries, setQueries] = useState([]);

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
  function addQuery({ subject, message }) {
      const newQuery = {
        id: Date.now(),
        subject,
        message,
        status: "Awaiting Response",
        response: "",
        submittedAt: new Date().toISOString(),
      };

      setQueries((currentQueries) => [...currentQueries, newQuery]);
    }
    function respondToQuery(queryId, response) {
      setQueries((currentQueries) =>
        currentQueries.map((query) =>
          query.id === queryId
            ? {
                ...query,
                response,
                status: "Responded",
                respondedAt: new Date().toISOString(),
              }
            : query
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

  function republishReport(reportId) {
  updateReport(reportId, {
    status: "published",
    republishedAt: new Date().toISOString(),
    republishedBy: user?.name || "Builder",
  });
}

  function withdrawReport(reportId, reason) {
  updateReport(reportId, {
    status: "withdrawn",
    withdrawalReason: reason,
    withdrawnAt: new Date().toISOString(),
    withdrawnBy: user?.name || "Builder",
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
        queries,
        addQuery,
        respondToQuery,

        reports,
        updateReport,

        approveReport,
        declineReport,

        builderApproveReport,
        builderDeclineReport,
        publishReport,
        withdrawReport,

        republishReport,

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