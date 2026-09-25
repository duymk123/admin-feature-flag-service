package com.example.adminfeatureflagservice.dto.tenant;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantReq {

    @NotBlank(message = "Tenant code is required")
    private String tenantCode;

    @NotBlank(message = "Name is required")
    private String name;

    private String ipAddress;

    private String serviceUrl;

    @Builder.Default
    private String status = "ACTIVE";
}
