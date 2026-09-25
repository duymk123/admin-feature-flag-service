package com.example.adminfeatureflagservice.service;

import com.example.adminfeatureflagservice.dto.tenant.TenantReq;
import com.example.adminfeatureflagservice.dto.tenant.TenantRes;

import java.util.List;

public interface TenantService {
    TenantRes createTenant(TenantReq request);
    TenantRes updateTenant(String id, TenantReq request);
    void deleteTenant(String id);
    List<TenantRes> getAllTenants();
    TenantRes getTenantById(String id);
    TenantRes getTenantByCode(String code);
}
