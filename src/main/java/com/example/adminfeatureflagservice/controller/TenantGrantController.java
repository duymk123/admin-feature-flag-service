package com.example.adminfeatureflagservice.controller;

import com.example.adminfeatureflagservice.dto.common.ApiResponse;
import com.example.adminfeatureflagservice.dto.grant.TenantGrantBatchReq;
import com.example.adminfeatureflagservice.dto.grant.TenantGrantRes;
import com.example.adminfeatureflagservice.dto.grant.TenantGrantToggleReq;
import com.example.adminfeatureflagservice.service.TenantGrantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/tenants/{tenantCode}/grants")
@RequiredArgsConstructor
public class TenantGrantController {

    private final TenantGrantService tenantGrantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TenantGrantRes>>> getTenantGrants(@PathVariable String tenantCode) {
        return ResponseEntity.ok(ApiResponse.ok(tenantGrantService.getTenantGrants(tenantCode)));
    }

//    Super Admin gạt công tắc cấp/thu hồi cờ cho một Tenant cụ thể.
    @RequestMapping(value = "/toggle", method = {RequestMethod.POST, RequestMethod.PATCH})
    public ResponseEntity<ApiResponse<TenantGrantRes>> toggleGrant(
            @PathVariable String tenantCode,
            @Valid @RequestBody TenantGrantToggleReq request
    ) {
        TenantGrantRes result = tenantGrantService.toggleGrant(tenantCode, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật phân quyền cờ thành công", result));
    }

    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<List<TenantGrantRes>>> batchUpdateGrants(
            @PathVariable String tenantCode,
            @Valid @RequestBody TenantGrantBatchReq request
    ) {
        List<TenantGrantRes> result = tenantGrantService.batchUpdateGrants(tenantCode, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật danh sách phân quyền thành công", result));
    }
}
