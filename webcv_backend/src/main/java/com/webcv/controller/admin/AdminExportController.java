package com.webcv.controller.admin;

import com.webcv.repository.CvsRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * Controller for exporting reports.
 */
@RestController
@RequestMapping("/api/admin/export")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminExportController {

    private final CvsRepository cvsRepository;

    /**
     * Trích thông tin cv
     */
    @GetMapping("/cvs")
    public void exportCvs(HttpServletResponse response) throws IOException, IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=cvs.csv");

        PrintWriter writer = response.getWriter();
        writer.println("ID,CreatedAt");

        cvsRepository.findAll()
                .forEach(cv ->
                        writer.println(cv.getId() + "," + cv.getCreatedAt())
                );

        writer.flush();
    }
}
