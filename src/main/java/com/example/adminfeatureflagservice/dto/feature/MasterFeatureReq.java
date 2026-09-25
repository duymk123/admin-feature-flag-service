package com.example.adminfeatureflagservice.dto.feature;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MasterFeatureReq {

    @NotBlank(message = "Feature key is required")
    private String featureKey;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @Builder.Default
    private Boolean isActive = true;
}
