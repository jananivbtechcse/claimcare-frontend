

// import { useEffect, useState } from "react";
// import { Plus } from "lucide-react";
// import api from "../../../api/api";
// import Layout from "../../Layout/Layout";
// import StatusBadge from "../../Common/StatusBadge";
// import Paginator from "../../Common/Paginator";

// const PAGE_SIZE = 10;
// const TABS = ["All", "Pending", "Accepted", "Rejected"];


// const CreateInvoiceModal = ({ patients, onClose, onCreated, showToast }) => {
//   const [form, setForm] = useState({
//     patientId:         "",
//     consultationFee:   "",
//     diagnosticTestFee: "",
//     diagnosticScanFee: "",
//     medicineFee:       "",
//     taxPercentage:     "",
//   });
//   const [providerId, setProviderId] = useState(null);
//   const [submitting, setSub]        = useState(false);

//   // fetch the logged-in provider's own ID on mount
//   useEffect(() => {
//     api.get("/api/HealthcareProvider/profile")
//       .then(res => {
//         const id = res.data?.providerId ?? res.data?.id ?? null;
//         setProviderId(id);
//       })
//       .catch(() => showToast("Could not load provider profile.", "danger"));
//   }, []);

//   const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

//   const subtotal =
//     (parseFloat(form.consultationFee)   || 0) +
//     (parseFloat(form.diagnosticTestFee) || 0) +
//     (parseFloat(form.diagnosticScanFee) || 0) +
//     (parseFloat(form.medicineFee)       || 0);

//   const taxAmt = subtotal * ((parseFloat(form.taxPercentage) || 0) / 100);
//   const total  = subtotal + taxAmt;

//   const handleSubmit = async () => {
//     if (!form.patientId) { showToast("Please select a patient.", "danger"); return; }
//     if (!providerId)     { showToast("Provider ID not loaded. Please retry.", "danger"); return; }
//     setSub(true);
//     try {
//       await api.post("/api/HealthcareProvider/create-invoice", {
//         patientId:         parseInt(form.patientId),
//         providerId:        providerId,               // ← was missing
//         consultationFee:   parseFloat(form.consultationFee)   || 0,
//         diagnosticTestFee: parseFloat(form.diagnosticTestFee) || 0,
//         diagnosticScanFee: parseFloat(form.diagnosticScanFee) || 0,
//         medicineFee:       parseFloat(form.medicineFee)       || 0,
//         taxPercentage:     parseFloat(form.taxPercentage)     || 0,
//       });
//       showToast("Invoice created! Patient has been notified.");
//       onCreated();
//       onClose();
//     } catch (err) {
//       console.error("Create invoice error:", err.response?.data);
//       showToast(err.response?.data?.message || "Failed to create invoice.", "danger");
//     } finally {
//       setSub(false);
//     }
//   };

//   const fields = [
//     { key: "consultationFee",   label: "Consultation Fee (₹)" },
//     { key: "diagnosticTestFee", label: "Diagnostic Test Fee (₹)" },
//     { key: "diagnosticScanFee", label: "Diagnostic Scan Fee (₹)" },
//     { key: "medicineFee",       label: "Medicine Fee (₹)" },
//     { key: "taxPercentage",     label: "Tax (%)" },
//   ];

//   return (
//     <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
//       onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title fw-bold">Create Invoice</h5>
//             <button className="btn-close" onClick={onClose} />
//           </div>

//           <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>

//             <div className="mb-3">
//               <label className="form-label small fw-semibold">Patient *</label>
//               <select className="form-select" value={form.patientId}
//                 onChange={e => setField("patientId", e.target.value)}>
//                 <option value="">Select patient…</option>
//                 {patients.map(p => (
//                   <option key={p.patientId} value={p.patientId}>
//                     {p.name} (ID: {p.patientId})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {fields.map(({ key, label }) => (
//               <div className="mb-3" key={key}>
//                 <label className="form-label small fw-semibold">{label}</label>
//                 <input
//                   type="number" min={0} step="0.01" placeholder="0.00"
//                   className="form-control"
//                   value={form[key]}
//                   onChange={e => setField(key, e.target.value)}
//                 />
//               </div>
//             ))}

//             {/* Summary */}
//             <div className="border rounded p-3 bg-light">
//               <div className="d-flex justify-content-between small mb-1">
//                 <span className="text-muted">Subtotal</span>
//                 <span>₹{subtotal.toFixed(2)}</span>
//               </div>
//               <div className="d-flex justify-content-between small mb-2">
//                 <span className="text-muted">Tax ({form.taxPercentage || 0}%)</span>
//                 <span>₹{taxAmt.toFixed(2)}</span>
//               </div>
//               <div className="d-flex justify-content-between fw-bold">
//                 <span>Total</span>
//                 <span>₹{total.toFixed(2)}</span>
//               </div>
//             </div>

//           </div>

//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
//             <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !providerId}>
//               {submitting ? "Creating…" : "Create Invoice"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// /* ── Accept Confirm Modal ── */
// const AcceptConfirmModal = ({ request, onClose, onAccepted, showToast }) => {
//   const [loading, setLoading] = useState(false);

//   const handleAccept = async () => {
//     setLoading(true);
//     try {
//       await api.post(`/api/HealthcareProvider/accept-request/${request.id}`);
//       showToast("Invoice request accepted!");
//       onAccepted();
//       onClose();
//     } catch {
//       showToast("Failed to accept request.", "danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
//       onClick={e => e.target === e.currentTarget && onClose()}>
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title fw-bold">Accept Invoice Request</h5>
//             <button className="btn-close" onClick={onClose} />
//           </div>
//           <div className="modal-body">
//             <p className="text-muted small mb-0">
//               Are you sure you want to accept request <strong>#{request.id}</strong>?
//               This will generate an invoice for the patient.
//             </p>
//           </div>
//           <div className="modal-footer">
//             <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
//             <button className="btn btn-primary" onClick={handleAccept} disabled={loading}>
//               {loading ? "Accepting…" : "Yes, Accept"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ── Main Page ── */
// const InvoiceRequests = () => {
//   const [allRequests,  setAllRequests]  = useState([]);
//   const [patients,     setPatients]     = useState([]);
//   const [loading,      setLoading]      = useState(true);
//   const [search,       setSearch]       = useState("");
//   const [tabFilter,    setTabFilter]    = useState("All");
//   const [page,         setPage]         = useState(1);
//   const [showCreate,   setShowCreate]   = useState(false);
//   const [acceptTarget, setAcceptTarget] = useState(null);
//   const [toast,        setToast]        = useState(null);

//   useEffect(() => { fetchAll(); }, []);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       const [reqRes, patRes] = await Promise.all([
//         api.get("/api/HealthcareProvider/invoice-requests"),
//         api.get("/api/HealthcareProvider/my-patients"),
//       ]);
//       const reqs = Array.isArray(reqRes.data) ? reqRes.data : (reqRes.data?.items ?? []);
//       if (reqs.length > 0) console.log("Invoice request sample:", reqs[0]);
//       setAllRequests(reqs);
//       const pats = Array.isArray(patRes.data) ? patRes.data : [];
//       setPatients([...new Map(pats.map(p => [p.patientId, p])).values()]);
//     } catch {
//       showToast("Failed to load requests.", "danger");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getId = (req) => req.invoiceRequestId ?? req.requestId ?? req.id ?? "—";

//   const formatDate = (d) => {
//     if (!d) return "—";
//     return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
//   };

//   const filtered = allRequests.filter(req => {
//     const s      = search.toLowerCase();
//     const id     = getId(req)?.toString() ?? "";
//     const status = (req.status || "").toLowerCase();

//     const matchSearch = !search ||
//       id.includes(s) ||
//       (req.patientName || "").toLowerCase().includes(s);

//     const matchTab =
//       tabFilter === "All" ||
//       (tabFilter === "Pending"  && status === "pending") ||
//       (tabFilter === "Accepted" && ["accepted", "completed", "generated"].includes(status)) ||
//       (tabFilter === "Rejected" && status === "rejected");

//     return matchSearch && matchTab;
//   });

//   const tabCounts = {
//     All:      allRequests.length,
//     Pending:  allRequests.filter(r => (r.status || "").toLowerCase() === "pending").length,
//     Accepted: allRequests.filter(r => ["accepted","completed","generated"].includes((r.status||"").toLowerCase())).length,
//     Rejected: allRequests.filter(r => (r.status || "").toLowerCase() === "rejected").length,
//   };

//   const totalCount = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
//   const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleSearch = (val) => { setSearch(val); setPage(1); };
//   const handleTab    = (val) => { setTabFilter(val); setPage(1); };

//   return (
//     <Layout role="provider">

//       {toast && (
//         <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3 shadow`} style={{ zIndex: 9999 }}>
//           {toast.msg}
//         </div>
//       )}

//       {showCreate && (
//         <CreateInvoiceModal patients={patients} onClose={() => setShowCreate(false)}
//           onCreated={fetchAll} showToast={showToast} />
//       )}

//       {acceptTarget && (
//         <AcceptConfirmModal request={acceptTarget} onClose={() => setAcceptTarget(null)}
//           onAccepted={fetchAll} showToast={showToast} />
//       )}

//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h4 className="fw-bold mb-1">Invoice Requests</h4>
//           <p className="text-muted small mb-0">Patient-requested invoices — accept to generate an invoice</p>
//         </div>
//         <button className="btn btn-primary d-flex align-items-center gap-2"
//           onClick={() => setShowCreate(true)}>
//           <Plus size={15} /> Create Invoice
//         </button>
//       </div>

//       {/* Tabs + Search */}
//       <div className="card border-0 shadow-sm mb-4">
//         <div className="card-body d-flex flex-wrap gap-3 align-items-center py-3">
//           <div className="d-flex flex-wrap gap-2">
//             {TABS.map(t => (
//               <button key={t}
//                 className={`btn btn-sm ${tabFilter === t ? "btn-primary" : "btn-outline-secondary"}`}
//                 onClick={() => handleTab(t)}>
//                 {t}
//                 <span className="ms-1 badge bg-white text-primary" style={{ fontSize: 10 }}>
//                   {tabCounts[t]}
//                 </span>
//               </button>
//             ))}
//           </div>
//           <input
//             className="form-control"
//             style={{ maxWidth: 320 }}
//             placeholder="Search by request ID or patient name…"
//             value={search}
//             onChange={e => handleSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="card border-0 shadow-sm">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>Request ID</th>
//                 <th>Patient</th>
//                 <th>Requested Date</th>
//                 <th>Status</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={5} className="text-center py-5">
//                     <div className="spinner-border spinner-border-sm text-primary me-2" />
//                     Loading requests…
//                   </td>
//                 </tr>
//               ) : visible.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="text-center py-5 text-muted">No invoice requests found.</td>
//                 </tr>
//               ) : visible.map(req => {
//                 const id        = getId(req);
//                 const isPending = (req.status || "").toLowerCase() === "pending";
//                 return (
//                   <tr key={id}>
//                     <td className="fw-semibold">#{id}</td>
//                     <td>{req.patientName || "—"}</td>
//                     <td className="text-muted small">{formatDate(req.requestedDate || req.createdAt)}</td>
//                     <td><StatusBadge status={req.status} /></td>
//                     <td>
//                       {isPending ? (
//                         <button className="btn btn-sm btn-outline-primary"
//                           onClick={() => setAcceptTarget({ ...req, id })}>
//                           Accept
//                         </button>
//                       ) : (
//                         <span className="text-muted small">—</span>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         <Paginator
//           page={page}
//           totalPages={totalPages}
//           totalCount={totalCount}
//           pageSize={PAGE_SIZE}
//           onPageChange={setPage}
//         />
//       </div>

//     </Layout>
//   );
// };

// export default InvoiceRequests;


import { useEffect, useState } from "react";
import { Plus, FileText, User, Calendar, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import api from "../../../api/api";
import Layout from "../../Layout/Layout";
import StatusBadge from "../../Common/StatusBadge";
import Paginator from "../../Common/Paginator";

const PAGE_SIZE = 10;
const TABS = ["All", "Pending", "Accepted", "Rejected"];

/* ─── Styles ─────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  .ir-root {
    font-family: 'Sora', sans-serif;
    --teal:       #0d9488;
    --teal-light: #ccfbf1;
    --teal-dark:  #0f766e;
    --amber:      #f59e0b;
    --amber-light:#fef3c7;
    --red:        #ef4444;
    --red-light:  #fee2e2;
    --sky:        #0ea5e9;
    --sky-light:  #e0f2fe;
    --slate:      #64748b;
    --ink:        #0f172a;
    --surface:    #f8fafc;
    --card-bg:    #ffffff;
    --border:     #e2e8f0;
    --radius:     14px;
    --shadow:     0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
    --shadow-hover: 0 4px 12px rgba(13,148,136,.14), 0 8px 28px rgba(0,0,0,.08);
  }

  /* ── header ── */
  .ir-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
  .ir-header h2 { font-size:1.6rem; font-weight:700; color:var(--ink); margin:0 0 .25rem; letter-spacing:-.02em; }
  .ir-header p  { font-size:.82rem; color:var(--slate); margin:0; }
  .btn-create {
    display:inline-flex; align-items:center; gap:.45rem;
    background:var(--teal); color:#fff; border:none; border-radius:10px;
    padding:.55rem 1.1rem; font-size:.84rem; font-weight:600; cursor:pointer;
    box-shadow:0 2px 8px rgba(13,148,136,.35);
    transition:background .2s, transform .15s, box-shadow .2s;
  }
  .btn-create:hover { background:var(--teal-dark); transform:translateY(-1px); box-shadow:0 4px 14px rgba(13,148,136,.4); }

  /* ── toolbar ── */
  .ir-toolbar {
    background:var(--card-bg); border:1px solid var(--border);
    border-radius:var(--radius); padding:1rem 1.25rem;
    display:flex; flex-wrap:wrap; gap:.75rem; align-items:center;
    margin-bottom:1.5rem; box-shadow:var(--shadow);
  }
  .tab-pill {
    display:inline-flex; align-items:center; gap:.4rem;
    border-radius:8px; padding:.38rem .8rem;
    font-size:.8rem; font-weight:600; cursor:pointer; border:1.5px solid var(--border);
    background:#fff; color:var(--slate); transition:all .18s;
  }
  .tab-pill.active { background:var(--teal); color:#fff; border-color:var(--teal); }
  .tab-pill .count {
    background:rgba(255,255,255,.25); color:inherit;
    border-radius:6px; padding:.1rem .38rem; font-size:.72rem;
  }
  .tab-pill:not(.active) .count { background:var(--surface); color:var(--slate); }
  .ir-search {
    margin-left:auto; position:relative; min-width:220px; max-width:300px; flex:1;
  }
  .ir-search input {
    width:100%; border:1.5px solid var(--border); border-radius:9px;
    padding:.42rem .8rem .42rem 2.2rem; font-size:.82rem; font-family:'Sora',sans-serif;
    background:var(--surface); color:var(--ink); outline:none; transition:border-color .2s;
  }
  .ir-search input:focus { border-color:var(--teal); }
  .ir-search svg { position:absolute; left:.6rem; top:50%; transform:translateY(-50%); color:var(--slate); }

  /* ── cards grid ── */
  .ir-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(310px,1fr)); gap:1rem; }

  .req-card {
    background:var(--card-bg); border:1px solid var(--border);
    border-radius:var(--radius); padding:1.25rem 1.35rem;
    box-shadow:var(--shadow); position:relative; overflow:hidden;
    transition:box-shadow .2s, transform .2s;
    display:flex; flex-direction:column; gap:.7rem;
  }
  .req-card:hover { box-shadow:var(--shadow-hover); transform:translateY(-2px); }
  .req-card::before {
    content:''; position:absolute; left:0; top:0; bottom:0;
    width:4px; border-radius:4px 0 0 4px;
  }
  .req-card.pending::before  { background:var(--amber); }
  .req-card.accepted::before { background:var(--teal); }
  .req-card.rejected::before { background:var(--red); }

  .req-card-top { display:flex; justify-content:space-between; align-items:flex-start; }
  .req-id { font-family:'JetBrains Mono',monospace; font-size:.78rem; font-weight:500; color:var(--teal); }
  .req-card-meta { display:flex; flex-direction:column; gap:.35rem; }
  .req-meta-row { display:flex; align-items:center; gap:.5rem; font-size:.82rem; color:var(--slate); }
  .req-meta-row svg { color:var(--teal); flex-shrink:0; }
  .req-meta-row strong { color:var(--ink); font-weight:600; }

  .req-card-footer { display:flex; justify-content:space-between; align-items:center; padding-top:.6rem; border-top:1px solid var(--border); }
  .btn-accept {
    background:var(--teal-light); color:var(--teal-dark); border:none;
    border-radius:8px; padding:.36rem .9rem; font-size:.78rem; font-weight:600;
    cursor:pointer; transition:background .18s, transform .15s;
  }
  .btn-accept:hover { background:var(--teal); color:#fff; transform:translateY(-1px); }

  /* ── empty / loading ── */
  .ir-empty {
    text-align:center; padding:4rem 2rem; color:var(--slate);
    background:var(--card-bg); border:1px solid var(--border);
    border-radius:var(--radius); box-shadow:var(--shadow);
  }
  .ir-empty svg { display:block; margin:0 auto .75rem; opacity:.35; }
  .ir-loading { display:flex; justify-content:center; align-items:center; gap:.6rem; padding:3rem; color:var(--slate); font-size:.9rem; }
  .spinner { width:20px; height:20px; border:2.5px solid var(--border); border-top-color:var(--teal); border-radius:50%; animation:spin .7s linear infinite; }
  @keyframes spin { to { transform:rotate(360deg); } }

  /* ── toast ── */
  .ir-toast {
    position:fixed; top:1rem; right:1rem; z-index:9999;
    padding:.75rem 1.2rem; border-radius:10px; font-size:.84rem; font-weight:500;
    box-shadow:0 4px 20px rgba(0,0,0,.15); animation:slideIn .25s ease;
  }
  .ir-toast.success { background:var(--teal); color:#fff; }
  .ir-toast.danger  { background:var(--red);  color:#fff; }
  @keyframes slideIn { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:none; } }

  /* ── modal overlay ── */
  .ir-modal-overlay {
    position:fixed; inset:0; background:rgba(15,23,42,.45);
    backdrop-filter:blur(4px); z-index:1050;
    display:flex; align-items:center; justify-content:center; padding:1rem;
  }
  .ir-modal {
    background:#fff; border-radius:18px; width:100%; max-width:480px;
    box-shadow:0 20px 60px rgba(0,0,0,.2); overflow:hidden;
    animation:modalIn .22s ease;
  }
  @keyframes modalIn { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:none; } }
  .ir-modal-header {
    padding:1.25rem 1.5rem; border-bottom:1px solid var(--border);
    display:flex; justify-content:space-between; align-items:center;
  }
  .ir-modal-header h5 { margin:0; font-size:1.05rem; font-weight:700; color:var(--ink); }
  .btn-close-modal {
    background:var(--surface); border:none; border-radius:8px;
    width:30px; height:30px; cursor:pointer; font-size:1.1rem; color:var(--slate);
    display:flex; align-items:center; justify-content:center; transition:background .15s;
  }
  .btn-close-modal:hover { background:var(--border); }
  .ir-modal-body { padding:1.5rem; max-height:66vh; overflow-y:auto; display:flex; flex-direction:column; gap:.85rem; }
  .ir-modal-footer { padding:1.25rem 1.5rem; border-top:1px solid var(--border); display:flex; gap:.6rem; justify-content:flex-end; }

  .ir-label { font-size:.78rem; font-weight:600; color:var(--slate); display:block; margin-bottom:.35rem; }
  .ir-input, .ir-select {
    width:100%; border:1.5px solid var(--border); border-radius:9px;
    padding:.5rem .85rem; font-size:.84rem; font-family:'Sora',sans-serif;
    color:var(--ink); background:#fff; outline:none; transition:border-color .2s; box-sizing:border-box;
  }
  .ir-input:focus, .ir-select:focus { border-color:var(--teal); }

  .summary-box {
    background:var(--surface); border:1px solid var(--border);
    border-radius:10px; padding:.9rem 1rem;
  }
  .summary-row { display:flex; justify-content:space-between; font-size:.82rem; color:var(--slate); margin-bottom:.4rem; }
  .summary-row.total { font-weight:700; color:var(--ink); font-size:.9rem; margin-bottom:0; padding-top:.5rem; border-top:1px solid var(--border); }

  .btn-primary-modal {
    background:var(--teal); color:#fff; border:none; border-radius:9px;
    padding:.55rem 1.25rem; font-size:.84rem; font-weight:600; cursor:pointer;
    transition:background .18s, opacity .18s;
  }
  .btn-primary-modal:disabled { opacity:.55; cursor:not-allowed; }
  .btn-primary-modal:not(:disabled):hover { background:var(--teal-dark); }
  .btn-secondary-modal {
    background:var(--surface); color:var(--slate); border:1.5px solid var(--border);
    border-radius:9px; padding:.55rem 1.1rem; font-size:.84rem; font-weight:600; cursor:pointer;
    transition:background .18s;
  }
  .btn-secondary-modal:hover { background:var(--border); }
`;

/* ─── Create Invoice Modal ─────────────────────────────────────────── */
const CreateInvoiceModal = ({ patients, onClose, onCreated, showToast }) => {
  const [form, setForm] = useState({
    patientId: "", consultationFee: "", diagnosticTestFee: "",
    diagnosticScanFee: "", medicineFee: "", taxPercentage: "",
  });
  const [providerId, setProviderId] = useState(null);
  const [submitting, setSub] = useState(false);

  useEffect(() => {
    api.get("/api/HealthcareProvider/profile")
      .then(res => setProviderId(res.data?.providerId ?? res.data?.id ?? null))
      .catch(() => showToast("Could not load provider profile.", "danger"));
  }, []);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const subtotal =
    (parseFloat(form.consultationFee) || 0) + (parseFloat(form.diagnosticTestFee) || 0) +
    (parseFloat(form.diagnosticScanFee) || 0) + (parseFloat(form.medicineFee) || 0);
  const taxAmt = subtotal * ((parseFloat(form.taxPercentage) || 0) / 100);
  const total  = subtotal + taxAmt;

  const handleSubmit = async () => {
    if (!form.patientId) { showToast("Please select a patient.", "danger"); return; }
    if (!providerId)     { showToast("Provider ID not loaded. Please retry.", "danger"); return; }
    setSub(true);
    try {
      await api.post("/api/HealthcareProvider/create-invoice", {
        patientId: parseInt(form.patientId), providerId,
        consultationFee: parseFloat(form.consultationFee) || 0,
        diagnosticTestFee: parseFloat(form.diagnosticTestFee) || 0,
        diagnosticScanFee: parseFloat(form.diagnosticScanFee) || 0,
        medicineFee: parseFloat(form.medicineFee) || 0,
        taxPercentage: parseFloat(form.taxPercentage) || 0,
      });
      showToast("Invoice created! Patient has been notified.");
      onCreated(); onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create invoice.", "danger");
    } finally { setSub(false); }
  };

  const fields = [
    { key: "consultationFee",   label: "Consultation Fee (₹)" },
    { key: "diagnosticTestFee", label: "Diagnostic Test Fee (₹)" },
    { key: "diagnosticScanFee", label: "Diagnostic Scan Fee (₹)" },
    { key: "medicineFee",       label: "Medicine Fee (₹)" },
    { key: "taxPercentage",     label: "Tax (%)" },
  ];

  return (
    <div className="ir-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ir-modal">
        <div className="ir-modal-header">
          <h5>Create Invoice</h5>
          <button className="btn-close-modal" onClick={onClose}>×</button>
        </div>
        <div className="ir-modal-body">
          <div>
            <label className="ir-label">Patient *</label>
            <select className="ir-select" value={form.patientId} onChange={e => setField("patientId", e.target.value)}>
              <option value="">Select patient…</option>
              {patients.map(p => (
                <option key={p.patientId} value={p.patientId}>{p.name} (ID: {p.patientId})</option>
              ))}
            </select>
          </div>
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="ir-label">{label}</label>
              <input type="number" min={0} step="0.01" placeholder="0.00" className="ir-input"
                value={form[key]} onChange={e => setField(key, e.target.value)} />
            </div>
          ))}
          <div className="summary-box">
            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Tax ({form.taxPercentage || 0}%)</span><span>₹{taxAmt.toFixed(2)}</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          </div>
        </div>
        <div className="ir-modal-footer">
          <button className="btn-secondary-modal" onClick={onClose}>Cancel</button>
          <button className="btn-primary-modal" onClick={handleSubmit} disabled={submitting || !providerId}>
            {submitting ? "Creating…" : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Accept Confirm Modal ─────────────────────────────────────────── */
const AcceptConfirmModal = ({ request, onClose, onAccepted, showToast }) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await api.post(`/api/HealthcareProvider/accept-request/${request.id}`);
      showToast("Invoice request accepted!");
      onAccepted(); onClose();
    } catch {
      showToast("Failed to accept request.", "danger");
    } finally { setLoading(false); }
  };

  return (
    <div className="ir-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ir-modal">
        <div className="ir-modal-header">
          <h5>Accept Invoice Request</h5>
          <button className="btn-close-modal" onClick={onClose}>×</button>
        </div>
        <div className="ir-modal-body">
          <p style={{ fontSize: ".88rem", color: "var(--slate)", margin: 0 }}>
            Are you sure you want to accept request <strong style={{ color: "var(--ink)" }}>#{request.id}</strong>?
            This will generate an invoice for the patient.
          </p>
        </div>
        <div className="ir-modal-footer">
          <button className="btn-secondary-modal" onClick={onClose}>Cancel</button>
          <button className="btn-primary-modal" onClick={handleAccept} disabled={loading}>
            {loading ? "Accepting…" : "Yes, Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Status icon helper ───────────────────────────────────────────── */
const StatusIcon = ({ status }) => {
  const s = (status || "").toLowerCase();
  if (s === "pending")  return <Clock size={14} />;
  if (["accepted","completed","generated"].includes(s)) return <CheckCircle size={14} />;
  if (s === "rejected") return <XCircle size={14} />;
  return null;
};

/* ─── Main Page ────────────────────────────────────────────────────── */
const InvoiceRequests = () => {
  const [allRequests,  setAllRequests]  = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [tabFilter,    setTabFilter]    = useState("All");
  const [page,         setPage]         = useState(1);
  const [showCreate,   setShowCreate]   = useState(false);
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [toast,        setToast]        = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [reqRes, patRes] = await Promise.all([
        api.get("/api/HealthcareProvider/invoice-requests"),
        api.get("/api/HealthcareProvider/my-patients"),
      ]);
      const reqs = Array.isArray(reqRes.data) ? reqRes.data : (reqRes.data?.items ?? []);
      setAllRequests(reqs);
      const pats = Array.isArray(patRes.data) ? patRes.data : [];
      setPatients([...new Map(pats.map(p => [p.patientId, p])).values()]);
    } catch {
      showToast("Failed to load requests.", "danger");
    } finally { setLoading(false); }
  };

  const getId = (req) => req.invoiceRequestId ?? req.requestId ?? req.id ?? "—";

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  const filtered = allRequests.filter(req => {
    const s = search.toLowerCase();
    const id = getId(req)?.toString() ?? "";
    const status = (req.status || "").toLowerCase();
    const matchSearch = !search || id.includes(s) || (req.patientName || "").toLowerCase().includes(s);
    const matchTab =
      tabFilter === "All" ||
      (tabFilter === "Pending"  && status === "pending") ||
      (tabFilter === "Accepted" && ["accepted","completed","generated"].includes(status)) ||
      (tabFilter === "Rejected" && status === "rejected");
    return matchSearch && matchTab;
  });

  const tabCounts = {
    All:      allRequests.length,
    Pending:  allRequests.filter(r => (r.status || "").toLowerCase() === "pending").length,
    Accepted: allRequests.filter(r => ["accepted","completed","generated"].includes((r.status||"").toLowerCase())).length,
    Rejected: allRequests.filter(r => (r.status || "").toLowerCase() === "rejected").length,
  };

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleTab    = (val) => { setTabFilter(val); setPage(1); };

  return (
    <Layout role="provider">
      <style>{styles}</style>
      <div className="ir-root">

        {toast && (
          <div className={`ir-toast ${toast.type}`}>{toast.msg}</div>
        )}

        {showCreate && (
          <CreateInvoiceModal patients={patients} onClose={() => setShowCreate(false)}
            onCreated={fetchAll} showToast={showToast} />
        )}

        {acceptTarget && (
          <AcceptConfirmModal request={acceptTarget} onClose={() => setAcceptTarget(null)}
            onAccepted={fetchAll} showToast={showToast} />
        )}

        {/* Header */}
        <div className="ir-header">
          <div>
            <h2>Invoice Requests</h2>
            <p>Patient-requested invoices — accept to generate an invoice</p>
          </div>
          <button className="btn-create" onClick={() => setShowCreate(true)}>
            <Plus size={15} /> Create Invoice
          </button>
        </div>

        {/* Toolbar */}
        <div className="ir-toolbar">
          {TABS.map(t => (
            <button key={t} className={`tab-pill ${tabFilter === t ? "active" : ""}`}
              onClick={() => handleTab(t)}>
              {t} <span className="count">{tabCounts[t]}</span>
            </button>
          ))}
          <div className="ir-search">
            <Search size={14} />
            <input placeholder="Search by ID or patient name…" value={search}
              onChange={e => handleSearch(e.target.value)} />
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="ir-loading"><div className="spinner" /> Loading requests…</div>
        ) : visible.length === 0 ? (
          <div className="ir-empty">
            <FileText size={40} />
            <p style={{ margin: 0, fontWeight: 600 }}>No invoice requests found</p>
            <p style={{ margin: ".3rem 0 0", fontSize: ".82rem" }}>Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="ir-grid">
            {visible.map(req => {
              const id = getId(req);
              const isPending = (req.status || "").toLowerCase() === "pending";
              const statusClass = isPending ? "pending"
                : ["accepted","completed","generated"].includes((req.status||"").toLowerCase()) ? "accepted"
                : "rejected";
              return (
                <div key={id} className={`req-card ${statusClass}`}>
                  <div className="req-card-top">
                    <span className="req-id">REQ-{id}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="req-card-meta">
                    <div className="req-meta-row">
                      <User size={13} />
                      <strong>{req.patientName || "—"}</strong>
                    </div>
                    <div className="req-meta-row">
                      <Calendar size={13} />
                      {formatDate(req.requestedDate || req.createdAt)}
                    </div>
                  </div>
                  <div className="req-card-footer">
                    <span style={{ display:"flex", alignItems:"center", gap:".35rem", fontSize:".78rem", color:"var(--slate)" }}>
                      <StatusIcon status={req.status} />
                      {req.status || "Unknown"}
                    </span>
                    {isPending ? (
                      <button className="btn-accept" onClick={() => setAcceptTarget({ ...req, id })}>
                        Accept
                      </button>
                    ) : (
                      <span style={{ fontSize:".78rem", color:"var(--slate)" }}>—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginator */}
        {!loading && visible.length > 0 && (
          <div style={{ marginTop: "1.25rem" }}>
            <Paginator page={page} totalPages={totalPages} totalCount={totalCount}
              pageSize={PAGE_SIZE} onPageChange={setPage} />
          </div>
        )}

      </div>
    </Layout>
  );
};

export default InvoiceRequests;