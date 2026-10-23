import { useState } from "react";
import {
  Package,
  Users,
  HardHat,
  Truck,
  Plus,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Fuel,
  BarChart3,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

// ─── mock data ────────────────────────────────────────────────────────────────

const initialMaterials = [
  {
    id: "m1",
    name: "Cement",
    unit: "Bags",
    totalOrdered: 2400,
    consumed: 1620,
    onSite: 380,
    lastUpdated: "Today, 08:30 AM",
  },
  {
    id: "m2",
    name: "Sand",
    unit: "Cu.ft",
    totalOrdered: 5000,
    consumed: 3100,
    onSite: 700,
    lastUpdated: "Today, 08:30 AM",
  },
  {
    id: "m3",
    name: "Aggregate (20mm)",
    unit: "Cu.ft",
    totalOrdered: 3800,
    consumed: 2200,
    onSite: 480,
    lastUpdated: "Yesterday, 06:00 PM",
  },
  {
    id: "m4",
    name: "Steel (TMT 16mm)",
    unit: "kg",
    totalOrdered: 18000,
    consumed: 12400,
    onSite: 2800,
    lastUpdated: "Yesterday, 06:00 PM",
  },
  {
    id: "m5",
    name: "Tiles (600×600)",
    unit: "Boxes",
    totalOrdered: 320,
    consumed: 0,
    onSite: 0,
    lastUpdated: "Not received",
  },
  {
    id: "m6",
    name: "Tile Adhesive",
    unit: "Bags",
    totalOrdered: 90,
    consumed: 0,
    onSite: 0,
    lastUpdated: "Not received",
  },
];

const initialLabour = [
  {
    id: "l1",
    contractor: "Patil & Sons Construction",
    workType: "RCC / Shuttering",
    skilled: 14,
    unskilled: 22,
    targetToday: 40,
    presentToday: 36,
    lastUpdated: "Today, 07:45 AM",
  },
  {
    id: "l2",
    contractor: "Mehta Electrical Works",
    workType: "Electrical Conduit",
    skilled: 6,
    unskilled: 4,
    targetToday: 10,
    presentToday: 10,
    lastUpdated: "Today, 07:45 AM",
  },
  {
    id: "l3",
    contractor: "Sharma Plumbing",
    workType: "Plumbing — Rough-in",
    skilled: 4,
    unskilled: 3,
    targetToday: 8,
    presentToday: 7,
    lastUpdated: "Today, 07:45 AM",
  },
];

const initialStaff = [
  {
    id: "s1",
    name: "Priya Sharma",
    designation: "Site Engineer",
    initials: "PS",
    onSite: true,
    phone: "+91 98200 12345",
  },
  {
    id: "s2",
    name: "Rohan Desai",
    designation: "Planning Engineer",
    initials: "RD",
    onSite: true,
    phone: "+91 98200 67890",
  },
  {
    id: "s3",
    name: "Anita Kulkarni",
    designation: "Quantity Surveyor",
    initials: "AK",
    onSite: false,
    phone: "+91 98765 43210",
  },
  {
    id: "s4",
    name: "Suresh Joshi",
    designation: "Safety Officer",
    initials: "SJ",
    onSite: true,
    phone: "+91 99001 11222",
  },
];

const initialMachinery = [
  {
    id: "eq1",
    name: "Tower Crane TC-48",
    type: "Crane",
    status: "active",
    fuelToday: 42,
    fuelStock: 340,
    lastUpdated: "Today, 09:00 AM",
  },
  {
    id: "eq2",
    name: "Transit Mixer 1",
    type: "Concrete Mixer",
    status: "active",
    fuelToday: 28,
    fuelStock: 180,
    lastUpdated: "Today, 09:00 AM",
  },
  {
    id: "eq3",
    name: "JCB Excavator",
    type: "Excavator",
    status: "idle",
    fuelToday: 0,
    fuelStock: 220,
    lastUpdated: "Yesterday, 05:30 PM",
  },
  {
    id: "eq4",
    name: "Concrete Pump P-7",
    type: "Pump",
    status: "active",
    fuelToday: 19,
    fuelStock: 95,
    lastUpdated: "Today, 09:00 AM",
  },
  {
    id: "eq5",
    name: "Tipper Truck MH-02",
    type: "Vehicle",
    status: "offsite",
    fuelToday: 35,
    fuelStock: 160,
    lastUpdated: "Today, 07:15 AM",
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

function pct(consumed, ordered) {
  if (!ordered) return 0;
  return Math.round((consumed / ordered) * 100);
}

function labourDelta(present, target) {
  const diff = present - target;
  if (diff > 0) return { label: `+${diff} over target`, type: "up" };
  if (diff < 0) return { label: `${diff} below target`, type: "down" };
  return { label: "On target", type: "flat" };
}

function StatusBadge({ value }) {
  const map = {
    active: { label: "Active", cls: "res-badge--green" },
    idle: { label: "Idle", cls: "res-badge--amber" },
    offsite: { label: "Off-site", cls: "res-badge--muted" },
  };
  const { label, cls } = map[value] || { label: value, cls: "" };
  return <span className={`res-badge ${cls}`}>{label}</span>;
}

// ─── section wrapper ──────────────────────────────────────────────────────────

function Section({ id, icon: Icon, title, colour, count, children }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="res-section" id={id}>
      <button
        type="button"
        className="res-section-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="res-section-icon" style={{ background: colour + "18", color: colour }}>
          <Icon size={18} />
        </span>

        <span className="res-section-title">{title}</span>

        {count !== undefined && (
          <span className="res-section-count">{count}</span>
        )}

        <span className="res-section-chevron">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>

      {open && <div className="res-section-body">{children}</div>}
    </section>
  );
}

// ─── Materials ────────────────────────────────────────────────────────────────

function MaterialsSection({ canEdit }) {
  const [rows, setRows] = useState(initialMaterials);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});

  function startEdit(row) {
    setEditing(row.id);
    setDraft({ consumed: row.consumed, onSite: row.onSite });
  }

  function saveEdit(id) {
    setRows((r) =>
      r.map((row) =>
        row.id === id
          ? {
            ...row,
            consumed: Number(draft.consumed),
            onSite: Number(draft.onSite),
            lastUpdated: "Just now",
          }
          : row
      )
    );
    setEditing(null);
  }

  return (
    <Section
      id="materials"
      icon={Package}
      title="Materials"
      colour="#1e2761"
      count={rows.length}
    >
      <p className="res-section-desc">
        Cement, sand, aggregate, steel, tiles and tile adhesive
      </p>

      <div className="res-table-wrap">
        <table className="res-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Ordered</th>
              <th>Consumed</th>
              <th>On Site</th>
              <th>Usage</th>
              <th>Last Update</th>
              {canEdit && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const p = pct(row.consumed, row.totalOrdered);
              const isEditing = editing === row.id;
              return (
                <tr key={row.id}>
                  <td>
                    <strong>{row.name}</strong>
                    <span className="res-unit">{row.unit}</span>
                  </td>
                  <td>{row.totalOrdered.toLocaleString()}</td>

                  <td>
                    {isEditing ? (
                      <input
                        className="res-inline-input"
                        type="number"
                        value={draft.consumed}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, consumed: e.target.value }))
                        }
                      />
                    ) : (
                      row.consumed.toLocaleString()
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className="res-inline-input"
                        type="number"
                        value={draft.onSite}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, onSite: e.target.value }))
                        }
                      />
                    ) : (
                      row.onSite.toLocaleString()
                    )}
                  </td>

                  <td>
                    <div className="res-prog-wrap">
                      <div className="res-prog-bar">
                        <div
                          className="res-prog-fill"
                          style={{
                            width: `${p}%`,
                            background:
                              p >= 90
                                ? "#c93d4b"
                                : p >= 70
                                  ? "#b7791f"
                                  : "#1e2761",
                          }}
                        />
                      </div>
                      <span className="res-prog-pct">{p}%</span>
                    </div>
                  </td>

                  <td className="res-muted">{row.lastUpdated}</td>

                  {canEdit && (
                    <td>
                      {isEditing ? (
                        <div className="res-row-actions">
                          <button
                            className="res-icon-btn res-icon-btn--save"
                            onClick={() => saveEdit(row.id)}
                            title="Save"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            className="res-icon-btn"
                            onClick={() => setEditing(null)}
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="res-icon-btn"
                          onClick={() => startEdit(row)}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── Labour ──────────────────────────────────────────────────────────────────

function LabourSection({ canEdit }) {
  const [rows, setRows] = useState(initialLabour);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});

  function startEdit(row) {
    setEditing(row.id);
    setDraft({
      skilled: row.skilled,
      unskilled: row.unskilled,
      presentToday: row.presentToday,
    });
  }

  function saveEdit(id) {
    setRows((r) =>
      r.map((row) =>
        row.id === id
          ? {
            ...row,
            skilled: Number(draft.skilled),
            unskilled: Number(draft.unskilled),
            presentToday: Number(draft.presentToday),
            lastUpdated: "Just now",
          }
          : row
      )
    );
    setEditing(null);
  }

  const totalPresent = rows.reduce((s, r) => s + r.presentToday, 0);
  const totalTarget = rows.reduce((s, r) => s + r.targetToday, 0);

  return (
    <Section
      id="labour"
      icon={Users}
      title="Labour"
      colour="#16855b"
      count={rows.length + " contractors"}
    >
      <p className="res-section-desc">
        Contractor-wise work type, skilled workers, unskilled workers and daily totals
      </p>

      <div className="res-labour-summary">
        <div className="res-labour-kpi">
          <span>Total Present Today</span>
          <strong>{totalPresent}</strong>
        </div>
        <div className="res-labour-kpi">
          <span>Total Target</span>
          <strong>{totalTarget}</strong>
        </div>
        <div
          className={`res-labour-kpi ${totalPresent < totalTarget ? "res-labour-kpi--warn" : "res-labour-kpi--ok"
            }`}
        >
          <span>Workforce Status</span>
          <strong>
            {totalPresent >= totalTarget
              ? "On / Above Target"
              : `${totalTarget - totalPresent} Short`}
          </strong>
        </div>
      </div>

      <div className="res-table-wrap">
        <table className="res-table">
          <thead>
            <tr>
              <th>Contractor</th>
              <th>Work Type</th>
              <th>Skilled</th>
              <th>Unskilled</th>
              <th>Present / Target</th>
              <th>Variance</th>
              <th>Updated</th>
              {canEdit && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const delta = labourDelta(row.presentToday, row.targetToday);
              const isEditing = editing === row.id;
              return (
                <tr key={row.id}>
                  <td>
                    <strong>{row.contractor}</strong>
                  </td>
                  <td className="res-muted">{row.workType}</td>

                  <td>
                    {isEditing ? (
                      <input
                        className="res-inline-input res-inline-input--sm"
                        type="number"
                        value={draft.skilled}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, skilled: e.target.value }))
                        }
                      />
                    ) : (
                      row.skilled
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className="res-inline-input res-inline-input--sm"
                        type="number"
                        value={draft.unskilled}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, unskilled: e.target.value }))
                        }
                      />
                    ) : (
                      row.unskilled
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className="res-inline-input res-inline-input--sm"
                        type="number"
                        value={draft.presentToday}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, presentToday: e.target.value }))
                        }
                      />
                    ) : (
                      <span>
                        <strong>{row.presentToday}</strong>
                        <span className="res-muted"> / {row.targetToday}</span>
                      </span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`res-delta ${delta.type === "up"
                        ? "res-delta--green"
                        : delta.type === "down"
                          ? "res-delta--red"
                          : "res-delta--flat"
                        }`}
                    >
                      {delta.type === "up" && <TrendingUp size={13} />}
                      {delta.type === "down" && <TrendingDown size={13} />}
                      {delta.type === "flat" && <Minus size={13} />}
                      {delta.label}
                    </span>
                  </td>

                  <td className="res-muted">{row.lastUpdated}</td>

                  {canEdit && (
                    <td>
                      {isEditing ? (
                        <div className="res-row-actions">
                          <button
                            className="res-icon-btn res-icon-btn--save"
                            onClick={() => saveEdit(row.id)}
                            title="Save"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            className="res-icon-btn"
                            onClick={() => setEditing(null)}
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="res-icon-btn"
                          onClick={() => startEdit(row)}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── Staff ───────────────────────────────────────────────────────────────────

function StaffSection({ canEdit }) {
  const [staff, setStaff] = useState(initialStaff);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", designation: "", phone: "" });

  function addStaff(e) {
    e.preventDefault();
    const initials = form.name
      .trim()
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    setStaff((s) => [
      ...s,
      { id: Date.now(), ...form, initials, onSite: true },
    ]);
    setForm({ name: "", designation: "", phone: "" });
    setShowAdd(false);
  }

  function toggleOnSite(id) {
    setStaff((s) =>
      s.map((m) => (m.id === id ? { ...m, onSite: !m.onSite } : m))
    );
  }

  const onSiteCount = staff.filter((s) => s.onSite).length;

  return (
    <Section
      id="staff"
      icon={HardHat}
      title="Staff"
      colour="#7c3aed"
      count={`${onSiteCount} on-site`}
    >
      <p className="res-section-desc">
        Engineers, planning engineers and other project personnel
      </p>

      <div className="res-staff-grid">
        {staff.map((member) => (
          <div
            key={member.id}
            className={`res-staff-card ${member.onSite ? "" : "res-staff-card--away"}`}
          >
            <div className="res-staff-avatar">{member.initials}</div>
            <div className="res-staff-info">
              <strong>{member.name}</strong>
              <span>{member.designation}</span>
              <span className="res-staff-phone">{member.phone}</span>
            </div>
            <div className="res-staff-meta">
              <span
                className={`res-badge ${member.onSite ? "res-badge--green" : "res-badge--muted"}`}
              >
                {member.onSite ? "On Site" : "Off Site"}
              </span>
              {canEdit && (
                <button
                  className="res-toggle-btn"
                  type="button"
                  onClick={() => toggleOnSite(member.id)}
                  title="Toggle on-site status"
                >
                  Toggle
                </button>
              )}
            </div>
          </div>
        ))}

        {canEdit && (
          <button
            type="button"
            className="res-staff-add-card"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={20} />
            <span>Add Staff</span>
          </button>
        )}
      </div>

      {showAdd && (
        <div className="team-modal-backdrop">
          <div className="team-modal">
            <div className="team-modal-header">
              <div>
                <h3>Add Staff Member</h3>
                <p>Add project personnel to this project.</p>
              </div>
              <button
                type="button"
                className="team-modal-close"
                onClick={() => setShowAdd(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={addStaff}>
              <label>
                Full name
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </label>

              <label>
                Designation
                <input
                  value={form.designation}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, designation: e.target.value }))
                  }
                  placeholder="e.g. Site Engineer"
                  required
                />
              </label>

              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                />
              </label>

              <div className="team-modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Section>
  );
}

// ─── Machinery & Vehicles ─────────────────────────────────────────────────────

function MachinerySection({ canEdit }) {
  const [rows, setRows] = useState(initialMachinery);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});

  function startEdit(row) {
    setEditing(row.id);
    setDraft({ fuelToday: row.fuelToday, fuelStock: row.fuelStock, status: row.status });
  }

  function saveEdit(id) {
    setRows((r) =>
      r.map((row) =>
        row.id === id
          ? {
            ...row,
            fuelToday: Number(draft.fuelToday),
            fuelStock: Number(draft.fuelStock),
            status: draft.status,
            lastUpdated: "Just now",
          }
          : row
      )
    );
    setEditing(null);
  }

  return (
    <Section
      id="machinery"
      icon={Truck}
      title="Machinery & Vehicles"
      colour="#0369a1"
      count={rows.length}
    >
      <p className="res-section-desc">
        Equipment usage, fuel consumption and remaining stock where applicable
      </p>

      <div className="res-table-wrap">
        <table className="res-table">
          <thead>
            <tr>
              <th>Equipment / Vehicle</th>
              <th>Type</th>
              <th>Status</th>
              <th>
                <span className="res-th-icon">
                  <Fuel size={13} />
                </span>
                Fuel Today (L)
              </th>
              <th>
                <span className="res-th-icon">
                  <BarChart3 size={13} />
                </span>
                Fuel Stock (L)
              </th>
              <th>Last Updated</th>
              {canEdit && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isEditing = editing === row.id;
              return (
                <tr key={row.id}>
                  <td>
                    <strong>{row.name}</strong>
                  </td>
                  <td className="res-muted">{row.type}</td>

                  <td>
                    {isEditing ? (
                      <select
                        className="res-inline-select"
                        value={draft.status}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, status: e.target.value }))
                        }
                      >
                        <option value="active">Active</option>
                        <option value="idle">Idle</option>
                        <option value="offsite">Off-site</option>
                      </select>
                    ) : (
                      <StatusBadge value={row.status} />
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className="res-inline-input res-inline-input--sm"
                        type="number"
                        value={draft.fuelToday}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, fuelToday: e.target.value }))
                        }
                      />
                    ) : (
                      row.fuelToday > 0 ? `${row.fuelToday} L` : "—"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        className="res-inline-input res-inline-input--sm"
                        type="number"
                        value={draft.fuelStock}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, fuelStock: e.target.value }))
                        }
                      />
                    ) : (
                      <span
                        className={
                          row.fuelStock < 100 ? "res-warn-text" : ""
                        }
                      >
                        {row.fuelStock} L
                      </span>
                    )}
                  </td>

                  <td className="res-muted">{row.lastUpdated}</td>

                  {canEdit && (
                    <td>
                      {isEditing ? (
                        <div className="res-row-actions">
                          <button
                            className="res-icon-btn res-icon-btn--save"
                            onClick={() => saveEdit(row.id)}
                            title="Save"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            className="res-icon-btn"
                            onClick={() => setEditing(null)}
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="res-icon-btn"
                          onClick={() => startEdit(row)}
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Resources() {
  const { project, demoRole } = useApp();

  // Planning engineers + builders can edit; everyone else read-only
  const canEdit =
    demoRole === "engineer" ||
    demoRole === "projectManager" ||
    demoRole === "builder";

  return (
    <div className="res-page">
      {/* Header */}
      <div className="res-page-header">
        <div>
          <span className="page-eyebrow">PROJECT RESOURCES</span>
          <h2>Resource Management</h2>
          <p>
            Live resource data for <strong>{project?.name || "this project"}</strong>.
            {canEdit
              ? " As planning engineer, you can update all fields below."
              : " Data is updated daily by the planning engineer."}
          </p>
        </div>

        {canEdit && (
          <span className="res-edit-badge">
            <Edit3 size={14} />
            Edit Mode Active
          </span>
        )}
      </div>

      {/* Quick-nav pills */}
      <div className="res-quicknav">
        {[
          { label: "Materials", href: "#materials", colour: "#1e2761" },
          { label: "Labour", href: "#labour", colour: "#16855b" },
          { label: "Staff", href: "#staff", colour: "#7c3aed" },
          { label: "Machinery", href: "#machinery", colour: "#0369a1" },
        ].map((n) => (
          <a key={n.href} href={n.href} className="res-pill" style={{ "--pill-c": n.colour }}>
            {n.label}
          </a>
        ))}
      </div>

      {/* Four resource sections */}
      <div className="res-sections">
        <MaterialsSection canEdit={canEdit} />
        <LabourSection canEdit={canEdit} />
        <StaffSection canEdit={canEdit} />
        <MachinerySection canEdit={canEdit} />
      </div>
    </div>
  );
}
