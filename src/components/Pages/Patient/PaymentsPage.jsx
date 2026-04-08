


import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import patientService from "../../../services/patientService";
import StatusBadge from "../../Common/StatusBadge";
import TableSearch from "../../Common/TableSearch";

const fmtDate = (raw) => {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const shortRef = (id) => {
  if (!id) return "—";
  const s = String(id).replace(/-/g, "");
  return "#" + s.slice(-8).toUpperCase();
};

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [page,     setPage]     = useState(1);
  const pageSize = 10;

  useEffect(() => {
    patientService
      .getPayments()
      .then((data) => {
        // getPayments returns { items, totalCount } via normalise()
        const items = Array.isArray(data) ? data : (data?.items ?? []);
        setPayments(items);
        setFiltered(items);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load payments.")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (q) => {
    const lower = q.toLowerCase();
    setFiltered(
      payments.filter(
        (p) =>
          p.patientName?.toLowerCase().includes(lower) ||
          String(p.id ?? "").toLowerCase().includes(lower) ||
          String(p.claimId ?? "").toLowerCase().includes(lower)
      )
    );
    setPage(1);
  };

  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const totalPaid = payments
    .filter((p) => p.status?.toLowerCase() === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <Layout role="Patient">
      <div className="dashboard-header mb-4">
        <h3 className="dashboard-title">Payments</h3>
        <p className="text-muted mb-0">
          All payment transactions linked to your claims.
          {totalPaid > 0 && (
            <span className="ms-2 badge bg-success-subtle text-success fw-semibold">
              ₹{totalPaid.toLocaleString("en-IN")} total paid
            </span>
          )}
        </p>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
          <TableSearch
            onSearch={handleSearch}
            placeholder="Search by payment ID or claim ID…"
          />
          <span className="text-muted small">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="card-body px-4 pb-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : paginated.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">No payments found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Payment Ref</th>
                    <th>Claim Ref</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span
                          className="badge bg-light text-secondary fw-medium"
                          style={{ fontFamily: "monospace", fontSize: "0.78rem" }}
                          title={p.id}
                        >
                          {shortRef(p.id)}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge bg-light text-secondary fw-medium"
                          style={{ fontFamily: "monospace", fontSize: "0.78rem" }}
                          title={p.claimId}
                        >
                          {shortRef(p.claimId)}
                        </span>
                      </td>
                      <td>₹{(p.amount ?? 0).toLocaleString("en-IN")}</td>
                      <td>{p.method || "—"}</td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {fmtDate(p.date ?? p.createdAt)}
                      </td>
                      <td>
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-4 d-flex justify-content-end">
              <ul className="pagination mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                  >
                    ‹
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <li
                      key={num}
                      className={`page-item ${num === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(num)}
                      >
                        {num}
                      </button>
                    </li>
                  )
                )}
                <li
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                  >
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentsPage;