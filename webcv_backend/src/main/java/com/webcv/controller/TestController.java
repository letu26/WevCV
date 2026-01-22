package com.webcv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class TestController {
    @GetMapping
    public String hi(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ("USERNAME = " + auth.getName());
    }
}
