package com.webcv.cvpdf.job;

import com.webcv.exception.customexception.ForbiddenException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.exception.customexception.ServiceUnavailableException;
import com.webcv.services.user.Impl.CvsService;
import com.webcv.services.user.Impl.PdfService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
@Slf4j
public class PdfJobQueueService {

    private static final Duration DEFAULT_TTL = Duration.ofMinutes(30);
    private static final int DEFAULT_QUEUE_CAPACITY = 150;

    private final CvsService cvsService;
    private final PdfService pdfService;

    private final Map<UUID, PdfJob> jobs = new ConcurrentHashMap<>();
    private final Duration jobTtl = DEFAULT_TTL;
    private final Path jobsDir = Paths.get(System.getProperty("java.io.tmpdir"), "webcv-pdf-jobs");

    private final ThreadPoolExecutor executor = new ThreadPoolExecutor(
            1,
            1,
            0L,
            TimeUnit.MILLISECONDS,
            new ArrayBlockingQueue<>(DEFAULT_QUEUE_CAPACITY),
            new ThreadFactory() {
                private final AtomicInteger idx = new AtomicInteger(1);

                @Override
                public Thread newThread(Runnable r) {
                    Thread t = new Thread(r);
                    t.setName("pdf-job-worker-" + idx.getAndIncrement());
                    t.setDaemon(true);
                    return t;
                }
            },
            new ThreadPoolExecutor.AbortPolicy()
    );

    public PdfJob enqueueCvPdf(Long cvId, Long userId) {
        ensureJobsDir();
        cleanupExpiredJobs();

        // Validate ownership early (fast fail) and fetch title for the filename.
        var cv = cvsService.getCvForUser(cvId, userId);

        UUID jobId = UUID.randomUUID();
        String titleSlug = toSafeSlug(cv.getTitle());
        String downloadFileName = titleSlug + "-" + jobId + ".pdf";
        Path filePath = jobsDir.resolve(jobId + ".pdf");

        PdfJob job = new PdfJob(jobId, cvId, userId, downloadFileName, filePath);
        jobs.put(jobId, job);

        try {
            executor.execute(() -> runJob(jobId));
        } catch (RejectedExecutionException e) {
            jobs.remove(jobId);
            throw new ServiceUnavailableException("PDF queue is full. Please try again later.");
        }

        return job;
    }

    public PdfJob getJobForUser(UUID jobId, Long userId) {
        cleanupExpiredJobs();
        PdfJob job = jobs.get(jobId);
        if (job == null) {
            throw new NotFoundException("PDF job not found");
        }
        if (!job.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not have access to this job");
        }
        return job;
    }

    public void removeJob(UUID jobId) {
        jobs.remove(jobId);
    }

    public void deleteJobFileAndRemove(UUID jobId) {
        PdfJob job = jobs.get(jobId);
        if (job == null) {
            return;
        }
        try {
            Files.deleteIfExists(job.getFilePath());
        } catch (Exception e) {
            log.warn("Failed to delete PDF job file: {}", job.getFilePath(), e);
        } finally {
            jobs.remove(jobId);
        }
    }

    private void runJob(UUID jobId) {
        PdfJob job = jobs.get(jobId);
        if (job == null) {
            return;
        }

        job.markRunning();

        try {
            // Fetch CV data at execution time (avoid keeping large JSON strings in the queue closure).
            var cv = cvsService.getCvForUser(job.getCvId(), job.getUserId());

            // Render directly to a temp file on disk.
            pdfService.renderCvPdfToFile(cv, job.getFilePath());

            job.markDone();
        } catch (Exception e) {
            job.markFailed(shortError(e));
            try {
                Files.deleteIfExists(job.getFilePath());
            } catch (Exception ignored) {
            }
        }
    }

    private void ensureJobsDir() {
        try {
            Files.createDirectories(jobsDir);
        } catch (Exception e) {
            throw new ServiceUnavailableException("Cannot create temp directory for PDF export");
        }
    }

    private void cleanupExpiredJobs() {
        Instant now = Instant.now();
        for (Map.Entry<UUID, PdfJob> entry : jobs.entrySet()) {
            PdfJob job = entry.getValue();
            if (job == null) {
                continue;
            }

            boolean finished = job.getStatus() == PdfJobStatus.DONE || job.getStatus() == PdfJobStatus.FAILED;
            if (!finished) {
                continue;
            }

            Instant finishedAt = job.getFinishedAt();
            if (finishedAt == null) {
                continue;
            }

            if (Duration.between(finishedAt, now).compareTo(jobTtl) > 0) {
                deleteJobFileAndRemove(entry.getKey());
            }
        }
    }

    private static String shortError(Exception e) {
        String msg = e.getMessage();
        if (msg == null || msg.isBlank()) {
            return e.getClass().getSimpleName();
        }
        msg = msg.replaceAll("[\\r\\n]+", " ").trim();
        return msg.length() > 200 ? msg.substring(0, 200) : msg;
    }

    private static String toSafeSlug(String title) {
        String t = title == null ? "" : title.trim();
        if (t.isBlank()) {
            return "cv";
        }
        String out = t.replaceAll("\\s+", "-");
        out = out.replaceAll("[\\r\\n]+", "");
        out = out.replaceAll("[\\\\/:*?\"<>|]+", "");
        out = out.replaceAll("[^\\p{L}\\p{N}._-]+", "-");
        out = out.replaceAll("-{2,}", "-");
        out = out.replaceAll("^-+", "").replaceAll("-+$", "");
        if (out.isBlank()) {
            out = "cv";
        }
        return out.length() > 60 ? out.substring(0, 60) : out;
    }
}