package com.webcv.response.admin;

import com.webcv.request.admin.ChartPointRequest;
import com.webcv.request.admin.SummaryRequest;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {

    private SummaryRequest summary;
    private List<ChartPointRequest> cvChart;
    private List<ChartPointRequest> projectChart;
    private List<ChartPointRequest> userChart;
}
