package com.example.adminfeatureflagservice.dto.audit;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogRes {

    private String id;
    private String tenantCode;
    private String featureKey;
    private String action;
    private String oldValue;
    private String newValue;
    private String performedBy;
    private LocalDateTime createdAt;
}
