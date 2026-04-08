

import api from "../api/api";
import normalise from "./Normalise";

// Profile
const completeProfile = async (data) => {
  const res = await api.put("/api/InsuranceCompany/complete-profile", data);
  return res.data;
};

const updateProfile = async (data) => {
  const res = await api.put("/api/InsuranceCompany/update-profile", data);
  return res.data;
};

// Claims
const getClaims = async (pageNumber = 1, pageSize = 10) => {
  const res = await api.get("/api/InsuranceCompany/claims", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

const approveClaim = async (id) => {
  const res = await api.put(`/api/InsuranceCompany/approve-claim/${id}`);
  return res.data;
};

const rejectClaim = async (id) => {
  const res = await api.put(`/api/InsuranceCompany/reject-claim/${id}`);
  return res.data;
};

const updateClaim = async (id, data) => {
  const res = await api.put(`/api/InsuranceCompany/update-claim/${id}`, data);
  return res.data;
};

// Plans
const getMyPlans = async (pageNumber = 1, pageSize = 9) => {
  const res = await api.get("/api/InsurancePlan", {
    params: { PageNumber: pageNumber, PageSize: pageSize },
  });
  return normalise(res.data);
};

const createPlan = async (data) => {
  const res = await api.post("/api/InsurancePlan", data);
  return res.data;
};

const updatePlan = async (id, data) => {
  const res = await api.put(`/api/InsurancePlan/${id}`, data);
  return res.data;
};

const deactivatePlan = async (id) => {
  const res = await api.delete(`/api/InsurancePlan/${id}`);
  return res.data;
};

const togglePlanStatus = async (id) => {
  const res = await api.put(`/api/InsurancePlan/${id}/toggle`);
  return res.data;
};

// Notifications
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
// ✅ ADD THIS
const getProfile = async () => {
  const res = await api.get("/api/InsuranceCompany/profile");
  return res.data;
};

export default {
  completeProfile,
  updateProfile,
  getClaims,
  approveClaim,
  rejectClaim,
  updateClaim,
  getMyPlans,
  createPlan,
  updatePlan,
  deactivatePlan,
  togglePlanStatus,
  getMyNotifications,
  markNotificationRead,
  getUnreadCount,
  getProfile
};