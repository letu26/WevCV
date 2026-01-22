package com.webcv.util;

import com.webcv.response.BaseResponse;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@NoArgsConstructor
public class ExceptionUtil {
    public static ResponseEntity<BaseResponse> buildErrorResponse(HttpStatus status, String code, String message){
        return ResponseEntity.status(status).body(
                BaseResponse.builder()
                        .code(code)
                        .message(message)
                        .build()
        );
    }
}
