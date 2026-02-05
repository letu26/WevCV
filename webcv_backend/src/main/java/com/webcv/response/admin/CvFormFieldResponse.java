package com.webcv.response.admin;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CvFormFieldResponse {

    private Long id;
    private String label;
    private String fieldKey;
    private String fieldType;
    private Boolean required;
    private Integer orderIndex;
}
