package com.webcv.exception.customexception;

public class DataExpiredException extends RuntimeException {
    public DataExpiredException(String message) {
        super(message);
    }
}
