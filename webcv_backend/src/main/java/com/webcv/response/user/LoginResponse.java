package com.webcv.response.user;

import com.webcv.entity.RoleEntity;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private Long userId;
    private String fullName;
    private String email;
    private List<String> role;
}
