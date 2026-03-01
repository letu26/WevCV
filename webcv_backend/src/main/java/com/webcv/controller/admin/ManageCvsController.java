package com.webcv.controller.admin;

import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;
import com.webcv.services.admin.Impl.ManageCvsServices;
import com.webcv.services.user.Impl.CvsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin/cvs")
public class ManageCvsController {

    private final ManageCvsServices manageCvsServices;

    @GetMapping()
    public ResponseEntity<BaseResponse<List<CvsResponse>>> getAllCvs(@RequestParam Map<String, Object> params){
        return ResponseEntity.ok().body(manageCvsServices.getAllCvs(params));
    }
}