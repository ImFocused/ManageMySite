import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  Users,
  MessageSquare,
  Bell,
  ClipboardCheck,
  BriefcaseBusiness,
  PackageOpen,
  FilePlus2,
} from "lucide-react";

export const roleNavigation = {
  builder: [
    {
      section: "OVERVIEW",
      items: [
        {
          label: "Review Queue",
          path: "/builder-review",
          icon: ClipboardCheck,
        },
        {
          label: "My Projects",
          path: "/projects",
          icon: BriefcaseBusiness,
        },
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Reports",
          path: "/reports",
          icon: FileText,
        },
        {
          label: "Progress",
          path: "/planning",
          icon: CalendarDays,
        },
      ],
    },

    {
      section: "PROJECT",
      items: [
        {
          label: "Team",
          path: "/team",
          icon: Users,
        },
        {
          label: "Queries",
          path: "/queries",
          icon: MessageSquare,
        },
        {
          label: "Resources",
          path: "/resources",
          icon: PackageOpen,
        },
      ],
    },

    {
      section: "SYSTEM",
      items: [
        {
          label: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
      ],
    },
  ],

  engineer: [
    {
      section: "WORKSPACE",
      items: [
        { label: "My Projects", path: "/projects", icon: BriefcaseBusiness },
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        {
          label: "Review Queue",
          path: "/review-queue",
          icon: ClipboardCheck,
        },
        { label: "Reports", path: "/reports", icon: FileText },
        { label: "Progress", path: "/planning", icon: CalendarDays },
      ],
    },
    {
      section: "PROJECT",
      items: [
        { label: "Notifications", path: "/notifications", icon: Bell },
      ],
    },
  ],

  contractor: [
    {
      section: "WORKSPACE",
      items: [
        {
          label: "My Projects",
          path: "/projects",
          icon: BriefcaseBusiness,
        },
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Reports",
          path: "/reports",
          icon: FileText,
        },
        {
          label: "Submit Report",
          path: "/submit-report",
          icon: FilePlus2,
        },
        {
          label: "Progress",
          path: "/planning",
          icon: CalendarDays,
        },
      ],
    },

    {
      section: "PROJECT",
      items: [
        {
          label: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
      ],
    },
  ],

  projectManager: [
    {
      section: "MONITORING",
      items: [
        {
          label: "My Projects",
          path: "/projects",
          icon: BriefcaseBusiness,
        },
        {
          label: "Dashboard",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Reports",
          path: "/reports",
          icon: FileText,
        },
        {
          label: "Progress",
          path: "/planning",
          icon: CalendarDays,
        },
      ],
    },

    {
      section: "SYSTEM",
      items: [
        {
          label: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
      ],
    },
  ],

  viewer: [
    {
      section: "MY PROJECT",
      items: [
        {
          label: "My Projects",
          path: "/projects",
          icon: BriefcaseBusiness,
        },
        {
          label: "Overview",
          path: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Progress",
          path: "/planning",
          icon: CalendarDays,
        },
        {
          label: "Updates",
          path: "/reports",
          icon: FileText,
        },
      ],
    },

    {
      section: "COMMUNICATION",
      items: [
        {
          label: "Queries",
          path: "/queries",
          icon: MessageSquare,
        },
      ],
    },

    {
      section: "SYSTEM",
      items: [
        {
          label: "Notifications",
          path: "/notifications",
          icon: Bell,
        },
      ],
    },
  ],
};
