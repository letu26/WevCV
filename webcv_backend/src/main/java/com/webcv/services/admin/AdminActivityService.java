package com.webcv.services.admin;

import com.webcv.repository.CvsRepository;
import com.webcv.repository.ProjectRepository;
import com.webcv.repository.UserRepository;
import com.webcv.request.admin.RecentActivityRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Service that aggregates recent activities across CV, Project and User.
 */
@Service
@RequiredArgsConstructor
public class AdminActivityService {

    private final CvsRepository cvsRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    /**
     * Returns latest activities sorted by created time.
     */
    public List<RecentActivityRequest> getRecentActivities(int limit) {

        List<RecentActivityRequest> activities = new ArrayList<>();

        cvsRepository.findTop5ByOrderByCreatedAtDesc()
                .forEach(cv -> activities.add(
                        RecentActivityRequest.builder()
                                .type("CV_CREATED")
                                .title("CV ID: " + cv.getId())
                                .minutesAgo(Duration.between(cv.getCreatedAt(), Instant.now()).toMinutes())
                                .build()
                ));

        projectRepository.findTop5ByOrderByCreatedAtDesc()
                .forEach(project -> activities.add(
                        RecentActivityRequest.builder()
                                .type("PROJECT_CREATED")
                                .title(project.getName())
                                .minutesAgo(Duration.between(project.getCreatedAt(), Instant.now()).toMinutes())
                                .build()
                ));

        userRepository.findTop5ByOrderByCreatedAtDesc()
                .forEach(user -> activities.add(
                        RecentActivityRequest.builder()
                                .type("USER_REGISTER")
                                .title(user.getEmail())
                                .minutesAgo(Duration.between(user.getCreatedAt(), Instant.now()).toMinutes())
                                .build()
                ));

        return activities.stream()
                .sorted(Comparator.comparing(RecentActivityRequest::getMinutesAgo))
                .limit(limit)
                .toList();
    }
}
