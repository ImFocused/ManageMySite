import { createContext, useContext, useState, useEffect } from "react";
import {
  demoUsers,
  demoMemberships,
  projects as initialProjects,
  reports as initialReports,
  initialGanttGroups,
  initialQueries,
} from "../data/mock";
import {
  FALLBACK_CONSTRUCTION_IMAGE,
  SITE_PHOTOS,
} from "../utils/imageUtils";

const AppContext = createContext(null);

const MOCK_DATA_VERSION = "2.3-builder-timeline";

export function AppProvider({ children }) {
  // Ensure local storage is updated to the rich stagewise progress dataset
  if (typeof window !== "undefined") {
    try {
      if (localStorage.getItem("mock_data_version") !== MOCK_DATA_VERSION) {
        localStorage.removeItem("reports");
        localStorage.removeItem("projectList");
        localStorage.removeItem("ganttGroups");
        localStorage.setItem("mock_data_version", MOCK_DATA_VERSION);
      }
    } catch (e) {
      console.error("Storage version check error", e);
    }
  }

  const [demoRole, setDemoRole] = useState(
    () => localStorage.getItem("demoRole") || "builder"
  );

  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem("reports");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((r, rIdx) => {
            const hasPhotos =
              r.photos && Array.isArray(r.photos) && r.photos.length > 0;
            return {
              ...r,
              photos: hasPhotos
                ? r.photos.map((p, pIdx) => ({
                    ...p,
                    url:
                      p.url ||
                      SITE_PHOTOS[pIdx % SITE_PHOTOS.length] ||
                      FALLBACK_CONSTRUCTION_IMAGE,
                    label:
                      p.label ||
                      `${r.title || "Report"} — Photo ${pIdx + 1}`,
                  }))
                : [
                    {
                      id: 1,
                      label: `${r.title || "Report"} — Photo 1`,
                      url:
                        SITE_PHOTOS[rIdx % SITE_PHOTOS.length] ||
                        FALLBACK_CONSTRUCTION_IMAGE,
                    },
                  ],
            };
          });
        }
      }
    } catch (e) {
      console.error("Error reading saved reports", e);
    }
    return initialReports;
  });

  const [queries, setQueries] = useState(() => {
    try {
      const saved = localStorage.getItem("queries");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading saved queries", e);
    }
    return initialQueries;
  });

  const [projectList, setProjectList] = useState(() => {
    try {
      const saved = localStorage.getItem("projectList");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading saved projects", e);
    }
    return initialProjects;
  });

  const [selectedProjectId, setSelectedProjectId] = useState(
    () => localStorage.getItem("selectedProjectId") || "private-001"
  );

  const [ganttGroups, setGanttGroups] = useState(() => {
    try {
      const saved = localStorage.getItem("ganttGroups");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading saved gantt groups", e);
    }
    return initialGanttGroups;
  });

  // Automatically persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("projectList", JSON.stringify(projectList));
    } catch (e) {
      console.error("Error saving projects", e);
    }
  }, [projectList]);

  useEffect(() => {
    try {
      localStorage.setItem("reports", JSON.stringify(reports));
    } catch (e) {
      console.error("Error saving reports", e);
    }
  }, [reports]);

  useEffect(() => {
    try {
      localStorage.setItem("queries", JSON.stringify(queries));
    } catch (e) {
      console.error("Error saving queries", e);
    }
  }, [queries]);

  useEffect(() => {
    try {
      localStorage.setItem("ganttGroups", JSON.stringify(ganttGroups));
    } catch (e) {
      console.error("Error saving gantt groups", e);
    }
  }, [ganttGroups]);

  const user = demoUsers[demoRole];
  const membership = demoMemberships[demoRole];

  const activeProjectId =
    selectedProjectId || membership?.projectId || "private-001";
  const project =
    projectList.find((item) => item.id === activeProjectId) || projectList[0];

  function changeDemoRole(role) {
    localStorage.setItem("demoRole", role);
    setDemoRole(role);
  }

  function changeProject(projectId) {
    localStorage.setItem("selectedProjectId", projectId);
    setSelectedProjectId(projectId);
  }

  function addProject(projectData) {
    const newId = `private-${String(Date.now()).slice(-4)}`;
    const newProject = {
      id: newId,
      name: projectData.name.trim(),
      type: "private",
      location: projectData.location.trim() || "Mumbai, Maharashtra",
      startDate:
        projectData.startDate ||
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      endDate: projectData.endDate || "31 Dec 2027",
      progress: 0,
      status: "On Time",
      statusDetail: "Tracking to schedule",
      timelineStages: [
        {
          id: "stage-1",
          title: "Site Prep & Excavation",
          status: "In progress",
          scheduleStatus: "on_time",
          scheduleLabel: "On Time",
          progress: 0,
          active: true,
        },
        {
          id: "stage-2",
          title: "Foundation & Plinth",
          status: "Upcoming",
          scheduleStatus: "on_time",
          scheduleLabel: "On Time",
          progress: 0,
        },
        {
          id: "stage-3",
          title: "Superstructure",
          status: "Upcoming",
          scheduleStatus: "on_time",
          scheduleLabel: "On Time",
          progress: 0,
        },
        {
          id: "stage-4",
          title: "Finishing & Handover",
          status: "Upcoming",
          scheduleStatus: "on_time",
          scheduleLabel: "On Time",
          progress: 0,
        },
      ],
    };

    setProjectList((currentList) => [...currentList, newProject]);
    changeProject(newId);
    return newProject;
  }

  function updateProjectStatus(projectId, newStatus) {
    setProjectList((currentList) =>
      currentList.map((p) => {
        if (p.id !== projectId) return p;
        const isDelayed = newStatus === "Delayed";
        return {
          ...p,
          status: newStatus,
          statusDetail: isDelayed
            ? "Delayed by 12 days"
            : "Tracking to schedule",
          timelineStages: (p.timelineStages || []).map((stage, idx) => {
            if (isDelayed) {
              if (idx === 1 || idx === 2) {
                return {
                  ...stage,
                  scheduleStatus: "delayed",
                  scheduleLabel: "Delayed",
                };
              }
              return {
                ...stage,
                scheduleStatus: "on_time",
                scheduleLabel: "On Time",
              };
            } else {
              return {
                ...stage,
                scheduleStatus: "on_time",
                scheduleLabel: "On Time",
              };
            }
          }),
        };
      })
    );
  }

  function updateProjectStageStatus(projectId, stageId, newScheduleStatus) {
    setProjectList((currentList) =>
      currentList.map((p) => {
        if (p.id !== projectId) return p;
        const updatedStages = (p.timelineStages || []).map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                scheduleStatus: newScheduleStatus,
                scheduleLabel:
                  newScheduleStatus === "delayed" ? "Delayed" : "On Time",
              }
            : stage
        );
        const hasDelayed = updatedStages.some(
          (s) => s.scheduleStatus === "delayed"
        );
        return {
          ...p,
          status: hasDelayed ? "Delayed" : "On Time",
          statusDetail: hasDelayed
            ? "Delayed by 12 days"
            : "Tracking to schedule",
          timelineStages: updatedStages,
        };
      })
    );
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

  function addQuery(queryData) {
    const now = new Date();
    const formatted =
      now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    const newQuery = {
      id: `Q-${String(Date.now()).slice(-4)}`,
      projectId: queryData.projectId || activeProjectId,
      projectName:
        queryData.projectName || project?.name || "Riverside Residence",
      workType: queryData.workType || "Civil & Structural Work",
      location: queryData.location || "Block A — General Area",
      queryType: queryData.queryType || "Inquiry / Clarification",
      priority: queryData.priority || "Medium",
      subject: queryData.subject,
      message: queryData.message,
      submittedBy: `${user?.name || "Rahul Mehta"} (${
        user?.roleLabel || "Viewer"
      })`,
      submittedAt: formatted,
      status: "Awaiting Response",
      response: "",
      respondedAt: null,
      respondedBy: null,
    };

    setQueries((currentQueries) => [newQuery, ...currentQueries]);
  }

  function respondToQuery(queryId, response) {
    const now = new Date();
    const formatted =
      now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    setQueries((currentQueries) =>
      currentQueries.map((query) =>
        query.id === queryId
          ? {
              ...query,
              response,
              status: "Responded",
              respondedAt: formatted,
              respondedBy: `${user?.name || "Rahul Sharma"} (${
                user?.roleLabel || "Builder"
              })`,
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
      status: "draft",
      feedback: reason,
      rejectedBy: "engineer",
    });
  }

  function builderApproveReport(reportId) {
    updateReport(reportId, {
      status: "approved",
      builderReviewedAt: new Date().toISOString(),
      builderReviewedBy: user?.name || "Builder",
    });
  }

  function builderDeclineReport(reportId, reason) {
    updateReport(reportId, {
      status: "draft",
      feedback: reason,
      rejectedBy: "builder",
    });
  }

  function publishReport(reportId) {
    updateReport(reportId, {
      status: "published",
      publishedAt: new Date().toISOString(),
    });
  }

  function withdrawReport(reportId, reason = "") {
    const now = new Date();
    const formatted =
      now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    updateReport(reportId, {
      status: "withdrawn",
      withdrawnAt: formatted,
      withdrawnReason: reason,
    });
  }

  function republishReport(reportId) {
    updateReport(reportId, {
      status: "published",
      republishedAt: new Date().toISOString(),
      withdrawnAt: null,
      withdrawnReason: null,
    });
  }

  function resubmitReport(reportId, notes = "") {
    const report = reports.find((item) => item.id === reportId);
    if (!report) return;

    updateReport(reportId, {
      status: "submitted",
      contractorNote: notes || report.contractorNote || "",
      resubmittedAt: new Date().toISOString(),
    });
  }

  function submitReport(newReportData) {
    const reportNumber = reports.length + 1;
    const formattedId = `R-${String(reportNumber).padStart(3, "0")}`;

    const now = new Date();
    const formattedDate =
      now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      ", " +
      now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

    const newReport = {
      id: formattedId,
      projectId: activeProjectId,
      contractorId: "usr-4",
      contractorName: user?.name || "Arjun Patil",
      submittedBy: user?.name || "Arjun Patil",
      submittedAt: formattedDate,
      status: newReportData.status || "engineer_review",
      milestone:
        newReportData.milestone || newReportData.activity || "Structure",
      title:
        newReportData.title ||
        (newReportData.activity
          ? `${newReportData.activity} — ${newReportData.floor || "Site"}`
          : "Site Progress Report"),
      summary: newReportData.summary || newReportData.description || "",
      description:
        newReportData.description ||
        newReportData.progressNote ||
        "Site work verified and logged by contractor.",
      location:
        newReportData.location ||
        `${newReportData.buildingName || project?.name || "Site"} — ${
          newReportData.floor || "General Area"
        }`,
      buildingName:
        newReportData.buildingName || project?.name || "Riverside Residence",
      floor: newReportData.floor || "Ground Floor",
      activity: newReportData.activity || "General Work",
      labourCount: newReportData.labourCount || 20,
      progressPercent: newReportData.progressPercent || 0,
      photos:
        newReportData.photos && newReportData.photos.length > 0
          ? newReportData.photos
          : [
              {
                id: 1,
                label: "Site Inspection Photo",
                url: FALLBACK_CONSTRUCTION_IMAGE,
              },
            ],
      feedback: newReportData.feedback || "",
      contractorNote: newReportData.progressNote || "",
      gpsCoordinates: newReportData.gpsCoordinates || "",
      materialsUsed: newReportData.materialsUsed || [],
      labourSummary: newReportData.labourSummary || [],
      equipmentUsed: newReportData.equipmentUsed || [],
      weatherConditions: newReportData.weatherConditions || "Clear, 32°C",
      challengesReported: newReportData.challengesReported || "None",
      signatureTimestamp: now.toISOString(),
      signedBy: user?.name || "Arjun Patil",
    };

    setReports((currentReports) => [newReport, ...currentReports]);
  }

  function updateGanttTaskDelay(groupId, taskId, delayDays) {
    setGanttGroups((currentGroups) =>
      currentGroups.map((group) => {
        if (group.id !== groupId) return group;

        const updatedTasks = group.tasks.map((task) => {
          if (task.id !== taskId) return task;

          const days = Math.max(0, parseInt(delayDays, 10) || 0);
          const hasDelay = days > 0;
          const baselineEnd = task.baselineEndMonth ?? task.endMonth;
          const newEndMonth = hasDelay
            ? Math.min(12, baselineEnd + Math.ceil(days / 15))
            : baselineEnd;

          return {
            ...task,
            delayDays: days,
            isDelayed: hasDelay,
            scheduleStatus: hasDelay ? "delayed" : "on_time",
            endMonth: newEndMonth,
            baselineEndMonth: baselineEnd,
          };
        });

        const anyDelayed = updatedTasks.some((t) => t.isDelayed);

        return {
          ...group,
          isDelayed: anyDelayed,
          tasks: updatedTasks,
        };
      })
    );
  }

  function resetGanttSchedule() {
    setGanttGroups(initialGanttGroups);
  }

  return (
    <AppContext.Provider
      value={{
        demoRole,
        changeDemoRole,
        user,
        membership,
        project,
        projects: projectList,
        selectedProjectId: activeProjectId,
        changeProject,
        addProject,
        updateProjectStatus,
        updateProjectStageStatus,
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
        submitReport,
        ganttGroups,
        updateGanttTaskDelay,
        resetGanttSchedule,
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
