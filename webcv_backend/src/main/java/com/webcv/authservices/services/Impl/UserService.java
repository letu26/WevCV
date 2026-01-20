package com.webcv.authservices.services.Impl;

import com.webcv.authservices.dto.UserDTO;
import com.webcv.authservices.entity.User;
import com.webcv.authservices.services.IUserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements IUserServices {

    @Override
    public User create(UserDTO userDTO) throws Exception {
        return null;
    }
}
