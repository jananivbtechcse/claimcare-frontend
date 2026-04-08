import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import patientService from "../../../services/patientService";

// ── Gender options ─────────────────────────────────────────────────────────────
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

// ── Avatar initials helper ─────────────────────────────────────────────────────
const getInitials = (name) => {
  if (!name) return "P";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ── component ──────────────────────────────────────────────────────────────────
const ProfilePage = () => {
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [editMode, setEditMode] = useState(false);

  // form fields
  const [form, setForm] = useState({
    dateOfBirth:      "",
    gender:           "",
    address:          "",
    symptoms:         "",
    treatmentDetails: "",
  });

  // ── fetch profile ────────────────────────────────────────────────────────────
  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await patientService.getProfile();
      setProfile(data);
      setForm({
        dateOfBirth:      data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
        gender:           data.gender           || "",
        address:          data.address          || "",
        symptoms:         data.symptoms         || "",
        treatmentDetails: data.treatmentDetails || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // ── handle input ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── save ─────────────────────────────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await patientService.completeProfile({
        dateOfBirth:      form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null,
        gender:           form.gender,
        address:          form.address,
        symptoms:         form.symptoms,
        treatmentDetails: form.treatmentDetails,
        // insurancePlanId intentionally omitted — managed via Insurance Plans page
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
        dateOfBirth:      profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
        gender:           profile.gender           || "",
        address:          profile.address          || "",
        symptoms:         profile.symptoms         || "",
        treatmentDetails: profile.treatmentDetails || "",
      });
    }
    setEditMode(false);
    setError("");
  };

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <Layout role="Patient">
      <div className="dashboard-header mb-4">
        <h3 className="dashboard-title">My Profile</h3>
        <p className="text-muted mb-0">View and update your personal health information.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="row g-4">

          {/* ── Left: Avatar card ── */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm text-center p-4 h-100">
              {/* Avatar circle */}
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                style={{
                  width: 90,
                  height: 90,
                  fontSize: 32,
                  background: "linear-gradient(135deg, #1a3c5e 0%, #2d6a9f 100%)",
                  letterSpacing: 1,
                }}
              >
                {getInitials(profile?.fullName || profile?.name || profile?.email)}
              </div>

              <h5 className="fw-semibold mb-1">
                {profile?.fullName || profile?.name || "Patient"}
              </h5>
              <p className="text-muted small mb-3">{profile?.email || ""}</p>

              <hr className="my-2" />

              {/* Quick info pills */}
              <div className="d-flex flex-column gap-2 mt-2 text-start">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>Gender</span>
                  <span className="small text-muted">{profile?.gender || "—"}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>DOB</span>
                  <span className="small text-muted">
                    {profile?.dateOfBirth
                      ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>Plan</span>
                  <span className="small text-muted">
                    {profile?.insurancePlanName || profile?.planName || "No plan"}
                  </span>
                </div>
              </div>

              {/* Edit toggle */}
              {!editMode && (
                <button
                  className="btn btn-primary mt-4 w-100"
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Form card ── */}
          <div className="col-12 col-md-9">
            <div className="card border-0 shadow-sm p-4">

              {success && <div className="alert alert-success py-2 mb-3">{success}</div>}
              {error   && <div className="alert alert-danger  py-2 mb-3">{error}</div>}

              <form onSubmit={handleSave}>
                <div className="row g-3">

                  {/* Date of Birth */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-medium">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      className="form-control"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      disabled={!editMode}
                      max={new Date().toISOString().slice(0, 10)}
                    />
                  </div>

                  {/* Gender */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-medium">Gender</label>
                    <select
                      name="gender"
                      className="form-select"
                      value={form.gender}
                      onChange={handleChange}
                      disabled={!editMode}
                    >
                      <option value="">— Select gender —</option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <label className="form-label fw-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="Enter your address"
                      value={form.address}
                      onChange={handleChange}
                      disabled={!editMode}
                    />
                  </div>

                  {/* Symptoms */}
                  <div className="col-12">
                    <label className="form-label fw-medium">Symptoms</label>
                    <textarea
                      name="symptoms"
                      className="form-control"
                      rows={3}
                      placeholder="Describe your current symptoms…"
                      value={form.symptoms}
                      onChange={handleChange}
                      disabled={!editMode}
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  {/* Treatment Details */}
                  <div className="col-12">
                    <label className="form-label fw-medium">Treatment Details</label>
                    <textarea
                      name="treatmentDetails"
                      className="form-control"
                      rows={3}
                      placeholder="Describe your current or past treatment details…"
                      value={form.treatmentDetails}
                      onChange={handleChange}
                      disabled={!editMode}
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  {/* Insurance plan note */}
                 

                </div>

                {/* Action buttons — only in edit mode */}
                {editMode && (
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          Saving…
                        </>
                      ) : (
                        "Save Changes"
                      )}
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

export default ProfilePage;