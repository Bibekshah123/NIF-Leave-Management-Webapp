import api from './api';

export const adminService = {
  getUsers: async () => {
    const response = await api.get('/users/');
    return response.data;
  },

  createUser: async (data) => {
    const response = await api.post('/admin/users/', data);
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await api.patch(`/admin/users/${id}/`, data);
    return response.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/admin/users/${id}/`);
  },

  getLeaves: async () => {
    const response = await api.get('/admin/leaves/');
    return response.data;
  },

  createLeave: async (data) => {
    const response = await api.post('/admin/leaves/', data);
    return response.data;
  },

  updateLeave: async (id, data) => {
    const response = await api.patch(`/admin/leaves/${id}/`, data);
    return response.data;
  },

  deleteLeave: async (id) => {
    await api.delete(`/admin/leaves/${id}/`);
  },

  getBalances: async () => {
    const response = await api.get('/admin/balances/');
    return response.data;
  },

  createBalance: async (data) => {
    const response = await api.post('/admin/balances/', data);
    return response.data;
  },

  updateBalance: async (id, data) => {
    const response = await api.patch(`/admin/balances/${id}/`, data);
    return response.data;
  },

  deleteBalance: async (id) => {
    await api.delete(`/admin/balances/${id}/`);
  },

  getStats: async () => {
    const response = await api.get('/admin/stats/');
    return response.data;
  }
};