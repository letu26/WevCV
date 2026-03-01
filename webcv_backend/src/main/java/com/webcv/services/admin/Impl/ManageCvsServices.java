package com.webcv.services.admin.Impl;

import com.webcv.mapper.CvsMapper;
import com.webcv.repository.CvsRepository;
import com.webcv.request.admin.GetAllCvsRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;
import com.webcv.services.admin.IManageCvsServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ManageCvsServices implements IManageCvsServices {

    private final CvsMapper cvsMapper;
    private final CvsRepository cvsRepository;

    @Override
    public BaseResponse<List<CvsResponse>> getAllCvs(Map<String, Object> params) {
        GetAllCvsRequest request = cvsMapper.toRequest(params);
        List<Object[]> cvs = cvsRepository.findAllCvs(request);
        List<CvsResponse> cvsResponses = cvs.stream()
                .map(cvsMapper::mapToResponse)
                .toList();
        return BaseResponse.<List<CvsResponse>>builder()
                .code("200")
                .message("Successfully fetched CV!")
                .data(cvsResponses)
                .build();
    }
}