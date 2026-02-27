package com.webcv.controller.admin;

import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.request.admin.UpdateUserStatusRequest;
import com.webcv.request.user.CvsRequest;
import com.webcv.response.admin.CvResponse;
import com.webcv.response.user.BaseResponse;
import com.webcv.services.admin.ManageCvService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class ManageCvController {

    private final ManageCvService cvService;

    public ManageCvController(ManageCvService cvService) {
        this.cvService = cvService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/cv/create")
    public BaseResponse createCv(@RequestBody CvsRequest req) {
        return cvService.createCv(req);
    }

    /*
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/cv")
    public ResponseEntity<BaseResponse<Void>> createAndUpdateCv(
            @Valid
            @RequestBody CvsRequest request,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = authorizationHeader.substring(7);
        Long userId = (Long) jwtTokenUtil.extractUserId(token, jwtSecret);

        BaseResponse<Void> response = cvsService.createAndUpdateCv(request, userId);

        return ResponseEntity.ok().body(response);
    }*/

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cv")
    public Page<CvResponse> getAllCv(
            @RequestParam(required = false) Boolean deleted,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {

        UserStatus userStatus = null;

        // validate status
        if (status != null && !status.isBlank()) {
            try {
                userStatus = UserStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + status);
            }
        }

        // validate keyword
        if (keyword != null) {
            keyword = keyword.trim();
            if (keyword.length() < 1) {
                throw new BadRequestException("Keyword too short");
            }
        }

        return cvService.getAllCv(deleted, userStatus, userId, keyword, pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cv/{id}")
    public CvResponse getCvDetail(@PathVariable Long id) {
        return cvService.getCvDetail(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/cv/{id}")
    public BaseResponse updateCv(
            @PathVariable Long id,
            @RequestBody CvsRequest req
    ) {
        return cvService.updateCv(id, req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/cv/{id}/status")
    public BaseResponse updateCvStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest request
    ) {
        return cvService.updateCvStatus(id, request.getStatus());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/cv/{id}")
    public BaseResponse deleteCv(@PathVariable Long id) {
        return cvService.deleteCv(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/cv/{id}/user/{userId}")
    public BaseResponse assignUserToCv(
            @PathVariable Long id,
            @PathVariable Long userId
    ) {
        return cvService.assignUserToCv(id, userId);
    }

}

