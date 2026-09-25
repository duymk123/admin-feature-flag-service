import { apiClient } from './client';

export const authApi = {
  login: async (username, password) => {
    return apiClient('/api/v1/auth/login', {
      method: 'POST',
      body: { username, password },
    });
  },
};
