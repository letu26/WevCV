package com.webcv.services.admin;

import com.webcv.entity.CvEntity;
import com.webcv.repository.CvsRepository;
import com.webcv.repository.ProjectRepository;
import com.webcv.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final CvsRepository cvsRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private static final ZoneId ZONE = ZoneId.systemDefault();

    private Instant getStart(LocalDate date) {
        return date.atStartOfDay(ZONE).toInstant();
    }

    private Instant getEnd(LocalDate date) {
        return date.plusDays(1).atStartOfDay(ZONE).toInstant();
    }

    public Long getTotalCvs() {
        return cvsRepository.count();
    }

    public Instant getCreatedAtCv(Long id) {

        return cvsRepository.findCreatedAtById(id);
    }

    public List<Long> getRecentCvCreated() {
        return cvsRepository.findRecentCvCreated();
    }

    public List<CvEntity> getTop5RecentCvCreate() {
        return cvsRepository.findTop5ByOrderByCreatedAtDesc();
    }

    public long getMinutesFromCvCreatedAt(Long cvId) {
        Instant createdAt = cvsRepository.findCreatedAtById(cvId);

        if (createdAt == null) {
            throw new RuntimeException("CV not found");
        }

        return Duration.between(createdAt, Instant.now()).toMinutes();
    }

    public long getMinutesFromCvUpdatedAt(Long cvId) {
        Instant updatedAt = cvsRepository.findUpdatedAtById(cvId);

        if (updatedAt == null) {
            throw new RuntimeException("CV not found");
        }

        return Duration.between(updatedAt, Instant.now()).toMinutes();
    }



    public long getMinutesFromProjectCreatedAt(Long projectId) {
        Instant createdAt = projectRepository.findCreatedAtById(projectId);

        if (createdAt == null) {
            throw new RuntimeException("Project not found");
        }

        return Duration.between(createdAt, Instant.now()).toMinutes();
    }

    public long getMinutesFromProjectUpdatedAt(Long projectId) {
        Instant updatedAt = projectRepository.findUpdatedAtById(projectId);

        if (updatedAt == null) {
            throw new RuntimeException("Project not found");
        }

        return Duration.between(updatedAt, Instant.now()).toMinutes();
    }

    public long getMinutesFromUserCreatedAt(Long userId) {
        Instant createdAt = userRepository.findCreatedAtById(userId);

        if (createdAt == null) {
            throw new RuntimeException("User not found");
        }

        return Duration.between(createdAt, Instant.now()).toMinutes();
    }

    public long getMinutesFromUserUpdatedAt(Long userId) {
        Instant updatedAt = userRepository.findUpdatedAtById(userId);

        if (updatedAt == null) {
            throw new RuntimeException("User not found");
        }

        return Duration.between(updatedAt, Instant.now()).toMinutes();
    }

    /*
    public LocalDate getTimeCvExistFromNow(Long id) {
        return cvsRepository.findCreatedAtById(id);
    }*/

    public Long getTotalCvsByDate(LocalDate date) {
        return cvsRepository.countByCreatedAtBetween(
                getStart(date),
                getEnd(date)
        );
    }

    public Long getTotalProjects() {
        return projectRepository.count();
    }

    public Long getTotalProjectsByDate(LocalDate date) {
        return projectRepository.countByCreatedAtBetween(
                getStart(date),
                getEnd(date)
        );
    }

    public Long getTotalUsers() {
        return userRepository.count();
    }

    public Long getTotalUsersByDate(LocalDate date) {
        return userRepository.countByCreatedAtBetween(
                getStart(date),
                getEnd(date)
        );
    }
}
