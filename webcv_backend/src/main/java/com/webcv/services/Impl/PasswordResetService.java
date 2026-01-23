package com.webcv.services.Impl;

import com.webcv.entity.PasswordResetEntity;
import com.webcv.entity.UserEntity;
import com.webcv.exception.customexception.DataExpiredException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.repository.PasswordResetRepository;
import com.webcv.repository.UserRepository;
import com.webcv.request.CheckOTPRequest;
import com.webcv.request.ResetPasswordRequest;
import com.webcv.response.BaseResponse;
import com.webcv.response.CheckMailResponse;
import com.webcv.response.CheckOTPResponse;
import com.webcv.services.IPasswordResetServices;
import com.webcv.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService implements IPasswordResetServices {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetRepository passwordResetRepository;
    private final MailService mailService;

    @Override
    public CheckMailResponse checkMail(String emailRequest) {
        UserEntity user = userRepository.findByEmail(emailRequest)
                .orElseThrow(() -> new NotFoundException("Email not found"));
        String otp = OtpUtil.generateOtp();
        String hashedOtp = passwordEncoder.encode(otp);

        PasswordResetEntity passwordReset = PasswordResetEntity.builder()
                .user(user)
                .otp(hashedOtp)
                .expiredAt(Instant.now().plus(2, ChronoUnit.MINUTES))
                .used(false)
                .resetToken(null)
                .build();

        passwordResetRepository.save(passwordReset);

        mailService.sendOtpEmail(user.getEmail(), otp);

        return CheckMailResponse.builder()
                .code("201")
                .message("Successfully verified your email address.")
                .userId(user.getId())
                .build();
    }

    @Override
    public CheckOTPResponse checkOTP(CheckOTPRequest request) {
        PasswordResetEntity passwordReset = passwordResetRepository.findByUserIdAndUsedFalseAndExpiredAtAfter(request.getUserId(), Instant.now())
                .orElseThrow(() -> new NotFoundException("OTP not found or be used!"));
        Instant OtpExpire = passwordReset.getExpiredAt();
        if(OtpExpire.isBefore(Instant.now())) {
            throw new DataExpiredException("OPT be expired!");
        }
        if(!passwordEncoder.matches(request.getOtp(), passwordReset.getOtp())){
                throw new DataIntegrityViolationException("Otp incorrect!");
        }

        String resetToken = UUID.randomUUID().toString();
        passwordReset.setResetToken(resetToken);
        passwordReset.setExpiredAt(Instant.now().plus(5, ChronoUnit.MINUTES));
        passwordResetRepository.save(passwordReset);

        return CheckOTPResponse.builder()
                .code("201")
                .message("Successfully verified OPT.")
                .resetToken(resetToken)
                .build();
    }

    @Override
    public BaseResponse resetPassword(ResetPasswordRequest request) {
        if(!request.getNewPassword().equals(request.getRetypeNewPassword())){
            throw new DataIntegrityViolationException("Passwords don't match!");
        }
        PasswordResetEntity passwordReset = passwordResetRepository.findByResetTokenAndUsedFalseAndExpiredAtAfter(request.getResetToken(), Instant.now())
                .orElseThrow(() -> new NotFoundException("ResetToken not found or be used"));
        passwordReset.setUsed(true);
        passwordResetRepository.save(passwordReset);

        UserEntity user = passwordReset.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setChangePasswordAt(Instant.now());
        userRepository.save(user);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully reset your password.")
                .build();
    }
}
