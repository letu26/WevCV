package com.webcv.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Retype password is required")
    private String retypePassword;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Fullname is required")
    private String fullname;
}
