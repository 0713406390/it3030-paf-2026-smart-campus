import api from './api';

export const getMyNotifications = async () => {
  const res = await api.get('/api/notifications');
  return res.data;
};

export const getNotifications = getMyNotifications;

export const getUnreadCount = async () => {
  const res = await api.get('/api/notifications/unread-count');
  return res.data;
};

export const markAsRead = async (id) => {
  const res = await api.patch(`/api/notifications/${id}/read`);
  return res.data;
};

export const markNotificationAsRead = markAsRead;

export const deleteNotification = async (id) => {
  const res = await api.delete(`/api/notifications/${id}`);
  return res.data;
};