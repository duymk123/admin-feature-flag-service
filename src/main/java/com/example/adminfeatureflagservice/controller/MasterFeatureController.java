package com.example.adminfeatureflagservice.controller;

import com.example.adminfeatureflagservice.dto.common.ApiResponse;
import com.example.adminfeatureflagservice.dto.feature.MasterFeatureReq;
import com.example.adminfeatureflagservice.dto.feature.MasterFeatureRes;
import com.example.adminfeatureflagservice.service.MasterFeatureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/master-features")
@RequiredArgsConstructor
public class MasterFeatureController {

    private final MasterFeatureService masterFeatureService;

    // api lấy tất cả các flag (dùng cho thống kê Dashboard và cấu hình cờ)
    @GetMapping
    public ResponseEntity<ApiResponse<List<MasterFeatureRes>>> getAllFeatures() {
        return ResponseEntity.ok(ApiResponse.ok(masterFeatureService.getAllFeatures()));
    }
}
