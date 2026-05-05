package com.webcv.controller.admin;

import com.webcv.enums.RangeType;
import com.webcv.request.admin.RecentActivityRequest;
import com.webcv.response.admin.DashboardResponse;
import com.webcv.services.admin.AdminActivityService;
import com.webcv.services.admin.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.TimeoutException;

/**
 * Controller chính cho Admin Dashboard
 * Cung cấp những thống kê tổng quan, biểu đồ và hoạt động gần đây
 */
@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService dashboardService;
    private final AdminActivityService activityService;

    /**
     * Methos: GET
     * API ENDPOINT: /api/admin/dashboard/
     *
     * Trả về thông tin Dashboard tổng quan
     *
     * @param range Time range (DAY, WEEK, MONTH) - Mặc định: range = DAY
     * @return DashboardResponse:
     *          1. SummaryRequest summary;
     *              + Long totalCvs;
     *              + Long totalProjects;
     *              + Long totalUsers;
     *              + Long newCvsToday;
     *              + Double cvGrowthPercent;
     *          2. List<ChartPointRequest> cvChart;
     *          3. List<ChartPointRequest> projectChart;
     *          4. List<ChartPointRequest> userChart;
     *             ChartPointRequest(String date, Long count)
     */
    private int attempt = 0;

    @GetMapping
    @Retryable(value = TimeoutException.class, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public DashboardResponse getDashboard(
            @RequestParam(defaultValue = "DAY") RangeType range
    ) throws TimeoutException {
        attempt ++;
        System.out.println("Attempt #" + attempt);

        if ((attempt > 1) && (attempt < 5)) {
            System.out.println("Simulate time out error");
            throw new TimeoutException("Time out occurred");
        }
        System.out.println("Successful!");

        return dashboardService.getDashboard(range);
    }

    /**
     * Method: GET
     * API ENDPOINT: /api/admin/dashboard/recent-activities
     *
     * Trả về các hoạt dộng gần đây
     *
     * @param limit number of records - mặc định limit = 5
     * @return List<RecentActivityRequest>
     *          ReentActivityRequest:
     *              1. String type;
     *              2. String title;
     *              3. Long minutesAgo;
     */
    @GetMapping("/recent-activities")
    public List<RecentActivityRequest> getRecentActivities(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return activityService.getRecentActivities(limit);
    }
}
