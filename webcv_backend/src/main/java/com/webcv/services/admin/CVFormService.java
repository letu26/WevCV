package com.webcv.services.admin;

import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.request.admin.CreateCVFormRequest;
import com.webcv.request.admin.UpdateCVFormRequest
import com.webcv.response.admin.CVFormResponse;
import com.webcv.entity.CVFormEntity;
import com.webcv.entity.UserEntity;
import com.webcv.repository.cvFormRepository;
import com.webcv.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class CVFormService {

    /**
     * @CVFormService:
     *
     * @getAllCVForm()
     * Trả về tất cẩ CV Form
     *
     * @createForm()
     * Tạo form mới
     *
     * @updateForm()
     * Chỉnh sửa form
     *
     * @updateStatus()
     * Thay đổi trạng thái
     *
     * @deleteForm()
     * Xóa form
     *
     * @previewForm()
     * Xem trước form
     *
     * */
    private final CVFormRepository cvFormRepository;
    private final UserRepository userRepository;

    public CVFormService(
            CVFormRepository cvFormRepository,
            UserRepository userRepository
    ) {
        this.cvFormRepository = cvFormRepository;
        this.userRepository = userRepository;
    }

    public Page<CVFormResponse> getAllCVForm(
            String statusStr,
            String keyword,
            Pageable pageable
    ) {
        FormStatus status = null;

        if (statusStr != null && !statusStr.isBlank()) {
            try {
                status = FormStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + statusStr);
            }
        }

        if (keyword != null) {
            keyword = keyword.trim();
            if (keyword.length() < 2) {
                throw new BadRequestException("Keyword too short");
            }
        }

        Page<CVFormEntity> page =
                cvFormRepository.findAllWithFilter(status, keyword, pageable);

        return page.map(this::toResponse);
    }

    @Transactional
    public CVFormResponse createForm(
            CreateCVFormRequest req,
            Long adminId
    ) {
        if (req.getName() == null || req.getName().isBlank()) {
            throw new BadRequestException("Form name is required");
        }

        if (cvFormRepository.existsByNameIgnoreCase(req.getName())) {
            throw new BadRequestException("Form name already exists");
        }

        FormStatus status;
        try {
            status = FormStatus.valueOf(req.getStatus().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid form status");
        }

        UserEntity admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        CVFormEntity form = new CVFormEntity();
        form.setName(req.getName());
        form.setDescription(req.getDescription());
        form.setStatus(status);
        form.setCreatedBy(admin);

        cvFormRepository.save(form);

        return toResponse(form);
    }

    @Transactional
    public CVFormResponse updateForm(
            Long formId,
            UpdateCVFormRequest req
    ) {
        CVFormEntity form = cvFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("CV Form not found"));

        if (req.getName() == null || req.getName().isBlank()) {
            throw new BadRequestException("Form name is required");
        }

        FormStatus status;
        try {
            status = FormStatus.valueOf(req.getStatus().toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid form status");
        }

        form.setName(req.getName());
        form.setDescription(req.getDescription());
        form.setStatus(status);

        cvFormRepository.save(form);

        return toResponse(form);
    }

    @Transactional
    public void updateStatus(Long formId, String statusStr) {

        CVFormEntity form = cvFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("CV Form not found"));

        if (statusStr == null || statusStr.isBlank()) {
            throw new BadRequestException("Status is required");
        }

        FormStatus status;
        try {
            status = FormStatus.valueOf(statusStr.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status");
        }

        if (form.getStatus() == status) {
            return;
        }

        form.setStatus(status);
        cvFormRepository.save(form);
    }

    @Transactional
    public void deleteForm(Long formId) {

        CVFormEntity form = cvFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("CV Form not found"));

        // CHƯA CÓ CV cho xóa
        // CÓ CV ném ngoại lệ
        if (cvRepository.existsByCvFormId(formId)) {
             throw new BadRequestException("Form already used, cannot delete");
        }

        cvFormRepository.delete(form);
    }

    public CVFormResponse previewForm(Long formId) {
        CVFormEntity form = cvFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("CV Form not found"));
        return toResponse(form);
    }

    private CVFormResponse toResponse(CVFormEntity form) {
        CVFormResponse res = new CVFormResponse();
        res.setId(form.getId());
        res.setName(form.getName());
        res.setDescription(form.getDescription());
        res.setStatus(form.getStatus().name());
        res.setCreatedAt(form.getCreatedAt());
        res.setCreatedBy(form.getCreatedBy().getUsername());
        return res;
    }
}
