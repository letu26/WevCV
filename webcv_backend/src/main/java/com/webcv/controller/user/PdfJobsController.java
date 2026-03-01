package com.webcv.controller.user;

import com.webcv.cvpdf.job.PdfJob;
import com.webcv.cvpdf.job.PdfJobInfo;
import com.webcv.cvpdf.job.PdfJobQueueService;
import com.webcv.enums.PdfJobStatus;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.response.user.BaseResponse;
import com.webcv.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/pdf-jobs")
public class PdfJobsController {

    @Value("${jwt.access.secret}")
    private String jwtSecret;

    private final JwtTokenUtil jwtTokenUtil;
    private final PdfJobQueueService pdfJobQueueService;

    @GetMapping("/{jobId}")
    public ResponseEntity<BaseResponse<PdfJobInfo>> getJob(
            @PathVariable("jobId") String jobId,
            @RequestHeader("Authorization") String authorizationHeader) {

        Long userId = extractUserId(authorizationHeader);
        UUID id = parseJobId(jobId);
        PdfJob job = pdfJobQueueService.getJobForUser(id, userId);

        return ResponseEntity.ok(
                BaseResponse.<PdfJobInfo>builder()
                        .code("200")
                        .message("OK")
                        .data(PdfJobInfo.from(job))
                        .build()
        );
    }

    @GetMapping("/{jobId}/download")
    public ResponseEntity<StreamingResponseBody> download(
            @PathVariable("jobId") String jobId,
            @RequestHeader("Authorization") String authorizationHeader) {

        Long userId = extractUserId(authorizationHeader);
        UUID id = parseJobId(jobId);
        PdfJob job = pdfJobQueueService.getJobForUser(id, userId);

        if (job.getStatus() != PdfJobStatus.DONE) {
            throw new BadRequestException("PDF is not ready");
        }

        Path path = job.getFilePath();
        if (!Files.exists(path)) {
            throw new NotFoundException("PDF file not found");
        }

        long size = -1;
        try {
            size = Files.size(path);
        } catch (Exception ignored) {
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(job.getFileName(), StandardCharsets.UTF_8)
                        .build()
        );
        if (size >= 0) {
            headers.setContentLength(size);
        }

        StreamingResponseBody body = outputStream -> {
            boolean completed = false;
            try (InputStream in = Files.newInputStream(path)) {
                in.transferTo(outputStream);
                outputStream.flush();
                completed = true;
            } finally {
                // Only cleanup if the download finished (so the user can retry if the connection drops).
                if (completed) {
                    pdfJobQueueService.deleteJobFileAndRemove(id);
                }
            }
        };

        return ResponseEntity.ok()
                .headers(headers)
                .body(body);
    }

    private Long extractUserId(String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        return (Long) jwtTokenUtil.extractUserId(token, jwtSecret);
    }

    private static UUID parseJobId(String jobId) {
        try {
            return UUID.fromString(jobId);
        } catch (Exception e) {
            throw new BadRequestException("Invalid job id");
        }
    }
}