import { apiClient } from './client';

export const featureApi = {
  getAll: async () => {
    const res = await apiClient('/api/v1/admin/master-features');
    const list = res?.data || [];
    return list.filter((f) => f.featureKey !== 'COUPON_DISCOUNT');
  },
};
