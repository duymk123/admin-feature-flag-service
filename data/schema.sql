-- 1. Bảng Master Features (Danh mục cờ toàn cục)
CREATE TABLE `master_features`
(
    `id`          VARCHAR(36)  NOT NULL PRIMARY KEY DEFAULT (UUID()),
    `feature_key` VARCHAR(100) NOT NULL,
    `name`        VARCHAR(255) NOT NULL,
    `description` TEXT,
    `is_active`   BOOLEAN      NOT NULL             DEFAULT TRUE,
    `created_at`  DATETIME     NOT NULL             DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     NOT NULL             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `uk_feature_key` (`feature_key`)
);

-- 2. Bảng Tenants (Danh sách các Instance / Khách hàng)
CREATE TABLE IF NOT EXISTS `tenants`
(
    `id`          VARCHAR(36)  NOT NULL PRIMARY KEY DEFAULT (uuid()),
    `tenant_code` VARCHAR(100) NOT NULL,
    `name`        VARCHAR(255) NOT NULL,
    `status`      VARCHAR(50)  NOT NULL             DEFAULT 'ACTIVE',
    `created_at`  DATETIME     NOT NULL             DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME     NOT NULL             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_tenant_code` (`tenant_code`)
    );

-- 3. Bảng Tenant Feature Grants (Phân quyền ON/OFF cờ cho từng Tenant)
CREATE TABLE IF NOT EXISTS `tenant_feature_grants`
(
    `id`         VARCHAR(36) NOT NULL PRIMARY KEY DEFAULT (uuid()),
    `tenant_id`  VARCHAR(36) NOT NULL,
    `feature_id` VARCHAR(36) NOT NULL,
    `is_granted` BOOLEAN     NOT NULL DEFAULT FALSE,
    `granted_at` DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `granted_by` VARCHAR(100)         DEFAULT 'admin',
    UNIQUE KEY `uk_tenant_feature` (`tenant_id`, `feature_id`),
    CONSTRAINT `fk_grant_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_grant_feature` FOREIGN KEY (`feature_id`) REFERENCES `master_features` (`id`) ON DELETE CASCADE
    );

-- 4. BẢNG AUDIT LOG (Lịch sử Bật/Tắt cờ của Super Admin)
CREATE TABLE IF NOT EXISTS `admin_audit_logs`
(
    `id`           VARCHAR(36)  NOT NULL PRIMARY KEY DEFAULT (uuid()),
    `tenant_code`  VARCHAR(100) NOT NULL,
    `feature_key`  VARCHAR(100) NOT NULL,
    `action`       VARCHAR(50)  NOT NULL, -- GRANT, REVOKE, TOGGLE
    `old_value`    VARCHAR(50)  NULL,     -- 'false' hoặc 'true'
    `new_value`    VARCHAR(50)  NOT NULL, -- 'true' hoặc 'false'
    `performed_by` VARCHAR(100) NOT NULL, -- Tên admin thực hiện
    `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_tenant` (`tenant_code`),
    INDEX `idx_audit_created` (`created_at`)
    );
