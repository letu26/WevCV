package com.webcv.cvservices.services;

import com.webcv.authservices.dto.UserDTO;
import com.webcv.authservices.entity.User;

import java.util.Optional;

public interface ICvServices {
    User createUser(UserDTO userDTO) throws Exception;
}
