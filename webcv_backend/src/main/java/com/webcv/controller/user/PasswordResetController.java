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

    /**
     * 5. Xác minh email
     * POST /api/forgot/checkmail
     *
     * @CheckMailRequest: String email
     *
     * @CheckMailResponse: Long userId
     *
     * Ví dụ
     * @CheckMailRequest: {“email”: nguyenvana@gmail.com}
     *
     * @CheckMailResponse: {“code”: “201”,
     *                     “message”: “Success fully verified your email address.”,
     *                     “userId”: 3}
     * */
    @PostMapping("/checkmail")
    public ResponseEntity<BaseResponse> checkEmail(@Valid @RequestBody CheckEmailRequest request) {
        BaseResponse response = passwordResetService.checkMail(request.getEmail());

        return ResponseEntity.ok().body(response);
    }

    /**
     * 6. Xác minh OTP
     * POST /api/forgot/checkotp
     *
     * @CheckOTPRequest: Long userId, String otp
     *
     * @CheckOTPRespone: String resetToken
     *
     * Ví dụ
     * @CheckOTPRequest: {“userId”: 3,
     *                   “otp”:”150430”}
     *
     * @CheckOTPRequest: {“code”: “201”,
     *                   “message”: “Successfully verified OPT.”,
     *                   “resetToken”: “bf243807-80af-4629-9b49-b9d34d5a37b3”}
     * */
    @PostMapping("/checkotp")
    public ResponseEntity<CheckOTPResponse> checkOTP(@Valid @RequestBody CheckOTPRequest request) {
        CheckOTPResponse response = passwordResetService.checkOTP(request);

        return ResponseEntity.ok().body(response);
    }

    /**
     * 7. Đặt lại mật khẩu
     * POST /api/forgot/resetpassword
     *
     * @ResetPasswordRequest: String newPassword, String retypeNewPassword, String resetToken
     *
     * Ví dụ
     * @ResetPasswordRequest: {“newPassword”: “12349”,
     *                        “retypeNewPassword”: “12349”,
     *                        “resetToken”: “bf243807-80af-4629-9b49-b9d34d5a37b3”}
     * @ResetPasswordResponse: {“code”: “200”,
     *                         “message”: “Successfully reset your password.”}
     * */
    @PostMapping("/resetpassword")
    public ResponseEntity<BaseResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        BaseResponse response = passwordResetService.resetPassword(request);
        return ResponseEntity.ok().body(response);
    }
}
