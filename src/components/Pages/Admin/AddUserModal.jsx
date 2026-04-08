// components/modals/AddUserModal.jsx
import { useState } from "react";
import adminService from "../../../services/adminService";
import { X } from "lucide-react";

const ROLES = ["Patient", "Provider", "InsuranceCompany", "Admin"];

const AddUserModal = ({ user = null, defaultRole = "Patient", onClose, onSaved }) => {
  const isEdit = !!user;

  const [form, setForm] = useState({
    name:     user?.name     || "",
    email:    user?.email    || "",
    role:     user?.role     || defaultRole,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || (!isEdit && !form.password)) {
      setError("Please fill all required fields."); return;
    }
    try {
      setLoading(true);
      setError("");
      if (isEdit) {
        await adminService.updateUser(user.id, form);
      } else {
        await adminService.createUser({
          userName: form.name,
          email:    form.email,
          password: form.password,
          role:     form.role,
        });
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1050,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{ width: 440, maxWidth: "95vw", borderRadius: 16 }}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h5 className="fw-bold mb-0">{isEdit ? "Edit User" : "Add New User"}</h5>
            <button className="btn btn-sm btn-outline-secondary p-1" onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}

          {/* Form */}
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-semibold">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter full name"
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">
                Email <span className="text-danger">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-control"
                placeholder="email@example.com"
              />
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="form-select"
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            {!isEdit && (
              <div className="col-12">
                <label className="form-label small fw-semibold">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Min. 8 characters"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Saving…" : isEdit ? "Update" : "Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;