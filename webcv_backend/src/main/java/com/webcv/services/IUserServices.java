package com.webcv.services;


import com.webcv.request.RegisterRequest;
import com.webcv.entity.UserEntity;
import com.webcv.response.LoginResponse;

public interface IUserServices {
    UserEntity createUser(RegisterRequest userDTO);
    LoginResponse login(String username, String password);
}
