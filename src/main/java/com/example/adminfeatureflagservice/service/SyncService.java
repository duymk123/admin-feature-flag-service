package com.example.adminfeatureflagservice.service;

import java.util.Map;

public interface SyncService {
    Map<String, Object> applyForTenant(String tenantCode);
}
