import { apiClient } from './client';

export const tenantApi = {
  getAll: async () => {
    const res = await apiClient('/api/v1/admin/tenants');
    return res?.data || [];
  },

  getById: async (id) => {
    const res = await apiClient(`/api/v1/admin/tenants/${id}`);
    return res?.data;
  },

  getByCode: async (code) => {
    const res = await apiClient(`/api/v1/admin/tenants/by-code/${code}`);
    return res?.data;
  },

  create: async (data) => {
    const res = await apiClient('/api/v1/admin/tenants', {
      method: 'POST',
      body: data,
    });
    return res?.data;
  },

  update: async (id, data) => {
    const res = await apiClient(`/api/v1/admin/tenants/${id}`, {
      method: 'PUT',
      body: data,
    });
    return res?.data;
  },

  delete: async (id) => {
    return apiClient(`/api/v1/admin/tenants/${id}`, {
      method: 'DELETE',
    });
  },
};
