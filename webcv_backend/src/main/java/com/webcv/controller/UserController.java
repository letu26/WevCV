package com.webcv.controller;

import com.webcv.request.LoginRequest;
import com.webcv.request.RefreshTokenRequest;
import com.webcv.request.RegisterRequest;
import com.webcv.response.BaseResponse;
import com.webcv.response.LoginResponse;
import com.webcv.response.RefreshTokenResponse;
import com.webcv.services.IUserServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final IUserServices userServices;

    @PostMapping("/register")
    public ResponseEntity<BaseResponse> createUser(
            @Valid @RequestBody RegisterRequest userRequest) {

        userServices.createUser(userRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.builder()
                        .code("201")
                        .message("Register successfully")
                        .build());
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
}
