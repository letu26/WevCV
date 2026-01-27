package com.webcv.services.user;

import com.webcv.request.CheckOTPRequest;
import com.webcv.request.ResetPasswordRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CheckMailResponse;
import com.webcv.response.user.CheckOTPResponse;

public interface IPasswordResetServices {
    CheckMailResponse checkMail(String emailRequest);
    CheckOTPResponse checkOTP(CheckOTPRequest request);
    BaseResponse resetPassword(ResetPasswordRequest request);
}
