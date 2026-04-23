import api from './api';

export const getAllUsers = async () => {
  const res = await api.get('/api/admin/users');
  return res.data;
};

export const createUser = async (payload) => {
  const res = await api.post('/api/admin/users', payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await api.put(`/api/admin/users/${id}`, payload);
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

export const getMyProfile = async () => {
  const res = await api.get('/api/users/profile');
  return res.data;
};

export const updateMyProfile = async (payload) => {
  const res = await api.put('/api/users/profile', payload);
  return res.data;
};
