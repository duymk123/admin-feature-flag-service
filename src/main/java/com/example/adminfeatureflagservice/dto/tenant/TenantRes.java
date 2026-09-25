package com.example.adminfeatureflagservice.dto.tenant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantRes {

    private String id;
    private String tenantCode;
    private String name;
    private String ipAddress;
    private String serviceUrl;
    private String status;
    private int grantedFeatureCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
