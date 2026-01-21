package com.webcv.services.Impl;

import com.webcv.dto.UserDTO;
import com.webcv.entity.User;
import com.webcv.services.IUserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements IUserServices {

    @Override
    public User createUser(UserDTO userDTO) throws Exception {
        return null;
    }
}
