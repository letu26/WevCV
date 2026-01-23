package com.webcv.exception;

import com.webcv.exception.customexception.DataExpiredException;
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

import static com.webcv.util.ExceptionUtil.buildErrorResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse> handleException(Exception ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"INTERNAL_SERVER_ERROR", ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<BaseResponse> handleException(RuntimeException ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"INTERNAL_SERVER_ERROR", ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<BaseResponse> notFoundException(NotFoundException ex){
        return buildErrorResponse(HttpStatus.NOT_FOUND,"NOT_FOUND", ex.getMessage());
    };

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<BaseResponse> dataExists(DataIntegrityViolationException ex){
        return buildErrorResponse(HttpStatus.CONFLICT,"CONFLICT", ex.getMessage());
    };

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        String error = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST,"BAD_REQUEST", error);
    };

    @ExceptionHandler(UnauthorizedException.class)
    ResponseEntity<BaseResponse> unauthorized(UnauthorizedException ex){
        return buildErrorResponse(HttpStatus.UNAUTHORIZED,"UNAUTHORIZED", ex.getMessage());
    };

    @ExceptionHandler(JwtGenerationException.class)
    ResponseEntity<BaseResponse> invalidParamException(JwtGenerationException ex){
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"JWT_NOT_CREATE", ex.getMessage());
    };

    @ExceptionHandler(DataExpiredException.class)
    ResponseEntity<BaseResponse> invalidParamException(DataExpiredException ex){
        return buildErrorResponse(HttpStatus.GONE,"DATA_EXPIRED", ex.getMessage());
    };
}
