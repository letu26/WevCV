package com.webcv.services.user;

public interface IMailServices {
    void sendOtpEmail(String toEmail, String otp);
}
