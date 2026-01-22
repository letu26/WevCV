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

import static com.webcv.util.ExceptionUtil.buildErrorResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<BaseResponse> handleException(Exception ex) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"500", ex.getMessage());
    }
    @ExceptionHandler(NotFoundException.class)
    ResponseEntity<BaseResponse> notFoundException(NotFoundException ex){
        return buildErrorResponse(HttpStatus.NOT_FOUND,"404", ex.getMessage());
    };

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<BaseResponse> dataExists(DataIntegrityViolationException ex){
        return buildErrorResponse(HttpStatus.CONFLICT,"409", ex.getMessage());
    };

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        String error = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return buildErrorResponse(HttpStatus.BAD_REQUEST,"400", error);
    };

    @ExceptionHandler(UnauthorizedException.class)
    ResponseEntity<BaseResponse> unauthorized(UnauthorizedException ex){
        return buildErrorResponse(HttpStatus.UNAUTHORIZED,"401", ex.getMessage());
    };

    @ExceptionHandler(JwtGenerationException.class)
    ResponseEntity<BaseResponse> invalidParamException(JwtGenerationException ex){
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"500", ex.getMessage());
    };


}
