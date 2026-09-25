package com.example.adminfeatureflagservice.service.impl;

import com.example.adminfeatureflagservice.client.FeatureFlagServiceClient;
import com.example.adminfeatureflagservice.entity.Tenant;
import com.example.adminfeatureflagservice.entity.TenantFeatureGrant;
import com.example.adminfeatureflagservice.repository.TenantFeatureGrantRepository;
import com.example.adminfeatureflagservice.repository.TenantRepository;
import com.example.adminfeatureflagservice.service.SyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SyncServiceImpl implements SyncService {

    private final TenantRepository tenantRepository;
    private final TenantFeatureGrantRepository tenantFeatureGrantRepository;
    private final FeatureFlagServiceClient featureFlagServiceClient;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> applyForTenant(String tenantCode) {
        String code = tenantCode.trim().toUpperCase();
        log.info("Triggering apply for tenant '{}' to tracking order via feature-flag-service", code);

        Tenant tenant = tenantRepository.findByTenantCode(code).orElse(null);
        if (tenant != null) {
            // 1. Đồng bộ các cờ được cấp của Tenant này sang Feature-Flag-Service của instance tương ứng
            List<TenantFeatureGrant> grants = tenantFeatureGrantRepository.findByTenantId(tenant.getId());
            for (TenantFeatureGrant grant : grants) {
                featureFlagServiceClient.syncTenantFeatureFlag(
                        tenant.getTenantCode(),
                        grant.getFeature().getFeatureKey(),
                        Boolean.TRUE.equals(grant.getIsGranted())
                );
            }
        }

        // 2. Đẩy snapshot cấu hình sang container Tracking Order của Tenant
        return featureFlagServiceClient.applyToTenant(code);
    }
}
