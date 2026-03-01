package com.webcv.repository.custom;

import com.webcv.request.admin.GetAllCvsRequest;

import java.util.List;

public interface CvsRepositoryCustom {
    List<Object[]> findAllCvs(GetAllCvsRequest request);
}