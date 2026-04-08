import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import providerService from "../../../services/ProviderService";


const getInitials = (name) => {
  if (!name) return "HP";
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
};


const claimBadgeColor = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "approved")                    return "success";
  if (s === "rejected" || s === "denied")  return "danger";
  if (s === "pending")                     return "warning";
  if (s === "paid")                        return "primary";
  return "secondary";
};

const ProviderProfilePage = () => {
  const [profile,       setProfile]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState("");
  const [editMode,      setEditMode]      = useState(false);
  const [claims,        setClaims]        = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(true);
  const [claimsError,   setClaimsError]   = useState("");

  const [form, setForm] = useState({
    hospitalName:  "",
    licenseNumber: "",
    address:       "",
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await providerService.getProfile();
      setProfile(data);
      setForm({
        hospitalName:  data.hospitalName  || "",
        licenseNumber: data.licenseNumber || "",
        address:       data.address       || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  
  const fetchClaims = async () => {
    setClaimsLoading(true);
    setClaimsError("");
    try {
      const data = await providerService.getClaims(1, 100);
      const list = Array.isArray(data) ? data : (data?.items ?? []);
      setClaims(list);
    } catch (err) {
      setClaimsError(err.response?.data?.message || "Failed to load claims.");
    } finally {
      setClaimsLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); fetchClaims(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await providerService.completeProfile({
        hospitalName:  form.hospitalName,
        licenseNumber: form.licenseNumber,
        address:       form.address,
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
        hospitalName:  profile.hospitalName  || "",
        licenseNumber: profile.licenseNumber || "",
        address:       profile.address       || "",
      });
    }
    setEditMode(false);
    setError("");
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const parsed = new Date(d);
    return isNaN(parsed) ? d : parsed.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  return (
    <Layout role="provider">
      <div className="dashboard-header mb-4">
        <h3 className="dashboard-title">Provider Profile</h3>
        <p className="text-muted mb-0">View and manage your hospital details and submitted claims.</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">

            {/* ── Left card ── */}
            <div className="col-12 col-md-3">
              <div className="card border-0 shadow-sm text-center p-4 h-100">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                  style={{
                    width: 90, height: 90, fontSize: 32,
                    background: "linear-gradient(135deg, #0f4c35 0%, #1a7a56 100%)",
                  }}
                >
                  {getInitials(profile?.hospitalName || profile?.fullName || profile?.email)}
                </div>

                <h5 className="fw-semibold mb-1">
                  {profile?.hospitalName || profile?.fullName || "Healthcare Provider"}
                </h5>
                <p className="text-muted small mb-1">{profile?.email        || ""}</p>
                <p className="text-muted small mb-3">{profile?.phoneNumber  || ""}</p>

                <hr className="my-2" />

                <div className="d-flex flex-column gap-2 mt-2 text-start">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>License</span>
                    <span className="small text-muted">{profile?.licenseNumber || "—"}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>Address</span>
                    <span className="small text-muted" style={{ wordBreak: "break-word" }}>
                      {profile?.address || "—"}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-dark border" style={{ fontSize: 11 }}>Claims</span>
                    <span className="small text-muted">{claims.length} total</span>
                  </div>
                </div>

                {!editMode && (
                  <button
                    className="btn btn-primary mt-4 w-100"
                    style={{ background: "linear-gradient(135deg, #0f4c35, #1a7a56)", border: "none" }}
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
                <h5 className="fw-semibold mb-3">Hospital Information</h5>

                {success && <div className="alert alert-success py-2 mb-3">{success}</div>}
                {error   && <div className="alert alert-danger  py-2 mb-3">{error}</div>}

                <form onSubmit={handleSave}>
                  <div className="row g-3">

                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-medium">Hospital Name</label>
                      <input
                        type="text" name="hospitalName" className="form-control"
                        placeholder="Enter hospital name"
                        value={form.hospitalName} onChange={handleChange}
                        disabled={!editMode} required
                      />
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-medium">License Number</label>
                      <input
                        type="text" name="licenseNumber" className="form-control"
                        placeholder="Enter license number"
                        value={form.licenseNumber} onChange={handleChange}
                        disabled={!editMode} required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-medium">Address</label>
                      <input
                        type="text" name="address" className="form-control"
                        placeholder="Enter hospital address"
                        value={form.address} onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="col-12">
                      <div className="alert alert-light border py-2 mb-0 small">
                        📧 Account email: <strong>{profile?.email || "—"}</strong>
                        {profile?.phoneNumber && (
                          <> &nbsp;|&nbsp; 📞 <strong>{profile.phoneNumber}</strong></>
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
                        style={{ background: "linear-gradient(135deg, #0f4c35, #1a7a56)", border: "none" }}
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

          {/* ── Claims table ── */}
          <div className="card border-0 shadow-sm p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-semibold mb-0">My Claims</h5>
              <span className="badge bg-secondary">{claims.length} total</span>
            </div>

            {claimsLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status" />
              </div>
            ) : claimsError ? (
              <div className="alert alert-danger py-2 small">{claimsError}</div>
            ) : claims.length === 0 ? (
              <p className="text-muted small text-center py-3">No claims submitted yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.875rem" }}>
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Claim Number</th>
                      <th>Invoice Number</th>
                      <th>Claim Amount</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((c, idx) => (
                      <tr key={c.claimId ?? idx}>
                        <td className="text-muted">{idx + 1}</td>
                        <td className="fw-medium">{c.claimNumber    || "—"}</td>
                        <td className="text-muted small">{c.invoiceNumber || "—"}</td>
                        <td>₹{(c.claimAmount  || 0).toLocaleString("en-IN")}</td>
                        <td>₹{(c.totalAmount  || 0).toLocaleString("en-IN")}</td>
                        <td>
                          <span className={`badge bg-${claimBadgeColor(c.status)}`}>
                            {c.status || "Unknown"}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {formatDate(c.submissionDate || c.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export default ProviderProfilePage;