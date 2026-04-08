

import { useEffect, useState, useCallback } from "react";
import Layout from "../../Layout/Layout";
import api from "../../../api/api";
import StatusBadge from "../../Common/StatusBadge";
import TableSearch from "../../Common/TableSearch";
import { Download, CheckCircle, AlertCircle } from "lucide-react";


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

const fmtAmt = (v) =>
  v == null ? "—" : "₹" + Number(v).toLocaleString("en-IN");


const fetchPatientInvoices = async () => {
  const res = await api.get("/api/Patient/invoices");
  const raw = res.data;
  if (Array.isArray(raw)) return raw;
  return raw?.$values ?? raw?.items?.$values ?? raw?.items ?? raw?.data ?? [];
};

// const generateAndDownloadPdf = (inv) => {

//   const html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8"/>
//       <title>Invoice ${inv.invoiceNumber ?? inv.invoiceId}</title>
//       <style>
//         body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
//         h1   { font-size: 24px; margin-bottom: 4px; }
//         .sub { color: #777; font-size: 13px; margin-bottom: 32px; }
//         table { width: 100%; border-collapse: collapse; margin-top: 16px; }
//         th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #eee; }
//         th { background: #f5f5f5; font-size: 13px; color: #555; }
//         .total td { font-weight: bold; font-size: 15px; border-top: 2px solid #333; }
//         .badge { display:inline-block; padding: 3px 10px; border-radius: 20px;
//                  font-size: 12px; background: #e8f5e9; color: #2e7d32; }
//         @media print { body { padding: 20px; } }
//       </style>
//     </head>
//     <body>
//       <h1>Invoice</h1>
//       <div class="sub">Generated on ${new Date().toLocaleDateString("en-IN")}</div>

//       <table>
//         <tr><th>Invoice Number</th><td>${inv.invoiceNumber ?? "—"}</td></tr>
//         <tr><th>Patient</th>        <td>${inv.patientName  ?? "—"}</td></tr>
//         <tr><th>Provider</th>       <td>${inv.providerName ?? "—"}</td></tr>
//         <tr><th>Invoice Date</th>   <td>${fmtDate(inv.invoiceDate)}</td></tr>
//         <tr><th>Status</th>
//             <td><span class="badge">${inv.invoiceStatus ?? "Issued"}</span></td>
//         </tr>
//       </table>

//       <table style="margin-top:24px">
//         <thead>
//           <tr><th>Description</th><th style="text-align:right">Amount</th></tr>
//         </thead>
//         <tbody>
//           ${inv.consultationFee != null ? `<tr><td>Consultation Fee</td><td style="text-align:right">${fmtAmt(inv.consultationFee)}</td></tr>` : ""}
//           ${inv.diagnosticFee   != null ? `<tr><td>Diagnostic Fee</td>  <td style="text-align:right">${fmtAmt(inv.diagnosticFee)}</td></tr>`   : ""}
//           ${inv.medicationFee   != null ? `<tr><td>Medication Fee</td>  <td style="text-align:right">${fmtAmt(inv.medicationFee)}</td></tr>`   : ""}
//           ${inv.tax             != null ? `<tr><td>Tax</td>             <td style="text-align:right">${fmtAmt(inv.tax)}</td></tr>`             : ""}
//         </tbody>
//         <tfoot>
//           <tr class="total">
//             <td>Total Amount</td>
//             <td style="text-align:right">${fmtAmt(inv.totalAmount)}</td>
//           </tr>
//         </tfoot>
//       </table>
//     </body>
//     </html>
//   `;

//   // Open in a hidden iframe and trigger print-to-PDF
//   const iframe = document.createElement("iframe");
//   iframe.style.position = "fixed";
//   iframe.style.top = "-10000px";
//   iframe.style.left = "-10000px";
//   document.body.appendChild(iframe);

//   iframe.contentDocument.open();
//   iframe.contentDocument.write(html);
//   iframe.contentDocument.close();

//   iframe.onload = () => {
//     iframe.contentWindow.focus();
//     iframe.contentWindow.print();
//     setTimeout(() => document.body.removeChild(iframe), 1000);
//   };
// };



const generateAndDownloadPdf = (inv) => {
  const fees = [
    { label: "Consultation Fee", sub: "Doctor consultation charges", val: inv.consultationFee },
    { label: "Diagnostic Tests Fee", sub: "Laboratory & pathology tests", val: inv.diagnosticFee },
    { label: "Diagnostic Scan Fee", sub: "Imaging & radiology scans", val: inv.diagnosticScanFee },
    { label: "Prescribed Medications", sub: "Pharmacy & medication charges", val: inv.medicationFee },
  ].filter((f) => f.val != null && f.val !== 0);

  const subtotal = fees.reduce((s, f) => s + Number(f.val), 0);
  const taxAmount = inv.taxAmount ?? subtotal * 0.08;
  const grandTotal = inv.totalAmount ?? subtotal + taxAmount;

  const feeRows = fees.length > 0
    ? fees.map((f) => `
        <tr>
          <td>
            <div class="item-desc">${f.label}</div>
            <div class="item-sub">${f.sub}</div>
          </td>
          <td style="text-align:right; font-weight:500">${fmtAmt(f.val)}</td>
        </tr>`).join("")
    : `<tr><td colspan="2" style="text-align:center; color:#9ca3af; padding:20px">
        No itemized fees available
       </td></tr>`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <title>Invoice ${inv.invoiceNumber ?? inv.invoiceId}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', Arial, sans-serif;
          background: #fff;
          color: #1a1a2e;
          padding: 40px 48px;
          font-size: 13px;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
          padding-bottom: 24px;
          border-bottom: 2.5px solid #1a1a2e;
        }
        .brand { display: flex; align-items: center; gap: 10px; }
        .brand-icon {
          width: 40px; height: 40px;
          background: #1a1a2e;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; font-weight: 700;
        }
        .brand-name { font-size: 20px; font-weight: 700; color: #1a1a2e; }
        .brand-tagline { font-size: 10px; color: #6b7280; margin-top: 1px; }
        .invoice-label { text-align: right; }
        .invoice-label h1 { font-size: 28px; font-weight: 700; letter-spacing: -1px; line-height: 1; }
        .inv-num { font-size: 12px; color: #6b7280; margin-top: 5px; font-weight: 500; }
        .status-chip {
          display: inline-block; margin-top: 7px;
          padding: 3px 12px; border-radius: 20px;
          font-size: 10px; font-weight: 700;
          background: #d1fae5; color: #065f46;
          letter-spacing: 0.5px; text-transform: uppercase;
        }
        .meta-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin-bottom: 28px;
        }
        .meta-box {
          background: #f8f9fb; border: 1px solid #e5e7eb;
          border-radius: 10px; padding: 16px 18px;
        }
        .meta-box h4 {
          font-size: 9.5px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 10px;
        }
        .meta-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f3f4f6; }
        .meta-row:last-child { border-bottom: none; }
        .meta-row .lbl { color: #6b7280; font-size: 12px; }
        .meta-row .val { color: #111827; font-weight: 500; font-size: 12px; max-width: 55%; text-align: right; word-break: break-word; }
        .section-title {
          font-size: 9.5px; font-weight: 700; color: #9ca3af;
          text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;
        }
        table { width: 100%; border-collapse: collapse; border-radius: 10px; overflow: hidden; border: 1px solid #e5e7eb; }
        thead tr { background: #1a1a2e; color: #fff; }
        thead th { padding: 10px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; }
        thead th:last-child { text-align: right; }
        tbody tr { border-bottom: 1px solid #f3f4f6; }
        tbody tr:last-child { border-bottom: none; }
        tbody td { padding: 11px 16px; color: #374151; }
        .item-desc { color: #111827; font-weight: 500; font-size: 13px; }
        .item-sub { color: #9ca3af; font-size: 11px; margin-top: 1px; }
        .totals-wrap { display: flex; justify-content: flex-end; margin-top: 16px; }
        .totals-box { width: 280px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
        .t-row { display: flex; justify-content: space-between; padding: 9px 14px; border-bottom: 1px solid #f3f4f6; font-size: 12.5px; color: #6b7280; }
        .t-row:last-child { border-bottom: none; }
        .t-row.grand { background: #1a1a2e; color: #fff; font-weight: 700; font-size: 13.5px; padding: 12px 14px; }
        .t-row.grand span:last-child { color: #a5f3fc; }
        .footer {
          margin-top: 32px; padding-top: 18px;
          border-top: 1px solid #e5e7eb;
          display: flex; justify-content: space-between; align-items: flex-end;
          color: #9ca3af; font-size: 11px;
        }
        .footer-note { max-width: 300px; line-height: 1.7; }
        .footer-brand { font-weight: 700; color: #1a1a2e; font-size: 13px; }
        @media print { body { padding: 20px 28px; } }
      </style>
    </head>
    <body>

      <div class="header">
        <div class="brand">
          <div class="brand-icon">C</div>
          <div>
            <div class="brand-name">ClaimCare</div>
            <div class="brand-tagline">Healthcare Billing & Claims Management</div>
          </div>
        </div>
        <div class="invoice-label">
          <h1>INVOICE</h1>
          <div class="inv-num">${inv.invoiceNumber ?? "—"}</div>
          <div class="status-chip">${inv.invoiceStatus ?? "Issued"}</div>
        </div>
      </div>

      <div class="meta-grid">
        <div class="meta-box">
          <h4>Patient Details</h4>
          <div class="meta-row">
            <span class="lbl">Patient ID</span>
            <span class="val">${inv.patientId ?? "—"}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Patient Name</span>
            <span class="val">${inv.patientName ?? "—"}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Address</span>
            <span class="val">${inv.patientAddress ?? "—"}</span>
          </div>
        </div>
        <div class="meta-box">
          <h4>Invoice Details</h4>
          <div class="meta-row">
            <span class="lbl">Invoice Number</span>
            <span class="val">${inv.invoiceNumber ?? "—"}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Invoice Date</span>
            <span class="val">${fmtDate(inv.invoiceDate)}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Due Date</span>
            <span class="val">${fmtDate(inv.dueDate)}</span>
          </div>
          <div class="meta-row">
            <span class="lbl">Provider</span>
            <span class="val">${inv.providerName ?? "—"}</span>
          </div>
        </div>
      </div>

      <div class="section-title">Billing Summary</div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>${feeRows}</tbody>
      </table>

      <div class="totals-wrap">
        <div class="totals-box">
          ${fees.length > 0 ? `<div class="t-row"><span>Subtotal</span><span>${fmtAmt(subtotal)}</span></div>` : ""}
          <div class="t-row"><span>Tax (8%)</span><span>${fmtAmt(taxAmount)}</span></div>
          <div class="t-row grand">
            <span>Total Amount Due</span>
            <span>${fmtAmt(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="footer-note">
          Thank you for choosing <strong>ClaimCare</strong>. Please retain this invoice for your records.<br/>
          For billing queries, contact support@claimcare.in
        </div>
        <div style="text-align:right">
          <div class="footer-brand">ClaimCare</div>
          <div>Generated on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
      </div>

    </body>
    </html>
  `;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-10000px";
  iframe.style.left = "-10000px";
  document.body.appendChild(iframe);
  iframe.contentDocument.open();
  iframe.contentDocument.write(html);
  iframe.contentDocument.close();
  iframe.onload = () => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
};

// ── config ────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

// ── component ─────────────────────────────────────────────────────────────────
const InvoicesPage = () => {
  const [allItems,      setAllItems]      = useState([]);
  const [filtered,      setFiltered]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [page,          setPage]          = useState(1);
  const [downloadingId, setDownloadingId] = useState(null);
  const [toast,         setToast]         = useState({ msg: "", type: "" });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPatientInvoices()
      .then((items) => {
        if (cancelled) return;
        const safe = Array.isArray(items) ? items : [];
        setAllItems(safe);
        setFiltered(safe);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.response?.data?.message || "Failed to load invoices.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleSearch = useCallback(
    (q) => {
      const lower = q.toLowerCase();
      setPage(1);
      setFiltered(
        !lower
          ? allItems
          : allItems.filter(
              (i) =>
                i.patientName?.toLowerCase().includes(lower)  ||
                i.providerName?.toLowerCase().includes(lower) ||
                i.invoiceNumber?.toLowerCase().includes(lower)
            )
      );
    },
    [allItems]
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 4000);
  };

  // ✅ Client-side PDF — no backend endpoint needed
  const handleDownload = (inv) => {
    const id = inv.invoiceId;
    setDownloadingId(id);
    try {
      generateAndDownloadPdf(inv);
      showToast("Invoice PDF opened for download!");
    } catch {
      showToast("Failed to generate PDF. Please try again.", "danger");
    } finally {
      // slight delay so user sees the spinner briefly
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  // ── pagination ────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <Layout role="Patient">
      <div className="dashboard-header mb-4">
        <h3 className="dashboard-title">Invoices</h3>
        <p className="text-muted mb-0">View and download your medical invoices.</p>
      </div>

      {/* Toast */}
      {toast.msg && (
        <div
          className={`alert alert-${toast.type} d-flex align-items-center gap-2 mb-3 py-2`}
          role="alert"
        >
          {toast.type === "success"
            ? <CheckCircle size={16} />
            : <AlertCircle size={16} />}
          <span style={{ fontSize: "0.88rem" }}>{toast.msg}</span>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        {/* Header */}
        <div className="card-header bg-white border-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-center">
          <TableSearch
            onSearch={handleSearch}
            placeholder="Search by invoice #, patient or provider…"
          />
          <span className="text-muted small">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Body */}
        <div className="card-body px-4 pb-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : paginated.length === 0 ? (
            <p className="text-muted text-center py-4 mb-0">No invoices found.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Invoice #</th>
                      <th>Patient</th>
                      <th>Provider</th>
                      <th>Total Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((inv) => (
                      <tr key={inv.invoiceId}>
                        <td>
                          <span
                            className="fw-medium text-primary"
                            style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
                          >
                            {inv.invoiceNumber || "—"}
                          </span>
                        </td>
                        <td>{inv.patientName  || "—"}</td>
                        <td className="text-muted small">{inv.providerName || "—"}</td>
                        <td>
                          <span className="fw-semibold">{fmtAmt(inv.totalAmount)}</span>
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {fmtDate(inv.invoiceDate)}
                        </td>
                        <td>
                          <StatusBadge status={inv.invoiceStatus ?? "Issued"} />
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => handleDownload(inv)}
                            disabled={downloadingId === inv.invoiceId}
                            title="Download PDF"
                          >
                            {downloadingId === inv.invoiceId ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <Download size={13} />
                            )}
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Prev / Next ── */}
              <div className="d-flex justify-content-between align-items-center mt-4 px-1">
                <span className="text-muted small">
                  Page {page} of {totalPages} &nbsp;·&nbsp; {filtered.length} records
                </span>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handlePrev}
                    disabled={page <= 1}
                  >
                    ← Prev
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleNext}
                    disabled={page >= totalPages}
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

export default InvoicesPage;