package com.webcv.cvpdf.job;

import com.webcv.enums.PdfJobStatus;
import lombok.Getter;

import java.nio.file.Path;
import java.time.Instant;
import java.util.UUID;

@Getter
public class PdfJob {
    private final UUID id;
    private final Long cvId;
    private final Long userId;
    private final String fileName;
    private final Path filePath;
    private final Instant createdAt;

    private volatile PdfJobStatus status;
    private volatile String error;
    private volatile Instant startedAt;
    private volatile Instant finishedAt;

    public PdfJob(UUID id, Long cvId, Long userId, String fileName, Path filePath) {
        this.id = id;
        this.cvId = cvId;
        this.userId = userId;
        this.fileName = fileName;
        this.filePath = filePath;
        this.createdAt = Instant.now();
        this.status = PdfJobStatus.QUEUED;
    }

    void markRunning() {
        this.status = PdfJobStatus.RUNNING;
        this.startedAt = Instant.now();
    }

    void markDone() {
        this.status = PdfJobStatus.DONE;
        this.finishedAt = Instant.now();
    }

    void markFailed(String message) {
        this.status = PdfJobStatus.FAILED;
        this.error = message;
        this.finishedAt = Instant.now();
    }
}