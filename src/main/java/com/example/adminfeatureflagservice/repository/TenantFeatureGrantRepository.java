package com.example.adminfeatureflagservice.repository;

import com.example.adminfeatureflagservice.entity.TenantFeatureGrant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenantFeatureGrantRepository extends JpaRepository<TenantFeatureGrant, String> {

    List<TenantFeatureGrant> findByTenantId(String tenantId);

    List<TenantFeatureGrant> findByTenantTenantCode(String tenantCode);

    Optional<TenantFeatureGrant> findByTenantIdAndFeatureId(String tenantId, String featureId);

    Optional<TenantFeatureGrant> findByTenantTenantCodeAndFeatureFeatureKey(String tenantCode, String featureKey);

    @Query("SELECT g FROM TenantFeatureGrant g " +
           "JOIN FETCH g.feature f " +
           "WHERE g.tenant.tenantCode = :tenantCode AND g.isGranted = true AND f.isActive = true")
    List<TenantFeatureGrant> findGrantedActiveFeaturesByTenantCode(@Param("tenantCode") String tenantCode);
}
