package com.webcv.controller.user;

import com.webcv.entity.IdempotencyRecord;
import com.webcv.exception.customexception.PasswordNotMatchException;
import com.webcv.request.user.ChangePassRequest;
import com.webcv.request.user.LoginRequest;
import com.webcv.request.user.RefreshTokenRequest;
import com.webcv.request.user.RegisterRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.LoginResponse;
import com.webcv.response.user.RefreshTokenResponse;
import com.webcv.services.user.IAuthServices;
import com.webcv.services.user.Impl.IdempotencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IAuthServices userServices;
    private final IdempotencyService idempotencyService;

    /**
     * 1. Đăng ký tài khoàn
     * POST /api/auth/register
     *
     * @RegisterRequest: String username, String password, List<String> roles, String status, String email, String fullname
     */
    @PostMapping("/register")
    public ResponseEntity<BaseResponse<?>> createUser(
            @Valid @RequestBody RegisterRequest userRequest,
            @RequestHeader(value = "Idempotency-Key", required = false) String key
    ) {

        if (key == null || key.isEmpty()) {
            if(!userRequest.getPassword().equals(userRequest.getRetypePassword())){
                throw new PasswordNotMatchException("Passwords don't match");
            }
            BaseResponse response = userServices.createUser(userRequest);
            return ResponseEntity.ok(response);
            //throw new RuntimeException("Missing Idempotency-Key");
        }

            Optional<IdempotencyRecord> existing = idempotencyService.get(key);

            if (existing.isPresent()) {
                System.out.println("Idempotency hit (register)");

                BaseResponse<?> cached =
                        idempotencyService.parseResponse(existing.get().getResponseBody());

                return ResponseEntity.ok(cached);
            }

            if (!userRequest.getPassword().equals(userRequest.getRetypePassword())) {
                throw new PasswordNotMatchException("Passwords don't match");
            }

            BaseResponse response = userServices.createUser(userRequest);

            idempotencyService.save(key, response);

            return ResponseEntity.ok(response);

    }
    /*
    @PostMapping("/register")
    public ResponseEntity<BaseResponse> createUser(
            @Valid @RequestBody RegisterRequest userRequest) {
        if(!userRequest.getPassword().equals(userRequest.getRetypePassword())){
            throw new PasswordNotMatchException("Passwords don't match");
        }
        BaseResponse response = userServices.createUser(userRequest);
        return ResponseEntity.ok().body(response);
    }*/


    /**
     * 2. Đăng nhập tài khoản
     * POST /api/auth/login
     *
     * @LoginRequest: String username, String password
     *
     * @LoginResponse: String accessToken, String refreshToken, List<String> role
     * */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest loginRequest) {

        LoginResponse response = userServices.login(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * 3. Làm mới mã truy cập
     * POST /api/auth/refresh
     *
     * @RefreshTokenRequest: String refreshToken
     *
     * @RefreshTokenResponse: String accessToken
     * */
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest refreshTokenRequest
    ){
        RefreshTokenResponse response = userServices.refreshToken(refreshTokenRequest.getRefreshToken());
        return ResponseEntity.ok().body(response);
    }

    /**
     * 4. Thay đổi mật khẩu
     * POST /api/auth/changepass
     *
     * @ChangePassRequest: String oldPassword, String newPassword, String retypeNewPassword
     * */
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

    @PostMapping("/logout")
    public ResponseEntity<BaseResponse> logOut() {
        BaseResponse response = new BaseResponse("200", "Logout successful", null);
        return ResponseEntity.ok(response);
    }
}
