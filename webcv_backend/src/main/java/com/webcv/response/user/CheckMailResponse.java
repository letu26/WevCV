package com.webcv.response.user;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class CheckMailResponse extends BaseResponse{
    private Long userId;
}
