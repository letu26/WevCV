package com.webcv.controller.admin;

import com.webcv.enums.UserStatus;
import com.webcv.request.admin.CreateCVFormRequest;
import com.webcv.request.admin.UpdateCVFormRequest;
import com.webcv.request.admin.UpdateFormStatusRequest;
import com.webcv.response.admin.CVFormResponse;
import com.webcv.services.admin.CVFormService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.webcv.exception.customexception.BadRequestException;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCVFormController {

    private final CVFormService cvFormService;

    /**
     * Request and Response
     *
     * @CVFormResponse (Long id,
     *                  String name,
     *                  String description,
     *                  String status,
     *                  String createdBy,
     *                  LocalDateTime createdAt)
     *
     * @CreateCVFormRequest (String name,
     *                       String description,
     *                       String status)
     *
     * @UpdateCVFormRequest (String name,
     *                       String description,
     *                       tring status)
     *
     * @UpdateFormStatusRequest (String status)
     *
     * */
    public AdminCVFormController(CVFormService cvFormService) {
        this.cvFormService = cvFormService;
    }

    /**
     * 12. Admin xem tất cả danh sách CV form
     * GET /api/admin/cv-forms
     *
     * @CVFormResponse (Long id,
     *                  String name,
     *                  String description,
     *                  String status,
     *                  String createdBy,
     *                  LocalDateTime createdAt)
     * */
    @GetMapping("/cv-forms")
    public Page<CVFormResponse> getAllForms(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
        /*UserStatus userStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                userStatus = UserStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + status);
            }
        }

        if (role != null && !role.isBlank()) {
            if (!role.equalsIgnoreCase("ADMIN")
                    && !role.equalsIgnoreCase("USER")
                    && !role.equalsIgnoreCase("LEAD")) {
                throw new BadRequestException("Invalid role: " + role);
            }
            role = role.toUpperCase();
        }

        if (keyword != null) {
            keyword = keyword.trim();
            if (keyword.length() < 2) {
                throw new BadRequestException("Keyword too short");
            }
        }*/

        return cvFormService.getAllForms(status, keyword, pageable);
    }

    /**
     * 13. Admin tạo CV form mới
     * POST /api/admin/cv-forms
     *
     * @CreateCVFormRequest (String name,
     *                       String description,
     *                       String status)
     * */
    @PostMapping("/cv-forms")
    public CVFormResponse createForm(
            @RequestBody @Valid CreateCVFormRequest request,
            @AuthenticationPrincipal UserPrincipal admin
    ) {
        return cvFormService.createForm(request, admin.getId());
    }

    /**
     * 14. Admin chỉnh sửa CV form
     * PUT /api/admin/cv-forms/{id}
     *
     * @UpdateCVFormRequest (String name,
     *                       String description,
     *                       String status)
     * */
    @PutMapping("/cv-forms/{id}")
    public CVFormResponse updateForm(
            @PathVariable Long id,
            @RequestBody @Valid UpdateCVFormRequest request
    ) {
        return cvFormService.updateForm(id, request);
    }

    /**
     * 15. Admin bật, tắt form
     * PATCH /cv-forms/{id}/status
     *
     * @UpdateFormStatusRequest (String status)
     *
     * */
    @PatchMapping("/cv-forms/{id}/status")
    public void updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateFormStatusRequest request
    ) {
        cvFormService.updateStatus(id, request.getStatus());
    }

    /**
     * 16. Admin xoá form
     * DELETE /api/admin/cv-forms/{id}
     * */
    @DeleteMapping("/cv-forms/{id}")
    public void deleteForm(@PathVariable Long id) {
        cvFormService.deleteForm(id);
    }

    /**
     * 17. Admin xem trước form
     * GET /cv-forms/{id}/preview
     * */
    @GetMapping("/cv-forms/{id}/preview")
    public CVFormPreviewResponse previewForm(@PathVariable Long id) {
        return cvFormService.previewForm(id);
    }
}
