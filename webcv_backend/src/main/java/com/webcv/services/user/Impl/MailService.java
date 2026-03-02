package com.webcv.services.user.Impl;

import com.webcv.services.user.IMailServices;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import static com.webcv.util.MailUtil.buildOtpContent;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService implements IMailServices {

    private static final int DEFAULT_QUEUE_CAPACITY = 200;

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

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
                    t.setName("mail-queue-worker-" + idx.getAndIncrement());
                    t.setDaemon(true);
                    return t;
                }
            },
            new ThreadPoolExecutor.AbortPolicy()
    );

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reset Password - OTP Code");
        message.setText(buildOtpContent(otp));

        try {
            executor.execute(() -> sendWithSmtp(message));
        } catch (RejectedExecutionException e) {
            throw new MailSendException("Mail queue is full. Please try again later.", e);
        }
    }

    private void sendWithSmtp(SimpleMailMessage message) {
        try {
            mailSender.send(message);
        } catch (MailException e) {
            log.error("SMTP mail send failed: {}", e.getMessage(), e);
        }
    }
}
