package com.example.adminfeatureflagservice.service;

import com.example.adminfeatureflagservice.dto.feature.MasterFeatureReq;
import com.example.adminfeatureflagservice.dto.feature.MasterFeatureRes;

import java.util.List;

public interface MasterFeatureService {
    MasterFeatureRes createFeature(MasterFeatureReq request);
    MasterFeatureRes updateFeature(String id, MasterFeatureReq request);
    MasterFeatureRes toggleStatus(String id);
    void deleteFeature(String id);
    List<MasterFeatureRes> getAllFeatures();
    MasterFeatureRes getFeatureById(String id);
}
