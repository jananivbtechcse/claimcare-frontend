


// import { useEffect, useState } from "react";
// import Layout from "../../Layout/Layout";
// import patientService from "../../../services/patientService";
// import StatusBadge from "../../Common/StatusBadge";
// import TableSearch from "../../Common/TableSearch";
// import api from "../../../api/api";

// const fmtDate = (raw) => {
//   if (!raw) return "—";
//   const d = new Date(raw);
//   return isNaN(d)
//     ? raw
//     : d.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
// };

// const PAGE_SIZE = 10;

// const InvoiceRequestsPage = () => {
//   const [requests,      setRequests]      = useState([]);
//   const [filtered,      setFiltered]      = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [error,         setError]         = useState("");
//   const [page,          setPage]          = useState(1);

//   const [providers,        setProviders]        = useState([]);
//   const [loadingProviders, setLoadingProviders] = useState(false);

//   const [showModal,     setShowModal]     = useState(false);
//   const [providerId,    setProviderId]    = useState("");
//   const [visitDate,     setVisitDate]     = useState("");
//   const [visitTime,     setVisitTime]     = useState("");
//   const [submitting,    setSubmitting]    = useState(false);
//   const [submitError,   setSubmitError]   = useState("");
//   const [submitSuccess, setSubmitSuccess] = useState("");

//   const fetchRequests = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const data = await patientService.getMyInvoiceRequests();
//       const safe = Array.isArray(data?.items)
//         ? data.items
//         : Array.isArray(data)
//         ? data
//         : [];
//       setRequests(safe);
//       setFiltered(safe);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load invoice requests.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchProviders = async () => {
//   //   setLoadingProviders(true);
//   //   try {
//   //     const res = await api.get("/api/User/providers", {
//   //       params: { PageNumber: 1, PageSize: 100 },
//   //     });
//   //     const raw = res.data;
//   //     const list = Array.isArray(raw) ? raw : (raw?.items ?? []);
//   //     setProviders(
//   //       list.map((p) => ({
//   //         providerId:   p.userId ?? p.providerId,
//   //         providerName: p.fullName ?? `Provider #${p.providerId}`,
//   //       }))
//   //     );
//   //   } catch (err) {
//   //     console.warn("fetchProviders failed:", err.message);
//   //   } finally {
//   //     setLoadingProviders(false);
//   //   }
//   // };


//   const fetchProviders = async () => {
//     setLoadingProviders(true);
//     try {
//         const res = await api.get("/api/Patient/providers/list");
//         const list = Array.isArray(res.data) ? res.data : [];
//         setProviders(list); // shape: [{ providerId (=UserId), providerName }]
//     } catch (err) {
//         console.warn("fetchProviders failed:", err.message);
//     } finally {
//         setLoadingProviders(false);
//     }
// };
//   useEffect(() => { fetchRequests(); }, []);
//   useEffect(() => { if (showModal) fetchProviders(); }, [showModal]);

//   const handleSearch = (q) => {
//     const lower = q.toLowerCase();
//     setPage(1);
//     if (!lower) { setFiltered(requests); return; }
//     setFiltered(
//       requests.filter(
//         (r) =>
//           r.providerName?.toLowerCase().includes(lower) ||
//           r.patientName?.toLowerCase().includes(lower)  ||
//           r.status?.toLowerCase().includes(lower)
//       )
//     );
//   };

//   const handleRequestSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitError("");
//     setSubmitSuccess("");

//     if (!providerId) { setSubmitError("Please select a provider."); return; }
//     if (!visitDate)  { setSubmitError("Please select a visit date."); return; }

//     const combined = visitTime
//       ? `${visitDate}T${visitTime}:00`
//       : `${visitDate}T00:00:00`;

//     const payload = {
//       ProviderId: Number(providerId),
//       VisitDate:  combined,
//     };

//     setSubmitting(true);
//     try {
//       await api.post("/api/Patient/request-invoice", payload);
//       setSubmitSuccess("Invoice request submitted successfully!");
//       setProviderId("");
//       setVisitDate("");
//       setVisitTime("");
//       await fetchRequests();
//       setTimeout(() => { setShowModal(false); setSubmitSuccess(""); }, 1500);
//     } catch (err) {
//       console.log("FULL ERROR:", err.response);
//       console.log("ERROR DATA:", err.response?.data);

//       const msg =
//         err.response?.data?.message ??
//         err.response?.data?.title ??
//         JSON.stringify(err.response?.data) ??
//         "Failed to submit request.";

//       setSubmitError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSubmitError("");
//     setSubmitSuccess("");
//     setProviderId("");
//     setVisitDate("");
//     setVisitTime("");
//   };

//   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   return (
//     <Layout role="Patient">
//       <div className="dashboard-header mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
//         <div>
//           <h3 className="dashboard-title">Invoice Requests</h3>
//           <p className="text-muted mb-0">
//             View and manage your invoice requests from providers.
//           </p>
//         </div>
//         <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//           + Request Invoice
//         </button>
//       </div>

//       <div className="card border-0 shadow-sm">
//         <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
//           <TableSearch
//             onSearch={handleSearch}
//             placeholder="Search by provider, patient or status…"
//           />
//           <span className="text-muted small">
//             {filtered.length} record{filtered.length !== 1 ? "s" : ""}
//           </span>
//         </div>

//         <div className="card-body px-4 pb-4">
//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status" />
//             </div>
//           ) : error ? (
//             <div className="alert alert-danger">{error}</div>
//           ) : paginated.length === 0 ? (
//             <p className="text-muted text-center py-4 mb-0">
//               No invoice requests found.
//             </p>
//           ) : (
//             <>
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Provider</th>
//                       <th>Patient</th>
//                       <th>Visit Date</th>
//                       <th>Requested On</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginated.map((r) => (
//                       <tr key={r.invoiceRequestId}>
//                         <td>{r.providerName || "—"}</td>
//                         <td>{r.patientName  || "—"}</td>
//                         <td style={{ whiteSpace: "nowrap" }}>{fmtDate(r.visitDate)}</td>
//                         <td style={{ whiteSpace: "nowrap" }}>{fmtDate(r.createdAt)}</td>
//                         <td><StatusBadge status={r.status} /></td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="d-flex justify-content-between align-items-center mt-4 px-1">
//                 <span className="text-muted small">
//                   Page {page} of {totalPages}&nbsp;·&nbsp;{filtered.length} records
//                 </span>
//                 <div className="d-flex gap-2">
//                   <button
//                     className="btn btn-sm btn-outline-secondary"
//                     onClick={() => setPage((p) => Math.max(1, p - 1))}
//                     disabled={page <= 1}
//                   >
//                     ← Prev
//                   </button>
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={page >= totalPages}
//                   >
//                     Next →
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {showModal && (
//         <>
//           <div
//             className="modal-backdrop fade show"
//             style={{ zIndex: 1040 }}
//             onClick={closeModal}
//           />
//           <div
//             className="modal fade show d-block"
//             tabIndex="-1"
//             style={{ zIndex: 1050 }}
//             role="dialog"
//           >
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content border-0 shadow">
//                 <div className="modal-header border-0 pb-0">
//                   <h5 className="modal-title fw-semibold">Request an Invoice</h5>
//                   <button
//                     type="button"
//                     className="btn-close"
//                     onClick={closeModal}
//                     aria-label="Close"
//                   />
//                 </div>

//                 <div className="modal-body pt-3">
//                   {submitSuccess && (
//                     <div className="alert alert-success py-2">{submitSuccess}</div>
//                   )}
//                   {submitError && (
//                     <div className="alert alert-danger py-2">{submitError}</div>
//                   )}

//                   <form onSubmit={handleRequestSubmit}>
//                     <div className="mb-3">
//                       <label className="form-label fw-medium" htmlFor="providerSelect">
//                         Provider
//                       </label>
//                       {loadingProviders ? (
//                         <div className="d-flex align-items-center gap-2 py-2">
//                           <div className="spinner-border spinner-border-sm text-primary" />
//                           <span className="text-muted small">Loading providers…</span>
//                         </div>
//                       ) : (
//                         <select
//                           id="providerSelect"
//                           className="form-select"
//                           value={providerId}
//                           onChange={(e) => setProviderId(e.target.value)}
//                           required
//                         >
//                           <option value="">
//                             {providers.length === 0
//                               ? "No providers available"
//                               : "— Select a provider —"}
//                           </option>
//                           {providers.map((p) => (
//                             <option key={`${p.providerId}-${p.providerName}`} value={p.providerId}>
//                               {p.providerName}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     </div>

//                     <div className="row g-3 mb-4">
//                       <div className="col-7">
//                         <label className="form-label fw-medium" htmlFor="visitDate">
//                           Visit Date
//                         </label>
//                         <input
//                           id="visitDate"
//                           type="date"
//                           className="form-control"
//                           value={visitDate}
//                           onChange={(e) => setVisitDate(e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div className="col-5">
//                         <label className="form-label fw-medium" htmlFor="visitTime">
//                           Time{" "}
//                           <span className="text-muted fw-normal">(optional)</span>
//                         </label>
//                         <input
//                           id="visitTime"
//                           type="time"
//                           className="form-control"
//                           value={visitTime}
//                           onChange={(e) => setVisitTime(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     <div className="d-flex justify-content-end gap-2">
//                       <button
//                         type="button"
//                         className="btn btn-outline-secondary"
//                         onClick={closeModal}
//                         disabled={submitting}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="btn btn-primary"
//                         disabled={submitting || loadingProviders}
//                       >
//                         {submitting ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2" />
//                             Submitting…
//                           </>
//                         ) : (
//                           "Submit Request"
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </Layout>
//   );
// };

// export default InvoiceRequestsPage;


import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import patientService from "../../../services/patientService";
import StatusBadge from "../../Common/StatusBadge";
import TableSearch from "../../Common/TableSearch";
import api from "../../../api/api";
import "./InvoiceRequestsPage.css";

const fmtDate = (raw) => {
  if (!raw) return "—";
  const d = new Date(raw);
  return isNaN(d)
    ? raw
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const fmtTime = (raw) => {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d)) return null;
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

const PAGE_SIZE = 9;

// Status → accent color map
const STATUS_COLOR = {
  pending:  "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  completed:"#6366f1",
};
const getStatusColor = (status = "") =>
  STATUS_COLOR[status.toLowerCase()] ?? "#94a3b8";

// Simple icon components (inline SVG — no extra dep)
const IconProvider = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconFile = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

const InvoiceRequestsPage = () => {
  const [requests,      setRequests]      = useState([]);
  const [filtered,      setFiltered]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [page,          setPage]          = useState(1);

  const [providers,        setProviders]        = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  const [showModal,     setShowModal]     = useState(false);
  const [providerId,    setProviderId]    = useState("");
  const [visitDate,     setVisitDate]     = useState("");
  const [visitTime,     setVisitTime]     = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [submitError,   setSubmitError]   = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await patientService.getMyInvoiceRequests();
      const safe = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];
      setRequests(safe);
      setFiltered(safe);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load invoice requests.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    setLoadingProviders(true);
    try {
      const res = await api.get("/api/Patient/providers/list");
      const list = Array.isArray(res.data) ? res.data : [];
      setProviders(list);
    } catch (err) {
      console.warn("fetchProviders failed:", err.message);
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);
  useEffect(() => { if (showModal) fetchProviders(); }, [showModal]);

  const handleSearch = (q) => {
    const lower = q.toLowerCase();
    setPage(1);
    if (!lower) { setFiltered(requests); return; }
    setFiltered(
      requests.filter(
        (r) =>
          r.providerName?.toLowerCase().includes(lower) ||
          r.patientName?.toLowerCase().includes(lower)  ||
          r.status?.toLowerCase().includes(lower)
      )
    );
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!providerId) { setSubmitError("Please select a provider."); return; }
    if (!visitDate)  { setSubmitError("Please select a visit date."); return; }

    const combined = visitTime
      ? `${visitDate}T${visitTime}:00`
      : `${visitDate}T00:00:00`;

    const payload = { ProviderId: Number(providerId), VisitDate: combined };

    setSubmitting(true);
    try {
      await api.post("/api/Patient/request-invoice", payload);
      setSubmitSuccess("Invoice request submitted successfully!");
      setProviderId(""); setVisitDate(""); setVisitTime("");
      await fetchRequests();
      setTimeout(() => { setShowModal(false); setSubmitSuccess(""); }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.title ??
        JSON.stringify(err.response?.data) ??
        "Failed to submit request.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitError(""); setSubmitSuccess("");
    setProviderId(""); setVisitDate(""); setVisitTime("");
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout role="Patient">
      <div className="irp-wrapper">

        {/* ── Header ── */}
        <div className="irp-header">
          <div className="irp-header-left">
            <h2 className="irp-title">Invoice Requests</h2>
            <p className="irp-subtitle">Track and manage your invoice requests from providers</p>
          </div>
          <button className="irp-btn-new" onClick={() => setShowModal(true)}>
            <span className="irp-btn-plus">＋</span> New Request
          </button>
        </div>

        {/* ── Search + count bar ── */}
        <div className="irp-toolbar">
          <TableSearch
            onSearch={handleSearch}
            placeholder="Search provider, patient or status…"
          />
          <span className="irp-count">
            {filtered.length} request{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="irp-center">
            <div className="irp-spinner" />
          </div>
        ) : error ? (
          <div className="irp-alert-error">{error}</div>
        ) : paginated.length === 0 ? (
          <div className="irp-empty">
            <div className="irp-empty-icon"><IconFile /></div>
            <p className="irp-empty-text">No invoice requests yet</p>
            <p className="irp-empty-sub">Click "New Request" to get started</p>
          </div>
        ) : (
          <>
            {/* ── Cards Grid ── */}
            <div className="irp-grid">
              {paginated.map((r, idx) => {
                const accent = getStatusColor(r.status);
                const time   = fmtTime(r.visitDate);
                return (
                  <div
                    className="irp-card"
                    key={r.invoiceRequestId}
                    style={{ "--accent": accent, animationDelay: `${idx * 0.05}s` }}
                  >
                    {/* colored left stripe */}
                    <div className="irp-card-stripe" />

                    <div className="irp-card-body">
                      {/* Top row: provider name + status */}
                      <div className="irp-card-top">
                        <div className="irp-card-provider">
                          <span className="irp-provider-icon"><IconProvider /></span>
                          <span className="irp-provider-name">{r.providerName || "—"}</span>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>

                      {/* Divider */}
                      <div className="irp-card-divider" />

                      {/* Meta info */}
                      <div className="irp-card-meta">
                        {/* Patient */}
                        <div className="irp-meta-item">
                          <span className="irp-meta-icon"><IconUser /></span>
                          <span className="irp-meta-label">Patient</span>
                          <span className="irp-meta-value">{r.patientName || "—"}</span>
                        </div>

                        {/* Visit Date */}
                        <div className="irp-meta-item">
                          <span className="irp-meta-icon"><IconCalendar /></span>
                          <span className="irp-meta-label">Visit</span>
                          <span className="irp-meta-value">
                            {fmtDate(r.visitDate)}
                            {time && (
                              <span className="irp-meta-time">
                                <IconClock /> {time}
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Requested On */}
                        <div className="irp-meta-item">
                          <span className="irp-meta-icon"><IconClock /></span>
                          <span className="irp-meta-label">Requested</span>
                          <span className="irp-meta-value">{fmtDate(r.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Pagination ── */}
            <div className="irp-pagination">
              <span className="irp-page-info">
                Page {page} of {totalPages} · {filtered.length} records
              </span>
              <div className="irp-page-btns">
                <button
                  className="irp-page-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  ← Prev
                </button>
                <span className="irp-page-current">{page}</span>
                <button
                  className="irp-page-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <>
          <div className="irp-backdrop" onClick={closeModal} />
          <div className="irp-modal-wrap" role="dialog">
            <div className="irp-modal">
              <div className="irp-modal-header">
                <h5 className="irp-modal-title">Request an Invoice</h5>
                <button className="irp-modal-close" onClick={closeModal}>✕</button>
              </div>

              <div className="irp-modal-body">
                {submitSuccess && (
                  <div className="irp-alert-success">{submitSuccess}</div>
                )}
                {submitError && (
                  <div className="irp-alert-error">{submitError}</div>
                )}

                <form onSubmit={handleRequestSubmit}>
                  <div className="irp-form-group">
                    <label className="irp-form-label" htmlFor="providerSelect">
                      Provider
                    </label>
                    {loadingProviders ? (
                      <div className="irp-loading-row">
                        <div className="irp-spinner-sm" />
                        <span>Loading providers…</span>
                      </div>
                    ) : (
                      <select
                        id="providerSelect"
                        className="irp-select"
                        value={providerId}
                        onChange={(e) => setProviderId(e.target.value)}
                        required
                      >
                        <option value="">
                          {providers.length === 0 ? "No providers available" : "— Select a provider —"}
                        </option>
                        {providers.map((p) => (
                          <option key={`${p.providerId}-${p.providerName}`} value={p.providerId}>
                            {p.providerName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="irp-form-row">
                    <div className="irp-form-group">
                      <label className="irp-form-label" htmlFor="visitDate">Visit Date</label>
                      <input
                        id="visitDate"
                        type="date"
                        className="irp-input"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="irp-form-group">
                      <label className="irp-form-label" htmlFor="visitTime">
                        Time <span className="irp-optional">(optional)</span>
                      </label>
                      <input
                        id="visitTime"
                        type="time"
                        className="irp-input"
                        value={visitTime}
                        onChange={(e) => setVisitTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="irp-modal-actions">
                    <button type="button" className="irp-btn-cancel" onClick={closeModal} disabled={submitting}>
                      Cancel
                    </button>
                    <button type="submit" className="irp-btn-submit" disabled={submitting || loadingProviders}>
                      {submitting ? (
                        <><span className="irp-spinner-sm irp-spinner-white" /> Submitting…</>
                      ) : (
                        "Submit Request"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default InvoiceRequestsPage;