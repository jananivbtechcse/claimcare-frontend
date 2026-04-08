

import api from "../api/api";
import normalise from "./Normalise";

// ── Profile ───────────────────────────────────────────────────────────────────
const getProfile = async () => {
  const res = await api.get("/api/Patient/profile");
  return res.data;
};

const updateProfile = async (data) => {
  const res = await api.put("/api/Patient/profile", data);
  return res.data;
};

const completeProfile = async (data) => {
  const res = await api.put("/api/Patient/complete-profile", data);
  return res.data;
};

// ── Insurance Plans ───────────────────────────────────────────────────────────

/** Plans the patient has already enrolled in */
const getMyPlans = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get("/api/Patient/insurance-plans", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

/**
 * Browse ALL available plans (public catalogue).
 * API: GET /api/InsurancePlan?PageNumber=1&PageSize=10
 */
const getAllPlans = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get("/api/InsurancePlan", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

const selectPlan = async (planId) => {
  const res = await api.post(`/api/Patient/select-plan/${planId}`);
  return res.data;
};

// ── Claims ────────────────────────────────────────────────────────────────────

/**
 * GET /api/Claim/my-claims?PageNumber=1&PageSize=10
 * Returns plain array → normalise wraps it.
 * Real fields: claimId, claimNumber, claimAmount, invoiceNumber,
 *              totalAmount, submissionDate, status
 */
const getMyClaims = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get("/api/Claim/my-claims", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

/** POST /api/Patient/submit-claim */
const submitClaim = async (data) => {
  const res = await api.post("/api/Patient/submit-claim", data);
  return res.data;
};

// ── Invoices ──────────────────────────────────────────────────────────────────

/**
 * GET /api/Invoice/patient
 * (no pagination params — returns all patient invoices)
 */
const getInvoices = async () => {
  const res = await api.get("/api/Invoice/patient");
  return normalise(res.data);
};

/** Download invoice as PDF blob */
const downloadInvoicePdf = async (invoiceId) => {
  const res = await api.get(`/api/Invoice/${invoiceId}/pdf`, {
    responseType: "blob",
  });
  return res.data;
};

const saveBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// ── Payments ──────────────────────────────────────────────────────────────────

/** GET /api/Payment/claim/:claimId */
const getPaymentsByClaim = async (claimId) => {
  const res = await api.get(`/api/Payment/claim/${claimId}`);
  return normalise(res.data);
};

// ── Notifications ─────────────────────────────────────────────────────────────

const getMyNotifications = async () => {
  const res = await api.get("/api/Notification/my");
  return normalise(res.data);
};

const markNotificationRead = async (id) => {
  const res = await api.put(`/api/Notification/read/${id}`);
  return res.data;
};

const getUnreadCount = async () => {
  const res = await api.get("/api/Notification/unread-count");
  return typeof res.data === "number" ? res.data : res.data?.count ?? 0;
};

// ── Invoice Requests ──────────────────────────────────────────────────────────

/** POST /api/Patient/request-invoice */
/** POST /api/Patient/request-invoice */
// ── Invoice Requests ──────────────────────────────────────────────────────────

/** POST /api/Patient/request-invoice */
const requestInvoice = async ({ providerId, visitDate }) => {
  const res = await api.post("/api/Patient/request-invoice", {  // ✅ has /api
    providerId,
    visitDate,
  });
  return res.data;
};

/** GET /api/Patient/my-invoice-requests */
const getMyInvoiceRequests = async () => {
  const res = await api.get("/api/Patient/my-invoice-requests");  // ✅ add /api here
  return normalise(res.data);
};
// ── export ────────────────────────────────────────────────────────────────────
export default {
  // profile
  getProfile,
  updateProfile,
  completeProfile,
  // plans
  getMyPlans,
  getAllPlans,
  selectPlan,
  // claims
  getMyClaims,
  submitClaim,
  // invoices
  getInvoices,
  downloadInvoicePdf,
  saveBlob,
  // payments
  getPaymentsByClaim,
  // notifications
  getMyNotifications,
  markNotificationRead,
  getUnreadCount,
  // invoice requests
  requestInvoice,
  getMyInvoiceRequests,
};