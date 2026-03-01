package com.webcv.cvpdf.job;

import java.time.Instant;

public record PdfJobInfo(
        String jobId,
        Long cvId,
        PdfJobStatus status,
        String fileName,
        String error,
        Instant createdAt,
        Instant startedAt,
        Instant finishedAt
) {
    public static PdfJobInfo from(PdfJob job) {
        return new PdfJobInfo(
                job.getId().toString(),
                job.getCvId(),
                job.getStatus(),
                job.getFileName(),
                job.getError(),
                job.getCreatedAt(),
                job.getStartedAt(),
                job.getFinishedAt()
        );
    }
}