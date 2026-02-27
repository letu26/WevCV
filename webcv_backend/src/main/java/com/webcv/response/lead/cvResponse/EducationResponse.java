package com.webcv.response.lead.cvResponse;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EducationResponse {
    private String id;
    private String school;
    private String major;
    private String start;
    private String end;
    private String description;
}