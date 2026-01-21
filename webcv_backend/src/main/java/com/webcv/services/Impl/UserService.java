package com.webcv.services.Impl;

import com.webcv.dto.UserDTO;
import com.webcv.entity.Role;
import com.webcv.entity.User;
import com.webcv.repository.RoleRepository;
import com.webcv.repository.UserRepository;
import com.webcv.services.IUserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService implements IUserServices {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User createUser(UserDTO userDTO) throws Exception {
        String username = userDTO.getUsername();
        //check username
        if(userRepository.existsByUsername(username)){
            throw new DataIntegrityViolationException("Username already exists");
        }
        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new Exception("Role not found"));

        User newUser = User.builder()
                .username(userDTO.getUsername())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .fullname(userDTO.getFullname())
                .email(userDTO.getEmail())
                .build();
        newUser.getRoles().add(role);
        return userRepository.save(newUser);
    }
}
