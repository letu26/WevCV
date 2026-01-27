package com.webcv.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePassRequest {
    @NotBlank(message = "OldPassWord is require")
    private String oldPassword;

    @NotBlank(message = "NewPassWord is require")
    private String newPassword;

    @NotBlank(message = "RetypeNewPassword is require")
    private String retypeNewPassword;
}
