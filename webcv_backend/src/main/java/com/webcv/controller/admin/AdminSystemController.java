package com.webcv.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller to check system health.
 */
@RestController
@RequestMapping("/api/admin/system")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSystemController {

    private final DataSource dataSource;

    /**
     * Method: GET
     * API ENDPOINT: /api/admin/system
     *
     * Kiểm tra sức khỏe của hệ thống:D
     */
    @GetMapping("/status")
    public Map<String, String> getSystemStatus() {

        Map<String, String> status = new HashMap<>();

        try (Connection ignored = dataSource.getConnection()) {
            status.put("database", "CONNECTED");
        } catch (Exception e) {
            status.put("database", "ERROR");
        }

        status.put("api", "ONLINE");
        status.put("timestamp", Instant.now().toString());

        return status;
    }
}
