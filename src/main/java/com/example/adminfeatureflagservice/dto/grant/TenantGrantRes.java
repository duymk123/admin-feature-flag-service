package com.example.adminfeatureflagservice.dto.grant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantGrantRes {

    private String grantId;
    private String featureId;
    private String featureKey;
    private String featureName;
    private String featureDescription;
    private Boolean masterActive;
    private Boolean isGranted;
    private LocalDateTime grantedAt;
    private String grantedBy;
}
