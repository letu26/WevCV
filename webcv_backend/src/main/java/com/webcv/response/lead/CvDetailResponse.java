package com.webcv.response.lead;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
public class CvDetailResponse {

    private Long id;
    private String title;

    private String fullName;
    private String email;
    private String phone;
    private String address;

    private String careerGoal;
    private String additionalInfo;

    private List<ProjectResponse> projects;
    private List<String> skills;
}