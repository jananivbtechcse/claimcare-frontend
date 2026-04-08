
// export default AdminUsers;



import { useEffect, useState, useCallback } from "react";
import Layout from "../../Layout/Layout";
import adminService from "../../../services/adminService";
import StatusBadge from "../../Common/StatusBadge";
import Paginator from "../../Common/Paginator";

const ROLES = ["Admin", "Patient", "HealthcareProvider", "InsuranceCompany"];
const PAGE_SIZE = 10;

const ROLE_COLOR = {
  Admin:              "danger",
  Patient:            "primary",
  HealthcareProvider: "success",
  InsuranceCompany:   "warning",
};

const Field = ({ label, type = "text", placeholder, value, onChange }) => (
  <div className="mb-3">
    <label className="form-label fw-semibold small">{label}</label>
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

const Modal = ({ title, onClose, onConfirm, confirmLabel, confirmDisabled, error, children }) => (
  <div
    className="modal d-block"
    tabIndex="-1"
    style={{ background: "rgba(0,0,0,0.45)", zIndex: 1050 }}
    onClick={e => e.target === e.currentTarget && onClose()}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content border-0 shadow">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold">{title}</h5>
          <button className="btn-close" onClick={onClose} />
        </div>
        <div className="modal-body pt-3">
          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
          {children}
        </div>
        <div className="modal-footer border-0 pt-0">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={confirmDisabled}>
            {confirmDisabled ? "Saving..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AdminUsers = () => {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [page,       setPage]       = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ fullName: "", email: "", phoneNumber: "", password: "", roleName: "Patient" });
  const [addBusy, setAddBusy] = useState(false);
  const [addErr,  setAddErr]  = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ userId: null, fullName: "", email: "", phoneNumber: "", roleName: "Patient" });
  const [editBusy, setEditBusy] = useState(false);
  const [editErr,  setEditErr]  = useState("");

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // ── load uses the page number directly ──────────────────────────────────────
  // const load = useCallback(async (pageNum) => {
  //   setLoading(true);
  //   try {
  //     const res = await adminService.getUsers(pageNum, PAGE_SIZE);
  //     setUsers(res.items ?? []);
  //     setTotalCount(res.totalCount ?? 0);
  //   } catch (e) {
  //     console.error("getUsers error:", e);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  const load = useCallback(async (pageNum) => {
  setLoading(true);
  try {
    const res = await adminService.getUsers(pageNum, PAGE_SIZE);
    setUsers(res.items ?? []);
    setTotalCount(res.totalCount ?? 0);
  } catch (e) {
    console.error("getUsers error:", e);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { load(1); }, [load]);

  // ── pagination: update page state AND fetch ──────────────────────────────────
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    load(newPage);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await adminService.deleteUser(id);
      // If deleting last item on a page > 1, go back one page
      const newPage = users.length === 1 && page > 1 ? page - 1 : page;
      setPage(newPage);
      load(newPage);
    } catch {
      alert("Failed to delete user.");
    }
  };

  const openAdd = () => {
    setAddForm({ fullName: "", email: "", phoneNumber: "", password: "", roleName: "Patient" });
    setAddErr("");
    setAddOpen(true);
  };

  const handleAdd = async () => {
    if (!addForm.fullName.trim() || !addForm.email.trim() ||
        !addForm.password.trim() || !addForm.phoneNumber.trim()) {
      setAddErr("All fields are required.");
      return;
    }
    setAddBusy(true);
    setAddErr("");
    try {
      await adminService.createUser({
        fullName:    addForm.fullName.trim(),
        email:       addForm.email.trim(),
        phoneNumber: addForm.phoneNumber.trim(),
        password:    addForm.password,
        roleName:    addForm.roleName,
      });
      setAddOpen(false);
      load(page);
    } catch (e) {
      const data = e.response?.data;
      const validationMsgs = data?.errors
        ? Object.values(data.errors).flat().join(" ")
        : null;
      setAddErr(
        validationMsgs ||
        data?.message ||
        (typeof data === "string" ? data : null) ||
        "Failed to create user."
      );
    } finally {
      setAddBusy(false);
    }
  };

  const openEdit = (u) => {
    setEditForm({
      userId:      u.userId,
      fullName:    u.fullName    || "",
      email:       u.email       || "",
      phoneNumber: u.phoneNumber || "",
      roleName:    u.role        || "Patient",
    });
    setEditErr("");
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editForm.fullName.trim() || !editForm.email.trim() || !editForm.phoneNumber.trim()) {
      setEditErr("All fields are required.");
      return;
    }
    setEditBusy(true);
    setEditErr("");
    try {
      await adminService.updateUser(editForm.userId, {
        fullName:    editForm.fullName.trim(),
        email:       editForm.email.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
        roleName:    editForm.roleName,
      });
      setEditOpen(false);
      load(page);
    } catch (e) {
      const data = e.response?.data;
      const validationMsgs = data?.errors
        ? Object.values(data.errors).flat().join(" ")
        : null;
      setEditErr(
        validationMsgs ||
        data?.message ||
        (typeof data === "string" ? data : null) ||
        "Failed to update user."
      );
    } finally {
      setEditBusy(false);
    }
  };

  const roleBadge = (role) => {
    const color = ROLE_COLOR[role] || "secondary";
    return (
      <span className={`badge bg-${color} ${color === "warning" ? "text-dark" : ""}`}>
        {role || "N/A"}
      </span>
    );
  };

  const visible = users.filter(u => {
    const q = search.toLowerCase();
    const matchName =
      (u.fullName || "").toLowerCase().includes(q) ||
      (u.email    || "").toLowerCase().includes(q);
    const matchRole = roleFilter === "All Roles" || u.role === roleFilter;
    return matchName && matchRole;
  });

  return (
    <Layout role="Admin">

      <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0 text-muted">Search</span>
          <input
            className="form-control border-start-0"
            placeholder="Search name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); load(1); }}
          />
        </div>

        <select
          className="form-select"
          style={{ maxWidth: 200 }}
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="All Roles">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <button className="btn btn-primary ms-auto" onClick={openAdd}>
          Add User
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ minWidth: 150 }}>Name</th>
                <th style={{ minWidth: 200 }}>Email</th>
                <th style={{ minWidth: 130 }}>Phone</th>
                <th style={{ minWidth: 150 }}>Role</th>
                <th style={{ minWidth: 90  }}>Status</th>
                <th style={{ minWidth: 130 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Loading users...
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No users found.
                  </td>
                </tr>
              ) : visible.map(u => (
                <tr key={u.userId}>
                  <td className="fw-semibold">{u.fullName         || "—"}</td>
                  <td className="text-muted small">{u.email       || "—"}</td>
                  <td className="text-muted small">{u.phoneNumber || "—"}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td><StatusBadge status={u.isActive ? "active" : "cancelled"} /></td>
                  <td>
                    <div className="d-flex gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(u.userId)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Paginator with all required props */}
        <Paginator
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>

      {addOpen && (
        <Modal
          title="Add New User"
          onClose={() => setAddOpen(false)}
          onConfirm={handleAdd}
          confirmLabel="Create User"
          confirmDisabled={addBusy}
          error={addErr}
        >
          <Field label="Full Name" placeholder="Enter full name"
            value={addForm.fullName}
            onChange={e => setAddForm(p => ({ ...p, fullName: e.target.value }))} />
          <Field label="Email" placeholder="Enter email" type="email"
            value={addForm.email}
            onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} />
          <Field label="Phone Number" placeholder="Enter phone number"
            value={addForm.phoneNumber}
            onChange={e => setAddForm(p => ({ ...p, phoneNumber: e.target.value }))} />
          <Field label="Password" placeholder="Enter password" type="password"
            value={addForm.password}
            onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} />
          <div className="mb-3">
            <label className="form-label fw-semibold small">Role</label>
            <select
              className="form-select"
              value={addForm.roleName}
              onChange={e => setAddForm(p => ({ ...p, roleName: e.target.value }))}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {editOpen && (
        <Modal
          title="Edit User"
          onClose={() => setEditOpen(false)}
          onConfirm={handleEdit}
          confirmLabel="Save Changes"
          confirmDisabled={editBusy}
          error={editErr}
        >
          <Field label="Full Name" placeholder="Enter full name"
            value={editForm.fullName}
            onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))} />
          <Field label="Email" placeholder="Enter email" type="email"
            value={editForm.email}
            onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} />
          <Field label="Phone Number" placeholder="Enter phone number"
            value={editForm.phoneNumber}
            onChange={e => setEditForm(p => ({ ...p, phoneNumber: e.target.value }))} />
          <div className="mb-3">
            <label className="form-label fw-semibold small">Role</label>
            <select
              className="form-select"
              value={editForm.roleName}
              onChange={e => setEditForm(p => ({ ...p, roleName: e.target.value }))}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </Modal>
      )}

    </Layout>
  );
};

export default AdminUsers;