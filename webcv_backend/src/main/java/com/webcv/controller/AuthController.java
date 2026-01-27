package com.webcv.controller;

import com.webcv.exception.customexception.PasswordNotMatchException;
import com.webcv.request.ChangePassRequest;
import com.webcv.request.LoginRequest;
import com.webcv.request.RefreshTokenRequest;
import com.webcv.request.RegisterRequest;
import com.webcv.response.BaseResponse;
import com.webcv.response.LoginResponse;
import com.webcv.response.RefreshTokenResponse;
import com.webcv.services.IAuthServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IAuthServices userServices;
    //
    @PostMapping("/register")
    public ResponseEntity<BaseResponse> createUser(
            @Valid @RequestBody RegisterRequest userRequest) {
        if(!userRequest.getPassword().equals(userRequest.getRetypePassword())){
            throw new PasswordNotMatchException("Passwords don't match");
        }
        BaseResponse response = userServices.createUser(userRequest);
        return ResponseEntity.ok().body(response);
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest) {

        LoginResponse response = userServices.login(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest refreshTokenRequest
    ){
        RefreshTokenResponse response = userServices.refreshToken(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/changepass")
    public ResponseEntity<BaseResponse> changePassword(
            @Valid @RequestBody ChangePassRequest request
    ){
        if(!request.getNewPassword().equals(request.getRetypeNewPassword())){
            throw new PasswordNotMatchException("Passwords don't match");
        }
        BaseResponse response = userServices.changePass(request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok().body(response);
    }
}
