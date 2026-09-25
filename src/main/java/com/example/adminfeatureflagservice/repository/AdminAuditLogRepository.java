package com.example.adminfeatureflagservice.repository;

import com.example.adminfeatureflagservice.entity.AdminAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, String> {
    List<AdminAuditLog> findByTenantCodeOrderByCreatedAtDesc(String tenantCode);
    List<AdminAuditLog> findAllByOrderByCreatedAtDesc();
}
