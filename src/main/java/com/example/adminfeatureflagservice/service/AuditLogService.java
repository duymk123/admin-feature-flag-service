package com.example.adminfeatureflagservice.service;

import com.example.adminfeatureflagservice.dto.audit.AuditLogRes;

import java.util.List;

public interface AuditLogService {
    List<AuditLogRes> getAllLogs();
    List<AuditLogRes> getLogsByTenant(String tenantCode);
}
