package com.webcv.controller.lead;

import com.webcv.entity.UserEntity;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.request.lead.ApplyCvRequest;
import com.webcv.response.lead.CvDetailResponse;
import com.webcv.response.lead.CvResponse;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;
import com.webcv.services.lead.ManageCvService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lead")
public class ManageCvController {


    private final ManageCvService manageCvService;
    public ManageCvController (ManageCvService manageCvService){
        this.manageCvService = manageCvService;
    }

    @PreAuthorize("hasRole('LEAD')")
    @GetMapping("/cvs")
    public Page<CvResponse> getAllCvs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {

        if (status != null && !status.isBlank()) {
            if (!status.equalsIgnoreCase("ACTIVE")
                    && !status.equalsIgnoreCase("INACTIVE")
                    && !status.equalsIgnoreCase("BLOCKED")) {
                throw new BadRequestException("Invalid status: " + status);
            }
        }

        if (keyword != null) {
            keyword = keyword.trim();
            if (keyword.length() < 1) {
                throw new BadRequestException("Keyword too short");
            }
        }

        return manageCvService.getAllCvs(status, keyword, pageable);
    }

    @PreAuthorize("hasRole('LEAD')")
    @GetMapping("cvs/{userId}")
    public ResponseEntity<BaseResponse<List<CvDetailResponse>>> getCvbyUserId(@PathVariable Long userId){
        BaseResponse<List<CvDetailResponse>> response = manageCvService.getCvbyUserId(userId);

        return ResponseEntity.ok().body(response);
    }

    @PreAuthorize("hasRole('LEAD')")
    @PostMapping("/projects/{projectId}/apply")
    public BaseResponse applyCv(
            @PathVariable Long projectId,
            @RequestBody ApplyCvRequest request,
            @AuthenticationPrincipal UserEntity User
    ) {

        if (request.getCvId() == null) {
            throw new BadRequestException("CV id is required");
        }

       return manageCvService.applyCv(User, projectId, request.getCvId());
    }

    @PreAuthorize("hasRole('LEAD')")
    @DeleteMapping("/projects/{projectId}/members/{cvId}")
    public ResponseEntity<?> removeMember(
            @AuthenticationPrincipal UserEntity User,
            @PathVariable Long projectId,
            @PathVariable Long cvId) {

        manageCvService.removeMember(User, projectId, cvId);

        return ResponseEntity.ok("Đã xoá member khỏi project");
    }
}
