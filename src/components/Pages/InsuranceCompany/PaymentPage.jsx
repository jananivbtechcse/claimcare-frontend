

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../Layout/Sidebar";
import Navbar from "../../Layout/Navbar";
import api from "../../../api/api";

/* ── helpers ── */
const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const extractAmount = (claim) =>
  claim?.claimAmount ?? claim?.approvedAmount ?? claim?.amount ?? 0;

const isApproved = (status = "") => status.toLowerCase().trim() === "approved";

const generateTxnRef = () =>
  "TXN" + Date.now() + Math.random().toString(36).slice(2, 7).toUpperCase();

const formatDateTime = (d) => {
  if (!d) return "—";
  const parsed = new Date(d);
  return isNaN(parsed)
    ? d
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

/* ── step indicator ── */
function StepIndicator({ step }) {
  const STEPS = ["Select Claim", "Payment Details", "Confirm & Pay"];
  return (
    <div className="d-flex align-items-center mb-4">
      {STEPS.map((label, idx) => {
        const n = idx + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={n} className="d-flex align-items-center">
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: 34, height: 34, fontSize: 14,
                  background: done ? "#198754" : active ? "#0d6efd" : "#dee2e6",
                  color: done || active ? "#fff" : "#6c757d",
                }}
              >
                {done ? "✓" : n}
              </div>
              <small className="mt-1" style={{
                fontSize: 11, whiteSpace: "nowrap",
                color: active ? "#0d6efd" : done ? "#198754" : "#6c757d",
                fontWeight: active ? 600 : 400,
              }}>
                {label}
              </small>
            </div>
            {idx < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, minWidth: 48,
                margin: "0 8px", marginBottom: 18,
                background: done ? "#198754" : "#dee2e6",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── success screen ── */
function SuccessScreen({ claimId, claimNumber, amount, txnRef, onDone }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "40vh" }}>
      <div className="card border-0 shadow text-center p-5" style={{ maxWidth: 440, width: "100%" }}>
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: 72, height: 72, background: "#ecfdf3", fontSize: 34, color: "#12b76a" }}
        >
          ✓
        </div>
        <h4 className="fw-bold mb-1">Payment Successful!</h4>
        <p className="text-muted small mb-1">Claim {claimNumber || `#${claimId}`}</p>
        <h2 className="fw-bold text-primary mb-3">{formatINR(amount)}</h2>
        <div className="alert alert-light border py-2 small mb-4">
          Transaction Reference: <strong>{txnRef}</strong>
        </div>
        <button className="btn btn-primary w-100" onClick={onDone}>
          Make Another Payment
        </button>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

/* ── payment history table with search + pagination ── */
function PaymentHistoryTable({ payments, loading }) {
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState("");

  // Reset page when search or data changes
  useEffect(() => { setPage(1); }, [search, payments.length]);

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted py-4 px-3">
        <span className="spinner-border spinner-border-sm" /> Loading payment history…
      </div>
    );
  }
  if (!payments.length) {
    return <div className="text-center text-muted py-5 small">No payment records found yet.</div>;
  }

  // Filter by claim number search
  const filtered = search.trim()
    ? payments.filter(p =>
        (p.claimNumber || "").toLowerCase().includes(search.toLowerCase())
      )
    : payments;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {/* search bar */}
      <div className="p-3 border-bottom">
        <div className="input-group" style={{ maxWidth: 320 }}>
          <span className="input-group-text bg-white border-end-0 text-muted" style={{ fontSize: 13 }}>🔍</span>
          <input
            className="form-control border-start-0"
            style={{ fontSize: 13 }}
            placeholder="Search by claim number…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th style={{ fontSize: 13 }}>#</th>
              <th style={{ fontSize: 13 }}>Claim Number</th>
              <th style={{ fontSize: 13 }}>Transaction Ref</th>
              <th style={{ fontSize: 13 }}>Payment Type</th>
              <th style={{ fontSize: 13 }}>Amount</th>
              <th style={{ fontSize: 13 }}>Date & Time</th>
              <th style={{ fontSize: 13 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4 small">
                  No results for "{search}"
                </td>
              </tr>
            ) : slice.map((p, idx) => (
              <tr key={p.paymentId}>
                <td className="text-muted small">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                {/* claimNumber — comes from backend after DTO fix */}
                <td className="fw-semibold small">{p.claimNumber || `#${p.claimId}`}</td>
                {/* transactionReference — comes from backend after DTO fix */}
                <td>
                  <span className="badge bg-light text-dark border font-monospace" style={{ fontSize: 11 }}>
                    {p.transactionReference || "—"}
                  </span>
                </td>
                <td>
                  <span className="badge bg-primary bg-opacity-10 text-primary small text-uppercase">
                    {p.paymentType}
                  </span>
                </td>
                <td className="fw-bold text-success small">{formatINR(p.paymentAmount)}</td>
                <td className="text-muted small">{formatDateTime(p.paymentDate)}</td>
                <td><span className="badge bg-success">Paid</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between px-3 py-2 border-top flex-wrap gap-2">
          <small className="text-muted">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </small>
          <div className="d-flex gap-1 flex-wrap">
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`btn btn-sm ${page === n ? "btn-primary" : "btn-outline-secondary"}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
              Next ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ── main page ── */
export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "";
  const navState = location.state || {};

  const [step, setStep] = useState(1);

  /* claims */
  const [allClaims, setAllClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  /* payment history */
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* selected claim */
  const [selectedClaimId, setSelectedClaimId] = useState(navState.claimId || "");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(navState.paymentAmount || 0);

  /* payment fields */
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  /* ui state */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  /* fetch approved (non-paid) claims */
  const fetchClaims = () => {
    setClaimsLoading(true);
    setFetchError("");
    api
      .get("/api/InsuranceCompany/claims")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        // Only Approved claims — backend marks paid ones as "Paid" so they're auto-excluded
        setAllClaims(all.filter((c) => isApproved(c.status || "")));
      })
      .catch((err) => {
        const status = err?.response?.status;
        setFetchError(
          status === 401 || status === 403
            ? "Session expired. Please log in again."
            : "Failed to load claims. Please refresh."
        );
      })
      .finally(() => setClaimsLoading(false));
  };

  /* fetch all payment history from Payments table */
  const fetchPaymentHistory = () => {
    setHistoryLoading(true);
    api
      .get("/api/Payment")
      .then((res) => {
        setPaymentHistory(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setPaymentHistory([]))
      .finally(() => setHistoryLoading(false));
  };

  useEffect(() => {
    fetchClaims();
    fetchPaymentHistory();
  }, []);

  /* Pre-select if navigated with claimId */
  useEffect(() => {
    if (navState.claimId && allClaims.length > 0) {
      handleClaimSelect(String(navState.claimId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allClaims]);

  /* Claim selection — keyed by claimNumber in dropdown */
  const handleClaimSelect = (claimNumber) => {
    setError("");
    if (!claimNumber) {
      setSelectedClaimId(""); setSelectedClaim(null); setPaymentAmount(0);
      return;
    }
    const claim =
      allClaims.find((c) => String(c.claimNumber) === String(claimNumber)) ||
      allClaims.find((c) => String(c.claimId) === String(claimNumber));
    if (claim) {
      setSelectedClaimId(claim.claimId);
      setSelectedClaim(claim);
      setPaymentAmount(extractAmount(claim));
    }
  };

  /* Validation */
  const validatePayment = () => {
    if (method === "upi") {
      if (!upiId.trim()) return "Please enter your UPI ID.";
      if (!upiId.includes("@")) return "Enter a valid UPI ID (e.g. name@okaxis).";
    }
    if (method === "card") {
      if (cardNumber.replace(/\s/g, "").length < 16) return "Enter a valid 16-digit card number.";
      if (!cardName.trim()) return "Enter the cardholder name.";
      if (expiry.length < 5) return "Enter expiry in MM/YY format.";
      if (cvv.length < 3) return "Enter a valid CVV.";
    }
    return "";
  };

  const goToStep2 = () => {
    if (!selectedClaimId) { setError("Please select a claim."); return; }
    if (!paymentAmount || paymentAmount <= 0) { setError("This claim has no payable amount."); return; }
    setError(""); setStep(2);
  };

  const goToStep3 = () => {
    const err = validatePayment();
    if (err) { setError(err); return; }
    setError(""); setStep(3);
  };

  /* Submit payment */
  const handlePay = async () => {
    setLoading(true);
    setError("");
    const transactionReference = generateTxnRef();
    const payload = {
      claimId: Number(selectedClaimId),
      paymentAmount: paymentAmount,
      paymentType: method,
      transactionReference: transactionReference,
    };
    try {
      await api.post("/api/Payment", payload);
      // Immediately remove paid claim from dropdown
      setAllClaims((prev) => prev.filter((c) => c.claimId !== Number(selectedClaimId)));
      // Refresh history table to show new record
      fetchPaymentHistory();
      setSuccess({ txnRef: transactionReference });
    } catch (e) {
      setError(
        e?.response?.data?.message ||
        e?.response?.data ||
        e.message ||
        "Payment failed. Please try again."
      );
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  /* Reset form after success — stay on the page for next payment */
  const handleAfterSuccess = () => {
    setSuccess(null);
    setStep(1);
    setSelectedClaimId("");
    setSelectedClaim(null);
    setPaymentAmount(0);
    setUpiId("");
    setCardNumber("");
    setCardName("");
    setExpiry("");
    setCvv("");
    setMethod("upi");
  };

  const methodLabel = method === "upi" ? "UPI" : "Credit / Debit Card";
  const methodDetail =
    method === "upi" ? upiId :
    cardNumber ? `**** **** **** ${cardNumber.replace(/\s/g, "").slice(-4)}` : "—";

  /* ── render ── */
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6fb" }}>
      <Sidebar role={role} />
      <div className="flex-grow-1 d-flex flex-column overflow-auto">
        <Navbar role={role} />
        <div className="container-fluid py-4 px-4">

          {/* header */}
          <div className="mb-3">
            <h5 className="mb-0 fw-bold">Process Claim Payment</h5>
            <small className="text-muted">Insurance Company Payment Portal</small>
          </div>

          {/* ── payment form ── */}
          {success ? (
            <SuccessScreen
              claimId={selectedClaimId}
              claimNumber={selectedClaim?.claimNumber}
              amount={paymentAmount}
              txnRef={success.txnRef}
              onDone={handleAfterSuccess}
            />
          ) : (
            <>
              <StepIndicator step={step} />
              <div className="row g-4 align-items-start">

                {/* left panel */}
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm p-4">

                    {/* step 1 */}
                    {step === 1 && (
                      <>
                        <h6 className="fw-bold mb-1">Select an Approved Claim</h6>
                        <p className="text-muted small mb-4">
                          Only <strong>Approved</strong> claims are listed. Selecting a claim number will automatically load the payable amount.
                        </p>

                        {claimsLoading && (
                          <div className="d-flex align-items-center gap-2 text-muted py-3">
                            <span className="spinner-border spinner-border-sm" /> Loading claims…
                          </div>
                        )}
                        {fetchError && <div className="alert alert-danger small">{fetchError}</div>}
                        {!claimsLoading && !fetchError && allClaims.length === 0 && (
                          <div className="alert alert-warning small mb-0">
                            No approved claims found. Approve a claim first from the Claims section.
                          </div>
                        )}

                        {!claimsLoading && allClaims.length > 0 && (
                          <>
                            <div className="mb-3">
                              <label className="form-label fw-semibold">Choose Claim Number</label>
                              <select
                                className="form-select form-select-lg"
                                value={selectedClaim?.claimNumber || ""}
                                onChange={(e) => handleClaimSelect(e.target.value)}
                              >
                                <option value="">-- Select Claim Number --</option>
                                {allClaims.map((c) => (
                                  <option key={c.claimId} value={c.claimNumber}>
                                    {c.claimNumber}
                                    {c.patientName  ? ` | ${c.patientName}`  : ""}
                                    {c.hospitalName ? ` | ${c.hospitalName}` : ""}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {selectedClaim ? (
                              <div className="card border-primary border-2 bg-primary bg-opacity-10 p-4 mb-3">
                                <div className="row g-3">
                                  <div className="col-sm-6">
                                    <div className="text-muted small fw-semibold mb-1">CLAIM NUMBER</div>
                                    <div className="fw-bold">{selectedClaim.claimNumber}</div>
                                  </div>
                                  <div className="col-sm-6">
                                    <div className="text-muted small fw-semibold mb-1">CLAIM ID</div>
                                    <div className="fw-medium text-muted">#{selectedClaim.claimId}</div>
                                  </div>
                                  {selectedClaim.patientName && (
                                    <div className="col-sm-6">
                                      <div className="text-muted small fw-semibold mb-1">PATIENT</div>
                                      <div className="fw-medium">{selectedClaim.patientName}</div>
                                    </div>
                                  )}
                                  {selectedClaim.hospitalName && (
                                    <div className="col-sm-6">
                                      <div className="text-muted small fw-semibold mb-1">HOSPITAL</div>
                                      <div className="fw-medium">{selectedClaim.hospitalName}</div>
                                    </div>
                                  )}
                                  <div className="col-sm-6">
                                    <div className="text-muted small fw-semibold mb-1">STATUS</div>
                                    <span className="badge bg-success">{selectedClaim.status}</span>
                                  </div>
                                  <div className="col-12">
                                    <hr className="my-1" />
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                      <div className="text-muted small fw-semibold">PAYABLE AMOUNT</div>
                                      <div className="fw-bold text-primary" style={{ fontSize: 26 }}>
                                        {formatINR(paymentAmount)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="alert alert-light border text-muted small mb-3">
                                ℹ️ Select a Claim Number above to auto-load the payable amount.
                              </div>
                            )}

                            {error && <div className="alert alert-danger py-2 small mb-3">⚠ {error}</div>}

                            <button
                              className="btn btn-primary px-5"
                              onClick={goToStep2}
                              disabled={!selectedClaimId || !paymentAmount}
                            >
                              Proceed to Payment →
                            </button>
                          </>
                        )}
                      </>
                    )}

                    {/* step 2 */}
                    {step === 2 && (
                      <>
                        <h6 className="fw-bold mb-1">Choose Payment Method</h6>
                        <p className="text-muted small mb-3">
                          Claim <strong>{selectedClaim?.claimNumber || `#${selectedClaimId}`}</strong> · {formatINR(paymentAmount)}
                        </p>

                        <ul className="nav nav-pills gap-2 mb-4">
                          {[
                            { id: "upi",  label: "💳 UPI" },
                            { id: "card", label: "🏦 Card" },
                          ].map((m) => (
                            <li className="nav-item" key={m.id}>
                              <button
                                className={`nav-link ${method === m.id ? "active" : "border text-dark bg-white"}`}
                                onClick={() => { setMethod(m.id); setError(""); }}
                              >
                                {m.label}
                              </button>
                            </li>
                          ))}
                        </ul>

                        <hr />

                        {method === "upi" && (
                          <div className="mb-3">
                            <label className="form-label fw-medium">UPI ID</label>
                            <input
                              className="form-control"
                              placeholder="e.g. name@okaxis"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                            />
                          </div>
                        )}

                        {method === "card" && (
                          <>
                            <div className="mb-3">
                              <label className="form-label fw-medium">Card Number</label>
                              <input
                                className="form-control"
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => {
                                  const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                                  setCardNumber(v);
                                }}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label fw-medium">Cardholder Name</label>
                              <input
                                className="form-control"
                                placeholder="Name as on card"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                              />
                            </div>
                            <div className="row g-3">
                              <div className="col-6">
                                <label className="form-label fw-medium">Expiry (MM/YY)</label>
                                <input
                                  className="form-control"
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  value={expiry}
                                  onChange={(e) => {
                                    let v = e.target.value.replace(/\D/g, "");
                                    if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                                    setExpiry(v);
                                  }}
                                />
                              </div>
                              <div className="col-6">
                                <label className="form-label fw-medium">CVV</label>
                                <input
                                  className="form-control"
                                  placeholder="•••"
                                  maxLength={4}
                                  type="password"
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {error && <div className="alert alert-danger py-2 small mt-3">⚠ {error}</div>}

                        <div className="mt-4">
                          <button className="btn btn-primary px-5" onClick={goToStep3}>
                            Review & Confirm →
                          </button>
                        </div>
                      </>
                    )}

                    {/* step 3 */}
                    {step === 3 && (
                      <>
                        <h6 className="fw-bold mb-1">Confirm Payment</h6>
                        <p className="text-muted small mb-4">Review and confirm. This action cannot be undone.</p>

                        <table className="table table-bordered table-sm mb-4">
                          <tbody>
                            <tr>
                              <td className="text-muted fw-semibold bg-light" style={{ width: "38%" }}>Claim Number</td>
                              <td className="fw-semibold">{selectedClaim?.claimNumber}</td>
                            </tr>
                            <tr>
                              <td className="text-muted fw-semibold bg-light">Claim ID</td>
                              <td className="text-muted">#{selectedClaimId}</td>
                            </tr>
                            {selectedClaim?.patientName && (
                              <tr>
                                <td className="text-muted fw-semibold bg-light">Patient</td>
                                <td>{selectedClaim.patientName}</td>
                              </tr>
                            )}
                            {selectedClaim?.hospitalName && (
                              <tr>
                                <td className="text-muted fw-semibold bg-light">Hospital</td>
                                <td>{selectedClaim.hospitalName}</td>
                              </tr>
                            )}
                            <tr>
                              <td className="text-muted fw-semibold bg-light">Payment Method</td>
                              <td>{methodLabel}</td>
                            </tr>
                            <tr>
                              <td className="text-muted fw-semibold bg-light">
                                {method === "upi" ? "UPI ID" : "Card"}
                              </td>
                              <td>{methodDetail}</td>
                            </tr>
                            <tr className="table-primary">
                              <td className="fw-bold">Total Payable</td>
                              <td className="fw-bold text-primary fs-6">{formatINR(paymentAmount)}</td>
                            </tr>
                          </tbody>
                        </table>

                        {error && <div className="alert alert-danger py-2 small mb-3">⚠ {error}</div>}

                        <div className="d-flex gap-3">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => setStep(2)}
                            disabled={loading}
                          >
                            ← Edit
                          </button>
                          <button
                            className="btn btn-success px-4"
                            onClick={handlePay}
                            disabled={loading}
                          >
                            {loading ? (
                              <><span className="spinner-border spinner-border-sm me-2" />Processing…</>
                            ) : (
                              `✓ Confirm & Pay ${formatINR(paymentAmount)}`
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* right: summary */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm p-4">
                    <h6 className="text-uppercase text-muted small fw-semibold mb-3">Payment Summary</h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Claim Number</span>
                      <span className="small fw-medium">{selectedClaim?.claimNumber || "—"}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Claim ID</span>
                      <span className="small fw-medium">{selectedClaimId ? `#${selectedClaimId}` : "—"}</span>
                    </div>
                    {selectedClaim?.patientName && (
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Patient</span>
                        <span className="small fw-medium">{selectedClaim.patientName}</span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Method</span>
                      <span className="small fw-medium">{step >= 2 ? methodLabel : "—"}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="fw-semibold">Total</span>
                      <span className="fs-5 fw-bold text-primary">
                        {paymentAmount ? formatINR(paymentAmount) : "—"}
                      </span>
                    </div>
                    {step === 1 && <p className="text-muted small mb-0">👆 Select a claim to continue.</p>}
                    {step === 2 && <p className="text-muted small mb-0">💳 Fill in payment details.</p>}
                    {step === 3 && <div className="alert alert-success py-2 small mb-0">✅ Ready to pay.</div>}
                    <p className="text-center text-muted small mt-3 mb-0">🔒 Secured end-to-end</p>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* ── payment history table — always visible below ── */}
          <div className="mt-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold mb-0">Payment History</h5>
                <small className="text-muted">All records stored in the Payments table</small>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={fetchPaymentHistory}
                disabled={historyLoading}
              >
                {historyLoading
                  ? <span className="spinner-border spinner-border-sm" />
                  : "↻ Refresh"}
              </button>
            </div>

            <div className="card border-0 shadow-sm">
              {/* summary strip */}
              <div className="p-3 border-bottom d-flex gap-4 flex-wrap">
                <div>
                  <div className="text-muted small">Total Payments</div>
                  <div className="fw-bold">{paymentHistory.length}</div>
                </div>
                <div>
                  <div className="text-muted small">Total Paid Out</div>
                  <div className="fw-bold text-success">
                    {formatINR(
                      paymentHistory.reduce(
                        (sum, p) => sum + (p.paymentAmount ?? p.amount ?? 0), 0
                      )
                    )}
                  </div>
                </div>
              </div>

              <PaymentHistoryTable payments={paymentHistory} loading={historyLoading} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}