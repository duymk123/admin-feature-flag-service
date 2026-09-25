package com.example.adminfeatureflagservice.controller;

import com.example.adminfeatureflagservice.service.SyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/sync")
@RequiredArgsConstructor
@Slf4j
public class SyncController {

    private final SyncService syncService;

    /**
     * Bấm Apply snapshot cho một Tenant cụ thể sang instance của họ
     */
    @PostMapping("/apply/{tenantCode}")
    public ResponseEntity<Map<String, Object>> applyForTenant(@PathVariable String tenantCode) {
        return ResponseEntity.ok(syncService.applyForTenant(tenantCode));
    }
}
