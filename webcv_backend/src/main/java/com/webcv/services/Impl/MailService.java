package com.webcv.services.Impl;

import com.webcv.services.IMailServices;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import static com.webcv.util.MailUtil.buildOtpContent;


@Service
@RequiredArgsConstructor
public class MailService implements IMailServices {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Reset Password - OTP Code");
            message.setText(buildOtpContent(otp));

            mailSender.send(message);
        }
        catch (MailException e) {
            System.err.println(e.getMessage());
            throw new MailSendException("Mail Exception: " + e.getMessage());
        }
    }
}
