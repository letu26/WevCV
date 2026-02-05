package com.webcv.services.admin;

import com.webcv.entity.CvFormEntity;
import com.webcv.entity.CvFormFieldEntity;
import com.webcv.repository.CvFormRepository;
import com.webcv.repository.CvFormFieldRepository;
import com.webcv.request.admin.CreateCvFormFieldRequest;
import com.webcv.request.admin.UpdateCvFormFieldRequest;
import com.webcv.response.admin.CvFormFieldResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CvFormFieldService {

    private final CvFormRepository cvFormRepository;
    private final CvFormFieldRepository fieldRepository;

    // 18. Get fields
    public List<CvFormFieldResponse> getCvFormFieldsByCvForm(Long formId) {

        return fieldRepository
                .findByCvFormIdOrderByOrderIndexAsc(formId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // 19. Add field
    public void addCvFormField(Long formId, CreateCvFormFieldRequest request) {

        CvFormEntity form = cvFormRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        if (fieldRepository.existsByCvFormIdAndFieldKey(formId, request.getFieldKey())) {
            throw new RuntimeException("Field key already exists in this form");
        }

        CvFormFieldEntity field = CvFormFieldEntity.builder()
                .cvForm(form)
                .label(request.getLabel())
                .fieldKey(request.getFieldKey())
                .fieldType(request.getFieldType())
                .required(Boolean.TRUE.equals(request.getRequired()))
                .orderIndex(request.getOrderIndex())
                .build();

        fieldRepository.save(field);
    }

    // 20. Update field
    public void updateField(Long fieldId, UpdateCvFormFieldRequest request) {

        CvFormFieldEntity field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new RuntimeException("Field not found"));

        if (request.getLabel() != null)
            field.setLabel(request.getLabel());

        if (request.getFieldType() != null)
            field.setFieldType(request.getFieldType());

        if (request.getRequired() != null)
            field.setRequired(request.getRequired());

        if (request.getOrderIndex() != null)
            field.setOrderIndex(request.getOrderIndex());

        fieldRepository.save(field);
    }

    // 21. Delete field
    public void deleteField(Long fieldId) {

        if (!fieldRepository.existsById(fieldId)) {
            throw new RuntimeException("Field not found");
        }

        fieldRepository.deleteById(fieldId);
    }

    private CvFormFieldResponse mapToResponse(CvFormFieldEntity field) {
        return CvFormFieldResponse.builder()
                .id(field.getId())
                .label(field.getLabel())
                .fieldKey(field.getFieldKey())
                .fieldType(field.getFieldType())
                .required(field.getRequired())
                .orderIndex(field.getOrderIndex())
                .build();
        /*
        *
        * java: cannot find symbol
  symbol:   method builder()
  location: class com.webcv.response.admin.CvFormFieldResponse
        * */
    }
}

