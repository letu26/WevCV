package com.webcv.controller.admin;

import com.webcv.request.admin.UpdateCvFormFieldRequest;
import com.webcv.services.admin.CvFormFieldService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/cv-fields")
@AllArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class CvFormFieldController {

    private final CvFormFieldService fieldService;

    /**
     * 20. Admin cập nhật field
     * PUT /api/admin/cv-fields/{fieldId}
     * */
    @PutMapping("/{fieldId}")
    public void updateField(
            @PathVariable Long fieldId,
            @RequestBody UpdateCvFormFieldRequest request
    ) {
        fieldService.updateField(fieldId, request);
    }

    /**
     * 21. Admin xóa field
     * DELETE /api/admin/cv-fields/{fieldId}
     * */
    @DeleteMapping("/{fieldId}")
    public void deleteField(@PathVariable Long fieldId) {
        fieldService.deleteField(fieldId);
    }
}

