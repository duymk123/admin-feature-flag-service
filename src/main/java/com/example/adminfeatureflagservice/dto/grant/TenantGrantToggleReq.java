package com.example.adminfeatureflagservice.dto.grant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantGrantToggleReq {

    @NotBlank(message = "Feature key is required")
    private String featureKey;

    @NotNull(message = "isGranted is required")
    private Boolean isGranted;

    private String performedBy;
}
