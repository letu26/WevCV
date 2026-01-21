package com.webcv.services;


import com.webcv.dto.UserDTO;
import com.webcv.entity.User;

public interface IUserServices {
    User createUser(UserDTO userDTO) throws Exception;
}
