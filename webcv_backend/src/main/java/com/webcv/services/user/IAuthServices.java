package com.webcv.services.user;


import com.webcv.request.user.RegisterRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.LoginResponse;
import com.webcv.response.user.RefreshTokenResponse;

public interface IAuthServices {
    BaseResponse<Void> createUser(RegisterRequest request);
    LoginResponse login(String username, String password);
    RefreshTokenResponse refreshToken(String refreshToken);
    BaseResponse<Void> changePass(String oldPassword, String newPassword);
}
