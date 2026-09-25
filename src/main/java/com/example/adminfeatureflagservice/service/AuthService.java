package com.example.adminfeatureflagservice.service;

import com.example.adminfeatureflagservice.dto.auth.LoginRequest;
import com.example.adminfeatureflagservice.dto.auth.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
