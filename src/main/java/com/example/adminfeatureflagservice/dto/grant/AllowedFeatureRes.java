package com.example.adminfeatureflagservice.dto.grant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllowedFeatureRes {

    private String tenantCode;
    private String tenantName;
    private String serviceUrl;
    private List<String> allowedFeatureKeys;
}
