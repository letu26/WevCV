package com.webcv.authservices.services;


import com.webcv.authservices.dto.UserDTO;
import com.webcv.authservices.entity.User;

public interface IUserServices {
    User create(UserDTO userDTO) throws Exception;
}
