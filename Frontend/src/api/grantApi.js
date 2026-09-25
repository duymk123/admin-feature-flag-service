import { apiClient } from './client';

export const grantApi = {
  getTenantGrants: async (tenantCode) => {
    const res = await apiClient(`/api/v1/admin/tenants/${tenantCode}/grants`);
    const list = res?.data || [];
    return list.filter((g) => g.featureKey !== 'COUPON_DISCOUNT');
  },

  toggleGrant: async (tenantCode, featureKey, isGranted, performedBy = 'admin') => {
    const res = await apiClient(`/api/v1/admin/tenants/${tenantCode}/grants/toggle`, {
      method: 'POST',
      body: {
        featureKey,
        isGranted,
        performedBy,
      },
    });
    return res?.data;
  },

  batchUpdateGrants: async (tenantCode, grantedFeatureKeys, performedBy = 'admin') => {
    const res = await apiClient(`/api/v1/admin/tenants/${tenantCode}/grants/batch`, {
      method: 'POST',
      body: {
        grantedFeatureKeys,
        performedBy,
      },
    });
    return res?.data || [];
  },

  applyForTenant: async (tenantCode) => {
    const res = await apiClient(`/api/v1/admin/sync/apply/${tenantCode}`, {
      method: 'POST',
    });
    return res;
  },
};
