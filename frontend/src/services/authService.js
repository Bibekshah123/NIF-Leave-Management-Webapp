import api from './api';

export const authService = {
  login: async (username, password) => {
    return await api.post('/auth/login/', { username, password });
  },

  register: async (userData) => {
    return await api.post('/auth/register/', userData);
  },

  me: async () => {
    return await api.get('/auth/user/');
  }
};
