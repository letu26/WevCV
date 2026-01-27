package com.webcv.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CheckOTPRequest {
    @NotNull(message = "UserID is require!")
    private Long userId;
    @NotBlank(message = "Otp is require!")
    private String otp;
}
