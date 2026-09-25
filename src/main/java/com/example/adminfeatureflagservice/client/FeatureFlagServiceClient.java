package com.example.adminfeatureflagservice.client;

import com.example.adminfeatureflagservice.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class FeatureFlagServiceClient {

    private final RestTemplate restTemplate;
    private final TenantRepository tenantRepository;

    @Value("${feature-flag.service.url:http://localhost:8081}")
    private String defaultFeatureFlagServiceUrl;

    @Value("${feature-flag.service.service-a-url:http://localhost:8081}")
    private String serviceAUrl;

    @Value("${feature-flag.service.service-b-url:http://localhost:8085}")
    private String serviceBUrl;

    public String getTargetServiceUrl(String tenantCode) {
        if (tenantCode != null) {
            String code = tenantCode.trim().toUpperCase();
            try {
                if (tenantRepository != null) {
                    var tenantOpt = tenantRepository.findByTenantCode(code);
                    if (tenantOpt.isPresent() && tenantOpt.get().getServiceUrl() != null) {
                        String sUrl = tenantOpt.get().getServiceUrl().toLowerCase();
                        if (sUrl.contains("-b") || sUrl.contains("8083") || sUrl.contains("8085")) {
                            return (serviceBUrl != null && !serviceBUrl.isBlank()) ? serviceBUrl : defaultFeatureFlagServiceUrl;
                        }
                        if (sUrl.contains("-a") || sUrl.contains("8082") || sUrl.contains("8081")) {
                            return (serviceAUrl != null && !serviceAUrl.isBlank()) ? serviceAUrl : defaultFeatureFlagServiceUrl;
                        }
                    }
                }
            } catch (Exception ignored) {}

            if (code.contains("COMPANY_B") || code.endsWith("_B") || code.contains("KMA") || code.contains("LOGISTICS")) {
                return (serviceBUrl != null && !serviceBUrl.isBlank()) ? serviceBUrl : defaultFeatureFlagServiceUrl;
            }
            if (code.contains("COMPANY_A") || code.endsWith("_A") || code.contains("VTIT") || code.contains("SOFTWARE")) {
                return (serviceAUrl != null && !serviceAUrl.isBlank()) ? serviceAUrl : defaultFeatureFlagServiceUrl;
            }
        }
        return defaultFeatureFlagServiceUrl;
    }

    // Đồng bộ cấp quyền cờ sang Feature-Flag-Service của Instance tương ứng
    public boolean syncTenantFeatureFlag(String tenantCode, String flagName, boolean isGranted) {
        String url = getTargetServiceUrl(tenantCode) + "/api/v1/flags/" + flagName + "/grant?isGranted=" + isGranted;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(Map.of("isGranted", isGranted), headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);
            log.info("Synced flag grant '{}' for tenant '{}' (isGranted={}) to FeatureFlagService ({}). Status: {}",
                    flagName, tenantCode, isGranted, url, response.getStatusCode());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.error("Failed to sync flag grant '{}' for tenant '{}' to FeatureFlagService ({}): {}",
                    flagName, tenantCode, url, e.getMessage());
            return false;
        }
    }

    // Apply cấu hình sang container Tracking-Order thông qua Feature-Flag-Service của Instance đó
    public Map<String, Object> applyToTenant(String tenantCode) {
        String url = getTargetServiceUrl(tenantCode) + "/api/v1/flags/apply";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Void> entity = new HttpEntity<>(headers);
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );
            log.info("Triggered apply for tenant '{}' on FeatureFlagService ({}). Result: {}", tenantCode, url, response.getBody());
            return response.getBody();
        } catch (Exception e) {
            log.error("Failed to trigger apply for tenant '{}' on FeatureFlagService ({}): {}", tenantCode, url, e.getMessage());
            return Map.of("status", "FAILED", "error", e.getMessage());
        }
    }
}
