package com.webcv.util;

public class MailUtil {
    public static String buildOtpContent(String otp) {
        return """
                Hello,

                Your OTP code to reset password is: %s

                This OTP is valid for 5 minutes.
                Please do not share this code with anyone.

                Regards,
                WebCV System
                """.formatted(otp);
    }
}
