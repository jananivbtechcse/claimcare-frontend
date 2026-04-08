// services/notificationService.js
import api from '../api/api';

// Get current user's notifications
const getMyNotifications = async () => {
  const res = await api.get('/api/Notification/my');
  return res.data;
};

// Get unread count (for the bell badge)
const getUnreadCount = async () => {
  const res = await api.get('/api/Notification/unread-count');
  return res.data;
};

// Mark a single notification as read
const markAsRead = async (id) => {
  const res = await api.put(`/api/Notification/read/${id}`);
  return res.data;
};

// Admin: get all notifications
const getAllNotifications = async () => {
  const res = await api.get('/api/Notification');
  return res.data;
};

export default {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  getAllNotifications,
};