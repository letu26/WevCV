package com.webcv.controller.admin;

import com.webcv.request.admin.CreateCvFormFieldRequest;
import com.webcv.request.admin.CreateCvFormRequest;
import com.webcv.request.admin.UpdateCvFormRequest;
import com.webcv.request.admin.UpdateFormStatusRequest;

import com.webcv.response.admin.CvFormFieldResponse;
import com.webcv.response.admin.CvFormResponse;

import com.webcv.services.admin.CvFormFieldService;
import com.webcv.services.admin.CvFormService;

import jakarta.validation.Valid;

import lombok.AllArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class CvFormController {

    private final CvFormService cvFormService;
    private final CvFormFieldService fieldService;

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
    public Page<CvFormResponse> getAllForms(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            Pageable pageable
    ) {
 /*      UserStatus userStatus = null;
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
        }
*/
        return cvFormService.getAllCVForms(status, keyword, pageable);
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
    public CvFormResponse createForm(
            @RequestBody @Valid CreateCvFormRequest request,
            Authentication authentication
    ) {
  /*      Object principal = authentication.getPrincipal();

        if (!(principal instanceof UserPrincipal user)) {
            throw new RuntimeException("Principal is not UserPrincipal");
        }
*/
        return cvFormService.createForm(request/*, user.getId()*/);
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
    public CvFormResponse updateForm(
            @PathVariable Long id,
            @RequestBody @Valid UpdateCvFormRequest request
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
     * GET /api/admin/cv-forms/{id}/preview
     * */
    @GetMapping("/cv-forms/{id}/preview")
    public CvFormResponse previewForm(@PathVariable Long id) {
        return cvFormService.previewForm(id);
    }

    /**
     * 18. Admin xem các trường trong cv form
     * GET /api/admin/cv-forms/{id}/fields
     * */
    @GetMapping("/cv-forms/{id}/fields")
    public List<CvFormFieldResponse> getFields(@PathVariable Long id) {
        return fieldService.getCvFormFieldsByCvForm(id);
    }

    /**
     * 19. Admin thêm trường trong cv form
     * POST /api/admin/cv-forms/{id}/fields
     * */
    @PostMapping("/cv-forms/{id}/fields")
    public void addField(
            @PathVariable Long id,
            @RequestBody CreateCvFormFieldRequest request
    ) {
        fieldService.addCvFormField(id, request);
    }

    /**
     *
     *
     *     CvFormEntity
     *     private Long id;
     *     private String name;
     *     private String description;
     *     private FormStatus status;
     *     private UserEntity createdBy;
     *     private List<CvFormFieldEntity> fields;
     *
     *     CvFormFieldEntity
     *     private Long id;
     *     private CvFormEntity cvForm;
     *     private String label;
     *     private String fieldKey;
     *     private String fieldType;
     *     private Boolean required;
     *     private Integer orderIndex;
     *     TO-DO:
     * CreateCvFormFieldRequest
     * UpdateCvFormFieldRequest
     *
     * CvFormFieldResponse
     *
     * CvFormFieldService
     *
     * CvFormFieldRepository
     * */

}
