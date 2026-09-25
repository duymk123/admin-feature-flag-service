package com.example.adminfeatureflagservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "tenant_feature_grants",
        uniqueConstraints = @UniqueConstraint(name = "uk_tenant_feature", columnNames = {"tenant_id", "feature_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantFeatureGrant {

    @Id
    @UuidGenerator
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "feature_id", nullable = false)
    private MasterFeature feature;

    @Builder.Default
    @Column(name = "is_granted", nullable = false)
    private Boolean isGranted = false;

    @Column(name = "granted_at", nullable = false)
    private LocalDateTime grantedAt;

    @Builder.Default
    @Column(name = "granted_by", length = 100)
    private String grantedBy = "admin";

    @PrePersist
    public void prePersist() {
        if (this.grantedAt == null) {
            this.grantedAt = LocalDateTime.now();
        }
        if (this.isGranted == null) {
            this.isGranted = false;
        }
        if (this.grantedBy == null) {
            this.grantedBy = "admin";
        }
    }
}
