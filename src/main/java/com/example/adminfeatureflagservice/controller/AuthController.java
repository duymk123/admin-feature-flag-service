package com.example.adminfeatureflagservice.controller;

import com.example.adminfeatureflagservice.dto.auth.LoginRequest;
import com.example.adminfeatureflagservice.dto.auth.LoginResponse;
import com.example.adminfeatureflagservice.dto.common.ApiResponse;
import com.example.adminfeatureflagservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công!", response));
    }
}
