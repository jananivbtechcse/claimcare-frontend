
import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import claimService from "../../../services/patientService";
import StatusBadge from "../../Common/StatusBadge";
import TableSearch from "../../Common/TableSearch";
import SimplePaginator from "../../Common/SimplePaginator";

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

  const fetchPage = async (pageNum) => {
    setLoading(true);
    setError("");

    try {
      const res = await claimService.getMyClaims(pageNum, PAGE_SIZE);
      const { items, totalCount } = res;
      const safe = Array.isArray(items) ? items : [];

      setClaims(safe);
      setFiltered(safe);
      setTotalPages(Math.max(1, Math.ceil((totalCount || 0) / PAGE_SIZE)));
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

  const handleNext = () => { if (page < totalPages) fetchPage(page + 1); };
  const handlePrev = () => { if (page > 1) fetchPage(page - 1); };

  return (
    <Layout role="Patient">
      <div className="dashboard-header mb-4">
        <h3 className="dashboard-title">My Claims</h3>
        <p className="text-muted mb-0">Track and manage all your insurance claims.</p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          {/* <TableSearch
            onSearch={handleSearch}
            placeholder="Search by claim #, invoice # or status…"
          />
           */}

           <TableSearch
  onChange={handleSearch}
  placeholder="Search by claim #, invoice # or status…"
/>
        </div>

        <div className="card-body px-4 pb-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filtered.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">No claims found.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Claim #</th>
                      <th>Invoice #</th>
                      <th>Claim Amount</th>
                      <th>Invoice Total</th>
                      <th>Submitted</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.claimId}>
                        <td className="fw-medium text-primary">{c.claimNumber}</td>
                        <td className="text-muted small">{c.invoiceNumber || "—"}</td>
                        <td>{fmtAmt(c.claimAmount)}</td>
                        <td>{fmtAmt(c.totalAmount)}</td>
                        <td style={{ whiteSpace: "nowrap" }}>{fmtDate(c.submissionDate)}</td>
                        <td><StatusBadge status={c.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <SimplePaginator
                page={page}
                totalPages={totalPages}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ClaimsPage;