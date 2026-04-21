import api from './api';

export async function getNotifications() {
  const { data } = await api.get('/notifications');
  return data;
}

export async function getUnreadCount() {
  const { data } = await api.get('/notifications/unread-count');
  return data?.count ?? 0;
}

export async function markNotificationAsRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
}

export async function deleteNotification(id) {
  await api.delete(`/notifications/${id}`);
}
