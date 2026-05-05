package com.webcv.services.admin;

import com.webcv.enums.RangeType;
import com.webcv.repository.CvsRepository;
import com.webcv.repository.ProjectRepository;
import com.webcv.repository.UserRepository;
import com.webcv.request.admin.ChartPointRequest;
import com.webcv.request.admin.SummaryRequest;
import com.webcv.response.admin.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Service responsible for building admin dashboard data.
 * Handles summary calculation and chart aggregation.
 */
@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final CvsRepository cvsRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private static final ZoneId ZONE = ZoneId.systemDefault();

    /**
     * Main method to build full dashboard response.
     */
    public DashboardResponse getDashboard(RangeType range) {

        return DashboardResponse.builder()
                .summary(buildSummary())
                .cvChart(buildChart(range, "CV"))
                .projectChart(buildChart(range, "PROJECT"))
                .userChart(buildChart(range, "USER"))
                //.todayCvsCountByTime(todayCvsCountByTime)
                .build();
    }

    /**
     * Builds summary section including totals and growth rate.
     */
    private SummaryRequest buildSummary() {

        Long totalCvs = cvsRepository.count();
        Long totalProjects = projectRepository.count();
        Long totalUsers = userRepository.count();

        //TODO: Uncomment later ...
        LocalDate today = LocalDate.now(); // trả về ngày hiện tại - ví dụ 2026-04-30

        Instant startToday = today.atStartOfDay(ZONE).toInstant(); // trả về thời điểm bắt đầu 1 ngày 2026-04-30T00:00:00
        Instant endToday = today.plusDays(1).atStartOfDay(ZONE).toInstant();

        // Nếu là ngáy hôm nay đồ thị không biểu diễn theo ngày nữa do đồ thị có mỗi một điểm trông trống trải quá =))
        // Biểu diễn tại mổi điểm tính từ thời điểm hiệm tại lùi đi 2 giờ
/*
        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime startOfPeriod = now.truncatedTo(ChronoUnit.HOURS);

        int hoursToCover = now.getHour();
        int steps = hoursToCover / 2 + 1;
        Long[] todayCvsCountByTime = new Long[steps];

        for (int i = 0; i < steps; i++) {
            ZonedDateTime start = startOfPeriod.minusHours(2);

            // Đếm trong khoảng [start, startOfPeriod]
            todayCvsCountByTime[i] = cvsRepository.countByCreatedAtBetween(
                    start.toInstant(),
                    startOfPeriod.toInstant()
            );

            // Cập nhật lại mốc để lùi tiếp về quá khứ
            startOfPeriod = start;
        }
*/
        Long todayCvs = cvsRepository.countByCreatedAtBetween(startToday, endToday);

        Long yesterdayCvs = cvsRepository.countByCreatedAtBetween(
                startToday.minus(1, ChronoUnit.DAYS),
                startToday
        );

        double growthPercent = yesterdayCvs == 0
                ? 100
                : ((double) (todayCvs - yesterdayCvs) / yesterdayCvs) * 100;

        return SummaryRequest.builder()
                .totalCvs(totalCvs)
                .totalProjects(totalProjects)
                .totalUsers(totalUsers)
                .newCvsToday(todayCvs)
                .cvGrowthPercent(growthPercent)
                //.todayCvsCountByTime(todayCvsCountByTime)
                .build();
    }

    /**
     * Builds chart data for CV, Project or User.
     */
    private List<ChartPointRequest> buildChart(RangeType range, String type) {

        int days = switch (range) {
            case DAY -> 1;
            case WEEK -> 7;
            case MONTH -> 30;
            case YEAR -> 365;
        };

        List<ChartPointRequest> result = new ArrayList<>();

        for (int i = days - 1; i >= 0; i--) {

            LocalDate date = LocalDate.now().minusDays(i);

            Instant start = date.atStartOfDay(ZONE).toInstant();
            Instant end = date.plusDays(1).atStartOfDay(ZONE).toInstant();

            Long count = switch (type) {
                case "CV" -> cvsRepository.countByCreatedAtBetween(start, end);
                case "PROJECT" -> projectRepository.countByCreatedAtBetween(start, end);
                case "USER" -> userRepository.countByCreatedAtBetween(start, end);
                default -> 0L;
            };

            result.add(new ChartPointRequest(date.toString(), count));
        }

        return result;
    }
}
