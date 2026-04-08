

import { useEffect, useState, useCallback } from "react";
import Layout from "../../Layout/Layout";
import adminService from "../../../services/adminService";
import StatusBadge from "../../Common/StatusBadge";
import Paginator from "../../Common/Paginator";

const STATUS_OPTIONS = ["All Status", "Approved", "Pending", "Rejected"];
const PAGE_SIZE = 10;

const AdminClaims = () => {
  const [claims,       setClaims]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page,         setPage]         = useState(1);
  const [totalCount,   setTotalCount]   = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // const load = useCallback(async (pageNum) => {
  //   try {
  //     setLoading(true);
  //     const res = await adminService.getClaims(pageNum, PAGE_SIZE);
  //     setClaims(res.items ?? []);
  //     setTotalCount(res.totalCount ?? 0);
  //   } catch (err) {
  //     console.error("getClaims error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);
  // const load = useCallback(async (pageNum) => {
  //   try {
  //     setLoading(true);
  //     const res = await adminService.getClaims(pageNum, PAGE_SIZE);
  //     setClaims(res.items ?? []);
  //     setTotalCount(res.totalCount ?? 0);
  //   } catch (err) {
  //     console.error("getClaims error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);


  // In AdminClaims.jsx — make load non-fatal
const load = useCallback(async (pageNum) => {
  try {
    setLoading(true);
    const res = await adminService.getClaims(pageNum, PAGE_SIZE);
    setClaims(res?.items ?? []);
    setTotalCount(res?.totalCount ?? 0);
  } catch (err) {
    console.error("getClaims error:", err);
    setClaims([]);
    setTotalCount(0);
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
    load(1);
  }, [load]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    load(newPage);
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const parsed = new Date(d);
    return isNaN(parsed)
      ? d
      : parsed.toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        });
  };

  const visible = claims.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      (c.claimNumber   || "").toLowerCase().includes(q) ||
      (c.invoiceNumber || "").toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All Status" ||
      (c.status || "").toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <Layout role="Admin">

      <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
        <div className="input-group" style={{ maxWidth: 380 }}>
          <span className="input-group-text bg-white border-end-0 text-muted">Search</span>
          <input
            className="form-control border-start-0"
            placeholder="Search claim or invoice..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ maxWidth: 160 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Claim Number</th>
                <th>Invoice Number</th>
                <th>Claim Amount</th>
         
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <div className="spinner-border spinner-border-sm text-primary me-2" />
                    Loading...
                  </td>
                </tr>
              ) : visible.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    No claims found.
                  </td>
                </tr>
              ) : visible.map(c => (
                <tr key={c.claimId}>
                  <td className="fw-semibold">{c.claimNumber        || "—"}</td>
                  <td className="text-muted small">{c.invoiceNumber || "—"}</td>
                  <td>Rs.{c.claimAmount}</td>
                  {/* <td>Rs.{c.totalAmount}</td> */}
                  <td><StatusBadge status={c.status} /></td>
                  <td>{formatDate(c.submissionDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Paginator
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      </div>

    </Layout>
  );
};

export default AdminClaims;