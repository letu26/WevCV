package com.webcv.controller;

import com.webcv.dto.UserDTO;
import com.webcv.entity.User;
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
    public ResponseEntity <BaseResponse> createUser(@Valid @RequestBody UserDTO userDTO, BindingResult result){
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
            if(!userDTO.getPassword().equals(userDTO.getRetypePassword())){
                return ResponseEntity.badRequest().body(
                        BaseResponse.builder()
                                .code("400")
                                .message("Passwords do not match")
                                .build()
                );
            }
            try{
                User user = userServices.createUser(userDTO);
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
}
