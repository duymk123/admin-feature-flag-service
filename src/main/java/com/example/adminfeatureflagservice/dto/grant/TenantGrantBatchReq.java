package com.example.adminfeatureflagservice.dto.grant;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantGrantBatchReq {

    private List<String> grantedFeatureKeys;

    private String performedBy;
}
