
import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "../../context/AppContext";


export default function Team() {
  const { project , demoRole } = useApp();
  const canManageTeam = demoRole === "builder";
  const [editingMember, setEditingMember] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [search, setSearch] = useState("");
    const [showInvite, setShowInvite] = useState(false);
    const [inviteName, setInviteName] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("Engineer");
    const [pendingInvites, setPendingInvites] = useState([]);
    const cancelInvite = (id) => {
        setPendingInvites((current) =>
            current.filter((invite) => invite.id !== id)
        );
    };
    const removeMember = (id) => {
      setTeamMembers((current) =>
        current.filter((member) => member.id !== id)
      );
    };
    const [selectedMember, setSelectedMember] = useState(null);

  const [teamMembers, setTeamMembers] = useState([
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    role: "Engineer",
    status: "Active",
    initials: "PS",
  },
  {
    id: 2,
    name: "Arjun Patil",
    email: "arjun.patil@example.com",
    role: "Contractor",
    status: "Active",
    initials: "AP",
  },
  {
    id: 3,
    name: "Neha Kulkarni",
    email: "neha.kulkarni@example.com",
    role: "Project Manager",
    status: "Active",
    initials: "NK",
  },
  {
    id: 4,
    name: "Rahul Mehta",
    email: "rahul.mehta@example.com",
    role: "Viewer",
    status: "Active",
    initials: "RM",
  },
]);

  const allMembers = [...teamMembers, ...pendingInvites];

    const filteredMembers = allMembers.filter((member) =>
    `${member.name} ${member.email} ${member.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="team-page">
      <div className="team-page-header">
        <div>
          <span className="page-eyebrow">PROJECT MANAGEMENT</span>
          <h2>Team Management</h2>
          <p>
            Manage the people and access associated with your project.
          </p>
        </div>

        {canManageTeam && (
          <button
            className="primary-button"
            type="button"
            onClick={() => setShowInvite(true)}
          >
            <UserPlus size={17} />
            Invite Member
          </button>
        )}
      </div>

      <div className="team-project-strip">
        <div className="team-project-icon">
          <Users size={20} />
        </div>
        <div>
          <span>ACTIVE PROJECT</span>
          <strong>{project?.name || "Your Project"}</strong>
        </div>
      </div>

      <div className="team-stats">
        <div className="team-stat-card">
          <span>Total Members</span>
          <strong>{teamMembers.length + pendingInvites.length + 1}</strong>
        </div>
        <div className="team-stat-card">
          <span>Active Members</span>
          <strong>{teamMembers.length + 1}</strong>
        </div>
        <div className="team-stat-card">
          <span>Pending Invitations</span>
          <strong>{pendingInvites.length}</strong>
        </div>
      </div>

      <section className="team-members-panel">
        <div className="team-members-header">
          <div>
            <h3>Project Members</h3>
            <p>People currently associated with this project</p>
          </div>

          <div className="team-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="team-table">
          <div className="team-table-head">
            <span>MEMBER</span>
            <span>ROLE</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>

          {filteredMembers.map((member) => (
            <div className="team-table-row" key={member.id}>
              <div className="team-member-info">
                <div className="team-avatar">
                  {member.initials}
                </div>
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.email}</span>
                </div>
              </div>

              <div className="team-role">
                <ShieldCheck size={15} />
                {member.role}
              </div>

              <div>
                <span
                    className={
                        member.status === "Pending"
                        ? "team-status-pending"
                        : "team-status-active"
                    }
                    >
                    {member.status}
                    </span>
              </div>

              <div>
                {member.status === "Pending" ? (
                <button
                    type="button"
                    className="team-cancel-invite"
                    onClick={() => cancelInvite(member.id)}
                >
                    Cancel
                </button>
                ) : (
                <div className="team-action-wrapper">
                    <button
                        className="team-action-button"
                        type="button"
                        aria-label={`Actions for ${member.name}`}
                        onClick={() =>
                        setSelectedMember(
                            selectedMember === member.id ? null : member.id
                        )
                        }
                    >
                        <MoreHorizontal size={19} />
                    </button>

                    {selectedMember === member.id && (
                      <div className="team-action-menu">
                        <button
                          type="button"
                          onClick={() => {
                            alert(`Member: ${member.name}\nRole: ${member.role}`);
                            setSelectedMember(null);
                          }}
                        >
                          View member
                        </button>

                        {canManageTeam && (
                          <>
                            <button
                              type="button"
                              className="team-remove-option"
                              onClick={() => {
                                const confirmed = window.confirm(
                                  `Remove ${member.name} from this project?`
                                );

                                if (confirmed) {
                                  removeMember(member.id);
                                }

                                setSelectedMember(null);
                              }}
                            >
                              Remove member
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingMember(member);
                                setEditedRole(member.role);
                                setSelectedMember(null);
                              }}
                            >
                              Edit role
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    </div>
                )}
              </div>
            </div>
          ))}

          {filteredMembers.length === 0 && (
            <div className="team-empty">
              No team members match your search.
            </div>
          )}
        </div>
      </section>
      {showInvite && (
        <div className="team-modal-backdrop">
            <div className="team-modal">
            <div className="team-modal-header">
                <div>
                <h3>Invite Team Member</h3>
                <p>Add someone to this project.</p>
                </div>
                <button
                type="button"
                className="team-modal-close"
                onClick={() => setShowInvite(false)}
                aria-label="Close invitation form"
                >
                ×
                </button>
            </div>

            <form
                onSubmit={(event) => {
                event.preventDefault();

                setPendingInvites((current) => [
                    ...current,
                    {
                    id: Date.now(),
                    name: inviteName.trim(),
                    email: inviteEmail.trim(),
                    role: inviteRole,
                    status: "Pending",
                    initials: inviteName
                        .trim()
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase(),
                    },
                ]);

                setShowInvite(false);
                setInviteName("");
                setInviteEmail("");
                setInviteRole("Engineer");
                }}
            >
                <label>
                Full name
                <input
                    value={inviteName}
                    onChange={(event) => setInviteName(event.target.value)}
                    placeholder="Enter full name"
                    required
                />
                </label>

                <label>
                Email address
                <input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="name@example.com"
                    required
                />
                </label>

                <label>
                Project role
                <select
                    value={inviteRole}
                    onChange={(event) => setInviteRole(event.target.value)}
                >
                    <option>Engineer</option>
                    <option>Contractor</option>
                    <option>Project Manager</option>
                    <option>Viewer</option>
                </select>
                </label>

                <div className="team-modal-actions">
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowInvite(false)}
                >
                    Cancel
                </button>
                <button type="submit" className="primary-button">
                    Continue
                </button>
                </div>
            </form>
            </div>
        </div>
        )}
        {editingMember && (
          <div className="team-modal-backdrop">
            <div className="team-modal">
              <div className="team-modal-header">
                <div>
                  <h3>Edit Member Role</h3>
                  <p>{editingMember.name}</p>
                </div>
                <button
                  type="button"
                  className="team-modal-close"
                  onClick={() => setEditingMember(null)}
                  aria-label="Close role editor"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  setTeamMembers((current) =>
                    current.map((member) =>
                      member.id === editingMember.id
                        ? { ...member, role: editedRole }
                        : member
                    )
                  );

                  setEditingMember(null);
                }}
              >
                <label>
                  Project role
                  <select
                    value={editedRole}
                    onChange={(event) => setEditedRole(event.target.value)}
                  >
                    <option>Engineer</option>
                    <option>Contractor</option>
                    <option>Project Manager</option>
                    <option>Viewer</option>
                  </select>
                </label>

                <div className="team-modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setEditingMember(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="primary-button">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}