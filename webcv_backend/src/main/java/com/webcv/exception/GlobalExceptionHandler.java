package com.webcv.exception;

import com.webcv.exception.customexception.*;
import com.webcv.response.user.BaseResponse;
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
    public ResponseEntity<BaseResponse<Void>> handleException(Exception ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"INTERNAL_SERVER_ERROR", ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<BaseResponse<Void>> handleException(RuntimeException ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"INTERNAL_SERVER_ERROR", ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<BaseResponse<Void>> notFoundException(NotFoundException ex){
        return buildErrorResponse(HttpStatus.NOT_FOUND,"NOT_FOUND", ex.getMessage());
    };

    @ExceptionHandler(ForbiddenException.class)
    ResponseEntity<BaseResponse<Void>> forbiddenException(ForbiddenException ex){
        return buildErrorResponse(HttpStatus.FORBIDDEN,"FORBIDDEN", ex.getMessage());
    };

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<BaseResponse<Void>> dataExists(DataIntegrityViolationException ex){
        return buildErrorResponse(HttpStatus.CONFLICT,"CONFLICT", ex.getMessage());
    };

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse<Void>> handleValidation(
            MethodArgumentNotValidException ex) {

        String error = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST,"BAD_REQUEST", error);
    };

    @ExceptionHandler(UnauthorizedException.class)
    ResponseEntity<BaseResponse<Void>> unauthorized(UnauthorizedException ex){
        return buildErrorResponse(HttpStatus.UNAUTHORIZED,"UNAUTHORIZED", ex.getMessage());
    };

    @ExceptionHandler(JwtGenerationException.class)
    ResponseEntity<BaseResponse<Void>> invalidParamException(JwtGenerationException ex){
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"JWT_NOT_CREATE", ex.getMessage());
    };

    @ExceptionHandler(DataExpiredException.class)
    ResponseEntity<BaseResponse<Void>> dataExpriedException(DataExpiredException ex){
        return buildErrorResponse(HttpStatus.GONE,"DATA_EXPIRED", ex.getMessage());
    };

    @ExceptionHandler(BadRequestException.class)
    ResponseEntity<BaseResponse<Void>> badRequestException(BadRequestException ex){
        return buildErrorResponse(HttpStatus.BAD_REQUEST,"BAD_REQUEST", ex.getMessage());
    };

    @ExceptionHandler(PasswordNotMatchException.class)
    ResponseEntity<BaseResponse<Void>> invalidParamException(PasswordNotMatchException ex){
        return buildErrorResponse(HttpStatus.BAD_REQUEST,"DATA_NOT_MATCH", ex.getMessage());
    };
}
