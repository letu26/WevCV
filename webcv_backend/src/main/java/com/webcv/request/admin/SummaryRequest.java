package com.webcv.request.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SummaryRequest {

    private Long totalCvs;
    private Long totalProjects;
    private Long totalUsers;

    private Long newCvsToday;
    private Double cvGrowthPercent;
}
