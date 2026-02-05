package com.webcv.request.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCvFormFieldRequest {

    private String label;

    private String fieldType;

    private Boolean required;

    private Integer orderIndex;
}
