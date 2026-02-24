package com.webcv.services.user;

import com.webcv.request.user.CheckOTPRequest;
import com.webcv.request.user.ResetPasswordRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CheckMailResponse;
import com.webcv.response.user.CheckOTPResponse;

public interface IPasswordResetServices {
    CheckMailResponse checkMail(String emailRequest);
    CheckOTPResponse checkOTP(CheckOTPRequest request);
    BaseResponse<Void> resetPassword(ResetPasswordRequest request);
}
