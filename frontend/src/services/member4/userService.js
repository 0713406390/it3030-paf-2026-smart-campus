import api from './api';

export async function getAllUsers() {
  const { data } = await api.get('/admin/users');
  return data;
}

export const createUser = async (payload) => {
  const res = await api.post('/admin/users', payload);
  return res.data;
};

export const updateUser = async (id, payload) => {
  const res = await api.put(`/admin/users/${id}`, payload);
  return res.data;
};

export async function updateUserRole(id, role) {
  const { data } = await api.put(`/admin/users/${id}/role`, { role });
  return data;
}

export async function updateUserStatus(id, enabled) {
  const { data } = await api.patch(`/admin/users/${id}/status`, { enabled });
  return data;
}

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const getMyProfile = async () => {
  const res = await api.get('/users/profile');
  return res.data;
};

export const updateMyProfile = async (payload) => {
  const res = await api.put('/users/profile', payload);
  return res.data;
};
