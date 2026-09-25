package com.example.adminfeatureflagservice.service;

import com.example.adminfeatureflagservice.dto.grant.*;

import java.util.List;

public interface TenantGrantService {
    List<TenantGrantRes> getTenantGrants(String tenantCode);
    TenantGrantRes toggleGrant(String tenantCode, TenantGrantToggleReq request);
    List<TenantGrantRes> batchUpdateGrants(String tenantCode, TenantGrantBatchReq request);
    AllowedFeatureRes getAllowedFeaturesForTenant(String tenantCode);
}
