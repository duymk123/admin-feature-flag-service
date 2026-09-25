import { apiClient } from './client';

export const auditApi = {
  getAllLogs: async (limit = 100) => {
    const res = await apiClient(`/api/v1/admin/audit-logs?limit=${limit}`);
    return res?.data || [];
  },

  getTenantLogs: async (tenantCode) => {
    const res = await apiClient(`/api/v1/admin/audit-logs/tenants/${tenantCode}`);
    return res?.data || [];
  },
};
