

// import { useEffect, useState } from "react";
// import Layout from "../Layout/Layout";
// import claimService from "../../services/patientService";
// import StatusBadge from "../Common/StatusBadge";
// import TableSearch from "../Common/TableSearch";


// const fmtDate = (raw) => {
//   if (!raw) return "—";
//   const d = new Date(raw);
//   return isNaN(d)
//     ? raw
//     : d.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });
// };

// const fmtAmt = (v) =>
//   v == null ? "—" : "₹" + Number(v).toLocaleString("en-IN");

// const PAGE_SIZE = 10;


// const ClaimsPage = () => {
//   const [claims,     setClaims]     = useState([]);
//   const [filtered,   setFiltered]   = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [error,      setError]      = useState("");
//   const [page,       setPage]       = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);


//   const fetchPage = async (pageNum) => {
//     setLoading(true);
//     setError("");
//     try {
//       const { items, totalCount: tc } = await claimService.getMyClaims(
//         pageNum,
//         PAGE_SIZE
//       );
//       const safe = Array.isArray(items) ? items : [];
//       setClaims(safe);
//       setFiltered(safe);
//       setTotalCount(tc ?? 0);
//       setTotalPages(Math.max(1, Math.ceil((tc ?? 0) / PAGE_SIZE)));
//       setPage(pageNum);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to load claims.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchPage(1); }, []);


//   const handleSearch = (q) => {
//     const lower = q.toLowerCase();
//     if (!lower) { setFiltered(claims); return; }
//     setFiltered(
//       claims.filter(
//         (c) =>
//           c.claimNumber?.toLowerCase().includes(lower)   ||
//           c.invoiceNumber?.toLowerCase().includes(lower) ||
//           c.status?.toLowerCase().includes(lower)
//       )
//     );
//   };

//   const handlePrev = () => { if (page > 1)          fetchPage(page - 1); };
//   const handleNext = () => { if (page < totalPages)  fetchPage(page + 1); };


//   return (
//     <Layout role="Patient">
//       <div className="dashboard-header mb-4">
//         <h3 className="dashboard-title">My Claims</h3>
//         <p className="text-muted mb-0">
//           Track and manage all your insurance claims.
//         </p>
//       </div>

//       <div className="card border-0 shadow-sm">
        
//         <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
//           <TableSearch
//             onSearch={handleSearch}
//             placeholder="Search by claim #, invoice # or status…"
//           />
//           <span className="text-muted small">
//             {totalCount > 0
//               ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(
//                   page * PAGE_SIZE,
//                   totalCount
//                 )} of ${totalCount} records`
//               : "No records"}
//           </span>
//         </div>

        
//         <div className="card-body px-4 pb-4">
//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status" />
//             </div>
//           ) : error ? (
//             <div className="alert alert-danger">{error}</div>
//           ) : filtered.length === 0 ? (
//             <p className="text-muted text-center py-4 mb-0">No claims found.</p>
//           ) : (
//             <>
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Claim #</th>
//                       <th>Invoice #</th>
//                       <th>Claim Amount</th>
//                       {/* <th>Invoice Total</th> */}
//                       <th>Submitted</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filtered.map((c) => (
//                       <tr key={c.claimId}>
//                         <td>
//                           <span className="fw-medium text-primary">
//                             {c.claimNumber}
//                           </span>
//                         </td>
//                         <td>
//                           <span className="text-muted small">
//                             {c.invoiceNumber || "—"}
//                           </span>
//                         </td>
//                         <td>{fmtAmt(c.claimAmount)}</td>
//                         {/* <td>{fmtAmt(c.totalAmount)}</td> */}
//                         <td style={{ whiteSpace: "nowrap" }}>
//                           {fmtDate(c.submissionDate)}
//                         </td>
//                         <td>
//                           <StatusBadge status={c.status} />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

              
//               <div className="d-flex justify-content-between align-items-center mt-4 px-1">
//                 <span className="text-muted small">
//                   Page {page} of {totalPages}
//                 </span>
//                 <div className="d-flex gap-2">
//                   <button
//                     className="btn btn-sm btn-outline-secondary"
//                     onClick={handlePrev}
//                     disabled={page <= 1 || loading}
//                   >
//                     ← Prev
//                   </button>
//                   <button
//                     className="btn btn-sm btn-primary"
//                     onClick={handleNext}
//                     disabled={page >= totalPages || loading}
//                   >
//                     Next →
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ClaimsPage;


import { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import claimService from "../../services/patientService";
import StatusBadge from "../Common/StatusBadge";
import TableSearch from "../Common/TableSearch";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";

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

const fmtAmt = (v) =>
  v == null ? "—" : "₹" + Number(v).toLocaleString("en-IN");

const PAGE_SIZE = 10;

const ClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPage = async (pageNum) => {
    setLoading(true);
    setError("");
    try {
      const { items, totalCount: tc } = await claimService.getMyClaims(
        pageNum,
        PAGE_SIZE
      );
      const safe = Array.isArray(items) ? items : [];
      setClaims(safe);
      setFiltered(safe);
      setTotalCount(tc ?? 0);
      setTotalPages(Math.max(1, Math.ceil((tc ?? 0) / PAGE_SIZE)));
      setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const handleSearch = (q) => {
    const lower = q.toLowerCase();
    if (!lower) {
      setFiltered(claims);
      return;
    }
    setFiltered(
      claims.filter(
        (c) =>
          c.claimNumber?.toLowerCase().includes(lower) ||
          c.invoiceNumber?.toLowerCase().includes(lower) ||
          c.status?.toLowerCase().includes(lower)
      )
    );
  };

  const handlePrev = () => {
    if (page > 1) fetchPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) fetchPage(page + 1);
  };

  // ✅ Stats
  const total = claims.length;
  const approved = claims.filter(
    (c) => c.status?.toLowerCase() === "approved"
  ).length;
  const pending = claims.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;
  const rejected = claims.filter(
    (c) => c.status?.toLowerCase() === "rejected"
  ).length;

  return (
    <Layout role="Patient">
      <div className="dashboard-header mb-4">
        <h3 className="dashboard-title">My Claims</h3>
        <p className="text-muted mb-0">
          Track and manage all your insurance claims.
        </p>
      </div>

      {/* ✅ PROFESSIONAL DASHBOARD CARDS */}
      <div className="row mb-4 g-3">
        {[
          {
            title: "Total Claims",
            value: total,
            icon: <FileText size={20} />,
            bg: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
            color: "#4338ca",
          },
          {
            title: "Approved",
            value: approved,
            icon: <CheckCircle size={20} />,
            bg: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
            color: "#047857",
          },
          {
            title: "Pending",
            value: pending,
            icon: <Clock size={20} />,
            bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
            color: "#b45309",
          },
          {
            title: "Rejected",
            value: rejected,
            icon: <XCircle size={20} />,
            bg: "linear-gradient(135deg, #fef2f2, #fee2e2)",
            color: "#b91c1c",
          },
        ].map((card, i) => (
          <div className="col-md-3" key={i}>
            <div
              className="p-3 h-100"
              style={{
                borderRadius: "14px",
                background: card.bg,
                border: "1px solid rgba(0,0,0,0.05)",
                transition: "all 0.25s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p
                    className="mb-1 small fw-semibold"
                    style={{ color: "#6b7280" }}
                  >
                    {card.title}
                  </p>
                  <h4
                    className="fw-bold mb-0"
                    style={{ color: card.color }}
                  >
                    {card.value}
                  </h4>
                </div>

                <div
                  style={{
                    background: "#ffffffaa",
                    borderRadius: "10px",
                    padding: "6px",
                    color: card.color,
                  }}
                >
                  {card.icon}
                </div>
              </div>

              <div
                style={{
                  height: "4px",
                  borderRadius: "10px",
                  marginTop: "12px",
                  background: card.color,
                  opacity: 0.2,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ EXISTING TABLE (UNCHANGED) */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <TableSearch
            onSearch={handleSearch}
            placeholder="Search by claim #, invoice # or status…"
          />
          <span className="text-muted small">
            {totalCount > 0
              ? `${(page - 1) * PAGE_SIZE + 1}–${Math.min(
                  page * PAGE_SIZE,
                  totalCount
                )} of ${totalCount} records`
              : "No records"}
          </span>
        </div>

        <div className="card-body px-4 pb-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filtered.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">
              No claims found.
            </p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Claim #</th>
                      <th>Invoice #</th>
                      <th>Claim Amount</th>
                      <th>Submitted</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.claimId}>
                        <td>
                          <span className="fw-medium text-primary">
                            {c.claimNumber}
                          </span>
                        </td>
                        <td>
                          <span className="text-muted small">
                            {c.invoiceNumber || "—"}
                          </span>
                        </td>
                        <td>{fmtAmt(c.claimAmount)}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {fmtDate(c.submissionDate)}
                        </td>
                        <td>
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-4 px-1">
                <span className="text-muted small">
                  Page {page} of {totalPages}
                </span>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handlePrev}
                    disabled={page <= 1 || loading}
                  >
                    ← Prev
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleNext}
                    disabled={page >= totalPages || loading}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClaimsPage;