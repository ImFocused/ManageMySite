export const projects = [
  {
    id: "private-001",
    name: "Riverside Residence",
    type: "private",
    location: "Andheri East, Mumbai",
    startDate: "12 Jan 2026",
    endDate: "30 Nov 2026",
    progress: 68,
  },
  {
    id: "private-002",
    name: "Green Valley Villa",
    type: "private",
    location: "Baner, Pune",
    startDate: "03 Mar 2026",
    endDate: "18 Dec 2026",
    progress: 42,
  },
  {
    id: "gov-001",
    name: "Municipal School Building",
    type: "government",
    location: "Solapur, Maharashtra",
    startDate: "15 Feb 2026",
    endDate: "20 Jan 2027",
    progress: 54,
  },
];

export const demoUsers = {
  builder: {
    name: "Rahul Sharma",
    role: "builder",
    roleLabel: "Builder",
  },

  engineer: {
    name: "Priya Sharma",
    role: "engineer",
    roleLabel: "Engineer",
  },

  contractor: {
    name: "Arjun Patil",
    role: "contractor",
    roleLabel: "Contractor",
  },

  projectManager: {
    name: "Neha Kulkarni",
    role: "projectManager",
    roleLabel: "Project Manager",
  },

  govtContractor: {
    name: "Vijay Construction",
    role: "govtContractor",
    roleLabel: "Government Contractor",
  },

  teamEngineer: {
    name: "Amit Joshi",
    role: "teamEngineer",
    roleLabel: "Team Engineer",
  },

  je: {
    name: "Suresh Patil",
    role: "je",
    roleLabel: "Junior Engineer",
  },

  de: {
    name: "Meena Deshmukh",
    role: "de",
    roleLabel: "Deputy Engineer",
  },

  ee: {
    name: "R. Kulkarni",
    role: "ee",
    roleLabel: "Executive Engineer",
  },

  viewer: {
    name: "Rahul Mehta",
    role: "viewer",
    roleLabel: "Viewer",
  },
};

export const demoMemberships = {
  builder: {
    projectId: "private-001",
    role: "builder",
  },

  engineer: {
    projectId: "private-001",
    role: "engineer",
  },

  contractor: {
    projectId: "private-001",
    role: "contractor",
  },

  projectManager: {
    projectId: "private-001",
    role: "projectManager",
  },

  govtContractor: {
    projectId: "gov-001",
    role: "govtContractor",
  },

  teamEngineer: {
    projectId: "gov-001",
    role: "teamEngineer",
  },

  je: {
    projectId: "gov-001",
    role: "je",
  },

  de: {
    projectId: "gov-001",
    role: "de",
  },

  ee: {
    projectId: "gov-001",
    role: "ee",
  },

  viewer: {
    projectId: "private-001",
    role: "viewer",
  },
};

export const reports = [
  {
    id: "R-024",
    title: "Column Reinforcement",
    location: "Block A — Ground Floor",
    submittedBy: "Arjun Patil",
    submittedAt: "28 Sep 2026, 10:42 AM",
    status: "engineer_review",
    description:
      "Column reinforcement completed for Block A ground floor as per the approved construction plan.",
    photos: [
      {
        id: 1,
        label: "Column reinforcement",
        url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 2,
        label: "Reinforcement detail",
        url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 3,
        label: "Block A site view",
        url: "https://images.unsplash.com/photo-1590644365607-1c5a2c8b6b5d?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    feedback: "",
  },

  {
    id: "R-023",
    title: "Electrical Conduit",
    location: "Block A — First Floor",
    submittedBy: "Arjun Patil",
    submittedAt: "27 Sep 2026, 03:18 PM",
    status: "approved",
    description:
      "Electrical conduit installation completed for the first floor.",
    photos: [
      {
        id: 1,
        label: "Electrical conduit",
        url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: 2,
        label: "Conduit installation",
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    feedback: "Work reviewed and approved.",
  },

  {
    id: "R-022",
    title: "Plastering — Block A",
    location: "Block A — First Floor",
    submittedBy: "Arjun Patil",
    submittedAt: "26 Sep 2026, 11:05 AM",
    status: "builder_review",
    description:
      "Internal plastering work completed on the first floor.",
    photos: [
      {
        id: 1,
        label: "Plastering work",
        url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    feedback: "Engineer approved. Awaiting Builder review.",
  },

  {
    id: "R-021",
    title: "Foundation Inspection",
    location: "Block A — Foundation",
    submittedBy: "Arjun Patil",
    submittedAt: "22 Sep 2026, 02:30 PM",
    status: "published",
    description:
      "Foundation inspection completed and published to project viewers.",
    photos: [
      {
        id: 1,
        label: "Foundation",
        url: "https://images.unsplash.com/photo-1508450859948-4e04c492982a?auto=format&fit=crop&w=1200&q=80",
      },
    ],
    feedback: "Approved and published.",
  },
];