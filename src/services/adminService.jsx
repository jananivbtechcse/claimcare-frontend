
import api from "../api/api";
import normalise from "./Normalise";

const adminService = {

 

  getUsers: async (pageNumber = 1, pageSize = 10) => {
    const res = await api.get("/api/User/users", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return normalise(res.data);
  },

  getPatients: async (pageNumber = 1, pageSize = 10) => {
    const res = await api.get("/api/User/patients", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return normalise(res.data);
  },

  getProviders: async (pageNumber = 1, pageSize = 10) => {
    const res = await api.get("/api/User/providers", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return normalise(res.data);
  },

  getInsuranceCompanies: async (pageNumber = 1, pageSize = 10) => {
    const res = await api.get("/api/User/insurance-companies", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return normalise(res.data);
  },

  createUser: async (data) => {
    const res = await api.post("/api/User/create-user", data);
    return res.data;
  },

  updateUser: async (id, data) => {
    const res = await api.put(`/api/User/update-user/${id}`, data);
    return res.data;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/api/User/delete-user/${id}`);
    return res.data;
  },


  getClaims: async (pageNumber = 1, pageSize = 10) => {
    const res = await api.get("/api/Claim", {
      params: { PageNumber: pageNumber, PageSize: pageSize },
    });
    return normalise(res.data);
  },

  getMyClaims: async () => {
    const res = await api.get("/api/Claim/my-claims");
    return normalise(res.data);
  },

  approveClaim: async (id) => {
    const res = await api.put(`/api/Claim/approve/${id}`);
    return res.data;
  },

  rejectClaim: async (id) => {
    const res = await api.put(`/api/Claim/reject/${id}`);
    return res.data;
  },

  // ── NOTIFICATIONS ─────────────────────

  getAllNotifications: async () => {
    const res = await api.get("/api/Notification");
    return normalise(res.data);
  },

  getUnreadCount: async () => {
    const res = await api.get("/api/Notification/unread-count");
    return res.data;
  },

  markRead: async (id) => {
    const res = await api.put(`/api/Notification/read/${id}`);
    return res.data;
  },
};

export default adminService;