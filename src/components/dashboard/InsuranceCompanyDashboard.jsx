

// import { useEffect, useState, useCallback } from "react";
// import Layout from "../Layout/Layout";
// import insuranceService from "../../services/InsuranceCompanyService";
// import StatusBadge from "../Common/StatusBadge";
// import Paginator from "../Common/Paginator";

// const PAGE_SIZE = 10;

// const StatCard = ({ title, value, sub, subColor = "text-muted", icon }) => (
//   <div className="card border-0 shadow-sm h-100">
//     <div className="card-body d-flex align-items-center gap-3 p-4">
//       <div className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 flex-shrink-0"
//         style={{ width: 52, height: 52, fontSize: 22 }}>
//         {icon}
//       </div>
//       <div>
//         <div className="text-muted small">{title}</div>
//         <div className="fw-bold fs-4">{value}</div>
//         {sub && <div className={`small ${subColor}`}>{sub}</div>}
//       </div>
//     </div>
//   </div>
// );

// /* Inline paid badge in case StatusBadge doesn't handle "paid" */
// const PaidBadge = ({ status }) => {
//   const s = (status || "").toLowerCase().trim();
//   if (s === "paid") {
//     return <span className="badge" style={{ background: "#0d6efd", color: "#fff" }}>Paid</span>;
//   }
//   return <StatusBadge status={status} />;
// };

// const InsuranceCompanyDashboard = () => {
//   const [allClaims,  setAllClaims]  = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [search,     setSearch]     = useState("");
//   const [page,       setPage]       = useState(1);
//   const [actionBusy, setActionBusy] = useState(null);
//   const [toast,      setToast]      = useState(null);

//   const companyName = localStorage.getItem("fullName") || "Insurance Company";

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const res = await insuranceService.getClaims(1, 1000);
//       const list = Array.isArray(res) ? res : (res.items ?? []);
//       setAllClaims(list);
//     } catch (e) {
//       console.error("getClaims error:", e);
//       setAllClaims([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const filtered = allClaims.filter(c => {
//     const q = search.toLowerCase();
//     return (
//       (c.claimNumber   || "").toLowerCase().includes(q) ||
//       (c.invoiceNumber || "").toLowerCase().includes(q) ||
//       (c.status        || "").toLowerCase().includes(q)
//     );
//   });

//   const totalCount = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
//   const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleSearch = (val) => { setSearch(val); setPage(1); };
//   const handlePageChange = (p) => { setPage(p); };

//   const handleApprove = async (claim) => {
//     setActionBusy(claim.claimId);
//     try {
//       await insuranceService.approveClaim(claim.claimId);
//       showToast(`Claim ${claim.claimNumber} approved.`);
//       load();
//     } catch { showToast("Failed to approve claim.", "danger"); }
//     finally { setActionBusy(null); }
//   };

//   const handleReject = async (claim) => {
//     setActionBusy(claim.claimId);
//     try {
//       await insuranceService.rejectClaim(claim.claimId);
//       showToast(`Claim ${claim.claimNumber} rejected.`, "warning");
//       load();
//     } catch { showToast("Failed to reject claim.", "danger"); }
//     finally { setActionBusy(null); }
//   };

//   const formatDate = (d) => {
//     if (!d) return "—";
//     const parsed = new Date(d);
//     return isNaN(parsed) ? d : parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
//   };

//   // Stats
//   const pending  = allClaims.filter(c => (c.status || "").toLowerCase() === "pending").length;
//   const approved = allClaims.filter(c => (c.status || "").toLowerCase() === "approved").length;
//   const rejected = allClaims.filter(c => (c.status || "").toLowerCase() === "rejected").length;
//   const paid     = allClaims.filter(c => (c.status || "").toLowerCase() === "paid").length;

//   const totalPayout = allClaims
//     .filter(c => ["approved", "paid"].includes((c.status || "").toLowerCase()))
//     .reduce((sum, c) => sum + (c.claimAmount || c.totalAmount || 0), 0);

//   return (
//     <Layout role="InsuranceCompany">

//       {toast && (
//         <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3 shadow`}
//           style={{ zIndex: 9999, minWidth: 260 }}>
//           {toast.msg}
//         </div>
//       )}

//       <div className="mb-4">
//         <div className="text-muted small">Welcome back,</div>
//         <h4 className="fw-bold mb-0">{companyName}</h4>
//       </div>

//       <div className="row g-3 mb-4">
//         <div className="col-6 col-lg-3">
//           <StatCard title="Pending Claims" value={pending} sub="Needs review" subColor="text-warning" icon="📋" />
//         </div>
//         <div className="col-6 col-lg-3">
//           <StatCard title="Approved" value={approved} sub="Awaiting payment" subColor="text-success" icon="✅" />
//         </div>
//         <div className="col-6 col-lg-3">
//           <StatCard title="Paid" value={paid} sub={`Rs.${totalPayout.toLocaleString()} total`} subColor="text-primary" icon="💸" />
//         </div>
//         <div className="col-6 col-lg-3">
//           <StatCard title="Rejected" value={rejected} icon="❌" />
//         </div>
//       </div>

//       <h5 className="fw-bold mb-3">All Claims</h5>

//       <div className="card border-0 shadow-sm">

//         <div className="p-3 border-bottom">
//           <div className="input-group" style={{ maxWidth: 380 }}>
//             <span className="input-group-text bg-white border-end-0 text-muted">Search</span>
//             <input className="form-control border-start-0"
//               placeholder="Search claim, invoice, status..."
//               value={search}
//               onChange={e => handleSearch(e.target.value)} />
//           </div>
//         </div>

//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>Claim Number</th>
//                 <th>Invoice Number</th>
//                 <th>Claim Amount</th>
            
//                 <th>Status</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-5">
//                     <div className="spinner-border spinner-border-sm text-primary me-2" />
//                     Loading claims...
//                   </td>
//                 </tr>
//               ) : visible.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="text-center py-5 text-muted">No claims found.</td>
//                 </tr>
//               ) : visible.map(c => {
//                 const statusLower = (c.status || "").toLowerCase();
//                 const isPending   = statusLower === "pending";
//                 const isPaid      = statusLower === "paid";
//                 const isBusy      = actionBusy === c.claimId;
//                 return (
//                   <tr key={c.claimId}>
//                     <td className="fw-semibold">{c.claimNumber   || "—"}</td>
//                     <td className="text-muted small">{c.invoiceNumber || "—"}</td>
//                     <td>Rs.{(c.claimAmount || 0).toLocaleString()}</td>
                    
//                     <td><PaidBadge status={c.status} /></td>
//                     <td className="text-muted small">{formatDate(c.submissionDate)}</td>
//                     <td>
//                       {isPending ? (
//                         <div className="d-flex gap-1">
//                           <button className="btn btn-sm btn-outline-success" disabled={isBusy}
//                             onClick={() => handleApprove(c)}>
//                             {isBusy ? "..." : "Approve"}
//                           </button>
//                           <button className="btn btn-sm btn-outline-danger" disabled={isBusy}
//                             onClick={() => handleReject(c)}>
//                             {isBusy ? "..." : "Reject"}
//                           </button>
//                         </div>
//                       ) : isPaid ? (
//                         <span className="badge bg-primary bg-opacity-10 text-primary small">Payment Done</span>
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

//         <Paginator page={page} totalPages={totalPages} totalCount={totalCount}
//           pageSize={PAGE_SIZE} onPageChange={handlePageChange} />
//       </div>

//     </Layout>
//   );
// };

// export default InsuranceCompanyDashboard;


import { useEffect, useState, useCallback } from "react";
import Layout from "../Layout/Layout";
import insuranceService from "../../services/InsuranceCompanyService";
import StatusBadge from "../Common/StatusBadge";
import Paginator from "../Common/Paginator";
import { FileText, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";

const PAGE_SIZE = 10;

/* ✅ PROFESSIONAL STAT CARD */
const StatCard = ({ title, value, sub, color, bg, icon }) => (
  <div
    className="h-100 p-3"
    style={{
      borderRadius: "14px",
      background: bg,
      border: "1px solid rgba(0,0,0,0.05)",
      transition: "all 0.25s ease",
      cursor: "pointer",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <p className="mb-1 small fw-semibold text-muted">{title}</p>
        <h4 className="fw-bold mb-0" style={{ color }}>{value}</h4>
        {sub && <div className="small text-muted mt-1">{sub}</div>}
      </div>

      <div
        style={{
          background: "#ffffffaa",
          borderRadius: "10px",
          padding: "6px",
          color,
        }}
      >
        {icon}
      </div>
    </div>

    <div
      style={{
        height: "4px",
        borderRadius: "10px",
        marginTop: "12px",
        background: color,
        opacity: 0.2,
      }}
    />
  </div>
);

/* Paid badge */
const PaidBadge = ({ status }) => {
  const s = (status || "").toLowerCase();
  if (s === "paid") {
    return <span className="badge bg-primary bg-opacity-10 text-primary">Paid</span>;
  }
  return <StatusBadge status={status} />;
};

const InsuranceCompanyDashboard = () => {
  const [allClaims, setAllClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionBusy, setActionBusy] = useState(null);
  const [toast, setToast] = useState(null);

  const companyName = localStorage.getItem("fullName") || "Insurance Company";

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await insuranceService.getClaims(1, 1000);
      const list = Array.isArray(res) ? res : res.items ?? [];
      setAllClaims(list);
    } catch {
      setAllClaims([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = allClaims.filter(c => {
    const q = search.toLowerCase();
    return (
      (c.claimNumber || "").toLowerCase().includes(q) ||
      (c.invoiceNumber || "").toLowerCase().includes(q) ||
      (c.status || "").toLowerCase().includes(q)
    );
  });

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApprove = async (claim) => {
    setActionBusy(claim.claimId);
    try {
      await insuranceService.approveClaim(claim.claimId);
      showToast(`Claim ${claim.claimNumber} approved.`);
      load();
    } catch {
      showToast("Failed to approve claim.", "danger");
    } finally {
      setActionBusy(null);
    }
  };

  const handleReject = async (claim) => {
    setActionBusy(claim.claimId);
    try {
      await insuranceService.rejectClaim(claim.claimId);
      showToast(`Claim ${claim.claimNumber} rejected.`, "warning");
      load();
    } catch {
      showToast("Failed to reject claim.", "danger");
    } finally {
      setActionBusy(null);
    }
  };

  // ✅ Stats
  const total = allClaims.length;
  const pending = allClaims.filter(c => c.status?.toLowerCase() === "pending").length;
  const approved = allClaims.filter(c => c.status?.toLowerCase() === "approved").length;
  const rejected = allClaims.filter(c => c.status?.toLowerCase() === "rejected").length;
  const paid = allClaims.filter(c => c.status?.toLowerCase() === "paid").length;

  const totalPayout = allClaims
    .filter(c => ["approved", "paid"].includes(c.status?.toLowerCase()))
    .reduce((sum, c) => sum + (c.claimAmount || 0), 0);

  return (
    <Layout role="InsuranceCompany">

      {toast && (
        <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3 shadow`}>
          {toast.msg}
        </div>
      )}

      {/* ✅ MODERN CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <StatCard title="Total Claims" value={total}
            icon={<FileText size={20} />}
            color="#4338ca"
            bg="linear-gradient(135deg,#eef2ff,#e0e7ff)" />
        </div>

        <div className="col-md-3">
          <StatCard title="Pending" value={pending}
            icon={<Clock size={20} />}
            color="#b45309"
            bg="linear-gradient(135deg,#fffbeb,#fef3c7)" />
        </div>

        <div className="col-md-3">
          <StatCard title="Approved" value={approved}
            icon={<CheckCircle size={20} />}
            color="#047857"
            bg="linear-gradient(135deg,#ecfdf5,#d1fae5)" />
        </div>

        <div className="col-md-3">
          <StatCard title="Paid" value={paid}
            sub={`₹${totalPayout.toLocaleString()}`}
            icon={<DollarSign size={20} />}
            color="#2563eb"
            bg="linear-gradient(135deg,#eff6ff,#dbeafe)" />
        </div>
      </div>

      {/* ✅ TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="p-3 border-bottom">
          <input
            className="form-control"
            placeholder="Search claim, invoice, status..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Claim</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-5">Loading...</td></tr>
              ) : visible.map(c => {
                const isPending = c.status?.toLowerCase() === "pending";
                const isBusy = actionBusy === c.claimId;

                return (
                  <tr key={c.claimId}>
                    <td className="fw-semibold">{c.claimNumber}</td>
                    <td className="text-muted small">{c.invoiceNumber}</td>
                    <td>₹{(c.claimAmount || 0).toLocaleString()}</td>
                    <td><PaidBadge status={c.status} /></td>
                    <td className="text-muted small">
                      {new Date(c.submissionDate).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      {isPending ? (
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-success"
                            disabled={isBusy}
                            onClick={() => handleApprove(c)}>
                            Approve
                          </button>
                          <button className="btn btn-sm btn-outline-danger"
                            disabled={isBusy}
                            onClick={() => handleReject(c)}>
                            Reject
                          </button>
                        </div>
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Paginator page={page} totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setPage} />
      </div>

    </Layout>
  );
};

export default InsuranceCompanyDashboard;