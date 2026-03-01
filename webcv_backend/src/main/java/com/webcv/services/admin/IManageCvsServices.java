package com.webcv.services.admin;

import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;

import java.util.List;
import java.util.Map;

public interface IManageCvsServices {
    BaseResponse<List<CvsResponse>> getAllCvs(Map<String, Object> params);
}