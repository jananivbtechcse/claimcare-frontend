
// import { useEffect, useState } from "react";
// import Layout from "../../Layout/Layout";
// import patientService from "../../../services/patientService";

// const fmtAmt = (v) => v == null ? "—" : "₹" + Number(v).toLocaleString("en-IN");

// // Flexible invoice field resolver
// const getInvoiceField = (inv, ...keys) => {
//   for (const k of keys) if (inv[k] != null) return inv[k];
//   return null;
// };

// const SubmitClaimPage = () => {
//   const [invoices,        setInvoices]        = useState([]);
//   const [myPlan,          setMyPlan]          = useState(null);   // ← patient's enrolled plan
//   const [selectedInvoice, setSelectedInvoice] = useState(null);
//   const [claimAmount,     setClaimAmount]     = useState("");
//   const [loadingInvoices, setLoadingInvoices] = useState(true);
//   const [loadingPlan,     setLoadingPlan]     = useState(true);
//   const [submitting,      setSubmitting]      = useState(false);
//   const [success,         setSuccess]         = useState(false);
//   const [error,           setError]           = useState("");

//   // useEffect(() => {
//   //   // Fetch invoices
//   //   patientService.getInvoices()
//   //     .then(res => {
//   //       const items = Array.isArray(res) ? res : (res?.items ?? []);
//   //       console.log("Invoices sample:", items[0]);
//   //       setInvoices(items);
//   //     })
//   //     .catch(err => console.error("Invoice fetch failed:", err))
//   //     .finally(() => setLoadingInvoices(false));

//   //   // Fetch patient's OWN enrolled plan
//   //   patientService.getMyPlans()
//   //     .then(res => {
//   //       // API may return array or single object
//   //       const plan = Array.isArray(res) ? res[0] : (res?.items?.[0] ?? res);
//   //       console.log("My plan (raw):", plan);
//   //       if (plan) setMyPlan(plan);
//   //     })
//   //     .catch(err => {
//   //       console.warn("getMyPlans failed, falling back to getAllPlans:", err);
//   //       // fallback: load all plans so the user can still pick one
//   //       patientService.getAllPlans(1, 100)
//   //         .then(res => {
//   //           const items = Array.isArray(res) ? res : (res?.items ?? []);
//   //           if (items.length > 0) setMyPlan(items[0]); // pre-select first
//   //         })
//   //         .catch(console.error);
//   //     })
//   //     .finally(() => setLoadingPlan(false));
//   // }, []);

//   useEffect(() => {
//   // Fetch invoices
//   patientService.getInvoices()
//     .then(res => {
//       const items = Array.isArray(res) ? res : (res?.items ?? []);
//       console.log("Invoices sample:", items[0]);
//       setInvoices(items);
//     })
//     .catch(err => console.error("Invoice fetch failed:", err))
//     .finally(() => setLoadingInvoices(false));

//   // ✅ Use getMyPlans — this is the ENROLLED plan(s), not all plans
//   patientService.getMyPlans(1, 100)
//     .then(res => {
//       const items = Array.isArray(res) ? res : (res?.items ?? []);
//       console.log("My enrolled plans:", items);
//       // Patient may have 1 enrolled plan — pick it
//       if (items.length > 0) setMyPlan(items[0]);
//     })
//     .catch(err => {
//       console.warn("getMyPlans failed:", err);
//       // ✅ Fallback: pull from profile which already shows correct plan
//       patientService.getProfile()
//         .then(profile => {
//           console.log("Profile fallback:", profile);
//           // Adjust field name based on what your profile API returns
//           const plan = profile?.insurancePlan
//             ?? profile?.plan
//             ?? profile?.currentPlan
//             ?? null;
//           if (plan) setMyPlan(plan);
//         })
//         .catch(console.error);
//     })
//     .finally(() => setLoadingPlan(false));
// }, []);

//   const handleInvoiceChange = (e) => {
//     const inv = invoices.find(i => String(i.invoiceId) === e.target.value) ?? null;
//     setSelectedInvoice(inv);
//     if (inv) {
//       const total = getInvoiceField(inv, "totalAmount", "total", "amount");
//       setClaimAmount(total?.toString() ?? "");
//     }
//   };

//   // Resolve plan id and display name flexibly
//   // const planId   = myPlan ? (myPlan.insurancePlanId ?? myPlan.planId ?? myPlan.id) : "";
//   // const planName = myPlan ? (myPlan.planName ?? myPlan.name ?? `Plan #${planId}`) : "No plan enrolled";
//   // const planPremium = myPlan
//   //   ? ((myPlan.premiumAmount ?? myPlan.monthlyPremium ?? myPlan.coverageAmount / 100 ?? 0) / 100)
//   //   : 0;

//   // ✅ getMyPlans returns same shape as getAllPlans
// const planId      = myPlan ? (myPlan.insurancePlanId ?? myPlan.planId ?? myPlan.id) : "";
// const planName    = myPlan ? (myPlan.planName ?? myPlan.name ?? `Plan #${planId}`) : "No plan enrolled";
// // premiumAmount from API is already in rupees (2000 = ₹2000), NOT paise
// // From devtools: premiumAmount: 2000 and Silver Plan showed ₹25.5 — so it IS divided by 100
// const planPremium = myPlan
//   ? (myPlan.premiumAmount ?? myPlan.monthlyPremium ?? 0) / 100
//   : 0;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedInvoice) { setError("Please select an invoice."); return; }
//     if (!planId)          { setError("No enrolled insurance plan found."); return; }
//     if (!claimAmount)     { setError("Please enter a claim amount."); return; }

//     setSubmitting(true);
//     setError("");
//     setSuccess(false);
//     try {
//       const total = getInvoiceField(selectedInvoice, "totalAmount", "total", "amount");
//       await patientService.submitClaim({
//         invoiceId:       selectedInvoice.invoiceId,
//         insurancePlanId: parseInt(planId),
//         claimAmount:     parseFloat(claimAmount),
//         invoiceAmount:   total,
//       });
//       setSuccess(true);
//       setSelectedInvoice(null);
//       setClaimAmount("");
//     } catch (err) {
//       console.error("Submit claim error:", err.response?.data);
//       setError(err.response?.data?.message || "Failed to submit claim. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Flexible invoice breakdown fields
//   const invoiceRows = selectedInvoice ? [
//     ["Invoice #",       selectedInvoice.invoiceNumber || "—",                                   "Consultation",    fmtAmt(getInvoiceField(selectedInvoice, "consultationFee", "consultation"))],
//     ["Diagnostic Test", fmtAmt(getInvoiceField(selectedInvoice, "diagnosticTestFee", "diagnosticTest", "testFee")), "Diagnostic Scan", fmtAmt(getInvoiceField(selectedInvoice, "diagnosticScanFee", "diagnosticScan", "scanFee"))],
//     ["Medicine",        fmtAmt(getInvoiceField(selectedInvoice, "medicineFee", "medicine")),    "Tax",             selectedInvoice.taxPercentage != null ? `${selectedInvoice.taxPercentage}%` : "—"],
//   ] : [];
//   const invoiceTotal = selectedInvoice ? getInvoiceField(selectedInvoice, "totalAmount", "total", "amount") : null;

//   return (
//     <Layout role="patient">
//       <div className="mb-4">
//         <h4 className="fw-bold mb-1">Submit Claim</h4>
//         <p className="text-muted small mb-0">Select an invoice and raise a claim for reimbursement.</p>
//       </div>

//       <div className="row">
//         <div className="col-lg-6 mb-4">

//           {success && (
//             <div className="alert alert-success mb-3">
//               Claim submitted successfully! You will receive a confirmation email shortly.
//             </div>
//           )}
//           {error && <div className="alert alert-danger mb-3">{error}</div>}

//           <div className="card border-0 shadow-sm">
//             <div className="card-body p-4">
//               <form onSubmit={handleSubmit}>

//                 {/* Invoice */}
//                 <div className="mb-3">
//                   <label className="form-label fw-semibold small">Select Invoice *</label>
//                   {loadingInvoices ? (
//                     <div className="d-flex align-items-center gap-2 text-muted small">
//                       <div className="spinner-border spinner-border-sm" /> Loading invoices…
//                     </div>
//                   ) : invoices.length === 0 ? (
//                     <div className="alert alert-warning py-2 small mb-0">
//                       No invoices found. Please request an invoice from your provider first.
//                     </div>
//                   ) : (
//                     <select className="form-select"
//                       value={selectedInvoice?.invoiceId ?? ""}
//                       onChange={handleInvoiceChange} required>
//                       <option value="">— Choose an invoice —</option>
//                       {invoices.map(inv => {
//                         const total = getInvoiceField(inv, "totalAmount", "total", "amount");
//                         return (
//                           <option key={inv.invoiceId} value={inv.invoiceId}>
//                             {inv.invoiceNumber || `#${inv.invoiceId}`} · {fmtAmt(total)}
//                           </option>
//                         );
//                       })}
//                     </select>
//                   )}
//                 </div>

                

//                 {/* Enrolled Insurance Plan — read-only, auto-filled */}
                
//                 {/* Claim Amount */}
//                 <div className="mb-4">
//                   <label className="form-label fw-semibold small">Claim Amount (₹) *</label>
//                   <input
//                     type="number" className="form-control"
//                     placeholder="Enter claim amount"
//                     min={1} max={invoiceTotal ?? undefined}
//                     value={claimAmount}
//                     onChange={e => setClaimAmount(e.target.value)}
//                     required
//                   />
//                   {selectedInvoice && (
//                     <div className="form-text">Max claimable: {fmtAmt(invoiceTotal)}</div>
//                   )}
//                 </div>

//                 <button type="submit" className="btn btn-primary w-100"
//                   disabled={submitting || !myPlan}>
//                   {submitting
//                     ? <><span className="spinner-border spinner-border-sm me-2" />Submitting…</>
//                     : "Submit Claim"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default SubmitClaimPage;


import { useEffect, useState } from "react";
import Layout from "../../Layout/Layout";
import patientService from "../../../services/patientService";

const fmtAmt = (v) => v == null ? "—" : "₹" + Number(v).toLocaleString("en-IN");

const getInvoiceField = (inv, ...keys) => {
  for (const k of keys) if (inv[k] != null) return inv[k];
  return null;
};

const SubmitClaimPage = () => {
  const [invoices,        setInvoices]        = useState([]);
  const [planId,          setPlanId]          = useState("");
  const [planName,        setPlanName]        = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [claimAmount,     setClaimAmount]     = useState("");
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [loadingPlan,     setLoadingPlan]     = useState(true);
  const [submitting,      setSubmitting]      = useState(false);
  const [success,         setSuccess]         = useState(false);
  const [error,           setError]           = useState("");

  // useEffect(() => {
  //   // Fetch invoices
  //   patientService.getInvoices()
  //     .then(res => {
  //       const items = Array.isArray(res) ? res : (res?.items ?? []);
  //       console.log("Invoice sample:", items[0]);
  //       setInvoices(items);
  //     })
  //     .catch(console.error)
  //     .finally(() => setLoadingInvoices(false));

  //   // ✅ Fetch plan from profile — simplest source of truth
  //   patientService.getProfile()
  //     .then(profile => {
  //       console.log("Profile:", profile);
  //       // Adjust these field names if yours differ
  //       const id   = profile?.insurancePlanId ?? profile?.planId ?? "";
  //       const name = profile?.planName ?? profile?.plan ?? profile?.insurancePlan ?? "—";
  //       setPlanId(String(id));
  //       setPlanName(name);
  //     })
  //     .catch(console.error)
  //     .finally(() => setLoadingPlan(false));
  // }, []);

  useEffect(() => {
  // Fetch invoices
  patientService.getInvoices()
    .then(res => {
      const items = Array.isArray(res) ? res : (res?.items ?? []);
      setInvoices(items);
    })
    .catch(console.error)
    .finally(() => setLoadingInvoices(false));

  // Get plan name from profile, match ID from getAllPlans (public, no 403)
  Promise.all([
    patientService.getProfile(),
    patientService.getAllPlans(1, 100),
  ])
    .then(([profile, plansRes]) => {
      const enrolledName = profile?.insurancePlanName ?? "";
      const items = Array.isArray(plansRes) ? plansRes : (plansRes?.items ?? []);
      // Match by name to get the ID
      const matched = items.find(p =>
        (p.planName ?? p.name ?? "") === enrolledName
      );
      console.log("Enrolled name:", enrolledName, "| Matched plan:", matched);
      setPlanName(enrolledName);
      setPlanId(String(matched?.insurancePlanId ?? matched?.planId ?? matched?.id ?? ""));
    })
    .catch(console.error)
    .finally(() => setLoadingPlan(false));
}, []);

  const handleInvoiceChange = (e) => {
    const inv = invoices.find(i => String(i.invoiceId) === e.target.value) ?? null;
    setSelectedInvoice(inv);
    if (inv) {
      const total = getInvoiceField(inv, "totalAmount", "total", "amount");
      setClaimAmount(total?.toString() ?? "");
    }
  };

  const invoiceTotal = selectedInvoice
    ? getInvoiceField(selectedInvoice, "totalAmount", "total", "amount")
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) { setError("Please select an invoice."); return; }
    if (!planId)          { setError("No enrolled insurance plan found."); return; }
    if (!claimAmount)     { setError("Please enter a claim amount."); return; }

    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      await patientService.submitClaim({
        invoiceId:       selectedInvoice.invoiceId,
        insurancePlanId: parseInt(planId),
        claimAmount:     parseFloat(claimAmount),
        invoiceAmount:   invoiceTotal,
      });
      setSuccess(true);
      setSelectedInvoice(null);
      setClaimAmount("");
    } catch (err) {
      console.error("Submit claim error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to submit claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout role="patient">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Submit Claim</h4>
        <p className="text-muted small mb-0">Select an invoice and raise a claim for reimbursement.</p>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">

          {success && (
            <div className="alert alert-success mb-3">
              Claim submitted successfully! You will receive a confirmation email shortly.
            </div>
          )}
          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>

                {/* Invoice */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Select Invoice *</label>
                  {loadingInvoices ? (
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <div className="spinner-border spinner-border-sm" /> Loading invoices…
                    </div>
                  ) : invoices.length === 0 ? (
                    <div className="alert alert-warning py-2 small mb-0">
                      No invoices found. Please request an invoice from your provider first.
                    </div>
                  ) : (
                    <select className="form-select"
                      value={selectedInvoice?.invoiceId ?? ""}
                      onChange={handleInvoiceChange} required>
                      <option value="">— Choose an invoice —</option>
                      {invoices.map(inv => {
                        const total = getInvoiceField(inv, "totalAmount", "total", "amount");
                        return (
                          <option key={inv.invoiceId} value={inv.invoiceId}>
                            {inv.invoiceNumber || `#${inv.invoiceId}`} · {fmtAmt(total)}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                {/* Insurance Plan — read-only, from profile */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Insurance Plan</label>
                  {loadingPlan ? (
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <div className="spinner-border spinner-border-sm" /> Loading…
                    </div>
                  ) : planId ? (
                    <div className="form-control bg-light">{planName}</div>
                  ) : (
                    <div className="alert alert-warning py-2 small mb-0">
                      No plan enrolled. <a href="/insurance-plans">Browse plans →</a>
                    </div>
                  )}
                </div>

                {/* Claim Amount */}
                <div className="mb-4">
                  <label className="form-label fw-semibold small">Claim Amount (₹) *</label>
                 <input
  type="number" className="form-control"
  placeholder="Enter claim amount"
  min={1}
  step="0.01"
  value={claimAmount}
  onChange={e => setClaimAmount(e.target.value)}
  required
/>
                  {selectedInvoice && (
                    <div className="form-text">Max claimable: {fmtAmt(invoiceTotal)}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100"
                  disabled={submitting || !planId}>
                  {submitting
                    ? <><span className="spinner-border spinner-border-sm me-2" />Submitting…</>
                    : "Submit Claim"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitClaimPage;