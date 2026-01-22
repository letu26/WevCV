package com.webcv.services;


import com.webcv.request.RegisterRequest;
import com.webcv.entity.UserEntity;
import com.webcv.response.LoginResponse;
import com.webcv.response.RefreshTokenResponse;

public interface IUserServices {
    UserEntity createUser(RegisterRequest request);
    LoginResponse login(String username, String password);
    RefreshTokenResponse refreshToken(String refreshToken);
}
