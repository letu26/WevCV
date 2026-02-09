package com.webcv.services.user;

import com.webcv.request.user.CvsRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;

import java.util.List;

public interface ICvServices {
    BaseResponse<Void> createAndUpdateCv(CvsRequest request, Long userId);
    BaseResponse<List<CvsResponse>> getCvbyUserId(Long userId);
    BaseResponse<Void> deleteCvById(Long id);
}