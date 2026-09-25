package com.example.adminfeatureflagservice.controller;

import com.example.adminfeatureflagservice.dto.audit.AuditLogRes;
import com.example.adminfeatureflagservice.dto.common.ApiResponse;
import com.example.adminfeatureflagservice.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogRes>>> getAllLogs() {
        return ResponseEntity.ok(ApiResponse.ok(auditLogService.getAllLogs()));
    }

    @GetMapping("/by-tenant/{tenantCode}")
    public ResponseEntity<ApiResponse<List<AuditLogRes>>> getLogsByTenant(@PathVariable String tenantCode) {
        return ResponseEntity.ok(ApiResponse.ok(auditLogService.getLogsByTenant(tenantCode)));
    }
}
