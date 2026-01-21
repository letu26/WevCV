package com.webcv.exception;

import com.webcv.exception.customexception.JwtGenerationException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.exception.customexception.UnauthorizedException;
import com.webcv.response.BaseResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse> handleException(Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(BaseResponse.builder()
                        .code("500")
                        .message("Internal server error")
                        .build());
    }
    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<BaseResponse> notFoundException(NotFoundException ex){
        return ResponseEntity.badRequest().body(
                BaseResponse.builder()
                        .code("404")
                        .message(ex.getMessage())
                        .build()
        );
    };

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<BaseResponse> dataExists(DataIntegrityViolationException ex){
        return ResponseEntity.badRequest().body(
                BaseResponse.builder()
                        .code("409")
                        .message(ex.getMessage())
                        .build()
        );
    };

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        String error = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return ResponseEntity.badRequest().body(
                BaseResponse.builder()
                        .code("400")
                        .message(error)
                        .build());
    };

    @ExceptionHandler(UnauthorizedException.class)
    ResponseEntity<BaseResponse> unauthorized(UnauthorizedException ex){
        return ResponseEntity.badRequest().body(
                BaseResponse.builder()
                        .code("401")
                        .message(ex.getMessage())
                        .build()
        );
    };

    @ExceptionHandler(JwtGenerationException.class)
    ResponseEntity<BaseResponse> invalidParamException(JwtGenerationException ex){
        return ResponseEntity.badRequest().body(
                BaseResponse.builder()
                        .code("500")
                        .message(ex.getMessage())
                        .build()
        );
    };
}
