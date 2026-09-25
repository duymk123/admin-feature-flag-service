package com.example.adminfeatureflagservice.repository;

import com.example.adminfeatureflagservice.entity.MasterFeature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MasterFeatureRepository extends JpaRepository<MasterFeature, String> {
    Optional<MasterFeature> findByFeatureKey(String featureKey);
    boolean existsByFeatureKey(String featureKey);
    List<MasterFeature> findByIsActiveTrue();
}
