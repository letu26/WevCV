package com.webcv.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = UsernameNotFoundException.class)
    ResponseEntity<String> handleUsernameNotFoundExceptionException(UsernameNotFoundException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
