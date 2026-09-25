package com.example.adminfeatureflagservice.repository;

import com.example.adminfeatureflagservice.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, String> {
    Optional<Tenant> findByTenantCode(String tenantCode);
    boolean existsByTenantCode(String tenantCode);
}
