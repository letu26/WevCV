package com.webcv.response.user;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CheckOTPResponse extends BaseResponse {
    private String resetToken;
}
