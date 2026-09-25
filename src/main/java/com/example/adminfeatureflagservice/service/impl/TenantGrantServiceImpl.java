package com.example.adminfeatureflagservice.service.impl;

import com.example.adminfeatureflagservice.client.FeatureFlagServiceClient;
import com.example.adminfeatureflagservice.dto.grant.*;
import com.example.adminfeatureflagservice.entity.AdminAuditLog;
import com.example.adminfeatureflagservice.entity.MasterFeature;
import com.example.adminfeatureflagservice.entity.Tenant;
import com.example.adminfeatureflagservice.entity.TenantFeatureGrant;
import com.example.adminfeatureflagservice.exception.AppException;
import com.example.adminfeatureflagservice.repository.AdminAuditLogRepository;
import com.example.adminfeatureflagservice.repository.MasterFeatureRepository;
import com.example.adminfeatureflagservice.repository.TenantFeatureGrantRepository;
import com.example.adminfeatureflagservice.repository.TenantRepository;
import com.example.adminfeatureflagservice.service.TenantGrantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantGrantServiceImpl implements TenantGrantService {

    private final TenantRepository tenantRepository;
    private final MasterFeatureRepository masterFeatureRepository;
    private final TenantFeatureGrantRepository tenantFeatureGrantRepository;
    private final AdminAuditLogRepository adminAuditLogRepository;
    private final FeatureFlagServiceClient featureFlagServiceClient;

    @Override
    @Transactional(readOnly = true)
    public List<TenantGrantRes> getTenantGrants(String tenantCode) {
        Tenant tenant = findTenant(tenantCode);
        List<MasterFeature> allMasterFeatures = masterFeatureRepository.findAll();
        List<TenantFeatureGrant> existingGrants = tenantFeatureGrantRepository.findByTenantId(tenant.getId());

        Map<String, TenantFeatureGrant> grantMap = new HashMap<>();
        for (TenantFeatureGrant grant : existingGrants) {
            grantMap.put(grant.getFeature().getId(), grant);
        }

        List<TenantGrantRes> result = new ArrayList<>();
        for (MasterFeature feature : allMasterFeatures) {
            TenantFeatureGrant grant = grantMap.get(feature.getId());
            boolean isGranted = grant != null && Boolean.TRUE.equals(grant.getIsGranted());

            result.add(TenantGrantRes.builder()
                    .grantId(grant != null ? grant.getId() : null)
                    .featureId(feature.getId())
                    .featureKey(feature.getFeatureKey())
                    .featureName(feature.getName())
                    .featureDescription(feature.getDescription())
                    .masterActive(feature.getIsActive())
                    .isGranted(isGranted)
                    .grantedAt(grant != null ? grant.getGrantedAt() : null)
                    .grantedBy(grant != null ? grant.getGrantedBy() : null)
                    .build());
        }

        return result;
    }

    @Override
    @Transactional
    public TenantGrantRes toggleGrant(String tenantCode, TenantGrantToggleReq request) {
        Tenant tenant = findTenant(tenantCode);
        String featureKey = request.getFeatureKey().trim().toUpperCase();
        MasterFeature feature = masterFeatureRepository.findByFeatureKey(featureKey)
                .orElseThrow(() -> new AppException("Không tìm thấy Master Feature: " + featureKey, HttpStatus.NOT_FOUND));

        Optional<TenantFeatureGrant> optGrant = tenantFeatureGrantRepository.findByTenantIdAndFeatureId(tenant.getId(), feature.getId());
        TenantFeatureGrant grant;
        boolean oldValue = false;

        if (optGrant.isPresent()) {
            grant = optGrant.get();
            oldValue = Boolean.TRUE.equals(grant.getIsGranted());
            grant.setIsGranted(request.getIsGranted());
            grant.setGrantedAt(LocalDateTime.now());
            if (request.getPerformedBy() != null && !request.getPerformedBy().isBlank()) {
                grant.setGrantedBy(request.getPerformedBy().trim());
            }
        } else {
            grant = TenantFeatureGrant.builder()
                    .tenant(tenant)
                    .feature(feature)
                    .isGranted(request.getIsGranted())
                    .grantedAt(LocalDateTime.now())
                    .grantedBy(request.getPerformedBy() != null ? request.getPerformedBy().trim() : "admin")
                    .build();
        }

        TenantFeatureGrant saved = tenantFeatureGrantRepository.save(grant);

        // Ghi Audit Log
        String performedBy = (request.getPerformedBy() != null && !request.getPerformedBy().isBlank()) ? request.getPerformedBy().trim() : "admin";
        AdminAuditLog auditLog = AdminAuditLog.builder()
                .tenantCode(tenant.getTenantCode())
                .featureKey(feature.getFeatureKey())
                .action(Boolean.TRUE.equals(saved.getIsGranted()) ? "GRANT" : "REVOKE")
                .oldValue(String.valueOf(oldValue))
                .newValue(String.valueOf(saved.getIsGranted()))
                .performedBy(performedBy)
                .createdAt(LocalDateTime.now())
                .build();
        adminAuditLogRepository.save(auditLog);

        // Sync flag grant sang Feature-Flag-Service của tenant
        featureFlagServiceClient.syncTenantFeatureFlag(tenant.getTenantCode(), featureKey, Boolean.TRUE.equals(saved.getIsGranted()));

        // Tự động đẩy snapshot cấu hình sang Tracking-Order của Tenant này ngay lập tức
        featureFlagServiceClient.applyToTenant(tenant.getTenantCode());

        log.info("Super Admin {} {} feature {} for tenant {}", performedBy, auditLog.getAction(), featureKey, tenantCode);

        return TenantGrantRes.builder()
                .grantId(saved.getId())
                .featureId(feature.getId())
                .featureKey(feature.getFeatureKey())
                .featureName(feature.getName())
                .featureDescription(feature.getDescription())
                .masterActive(feature.getIsActive())
                .isGranted(saved.getIsGranted())
                .grantedAt(saved.getGrantedAt())
                .grantedBy(saved.getGrantedBy())
                .build();
    }

    @Override
    @Transactional
    public List<TenantGrantRes> batchUpdateGrants(String tenantCode, TenantGrantBatchReq request) {
        Tenant tenant = findTenant(tenantCode);
        List<MasterFeature> allMasterFeatures = masterFeatureRepository.findAll();
        Set<String> targetKeys = new HashSet<>(
                request.getGrantedFeatureKeys() != null
                        ? request.getGrantedFeatureKeys().stream().map(String::toUpperCase).toList()
                        : List.of()
        );

        String performedBy = (request.getPerformedBy() != null && !request.getPerformedBy().isBlank())
                ? request.getPerformedBy().trim() : "admin";

        for (MasterFeature feature : allMasterFeatures) {
            boolean shouldGrant = targetKeys.contains(feature.getFeatureKey());
            Optional<TenantFeatureGrant> optGrant = tenantFeatureGrantRepository.findByTenantIdAndFeatureId(tenant.getId(), feature.getId());

            boolean currentGranted = optGrant.map(TenantFeatureGrant::getIsGranted).orElse(false);
            if (currentGranted != shouldGrant) {
                TenantFeatureGrant grant = optGrant.orElseGet(() -> TenantFeatureGrant.builder()
                        .tenant(tenant)
                        .feature(feature)
                        .build());
                grant.setIsGranted(shouldGrant);
                grant.setGrantedAt(LocalDateTime.now());
                grant.setGrantedBy(performedBy);
                tenantFeatureGrantRepository.save(grant);

                // Audit
                adminAuditLogRepository.save(AdminAuditLog.builder()
                        .tenantCode(tenant.getTenantCode())
                        .featureKey(feature.getFeatureKey())
                        .action(shouldGrant ? "GRANT" : "REVOKE")
                        .oldValue(String.valueOf(currentGranted))
                        .newValue(String.valueOf(shouldGrant))
                        .performedBy(performedBy)
                        .createdAt(LocalDateTime.now())
                        .build());

                // Sync flag grant sang feature-flag-service
                featureFlagServiceClient.syncTenantFeatureFlag(tenant.getTenantCode(), feature.getFeatureKey(), shouldGrant);
            }
        }

        // Tự động đẩy snapshot cấu hình sang Tracking-Order của Tenant này ngay lập tức
        featureFlagServiceClient.applyToTenant(tenant.getTenantCode());

        return getTenantGrants(tenantCode);
    }

    @Override
    @Transactional(readOnly = true)
    public AllowedFeatureRes getAllowedFeaturesForTenant(String tenantCode) {
        Tenant tenant = findTenant(tenantCode);
        List<TenantFeatureGrant> grantedList = tenantFeatureGrantRepository.findGrantedActiveFeaturesByTenantCode(tenant.getTenantCode());

        List<String> allowedKeys = grantedList.stream()
                .map(g -> g.getFeature().getFeatureKey())
                .toList();

        return AllowedFeatureRes.builder()
                .tenantCode(tenant.getTenantCode())
                .tenantName(tenant.getName())
                .serviceUrl(tenant.getServiceUrl())
                .allowedFeatureKeys(allowedKeys)
                .build();
    }

    private Tenant findTenant(String tenantCode) {
        return tenantRepository.findByTenantCode(tenantCode.trim().toUpperCase())
                .orElseThrow(() -> new AppException("Không tìm thấy Tenant với mã: " + tenantCode, HttpStatus.NOT_FOUND));
    }
}
