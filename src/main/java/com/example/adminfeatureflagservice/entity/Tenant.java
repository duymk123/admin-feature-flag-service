package com.example.adminfeatureflagservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @UuidGenerator
    @Column(length = 36)
    private String id;

    @Column(name = "tenant_code", nullable = false, unique = true, length = 100)
    private String tenantCode;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "ip_address", length = 100)
    private String ipAddress;

    @Column(name = "service_url", length = 500)
    private String serviceUrl;

    @Builder.Default
    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
