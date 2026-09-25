package com.example.adminfeatureflagservice.controller;

import com.example.adminfeatureflagservice.dto.common.ApiResponse;
import com.example.adminfeatureflagservice.dto.tenant.TenantReq;
import com.example.adminfeatureflagservice.dto.tenant.TenantRes;
import com.example.adminfeatureflagservice.service.TenantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    // api lấy tất cả khách hàng
    @GetMapping
    public ResponseEntity<ApiResponse<List<TenantRes>>> getAllTenants() {
        return ResponseEntity.ok(ApiResponse.ok(tenantService.getAllTenants()));
    }



    // tạo 1 tenant mới
    @PostMapping
    public ResponseEntity<ApiResponse<TenantRes>> createTenant(@Valid @RequestBody TenantReq request) {
        TenantRes created = tenantService.createTenant(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok("Tạo Tenant thành công", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TenantRes>> updateTenant(
            @PathVariable String id,
            @Valid @RequestBody TenantReq request
    ) {
        TenantRes updated = tenantService.updateTenant(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật Tenant thành công", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTenant(@PathVariable String id) {
        tenantService.deleteTenant(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa Tenant thành công", null));
    }
}
