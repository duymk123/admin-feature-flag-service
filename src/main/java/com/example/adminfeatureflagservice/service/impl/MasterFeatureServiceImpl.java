package com.example.adminfeatureflagservice.service.impl;

import com.example.adminfeatureflagservice.dto.feature.MasterFeatureReq;
import com.example.adminfeatureflagservice.dto.feature.MasterFeatureRes;
import com.example.adminfeatureflagservice.entity.MasterFeature;
import com.example.adminfeatureflagservice.exception.AppException;
import com.example.adminfeatureflagservice.repository.MasterFeatureRepository;
import com.example.adminfeatureflagservice.service.MasterFeatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MasterFeatureServiceImpl implements MasterFeatureService {

    private final MasterFeatureRepository masterFeatureRepository;

    @Override
    @Transactional
    public MasterFeatureRes createFeature(MasterFeatureReq request) {
        String key = request.getFeatureKey().trim().toUpperCase();
        if (masterFeatureRepository.existsByFeatureKey(key)) {
            throw new AppException("Feature key '" + key + "' đã tồn tại!", HttpStatus.CONFLICT);
        }

        MasterFeature feature = MasterFeature.builder()
                .featureKey(key)
                .name(request.getName().trim())
                .description(request.getDescription())
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        MasterFeature saved = masterFeatureRepository.save(feature);
        log.info("Created master feature: {}", saved.getFeatureKey());
        return mapToRes(saved);
    }

    @Override
    @Transactional
    public MasterFeatureRes updateFeature(String id, MasterFeatureReq request) {

        MasterFeature feature = masterFeatureRepository.findById(id)
                .orElseThrow(
                        () -> new AppException("Không tìm thấy Feature với ID: " + id, HttpStatus.NOT_FOUND));

        String newKey = request.getFeatureKey().trim().toUpperCase();
        if (!feature.getFeatureKey().equals(newKey) && masterFeatureRepository.existsByFeatureKey(newKey)) {
            throw new AppException("Feature key '" + newKey + "' đã tồn tại ở bản ghi khác!", HttpStatus.CONFLICT);
        }

        feature.setFeatureKey(newKey);
        feature.setName(request.getName().trim());
        feature.setDescription(request.getDescription());

        if (request.getIsActive() != null) {
            feature.setIsActive(request.getIsActive());
        }

        MasterFeature updated = masterFeatureRepository.save(feature);
        log.info("Updated master feature: {}", updated.getFeatureKey());
        return mapToRes(updated);
    }

    @Override
    @Transactional
    public MasterFeatureRes toggleStatus(String id) {
        MasterFeature feature = masterFeatureRepository.findById(id)
                .orElseThrow(
                        () -> new AppException("Không tìm thấy Feature với ID: " + id, HttpStatus.NOT_FOUND));

        feature.setIsActive(!Boolean.TRUE.equals(feature.getIsActive()));
        MasterFeature updated = masterFeatureRepository.save(feature);
        log.info("Toggled master feature {} status to {}", updated.getFeatureKey(), updated.getIsActive());

        return mapToRes(updated);
    }

    @Override
    @Transactional
    public void deleteFeature(String id) {
        if (!masterFeatureRepository.existsById(id)) {
            throw new AppException("Không tìm thấy Feature với ID: " + id, HttpStatus.NOT_FOUND);
        }
        masterFeatureRepository.deleteById(id);

        log.info("Deleted master feature ID: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MasterFeatureRes> getAllFeatures() {
        return masterFeatureRepository.findAll().stream()
                .map(this::mapToRes)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MasterFeatureRes getFeatureById(String id) {
        return masterFeatureRepository.findById(id)
                .map(this::mapToRes)
                .orElseThrow(() -> new AppException("Không tìm thấy Feature với ID: " + id, HttpStatus.NOT_FOUND));
    }

    private MasterFeatureRes mapToRes(MasterFeature entity) {
        return MasterFeatureRes.builder()
                .id(entity.getId())
                .featureKey(entity.getFeatureKey())
                .name(entity.getName())
                .description(entity.getDescription())
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
