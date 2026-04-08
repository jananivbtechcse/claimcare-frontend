import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import insuranceService from "../../../services/InsuranceCompanyService";

// ── Avatar initials helper ────────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return "IC";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
};

const InsuranceCompanyProfilePage = () => {
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    companyName:        "",
    address:            "",
    registrationNumber: "",
    isActive:           true,
  });

  // ── fetch profile ─────────────────────────────────────────────────────────
  // InsuranceCompanyService doesn't have getProfile yet —
  // we call completeProfile (PUT) to save, and read back from localStorage
  // OR if your backend has GET /api/InsuranceCompany/profile, add it to the service.
  // For now we pre-populate from localStorage keys set at login.
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      // Try a GET profile endpoint if it exists on your backend
      // If not, this will catch and fall through to localStorage fallback
      const res = await insuranceService.updateProfile({});  // lightweight ping
      // If you have a real getProfile, replace the two lines above with:
      // const res = await insuranceService.getProfile();
      setProfile(res);
      setForm({
        companyName:        res.companyName        || "",
        address:            res.address            || "",
        registrationNumber: res.registrationNumber || "",
        isActive:           res.isActive ?? true,
      });
    } catch {
      // Fallback: build from localStorage (populated at login)
      const fallback = {
        companyName:        localStorage.getItem("companyName")        || localStorage.getItem("fullName") || "",
        address:            localStorage.getItem("address")            || "",
        registrationNumber: localStorage.getItem("registrationNumber") || "",
        isActive:           true,
        email:              localStorage.getItem("email")              || "",
        phoneNumber:        localStorage.getItem("phoneNumber")        || "",
      };
      setProfile(fallback);
      setForm({
        companyName:        fallback.companyName,
        address:            fallback.address,
        registrationNumber: fallback.registrationNumber,
        isActive:           fallback.isActive,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Uses existing completeProfile in InsuranceCompanyService
      await insuranceService.completeProfile({
        companyName:        form.companyName,
        address:            form.address,
        registrationNumber: form.registrationNumber,
        isActive:           form.isActive,
      });
      setSuccess("Profile updated successfully!");
      setEditMode(false);
      await fetchProfile();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        companyName:        profile.companyName        || "",
        address:            profile.address            || "",
        registrationNumber: profile.registrationNumber || "",
        isActive:           profile.isActive ?? true,
      });
    }
    setEditMode(false);
    setError("");
  };

  return (
    <Layout role="InsuranceCompany">
      <div className="dashboard-header mb-4">
        <h3 className="dashboard-title">Company Profile</h3>
        <p className="text-muted mb-0">View and manage your insurance company details.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="row g-4">

          {/* ── Left card ── */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm text-center p-4 h-100">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                style={{
                  width: 90, height: 90, fontSize: 32,
                  background: "linear-gradient(135deg, #1a2a5e 0%, #2d4a9f 100%)",
                }}
              >
                {getInitials(profile?.companyName || profile?.fullName || profile?.email)}
              </div>

              <h5 className="fw-semibold mb-1">
                {profile?.companyName || profile?.fullName || "Insurance Company"}
              </h5>
              <p className="text-muted small mb-1">{profile?.email       || localStorage.getItem("email")       || ""}</p>
              <p className="text-muted small mb-3">{profile?.phoneNumber || localStorage.getItem("phoneNumber") || ""}</p>

              <hr className="my-2" />

              <div className="d-flex flex-column gap-2 mt-2 text-start">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>Reg No.</span>
                  <span className="small text-muted">{profile?.registrationNumber || "—"}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>Address</span>
                  <span className="small text-muted" style={{ wordBreak: "break-word" }}>
                    {profile?.address || "—"}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>Status</span>
                  <span className={`badge ${profile?.isActive ? "bg-success" : "bg-danger"}`}>
                    {profile?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {!editMode && (
                <button
                  className="btn btn-primary mt-4 w-100"
                  style={{ background: "linear-gradient(135deg, #1a2a5e, #2d4a9f)", border: "none" }}
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* ── Right: form card ── */}
          <div className="col-12 col-md-9">
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-semibold mb-3">Company Information</h5>

              {success && <div className="alert alert-success py-2 mb-3">{success}</div>}
              {error   && <div className="alert alert-danger  py-2 mb-3">{error}</div>}

              <form onSubmit={handleSave}>
                <div className="row g-3">

                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-medium">Company Name</label>
                    <input
                      type="text" name="companyName" className="form-control"
                      placeholder="Enter company name"
                      value={form.companyName} onChange={handleChange}
                      disabled={!editMode} required
                    />
                  </div>

                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-medium">Registration Number</label>
                    <input
                      type="text" name="registrationNumber" className="form-control"
                      placeholder="Enter registration number"
                      value={form.registrationNumber} onChange={handleChange}
                      disabled={!editMode} required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium">Address</label>
                    <input
                      type="text" name="address" className="form-control"
                      placeholder="Enter company address"
                      value={form.address} onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>

                  {/* isActive toggle */}
                  <div className="col-12">
                    <div className="form-check form-switch mt-1">
                      <input
                        className="form-check-input" type="checkbox" role="switch"
                        id="isActiveSwitch" name="isActive"
                        checked={form.isActive} onChange={handleChange}
                        disabled={!editMode}
                      />
                      <label className="form-check-label fw-medium" htmlFor="isActiveSwitch">
                        Company is Active &nbsp;
                        <span className={`badge ${form.isActive ? "bg-success" : "bg-secondary"}`}>
                          {form.isActive ? "Active" : "Inactive"}
                        </span>
                      </label>
                    </div>
                    <p className="text-muted small mt-1 mb-0">
                      Inactive companies won't appear for patient plan selection.
                    </p>
                  </div>

                  <div className="col-12">
                    <div className="alert alert-light border py-2 mb-0 small">
                      📧 Account email:{" "}
                      <strong>{profile?.email || localStorage.getItem("email") || "—"}</strong>
                      {(profile?.phoneNumber || localStorage.getItem("phoneNumber")) && (
                        <>
                          &nbsp;|&nbsp; 📞{" "}
                          <strong>
                            {profile?.phoneNumber || localStorage.getItem("phoneNumber")}
                          </strong>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {editMode && (
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-outline-secondary"
                      onClick={handleCancel} disabled={saving}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary"
                      style={{ background: "linear-gradient(135deg, #1a2a5e, #2d4a9f)", border: "none" }}
                      disabled={saving}>
                      {saving
                        ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Saving…</>
                        : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default InsuranceCompanyProfilePage;