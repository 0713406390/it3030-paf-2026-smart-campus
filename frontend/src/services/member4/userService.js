import api from './api';

export async function getAllUsers() {
  const { data } = await api.get('/admin/users');
  return data;
}

export async function updateUserRole(id, role) {
  const { data } = await api.put(`/admin/users/${id}/role`, { role });
  return data;
}

export async function updateUserStatus(id, enabled) {
  const { data } = await api.patch(`/admin/users/${id}/status`, { enabled });
  return data;
}

export async function deleteUser(id) {
  await api.delete(`/admin/users/${id}`);
}
