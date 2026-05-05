package com.webcv.controller.admin;

import com.webcv.entity.CvEntity;
import com.webcv.services.admin.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.TimeoutException;

@RestController
@RequestMapping("/api/admin/statistics")
public class StatisticsController {
    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {

        this.statisticsService = statisticsService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cv/{id}")
    public Instant getCreatedAt_Cv(
            @PathVariable Long id
            ) {
        return statisticsService.getCreatedAtCv(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cv/{id}/exist/minutes")
    public Long getTimeCvExistFromNow(
            @PathVariable Long id
    ) {
        return statisticsService.getMinutesFromCvCreatedAt(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cv/{id}/update/minutes")
    public Long getTimeCvUpdateFromNow(
            @PathVariable Long id
    ) {
        return statisticsService.getMinutesFromCvUpdatedAt(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cvs/create/recent")
    public ResponseEntity<?> getRecentCvCreated() {
        List<Long> ids = statisticsService.getRecentCvCreated();
        return ResponseEntity.ok(ids);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cvs/create/recent/newest-cv")
    public ResponseEntity<?> getTop5RecentCvCreate() {
        List<CvEntity> ids = statisticsService.getTop5RecentCvCreate();
        return ResponseEntity.ok(ids);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/project/{id}/exist/minutes")
    public Long getTimeProjectExistFromNow(
            @PathVariable Long id
    ) {
        return statisticsService.getMinutesFromProjectCreatedAt(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/project/{id}/update/minutes")
    public Long getTimeProjectUpdateFromNow(
            @PathVariable Long id
    ) {
        return statisticsService.getMinutesFromProjectUpdatedAt(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{id}/exist/minutes")
    public Long getTimeUserExistFromNow(
            @PathVariable Long id
    ) {
        return statisticsService.getMinutesFromUserCreatedAt(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{id}/update/minutes")
    public Long getTimeUserUpdateFromNow(
            @PathVariable Long id
    ) {
        return statisticsService.getMinutesFromUserUpdatedAt(id);
    }

    private int attempt = 0;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cvs")
    @Retryable(value = TimeoutException.class, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public long getTotalCvs(
            @RequestParam(required = false) LocalDate day
    ) throws TimeoutException {
        attempt++;
        System.out.println("Attempt #" + attempt);

        // Giả lập lỗi timeout trong lần thử đầu tiên
        if (attempt < 3) {
            System.out.println("Simulating timeout error...");
            throw new TimeoutException("Timeout occurred");
        }

        // Giả lập thành công sau retry
        System.out.println("Successfully fetched total CVs");
        if (day == null) {
            return statisticsService.getTotalCvs();
        } else {
            return statisticsService.getTotalCvsByDate(day);
        }
    }


/*
public Long getTotalCvs(
            @RequestParam(required = false) LocalDate day
    ) {
        if (day == null) {
            return statisticsService.getTotalCvs();
        } else {
            return statisticsService.getTotalCvsByDate(day);
        }
    }
*/
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/projects")
    public Long getTotalProjects(
            @RequestParam(required = false) LocalDate day
    ) {
        if (day == null) {
            return statisticsService.getTotalProjects();
        } else {
            return statisticsService.getTotalProjectsByDate(day);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public Long getTotalUsers(
            @RequestParam(required = false) LocalDate day
    ) {
        if (day == null) {
            return statisticsService.getTotalUsers();
        } else {
            return statisticsService.getTotalUsersByDate(day);

        }
    }
/*
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cvs")
    public Long getTotalCvs() {

        return statisticsService.getTotalCvs();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cvs?day=")
    public Long getTotalCvsByDate(
            @RequestParam Instant day
    ) {
       LocalDate localDate = day.atZone(ZoneId.systemDefault()).toLocalDate();
       return statisticsService.getTotalCvsByDate(localDate);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/projects")
    public Long getTotalProjects() {

        return statisticsService.getTotalProjects();
    }

    @GetMapping("/projects?day=")
    @PreAuthorize("hasRole('ADMIN')")
    public Long getTotalProjectsByDay(
            @RequestParam Instant day
    ) {
        LocalDate localDate = day.atZone(ZoneId.systemDefault()).toLocalDate();
        return statisticsService.getTotalProjectsByDate(localDate);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public Long getTotalUsers() {

        return statisticsService.getTotalUsers();
    }

    @GetMapping("/users?day=")
    @PreAuthorize("hasRole('ADMIN')")
    public Long getTotalUsersByDay(
            @RequestParam Instant day
    ) {
        LocalDate localDate = day.atZone(ZoneId.systemDefault()).toLocalDate();
        return statisticsService.getTotalUsersByDate(localDate);
    }*/

}
/*@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/cvs/today")
    public Long getTotalCvsByToday() {
        Instant todayInstant = Instant.now();
        LocalDate todayLocalDate = todayInstant.atZone(ZoneId.systemDefault()).toLocalDate();
        return statisticsService.getTotalCvsByDate(todayLocalDate);
    }*/