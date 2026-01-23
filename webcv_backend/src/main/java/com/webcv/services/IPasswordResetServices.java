package com.webcv.services;

import com.webcv.request.CheckOTPRequest;
import com.webcv.request.ResetPasswordRequest;
import com.webcv.response.BaseResponse;
import com.webcv.response.CheckMailResponse;
import com.webcv.response.CheckOTPResponse;

public interface IPasswordResetServices {
    CheckMailResponse checkMail(String emailRequest);
    CheckOTPResponse checkOTP(CheckOTPRequest request);
    BaseResponse resetPassword(ResetPasswordRequest request);
}
