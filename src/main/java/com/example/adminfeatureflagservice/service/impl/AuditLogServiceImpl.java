package com.example.adminfeatureflagservice.service.impl;

import com.example.adminfeatureflagservice.dto.audit.AuditLogRes;
import com.example.adminfeatureflagservice.entity.AdminAuditLog;
import com.example.adminfeatureflagservice.repository.AdminAuditLogRepository;
import com.example.adminfeatureflagservice.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AdminAuditLogRepository adminAuditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogRes> getAllLogs() {
        return adminAuditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToRes)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogRes> getLogsByTenant(String tenantCode) {
        return adminAuditLogRepository.findByTenantCodeOrderByCreatedAtDesc(tenantCode.trim().toUpperCase()).stream()
                .map(this::mapToRes)
                .toList();
    }

    private AuditLogRes mapToRes(AdminAuditLog entity) {
        return AuditLogRes.builder()
                .id(entity.getId())
                .tenantCode(entity.getTenantCode())
                .featureKey(entity.getFeatureKey())
                .action(entity.getAction())
                .oldValue(entity.getOldValue())
                .newValue(entity.getNewValue())
                .performedBy(entity.getPerformedBy())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
