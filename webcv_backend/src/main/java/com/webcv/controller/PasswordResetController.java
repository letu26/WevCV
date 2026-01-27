package com.webcv.controller;

import com.webcv.request.CheckEmailRequest;
import com.webcv.request.CheckOTPRequest;
import com.webcv.request.ResetPasswordRequest;
import com.webcv.response.BaseResponse;
import com.webcv.response.CheckOTPResponse;
import com.webcv.services.Impl.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/forgot")
public class PasswordResetController {
    private final PasswordResetService passwordResetService;

    @PostMapping("/checkmail")
    public ResponseEntity<BaseResponse> checkEmail(@Valid @RequestBody CheckEmailRequest request) {
        BaseResponse response = passwordResetService.checkMail(request.getEmail());

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/checkotp")
    public ResponseEntity<CheckOTPResponse> checkOTP(@Valid @RequestBody CheckOTPRequest request) {
        CheckOTPResponse response = passwordResetService.checkOTP(request);

        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/resetpassword")
    public ResponseEntity<BaseResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        BaseResponse response = passwordResetService.resetPassword(request);
        return ResponseEntity.ok().body(response);
    }
}
