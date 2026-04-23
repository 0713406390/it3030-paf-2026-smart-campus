import api from './api';

export const getAllUsers = async () => {
  const res = await api.get('/api/admin/users');
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await api.put(`/api/admin/users/${id}/role`, { role });
  return res.data;
};

export const updateUserStatus = async (id, enabled) => {
  const res = await api.patch(`/api/admin/users/${id}/status`, { enabled });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/api/admin/users/${id}`);
  return res.data;
};