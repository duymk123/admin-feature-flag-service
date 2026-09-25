package com.example.adminfeatureflagservice.service.impl;

import com.example.adminfeatureflagservice.dto.tenant.TenantReq;
import com.example.adminfeatureflagservice.dto.tenant.TenantRes;
import com.example.adminfeatureflagservice.entity.Tenant;
import com.example.adminfeatureflagservice.exception.AppException;
import com.example.adminfeatureflagservice.repository.TenantFeatureGrantRepository;
import com.example.adminfeatureflagservice.repository.TenantRepository;
import com.example.adminfeatureflagservice.service.TenantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantServiceImpl implements TenantService {

    private final TenantRepository tenantRepository;
    private final TenantFeatureGrantRepository tenantFeatureGrantRepository;

    @Override
    @Transactional
    public TenantRes createTenant(TenantReq request) {
        String code = request.getTenantCode().trim().toUpperCase();
        if (tenantRepository.existsByTenantCode(code)) {
            throw new AppException("Tenant code '" + code + "' đã tồn tại!", HttpStatus.CONFLICT);
        }

        Tenant tenant = Tenant.builder()
                .tenantCode(code)
                .name(request.getName().trim())
                .ipAddress(request.getIpAddress())
                .serviceUrl(request.getServiceUrl())
                .status(request.getStatus() != null ? request.getStatus().trim().toUpperCase() : "ACTIVE")
                .build();

        Tenant saved = tenantRepository.save(tenant);
        log.info("Created new tenant: {}", saved.getTenantCode());

        return mapToRes(saved);
    }

    @Override
    @Transactional
    public TenantRes updateTenant(String id, TenantReq request) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy Tenant với ID: " + id, HttpStatus.NOT_FOUND));

        String newCode = request.getTenantCode().trim().toUpperCase();
        if (!tenant.getTenantCode().equals(newCode) && tenantRepository.existsByTenantCode(newCode)) {
            throw new AppException("Tenant code '" + newCode + "' đã tồn tại ở bản ghi khác!", HttpStatus.CONFLICT);
        }

        tenant.setTenantCode(newCode);
        tenant.setName(request.getName().trim());
        tenant.setIpAddress(request.getIpAddress());
        tenant.setServiceUrl(request.getServiceUrl());
        if (request.getStatus() != null) {
            tenant.setStatus(request.getStatus().trim().toUpperCase());
        }

        Tenant updated = tenantRepository.save(tenant);
        log.info("Updated tenant: {}", updated.getTenantCode());

        return mapToRes(updated);
    }

    @Override
    @Transactional
    public void deleteTenant(String id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy Tenant với ID: " + id, HttpStatus.NOT_FOUND));
        String tenantCode = tenant.getTenantCode();
        tenantRepository.delete(tenant);
        log.info("Deleted tenant ID: {}, code: {}", id, tenantCode);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantRes> getAllTenants() {
        return tenantRepository.findAll().stream()
                .map(this::mapToRes)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TenantRes getTenantById(String id) {
        return tenantRepository.findById(id)
                .map(this::mapToRes)
                .orElseThrow(() -> new AppException("Không tìm thấy Tenant với ID: " + id, HttpStatus.NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public TenantRes getTenantByCode(String code) {
        return tenantRepository.findByTenantCode(code.trim().toUpperCase())
                .map(this::mapToRes)
                .orElseThrow(() -> new AppException("Không tìm thấy Tenant với mã: " + code, HttpStatus.NOT_FOUND));
    }

    private TenantRes mapToRes(Tenant entity) {
        int grantedCount = tenantFeatureGrantRepository.findGrantedActiveFeaturesByTenantCode(entity.getTenantCode()).size();
        return TenantRes.builder()
                .id(entity.getId())
                .tenantCode(entity.getTenantCode())
                .name(entity.getName())
                .ipAddress(entity.getIpAddress())
                .serviceUrl(entity.getServiceUrl())
                .status(entity.getStatus())
                .grantedFeatureCount(grantedCount)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
