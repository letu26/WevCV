package com.webcv.response.user;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BaseResponse<T> {
    private String code;
    private String message;
    private T data;
}