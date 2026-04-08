
import { useEffect, useState, useCallback } from "react";
import api from "../../../api/api";
import Layout from "../../Layout/Layout";
import StatusBadge from "../../Common/StatusBadge";
import Paginator from "../../Common/Paginator";

const PAGE_SIZE = 10;

const Claims = () => {
  const [allClaims,   setAllClaims]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatusFilter]= useState("All");
  const [expandedId,  setExpandedId]  = useState(null);
  const [page,        setPage]        = useState(1);
  const [toast,       setToast]       = useState(null);

  const statuses = ["All", "Pending", "Approved", "Rejected", ];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };



  const load = useCallback(async () => {
  setLoading(true);
  try {
    const res = await api.get("/api/HealthcareProvider/my-claims", {
      params: { PageNumber: 1, PageSize: 1000 },
    });

    const items = Array.isArray(res.data)
      ? res.data
      : (res.data?.items ?? []);

    setAllClaims(items);
  } catch {
    showToast("Failed to load claims.", "danger");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { load(); }, [load]);

  // Filter
  const filtered = allClaims.filter(c => {
    const s = search.toLowerCase();
    const matchSearch = !search ||
      c.claimId?.toString().includes(s) ||
      (c.claimNumber   || "").toLowerCase().includes(s) ||
      (c.invoiceNumber || "").toLowerCase().includes(s) ||
      (c.status        || "").toLowerCase().includes(s);
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Paginate filtered
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleStatus = (val) => { setStatusFilter(val); setPage(1); };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <Layout role="provider">

      {toast && (
        <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3 shadow`} style={{ zIndex: 9999 }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Claims</h4>
        <p className="text-muted small mb-0">Insurance claims submitted by your hospital's patients</p>
      </div>

      {/* Search + Status filter */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body d-flex flex-wrap gap-3 align-items-center py-3">
          <input
            className="form-control"
            style={{ maxWidth: 320 }}
            placeholder="Search by claim #, invoice # or status…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          <div className="d-flex flex-wrap gap-2">
            {statuses.map(s => (
              <button key={s}
                className={`btn btn-sm ${statusFilter === s ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => handleStatus(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Claim #</th>
                <th>Invoice #</th>
                <th>Claim Amount</th>
                {/* <th>Total Amount</th> */}
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Loading claims…
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-5 text-muted">No claims found.</td>
                </tr>
              ) : visible.map(c => {
                const isExpanded = expandedId === c.claimId;
                // claimNumber fallback: use claimId if claimNumber is missing
                const claimLabel = c.claimNumber || `#${c.claimId}`;
                return (
                  <>
                    <tr key={c.claimId}>
                      <td className="fw-semibold">{claimLabel}</td>
                      <td className="text-muted small">{c.invoiceNumber || "—"}</td>
                      <td>₹{(c.claimAmount ?? 0).toLocaleString("en-IN")}</td>
                      {/* <td className="text-muted">₹{(c.totalAmount ?? 0).toLocaleString("en-IN")}</td> */}
                      <td className="text-muted small">{formatDate(c.submissionDate)}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td>
                        <button
                          className={`btn btn-sm ${isExpanded ? "btn-outline-secondary" : "btn-outline-primary"}`}
                          onClick={() => setExpandedId(isExpanded ? null : c.claimId)}>
                          {isExpanded ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr key={`${c.claimId}_detail`}>
                        <td colSpan={7} className="bg-light">
                          <div className="p-3">
                            <div className="row g-3">
                              {[
                                { label: "Claim ID",       val: `#${c.claimId}` },
                                { label: "Claim Number",   val: c.claimNumber || "—" },
                                { label: "Invoice Number", val: c.invoiceNumber || "—" },
                                { label: "Claim Amount",   val: `₹${(c.claimAmount ?? 0).toLocaleString("en-IN")}` },
                               
                                { label: "Submitted On",   val: c.submissionDate ? new Date(c.submissionDate).toLocaleString("en-IN") : "—" },
                                { label: "Status",         val: c.status || "—" },
                              ].map(({ label, val }) => (
                                <div key={label} className="col-6 col-md-3">
                                  <div className="text-muted small mb-1">{label}</div>
                                  <div className="fw-semibold small">{val}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginator */}
        <Paginator
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>

    </Layout>
  );
};

export default Claims;