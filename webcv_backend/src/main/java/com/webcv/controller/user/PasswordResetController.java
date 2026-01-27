package com.webcv.controller.user;

import com.webcv.request.user.CheckEmailRequest;
import com.webcv.request.user.CheckOTPRequest;
import com.webcv.request.user.ResetPasswordRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CheckOTPResponse;
import com.webcv.services.user.Impl.PasswordResetService;
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
