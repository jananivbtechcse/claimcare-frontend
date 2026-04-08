

import { useEffect, useState, useMemo } from "react";
import Layout from "../../Layout/Layout";
import patientService from "../../../services/patientService";
import { Shield, Check, X, CheckCircle2, Building2, Tag, IndianRupee, Hospital, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const fmtAmt = (v) => v == null ? "—" : "₹" + Number(v).toLocaleString("en-IN");



const mapPlan = (p) => ({
  id:           p.insurancePlanId ?? p.planId ?? p.id,
  name:         p.planName        ?? p.name   ?? "—",
  description:  p.description     ?? "",
  
  coverage:     p.coverageAmount  ?? p.coverage ?? 0,

 
  premium:      (p.coverageAmount ?? p.coverage ?? 0) / 100,

  coverageType: p.coverageType    ?? p.type    ?? "General",
  hospital:     p.hospitalName    ?? p.hospital ?? "—",
  provider:     p.insuranceCompanyName ?? p.providerName ?? p.provider ?? "—",
  isActive:     p.isActive        ?? p.active  ?? true,

  features: Array.isArray(p.features)
    ? p.features
    : p.features
    ? String(p.features).split(",").map(s => s.trim())
    : [],

  _raw: p,
});
const PAGE_SIZE = 6;

/* ── FilterBar ── */
const FilterBar = ({ plans, filters, onChange }) => {
  const hospitals = [...new Set(plans.map(p => p.provider).filter(Boolean).filter(p => p !== "—"))];
 
  const providers = [...new Set(
  plans.map(p => p.provider).filter(Boolean).filter(v => v !== "—")
)];
  const handle        = (key, val) => onChange({ ...filters, [key]: val });
  const clear         = () => onChange({ hospital: "", coverageType: "", provider: "", maxPremium: "" });
  const hasAny        = Object.values(filters).some(Boolean);

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body py-3">
        <div className="d-flex align-items-center gap-2 mb-3">
        
          
          {hasAny && (
            <button className="btn btn-sm btn-link text-danger p-0 ms-auto small" onClick={clear}>
              Clear all
            </button>
          )}
        </div>
        <div className="row g-2">
          
          
          <div className="col-md-3 col-sm-6">
            <label className="form-label small text-muted mb-1">Insurance Provider</label>
            <select className="form-select form-select-sm" value={filters.provider}
              onChange={e => handle("provider", e.target.value)}>
              <option value="">insurance companies</option>
              {providers.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
        </div>
      </div>
    </div>
  );
};

/* ── PlanCard ── */
const PlanCard = ({ plan, onSelect, selectingId, toast }) => {
  const isSelecting = selectingId === plan.id;
  return (
    <div className="col-md-4 col-sm-6">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body d-flex flex-column p-4">

          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="rounded-3 bg-primary d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: 44, height: 44 }}>
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <div className="fw-bold" style={{ fontSize: "0.95rem" }}>{plan.name}</div>
              <div className="text-muted small">{plan.provider}</div>
            </div>
          </div>

          <div className="mb-2">
           <span className="fw-bold text-primary" style={{ fontSize: "1.5rem" }}>
  {fmtAmt(plan.coverage / 100)}
</span>
<span className="text-muted small ms-1">/month</span>
          </div>

          <div className="d-flex gap-2 mb-3 flex-wrap">
            <span className="badge bg-primary-subtle text-primary small">{plan.coverageType}</span>
            <span className="badge bg-success-subtle text-success small">Coverage: {fmtAmt(plan.coverage)}</span>
          </div>

          {plan.hospital && plan.hospital !== "—" && (
            <div className="text-muted small mb-2 d-flex align-items-center gap-1">
              <Hospital size={12} /> {plan.hospital}
            </div>
          )}

          {plan.description && (
            <p className="text-muted small mb-3">{plan.description}</p>
          )}

          {plan.features.length > 0 && (
            <ul className="list-unstyled mb-3 flex-grow-1">
              {plan.features.slice(0, 4).map((f, i) => (
                <li key={i} className="d-flex align-items-start gap-2 mb-1 small">
                  <Check size={13} className="text-success flex-shrink-0 mt-1" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <button className="btn btn-primary w-100 mt-auto"
            onClick={() => onSelect(plan)}
            disabled={isSelecting}>
            {isSelecting
              ? <><span className="spinner-border spinner-border-sm me-2" />Selecting…</>
              : "Select Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Success Drawer ── */
const SuccessDrawer = ({ plan, onClose }) => {
  if (!plan) return null;
  return (
    <>
      <div onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1040 }} />
      <div style={{
        position: "fixed", top: 0, right: 0,
        width: "min(420px,100vw)", height: "100vh",
        background: "#fff", zIndex: 1050,
        boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column",
      }}>
        <div className="bg-primary p-4 text-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-bold">Plan Confirmed</span>
            <button onClick={onClose}
              className="btn btn-sm text-white border-0 p-1"
              style={{ background: "rgba(255,255,255,0.2)" }}>
              <X size={16} />
            </button>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-3 p-2" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Shield size={26} color="#fff" />
            </div>
            <div>
              <div className="fw-bold fs-5">{plan.name}</div>
              <div style={{ opacity: 0.85, fontSize: "0.82rem" }}>{plan.provider}</div>
            </div>
          </div>
        </div>

        <div className="flex-grow-1 overflow-auto p-4">
          <div className="d-flex align-items-center gap-2 p-3 mb-4 rounded-3"
            style={{ background: "#ecfdf5", color: "#059669" }}>
            <CheckCircle2 size={20} />
            <div>
              <div className="fw-semibold small">Plan Selected Successfully</div>
              <div style={{ fontSize: "0.78rem" }}>A confirmation email has been sent to you.</div>
            </div>
          </div>

          <p className="fw-semibold small text-muted text-uppercase mb-3">Plan Summary</p>
          {[
            ["Monthly Premium", fmtAmt(plan.premium)],
            ["Coverage Amount", fmtAmt(plan.coverage)],
            ["Coverage Type",   plan.coverageType],
            ["Hospital",        plan.hospital],
            ["Provider",        plan.provider],
          ].map(([label, value]) => (
            <div key={label} className="d-flex justify-content-between py-2 px-3 rounded-3 mb-2 bg-light">
              <span className="text-muted small">{label}</span>
              <span className="fw-semibold small">{value || "—"}</span>
            </div>
          ))}

          {plan.features.length > 0 && (
            <>
              <p className="fw-semibold small text-muted text-uppercase mt-4 mb-3">Included Benefits</p>
              <ul className="list-unstyled">
                {plan.features.map((f, i) => (
                  <li key={i} className="d-flex align-items-start gap-2 mb-2 small">
                    <Check size={13} className="text-success flex-shrink-0 mt-1" />{f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="p-4 border-top">
          <button className="btn btn-outline-secondary w-100" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
};

/* ── Main Page ── */
const InsurancePlansPage = () => {
  const [allPlans,     setAllPlans]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [filters,      setFilters]      = useState({ hospital: "", coverageType: "", provider: "", maxPremium: "" });
  const [serverPage,   setServerPage]   = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [selectingId,  setSelectingId]  = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPage = async (pageNum) => {
    setLoading(true);
    setError("");
    try {
      const res   = await patientService.getAllPlans(pageNum, PAGE_SIZE);
      const items = Array.isArray(res) ? res : (res?.items ?? []);
      const total = res?.totalCount ?? items.length;
      // log first item to confirm real field names
      if (items.length > 0) console.log("Plan sample (raw):", items[0]);
      const mapped = items.map(mapPlan).filter(p => p.isActive !== false);
      setAllPlans(mapped);
      setServerPage(pageNum);
      setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
    } catch (err) {
      setError("Failed to load insurance plans.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPage(1); }, []);

  const filtered = useMemo(() => allPlans.filter(p => {
    if (filters.hospital     && p.hospital     !== filters.hospital)    return false;
    if (filters.coverageType && p.coverageType !== filters.coverageType) return false;
    if (filters.provider     && p.provider     !== filters.provider)    return false;
    if (filters.maxPremium   && p.premium > Number(filters.maxPremium)) return false;
    return true;
  }), [allPlans, filters]);

  const handleSelect = async (plan) => {
    setSelectingId(plan.id);
    try {
      console.log("Selecting plan id:", plan.id, "raw:", plan._raw);
      await patientService.selectPlan(plan.id);
      setSelectedPlan(plan);
    } catch (err) {
      console.error("Select plan error:", err.response?.data);
      const msg = err.response?.data?.message
        || err.response?.data
        || "Could not select plan. Please try again.";
      showToast(typeof msg === "string" ? msg : JSON.stringify(msg), "danger");
    } finally {
      setSelectingId(null); // ← always clears, no more stuck buttons
    }
  };

  return (
    <Layout role="patient">

      {toast && (
        <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3 shadow`}
          style={{ zIndex: 9999 }}>
          {toast.msg}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1">Insurance Plans</h4>
          <p className="text-muted small mb-0">Choose the plan that best fits your healthcare needs.</p>
        </div>
        <span className="badge bg-primary-subtle text-primary">
          {filtered.length} plan{filtered.length !== 1 ? "s" : ""} available
        </span>
      </div>

      {!loading && !error && allPlans.length > 0 && (
        <FilterBar plans={allPlans} filters={filters}
          onChange={f => setFilters(f)} />
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-3 small">Loading plans…</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={() => fetchPage(1)}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <Shield size={40} className="mb-3" />
          <p>No plans match your filters.</p>
          <button className="btn btn-sm btn-outline-primary"
            onClick={() => setFilters({ hospital: "", coverageType: "", provider: "", maxPremium: "" })}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(plan => (
            <PlanCard key={plan.id} plan={plan}
              onSelect={handleSelect}
              selectingId={selectingId} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination mb-0">
            <li className={`page-item ${serverPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => fetchPage(serverPage - 1)}>
                <ChevronLeft size={14} /> Prev
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <li key={p} className={`page-item ${p === serverPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => fetchPage(p)}>{p}</button>
              </li>
            ))}
            <li className={`page-item ${serverPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => fetchPage(serverPage + 1)}>
                Next <ChevronRight size={14} />
              </button>
            </li>
          </ul>
        </nav>
      )}

      <SuccessDrawer plan={selectedPlan} onClose={() => setSelectedPlan(null)} />

    </Layout>
  );
};

export default InsurancePlansPage;