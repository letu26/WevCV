package com.webcv.controller;

import com.webcv.request.LoginRequest;
import com.webcv.request.RegisterRequest;
import com.webcv.entity.UserEntity;
import com.webcv.response.BaseResponse;
import com.webcv.services.IUserServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final IUserServices userServices;

    @PostMapping("/register")
    public ResponseEntity <?> createUser(@Valid @RequestBody RegisterRequest userRequest, BindingResult result){
        try{
            if(result.hasErrors()){
                String error = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .collect(Collectors.joining(", "));
                return ResponseEntity.badRequest().body(
                        BaseResponse.builder()
                                .code("400")
                                .message(error)
                                .build()
                );
            }
            if(!userRequest.getPassword().equals(userRequest.getRetypePassword())){
                return ResponseEntity.badRequest().body(
                        BaseResponse.builder()
                                .code("400")
                                .message("Passwords do not match")
                                .build()
                );
            }
            try{
                UserEntity user = userServices.createUser(userRequest);
                return ResponseEntity.ok(
                        BaseResponse.builder()
                                .code("200")
                                .message("Register successfully")
                                .build()
                );
            }catch(Exception e){
                return ResponseEntity.badRequest().body(
                        BaseResponse.builder()
                                .code("400")
                                .message(e.getMessage())
                                .build()
                );
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    BaseResponse.builder()
                            .code("400")
                            .message(e.getMessage())
                            .build()
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity <?> login(@Valid @RequestBody LoginRequest loginRequest){
        try{
            return ResponseEntity.ok().body(userServices.login(loginRequest.getUsername(), loginRequest.getPassword()));
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
