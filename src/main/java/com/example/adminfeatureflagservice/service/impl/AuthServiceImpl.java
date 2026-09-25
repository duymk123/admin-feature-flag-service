package com.example.adminfeatureflagservice.service.impl;

import com.example.adminfeatureflagservice.dto.auth.LoginRequest;
import com.example.adminfeatureflagservice.dto.auth.LoginResponse;
import com.example.adminfeatureflagservice.exception.AppException;
import com.example.adminfeatureflagservice.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    // Fix cứng tài khoản
    private static final String DEFAULT_ADMIN_USERNAME = "admin";
    private static final String DEFAULT_ADMIN_PASSWORD = "1";

    @Override
    public LoginResponse login(LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            throw new AppException("Username and password must not be empty", HttpStatus.BAD_REQUEST);
        }

        if (!DEFAULT_ADMIN_USERNAME.equals(request.getUsername().trim()) ||
            !DEFAULT_ADMIN_PASSWORD.equals(request.getPassword())) {
            log.warn("Failed login attempt for username: {}", request.getUsername());
            throw new AppException("Sai tài khoản hoặc mật khẩu!", HttpStatus.UNAUTHORIZED);
        }

        log.info("Admin user logged in successfully");
        String token = "admin-session-" + UUID.randomUUID().toString();

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(DEFAULT_ADMIN_USERNAME)
                .role("SUPER_ADMIN")
                .build();
    }
}
