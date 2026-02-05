package com.webcv.request.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCvFormFieldRequest {

    @NotBlank
    private String label;

    @NotBlank
    private String fieldKey;

    @NotBlank
    private String fieldType; // TEXT, NUMBER, DATE, SELECT...

    private Boolean required;

    private Integer orderIndex;
}
