package com.example.adminfeatureflagservice.config;

import com.example.adminfeatureflagservice.entity.MasterFeature;
import com.example.adminfeatureflagservice.entity.Tenant;
import com.example.adminfeatureflagservice.entity.TenantFeatureGrant;
import com.example.adminfeatureflagservice.repository.MasterFeatureRepository;
import com.example.adminfeatureflagservice.repository.TenantFeatureGrantRepository;
import com.example.adminfeatureflagservice.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import com.example.adminfeatureflagservice.client.FeatureFlagServiceClient;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DataInitializer implements CommandLineRunner {

    private final MasterFeatureRepository masterFeatureRepository;
    private final TenantRepository tenantRepository;
    private final TenantFeatureGrantRepository tenantFeatureGrantRepository;
    private final FeatureFlagServiceClient featureFlagServiceClient;

    @Override
    public void run(String... args) {
        log.info("Checking initial data seeding for Admin Feature Flag Service...");

        // Dọn dẹp COUPON_DISCOUNT nếu còn tồn tại từ trước (do không có trong FeatureFlags enum của feature-flag-service)
        masterFeatureRepository.findByFeatureKey("COUPON_DISCOUNT").ifPresent(f -> {
            tenantFeatureGrantRepository.findAll().stream()
                    .filter(g -> g.getFeature().getId().equals(f.getId()))
                    .forEach(tenantFeatureGrantRepository::delete);
            masterFeatureRepository.delete(f);
            log.info("Removed legacy COUPON_DISCOUNT feature from database");
        });

        // 1. Seed Master Features nếu chưa có
        if (masterFeatureRepository.count() == 0) {
            log.info("Seeding default Master Features...");
            MasterFeature f1 = MasterFeature.builder()
                    .featureKey("BUY_NOW")
                    .name("Mua Ngay (Buy Now)")
                    .description("Cho phép hiển thị nút Mua Ngay và đặt hàng nhanh không cần qua giỏ hàng")
                    .isActive(true)
                    .build();

            MasterFeature f2 = MasterFeature.builder()
                    .featureKey("ORDER_DETAIL")
                    .name("Chi Tiết Đơn Hàng (Order Detail)")
                    .description("Cho phép xem thông tin lịch sử và hành trình chi tiết của đơn hàng")
                    .isActive(true)
                    .build();

            MasterFeature f3 = MasterFeature.builder()
                    .featureKey("PRICE_INCREASE")
                    .name("Tăng Giá Tự Động (Price Increase)")
                    .description("Tính năng điều chỉnh giá sản phẩm tự động theo chiến dịch")
                    .isActive(true)
                    .build();

            masterFeatureRepository.saveAll(List.of(f1, f2, f3));
        }

        // 2. Seed Tenants nếu chưa có
        if (tenantRepository.count() == 0) {
            log.info("Seeding default Tenants (Company A & Company B)...");
            Tenant tA = Tenant.builder()
                    .tenantCode("COMPANY_A")
                    .name("Viettel Software - Company A")
                    .ipAddress("127.0.0.1")
                    .serviceUrl("http://tracking-order-a:8080")
                    .status("ACTIVE")
                    .build();

            Tenant tB = Tenant.builder()
                    .tenantCode("COMPANY_B")
                    .name("Viettel Logistics - Company B")
                    .ipAddress("127.0.0.1")
                    .serviceUrl("http://tracking-order-b:8080")
                    .status("ACTIVE")
                    .build();

            tenantRepository.saveAll(List.of(tA, tB));
        }

        // 3. Seed Grants nếu chưa có
        if (tenantFeatureGrantRepository.count() == 0) {
            log.info("Seeding initial Feature Grants for Tenants...");
            Tenant tA = tenantRepository.findByTenantCode("COMPANY_A").orElse(null);
            Tenant tB = tenantRepository.findByTenantCode("COMPANY_B").orElse(null);

            List<MasterFeature> features = masterFeatureRepository.findAll();
            if (tA != null && tB != null && !features.isEmpty()) {
                for (MasterFeature f : features) {
                    // Company A: Cấp BUY_NOW, ORDER_DETAIL
                    boolean grantA = "BUY_NOW".equals(f.getFeatureKey()) || "ORDER_DETAIL".equals(f.getFeatureKey());
                    tenantFeatureGrantRepository.save(TenantFeatureGrant.builder()
                            .tenant(tA)
                            .feature(f)
                            .isGranted(grantA)
                            .grantedAt(LocalDateTime.now())
                            .grantedBy("system")
                            .build());

                    // Company B: Cấp ORDER_DETAIL, PRICE_INCREASE
                    boolean grantB = "ORDER_DETAIL".equals(f.getFeatureKey()) || "PRICE_INCREASE".equals(f.getFeatureKey());
                    tenantFeatureGrantRepository.save(TenantFeatureGrant.builder()
                            .tenant(tB)
                            .feature(f)
                            .isGranted(grantB)
                            .grantedAt(LocalDateTime.now())
                            .grantedBy("system")
                            .build());
                }
            }
        }

        // 4. Đồng bộ toàn bộ Feature Grants sang Feature Flag Service của từng Instance khi khởi động
        log.info("Synchronizing all feature grants to Feature Flag Service instances...");
        List<Tenant> allTenants = tenantRepository.findAll();
        for (Tenant t : allTenants) {
            List<TenantFeatureGrant> grants = tenantFeatureGrantRepository.findByTenantId(t.getId());
            for (TenantFeatureGrant g : grants) {
                featureFlagServiceClient.syncTenantFeatureFlag(
                        t.getTenantCode(),
                        g.getFeature().getFeatureKey(),
                        Boolean.TRUE.equals(g.getIsGranted())
                );
            }
        }
        log.info("Data seeding and synchronization completed successfully for {} tenants!", allTenants.size());
    }
}
