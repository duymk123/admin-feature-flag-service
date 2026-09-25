package com.example.adminfeatureflagservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "admin_audit_logs",
        indexes = {
                @Index(name = "idx_audit_tenant", columnList = "tenant_code"),
                @Index(name = "idx_audit_created", columnList = "created_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAuditLog {

    @Id
    @UuidGenerator
    @Column(length = 36)
    private String id;

    @Column(name = "tenant_code", nullable = false, length = 100)
    private String tenantCode;

    @Column(name = "feature_key", nullable = false, length = 100)
    private String featureKey;

    @Column(name = "action", nullable = false, length = 50)
    private String action; // GRANT, REVOKE, TOGGLE

    @Column(name = "old_value", length = 50)
    private String oldValue;

    @Column(name = "new_value", nullable = false, length = 50)
    private String newValue;

    @Column(name = "performed_by", nullable = false, length = 100)
    private String performedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
