package com.webcv.response.lead.cvResponse;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
public class CvDetailResponse {

    private Long id;
    private String title;

    // ===== BUSINESS CARD =====
    private String fullName;
    private String position;

    // ===== AVATAR =====
    private String avatar;

    // ===== PROFILE =====
    private String email;
    private String phone;
    private String address;
    private String dob;
    private String gender;

    // ===== CAREER =====
    private String longTerm;
    private String shortTerm;

    // ===== SKILLS =====
    private List<SkillResponse> skills;

    // ===== EDUCATION =====
    private List<EducationResponse> educations;

    // ===== EXPERIENCE =====
    private List<JobResponse> jobs;

    // ===== CERTIFICATE =====
    private List<CertificateResponse> certificates;

    // ===== AWARD =====
    private List<AwardResponse> awards;

    // ===== ACTIVITY =====
    private List<ActivityResponse> activities;
}