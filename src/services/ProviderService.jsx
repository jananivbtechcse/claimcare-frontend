

import api from "../api/api";
import normalise from "./Normalise";

// ── Profile ───────────────────────────────────────────────────────────────────
const getProfile = async () => {
  const res = await api.get("/api/HealthcareProvider/profile");
  return res.data;
};

const updateProfile = async (data) => {
  const res = await api.put("/api/HealthcareProvider/update-profile", data);
  return res.data;
};

const completeProfile = async (data) => {
  const res = await api.put("/api/HealthcareProvider/complete-profile", data);
  return res.data;
};

// ── Claims ────────────────────────────────────────────────────────────────────
const getClaims = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get("/api/HealthcareProvider/claims", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

// ── Invoices ──────────────────────────────────────────────────────────────────
const createInvoice = async (data) => {
  const res = await api.post("/api/HealthcareProvider/create-invoice", data);
  return res.data;
};

const getMyInvoices = async () => {
  const res = await api.get("/api/Invoice/provider");
  return normalise(res.data);
};

// ── Claim Documents ───────────────────────────────────────────────────────────
const uploadDocument = async (claimId, formData) => {
  const res = await api.post("/api/ClaimDocument/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { claimId },
  });
  return res.data;
};

const getDocumentsByClaim = async (claimId) => {
  const res = await api.get(`/api/ClaimDocument/claim/${claimId}`);
  return normalise(res.data);
};

// ── Payments ──────────────────────────────────────────────────────────────────
const createPayment = async (data) => {
  const res = await api.post("/api/Payment", data);
  return res.data;
};

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

// ── export ────────────────────────────────────────────────────────────────────
export default {
  // profile
  getProfile,
  updateProfile,
  completeProfile,
  // claims
  getClaims,
  // invoices
  createInvoice,
  getMyInvoices,
  // documents
  uploadDocument,
  getDocumentsByClaim,
  // payments
  createPayment,
  getPaymentsByClaim,
  // notifications
  getMyNotifications,
  markNotificationRead,
  getUnreadCount,
};