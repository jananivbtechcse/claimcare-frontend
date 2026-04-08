


// import { useEffect, useState, useCallback } from "react";
// import Layout from "../../Layout/Layout";
// import insuranceService from "../../../services/InsuranceCompanyService";
// import Paginator from "../../Common/Paginator";

// const PAGE_SIZE = 9;

// const EMPTY_FORM = {
//   planName:       "",
//   description:    "",
//   coverageAmount: "",
//   premium:        "",
//   durationMonths: "",
// };

// const Field = ({ label, type = "text", placeholder, value, onChange, hint }) => (
//   <div className="mb-3">
//     <label className="form-label fw-semibold small">{label}</label>
//     <input
//       type={type}
//       className="form-control"
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//     />
//     {hint && <div className="form-text text-muted">{hint}</div>}
//   </div>
// );

// const Modal = ({ title, onClose, onConfirm, confirmLabel, confirmDisabled, error, children }) => (
//   <div
//     className="modal d-block"
//     tabIndex="-1"
//     style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
//     onClick={e => e.target === e.currentTarget && onClose()}
//   >
//     <div className="modal-dialog modal-dialog-centered modal-lg">
//       <div className="modal-content border-0 shadow">
//         <div className="modal-header border-0 pb-0">
//           <h5 className="modal-title fw-bold">{title}</h5>
//           <button className="btn-close" onClick={onClose} />
//         </div>
//         <div className="modal-body pt-3">
//           {error && (
//             <div className="alert alert-danger py-2 small mb-3">{error}</div>
//           )}
//           {children}
//         </div>
//         <div className="modal-footer border-0 pt-0">
//           <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
//           <button
//             className="btn btn-primary"
//             onClick={onConfirm}
//             disabled={confirmDisabled}
//           >
//             {confirmDisabled ? "Saving..." : confirmLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const PlanCard = ({ plan, onEdit, onToggle }) => {
//   const isActive = plan.isActive ?? plan.active ?? true;

//   return (
//     <div className={`card h-100 border-0 shadow-sm ${!isActive ? "opacity-75" : ""}`}>
//       <div className="card-body d-flex flex-column p-4">

//         {/* Header */}
//         <div className="d-flex align-items-start justify-content-between mb-3">
//           <div
//             className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10"
//             style={{ width: 44, height: 44 }}
//           >
//             <svg width="20" height="20" fill="none" stroke="#0d6efd" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//             </svg>
//           </div>
//           <span className={`badge ${isActive ? "bg-success" : "bg-secondary"}`}>
//             {isActive ? "Active" : "Inactive"}
//           </span>
//         </div>

//         {/* Info */}
//         <h5 className="fw-bold mb-1">{plan.planName || plan.name || "—"}</h5>
//         <p className="text-primary fw-bold fs-5 mb-0">
//           Rs.{Number(plan.premium ?? 0).toLocaleString()}/mo
//         </p>
//         <p className="text-muted small mb-1">
//           Coverage: Rs.{Number(plan.coverageAmount ?? 0).toLocaleString()}
//         </p>
//         {plan.durationMonths && (
//           <p className="text-muted small mb-1">
//             Duration: {plan.durationMonths} month{plan.durationMonths > 1 ? "s" : ""}
//           </p>
//         )}
//         {plan.description && (
//           <p
//             className="text-muted small mb-3"
//             style={{
//               display: "-webkit-box",
//               WebkitLineClamp: 2,
//               WebkitBoxOrient: "vertical",
//               overflow: "hidden",
//             }}
//           >
//             {plan.description}
//           </p>
//         )}

//         {/* Buttons */}
//         <div className="mt-auto d-flex gap-2">
//           <button
//             className="btn btn-sm btn-outline-primary flex-grow-1"
//             onClick={() => onEdit(plan)}
//           >
//             Edit
//           </button>
//           <button
//             className={`btn btn-sm flex-grow-1 ${isActive ? "btn-outline-danger" : "btn-outline-success"}`}
//             onClick={() => onToggle(plan)}
//           >
//             {isActive ? "Deactivate" : "Activate"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// const ManagePlans = () => {
//   const [plans,      setPlans]      = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [page,       setPage]       = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [toast,      setToast]      = useState(null);

//   const [addOpen, setAddOpen] = useState(false);
//   const [addForm, setAddForm] = useState(EMPTY_FORM);
//   const [addBusy, setAddBusy] = useState(false);
//   const [addErr,  setAddErr]  = useState("");

//   const [editOpen, setEditOpen] = useState(false);
//   const [editForm, setEditForm] = useState({ ...EMPTY_FORM, planId: null });
//   const [editBusy, setEditBusy] = useState(false);
//   const [editErr,  setEditErr]  = useState("");

//   const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const load = useCallback(async (pageNum) => {
//     try {
//       setLoading(true);
//       const res = await insuranceService.getMyPlans(pageNum, PAGE_SIZE);
//       setPlans(res.items ?? []);
//       setTotalCount(res.totalCount ?? 0);
//     } catch (e) {
//       console.error("getMyPlans error:", e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load(1);
//   }, [load]);

//   const handlePageChange = (newPage) => {
//     if (newPage < 1 || newPage > totalPages || newPage === page) return;
//     setPage(newPage);
//     load(newPage);
//   };

//   // Add
//   const openAdd = () => {
//     setAddForm(EMPTY_FORM);
//     setAddErr("");
//     setAddOpen(true);
//   };

//   const handleAdd = async () => {
//     if (!addForm.planName.trim() || !addForm.premium || !addForm.coverageAmount) {
//       setAddErr("Plan name, premium and coverage amount are required.");
//       return;
//     }
//     setAddBusy(true);
//     setAddErr("");
//     try {
//       await insuranceService.createPlan({
//         planName:       addForm.planName.trim(),
//         description:    addForm.description.trim(),
//         coverageAmount: Number(addForm.coverageAmount),
//         premium:        Number(addForm.premium),
//         durationMonths: Number(addForm.durationMonths) || 12,
//       });
//       setAddOpen(false);
//       showToast("Plan created successfully.");
//       load(page);
//     } catch (e) {
//       const data = e.response?.data;
//       const msgs = data?.errors
//         ? Object.values(data.errors).flat().join(" ")
//         : null;
//       setAddErr(msgs || data?.message || "Failed to create plan.");
//     } finally {
//       setAddBusy(false);
//     }
//   };

//   // Edit
//   const openEdit = (plan) => {
//     setEditForm({
//       planId:         plan.planId ?? plan.id,
//       planName:       plan.planName    || "",
//       description:    plan.description || "",
//       coverageAmount: plan.coverageAmount ?? "",
//       premium:        plan.premium        ?? "",
//       durationMonths: plan.durationMonths ?? "",
//     });
//     setEditErr("");
//     setEditOpen(true);
//   };

//   const handleEdit = async () => {
//     if (!editForm.planName.trim() || !editForm.premium || !editForm.coverageAmount) {
//       setEditErr("Plan name, premium and coverage amount are required.");
//       return;
//     }
//     setEditBusy(true);
//     setEditErr("");
//     try {
//       await insuranceService.updatePlan(editForm.planId, {
//         planName:       editForm.planName.trim(),
//         description:    editForm.description.trim(),
//         coverageAmount: Number(editForm.coverageAmount),
//         premium:        Number(editForm.premium),
//         durationMonths: Number(editForm.durationMonths) || 12,
//       });
//       setEditOpen(false);
//       showToast("Plan updated successfully.");
//       load(page);
//     } catch (e) {
//       const data = e.response?.data;
//       const msgs = data?.errors
//         ? Object.values(data.errors).flat().join(" ")
//         : null;
//       setEditErr(msgs || data?.message || "Failed to update plan.");
//     } finally {
//       setEditBusy(false);
//     }
//   };

//   // Toggle
//   const handleToggle = async (plan) => {
//     const planId = plan.planId ?? plan.id;
//     try {
//       await insuranceService.togglePlanStatus(planId);
//       const isActive = plan.isActive ?? plan.active ?? true;
//       showToast(
//         `${plan.planName || "Plan"} ${isActive ? "deactivated" : "activated"}.`,
//         isActive ? "warning" : "success"
//       );
//       load(page);
//     } catch (e) {
//       console.error("togglePlanStatus error:", e);
//       showToast("Failed to update plan status.", "danger");
//     }
//   };

//   const FormFields = ({ form, setForm }) => (
//     <>
//       <Field
//         label="Plan Name"
//         placeholder="e.g. Gold Health Plan"
//         value={form.planName}
//         onChange={e => setForm(p => ({ ...p, planName: e.target.value }))}
//       />
//       <Field
//         label="Description"
//         placeholder="Brief description of this plan"
//         value={form.description}
//         onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
//       />
//       <div className="row">
//         <div className="col-md-6">
//           <Field
//             label="Monthly Premium (Rs.)"
//             type="number"
//             placeholder="e.g. 1500"
//             value={form.premium}
//             onChange={e => setForm(p => ({ ...p, premium: e.target.value }))}
//           />
//         </div>
//         <div className="col-md-6">
//           <Field
//             label="Coverage Amount (Rs.)"
//             type="number"
//             placeholder="e.g. 500000"
//             value={form.coverageAmount}
//             onChange={e => setForm(p => ({ ...p, coverageAmount: e.target.value }))}
//           />
//         </div>
//       </div>
//       <Field
//         label="Duration (Months)"
//         type="number"
//         placeholder="e.g. 12"
//         value={form.durationMonths}
//         onChange={e => setForm(p => ({ ...p, durationMonths: e.target.value }))}
//         hint="Defaults to 12 months if left blank"
//       />
//     </>
//   );

//   return (
//     <Layout role="InsuranceCompany">

//       {/* Toast */}
//       {toast && (
//         <div
//           className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3 shadow`}
//           style={{ zIndex: 9999, minWidth: 260 }}
//         >
//           {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
//         <h4 className="fw-bold mb-0">Manage Insurance Plans</h4>
//         <button className="btn btn-primary" onClick={openAdd}>
//           Add New Plan
//         </button>
//       </div>

//       {/* Content */}
//       {loading ? (
//         <div className="text-center py-5">
//           <div className="spinner-border text-primary" />
//           <p className="text-muted mt-3 small">Loading plans...</p>
//         </div>
//       ) : plans.length === 0 ? (
//         <div className="text-center py-5">
//           <div
//             className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mx-auto mb-3"
//             style={{ width: 64, height: 64 }}
//           >
//             <svg width="28" height="28" fill="none" stroke="#0d6efd" strokeWidth="2" viewBox="0 0 24 24">
//               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//             </svg>
//           </div>
//           <h5 className="text-muted">No plans yet</h5>
//           <p className="text-muted small">
//             Click "Add New Plan" to create your first insurance plan.
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="row g-4">
//             {plans.map(plan => (
//               <div
//                 className="col-12 col-md-6 col-lg-4"
//                 key={plan.planId ?? plan.id}
//               >
//                 <PlanCard
//                   plan={plan}
//                   onEdit={openEdit}
//                   onToggle={handleToggle}
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="card border-0 shadow-sm mt-4">
//             <Paginator
//               page={page}
//               totalPages={totalPages}
//               totalCount={totalCount}
//               pageSize={PAGE_SIZE}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </>
//       )}

//       {/* Add Modal */}
//       {addOpen && (
//         <Modal
//           title="Add New Plan"
//           onClose={() => setAddOpen(false)}
//           onConfirm={handleAdd}
//           confirmLabel="Create Plan"
//           confirmDisabled={addBusy}
//           error={addErr}
//         >
//           <FormFields form={addForm} setForm={setAddForm} />
//         </Modal>
//       )}

//       {/* Edit Modal */}
//       {editOpen && (
//         <Modal
//           title="Edit Plan"
//           onClose={() => setEditOpen(false)}
//           onConfirm={handleEdit}
//           confirmLabel="Save Changes"
//           confirmDisabled={editBusy}
//           error={editErr}
//         >
//           <FormFields form={editForm} setForm={setEditForm} />
//         </Modal>
//       )}

//     </Layout>
//   );
// };

// export default ManagePlans;



import { useEffect, useState, useCallback } from "react";
import Layout from "../../Layout/Layout";
import insuranceService from "../../../services/InsuranceCompanyService";
import Paginator from "../../Common/Paginator";

const PAGE_SIZE = 9;
const EMPTY_FORM = { planName: "", planDescription: "", coverageAmount: "", premiumAmount: "", durationMonths: "" };

const PlanForm = ({ form, setForm }) => (
  <>
    <div className="mb-3">
      <label className="form-label small fw-semibold">Plan Name *</label>
      <input className="form-control" placeholder="e.g. Gold Health Plan"
        value={form.planName}
        onChange={e => setForm(p => ({ ...p, planName: e.target.value }))} />
    </div>
    <div className="mb-3">
      <label className="form-label small fw-semibold">Description</label>
      <input className="form-control" placeholder="Brief description"
        value={form.planDescription}
        onChange={e => setForm(p => ({ ...p, planDescription: e.target.value }))} />
    </div>
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label small fw-semibold">Monthly Premium (Rs.) *</label>
        <input type="number" className="form-control" placeholder="e.g. 1500"
          value={form.premiumAmount}
          onChange={e => setForm(p => ({ ...p, premiumAmount: e.target.value }))} />
      </div>
      <div className="col-md-6 mb-3">
        <label className="form-label small fw-semibold">Coverage Amount (Rs.) *</label>
        <input type="number" className="form-control" placeholder="e.g. 500000"
          value={form.coverageAmount}
          onChange={e => setForm(p => ({ ...p, coverageAmount: e.target.value }))} />
      </div>
    </div>
    <div className="mb-3">
      <label className="form-label small fw-semibold">Duration (Months)</label>
      <input type="number" className="form-control" placeholder="e.g. 12"
        value={form.durationMonths}
        onChange={e => setForm(p => ({ ...p, durationMonths: e.target.value }))} />
      <div className="form-text">Defaults to 12 if left blank</div>
    </div>
  </>
);

const ManagePlans = () => {
  const [allPlans,   setAllPlans]   = useState([]);   // full list from API
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [toast,      setToast]      = useState(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [addErr,  setAddErr]  = useState("");
  const [addBusy, setAddBusy] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM, planId: null });
  const [editErr,  setEditErr]  = useState("");
  const [editBusy, setEditBusy] = useState(false);

  // ── Paginate locally since backend returns plain array ──
  const totalCount = allPlans.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const plans = allPlans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      // Pass large pageSize to get all plans at once, paginate on frontend
      const res = await insuranceService.getMyPlans(1, 100);
      // Handle both array response and { items } response
      const list = Array.isArray(res) ? res : (res.items ?? []);
      setAllPlans(list);
    } catch { setAllPlans([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handlePageChange = (p) => { setPage(p); };

  // ── Add ──
  const handleAdd = async () => {
    if (!addForm.planName.trim() || !addForm.premiumAmount || !addForm.coverageAmount)
      return setAddErr("Plan name, premium and coverage amount are required.");
    setAddBusy(true); setAddErr("");
    try {
      await insuranceService.createPlan({
        planName:        addForm.planName.trim(),
        planDescription: addForm.planDescription.trim(),
        coverageAmount:  Number(addForm.coverageAmount),
        premiumAmount:   Number(addForm.premiumAmount),
        durationMonths:  Number(addForm.durationMonths) || 12,
      });
      setAddOpen(false);
      showToast("Plan created successfully.");
      load();
    } catch (e) {
      const d = e?.response?.data;
      setAddErr(d?.errors ? Object.values(d.errors).flat().join(" ") : d?.message || "Failed to create plan.");
    } finally { setAddBusy(false); }
  };

  // ── Edit ──
  const openEdit = (plan) => {
    setEditForm({
      planId:          plan.planId ?? plan.id ?? plan.insurancePlanId,
      planName:        plan.planName        || plan.name        || "",
      planDescription: plan.planDescription || plan.description || "",
      coverageAmount:  plan.coverageAmount  ?? "",
      premiumAmount:   plan.premiumAmount   ?? plan.premium     ?? "",
      durationMonths:  plan.durationMonths  ?? "",
    });
    setEditErr(""); setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editForm.planName.trim() || !editForm.premiumAmount || !editForm.coverageAmount)
      return setEditErr("Plan name, premium and coverage amount are required.");
    if (!editForm.planId) return setEditErr("Plan ID missing. Close and try again.");
    setEditBusy(true); setEditErr("");
    try {
      await insuranceService.updatePlan(editForm.planId, {
        planName:        editForm.planName.trim(),
        planDescription: editForm.planDescription.trim(),
        coverageAmount:  Number(editForm.coverageAmount),
        premiumAmount:   Number(editForm.premiumAmount),
        isActive:        true,
      });
      setEditOpen(false);
      showToast("Plan updated successfully.");
      load();
    } catch (e) {
      const d = e?.response?.data;
      setEditErr(d?.errors ? Object.values(d.errors).flat().join(" ") : d?.message || "Failed to update plan.");
    } finally { setEditBusy(false); }
  };

  // ── Deactivate: optimistic UI update (fade card instantly), then call API ──
  const handleToggle = async (plan) => {
    const planId   = plan.planId ?? plan.id ?? plan.insurancePlanId;
    const isActive = plan.isActive ?? plan.active ?? true;

    // Optimistic update — flip isActive immediately so card fades right away
    setAllPlans(prev =>
      prev.map(p =>
        (p.planId ?? p.id ?? p.insurancePlanId) === planId
          ? { ...p, isActive: !isActive }
          : p
      )
    );

    try {
      if (isActive) {
        // DELETE endpoint sets isActive = false
        await insuranceService.deactivatePlan(planId);
      } else {
        // Reactivate via PUT
        await insuranceService.updatePlan(planId, {
          planName:        plan.planName,
          planDescription: plan.planDescription || plan.description || "",
          coverageAmount:  plan.coverageAmount,
          premiumAmount:   plan.premiumAmount ?? plan.premium,
          isActive:        true,
        });
      }
      showToast(`${plan.planName} ${isActive ? "deactivated" : "activated"}.`, isActive ? "warning" : "success");
    } catch {
      // Revert optimistic update on failure
      setAllPlans(prev =>
        prev.map(p =>
          (p.planId ?? p.id ?? p.insurancePlanId) === planId
            ? { ...p, isActive: isActive }
            : p
        )
      );
      showToast("Failed to update plan status.", "danger");
    }
  };

  return (
    <Layout role="InsuranceCompany">

      {toast && (
        <div className={`alert alert-${toast.type} position-fixed top-0 end-0 m-3 shadow`} style={{ zIndex: 9999 }}>
          {toast.msg}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Manage Insurance Plans</h4>
        <button className="btn btn-primary"
          onClick={() => { setAddForm(EMPTY_FORM); setAddErr(""); setAddOpen(true); }}>
          + Add New Plan
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : allPlans.length === 0 ? (
        <div className="text-center py-5 text-muted">No plans yet. Click "+ Add New Plan" to get started.</div>
      ) : (
        <>
          <div className="row g-4">
            {plans.map(plan => {
              const planId   = plan.planId ?? plan.id ?? plan.insurancePlanId;
              const isActive = plan.isActive ?? plan.active ?? true;
              const premium  = Number(plan.premiumAmount ?? plan.premium ?? 0) > 0
                ? Number(plan.premiumAmount ?? plan.premium)
                : Math.round(Number(plan.coverageAmount) / 100);
              const coverage = Number(plan.coverageAmount ?? 0);

              return (
                <div className="col-12 col-md-6 col-lg-4" key={planId}>
                  <div className={`card h-100 border-0 shadow-sm`}
                    style={{ opacity: isActive ? 1 : 0.5, transition: "opacity 0.4s ease" }}>
                    <div className="card-body p-4">

                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="bg-primary rounded-3 d-flex align-items-center justify-content-center"
                          style={{ width: 44, height: 44 }}>
                          <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          </svg>
                        </div>
                        <span className={`badge ${isActive ? "bg-success" : "bg-secondary"}`}>
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <h6 className="fw-bold mb-0">{plan.planName || plan.name || "—"}</h6>
                      {plan.durationMonths && (
                        <small className="text-muted">{plan.durationMonths} month plan</small>
                      )}

                      <div className="mt-2 mb-2">
                        <span className="fs-4 fw-bold">₹{premium.toLocaleString()}</span>
                        <span className="text-muted small"> /month</span>
                      </div>

                      <div className="d-flex gap-2 flex-wrap mb-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary">General</span>
                        <span className="badge bg-success bg-opacity-10 text-success">
                          Coverage: ₹{coverage.toLocaleString()}
                        </span>
                      </div>

                      {(plan.planDescription || plan.description) && (
                        <p className="text-muted small mb-3"
                          style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {plan.planDescription || plan.description}
                        </p>
                      )}

                      <hr className="my-2" />
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary flex-grow-1"
                          onClick={() => openEdit(plan)}>Edit</button>
                        <button
                          className={`btn btn-sm flex-grow-1 ${isActive ? "btn-outline-danger" : "btn-outline-success"}`}
                          onClick={() => handleToggle(plan)}>
                          {isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Paginator page={page} totalPages={totalPages} totalCount={totalCount}
              pageSize={PAGE_SIZE} onPageChange={handlePageChange} />
          </div>
        </>
      )}

      {/* Add Modal */}
      {addOpen && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={e => e.target === e.currentTarget && setAddOpen(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add New Plan</h5>
                <button className="btn-close" onClick={() => setAddOpen(false)} />
              </div>
              <div className="modal-body">
                {addErr && <div className="alert alert-danger py-2 small">{addErr}</div>}
                <PlanForm form={addForm} setForm={setAddForm} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAdd} disabled={addBusy}>
                  {addBusy ? "Saving..." : "Create Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOpen && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Plan</h5>
                <button className="btn-close" onClick={() => setEditOpen(false)} />
              </div>
              <div className="modal-body">
                {editErr && <div className="alert alert-danger py-2 small">{editErr}</div>}
                <PlanForm form={editForm} setForm={setEditForm} />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditOpen(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleEdit} disabled={editBusy}>
                  {editBusy ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default ManagePlans;