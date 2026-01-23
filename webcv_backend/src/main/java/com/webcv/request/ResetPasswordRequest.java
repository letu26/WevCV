package com.webcv.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    @NotBlank(message = "New password is require!")
    private String newPassword;

    @NotBlank(message = "New password is require!")
    private String retypeNewPassword;

    @NotBlank(message = "New password is require!")
    private String resetToken;
}
