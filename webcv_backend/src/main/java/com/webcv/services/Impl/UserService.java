package com.webcv.services.Impl;

import com.webcv.entity.RoleEntity;
import com.webcv.entity.UserEntity;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.exception.customexception.UnauthorizedException;
import com.webcv.repository.RoleRepository;
import com.webcv.repository.UserRepository;
import com.webcv.request.RegisterRequest;
import com.webcv.response.LoginResponse;
import com.webcv.response.RefreshTokenResponse;
import com.webcv.services.IUserServices;
import com.webcv.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService implements IUserServices {

    @Value("${jwt.refresh.secret}")
    private String secretRefresh;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public UserEntity createUser(RegisterRequest userDTO){
        String username = userDTO.getUsername();
        //check username
        if(userRepository.existsByUsername(username)){
            throw new DataIntegrityViolationException("Username already exists");
        }
        RoleEntity role = roleRepository.findByName("USER")
                .orElseThrow(() -> new NotFoundException("Role not found"));

        UserEntity newUser = UserEntity.builder()
                .username(userDTO.getUsername())
                .password(passwordEncoder.encode(userDTO.getPassword()))
                .fullname(userDTO.getFullname())
                .email(userDTO.getEmail())
                .build();
        newUser.getRoles().add(role);
        return userRepository.save(newUser);
    }

    @Override
    public LoginResponse login(String username, String password){

        Optional<UserEntity> user = userRepository.findByUsername(username);
        if(user.isEmpty()){
            throw new NotFoundException("User not found");
        }
        UserEntity userEntity = user.get();
        if(!passwordEncoder.matches(password,userEntity.getPassword())){
            throw new UnauthorizedException("Wrong password or username!");
        }

        UsernamePasswordAuthenticationToken authenticationToken =new UsernamePasswordAuthenticationToken(username, password
        , userEntity.getAuthorities());

        authenticationManager.authenticate(authenticationToken);
        String accessToken = jwtTokenUtil.generateAccessToken(userEntity);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userEntity);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Override
    public RefreshTokenResponse refreshToken(String refreshToken) {
        String username = jwtTokenUtil.extractUsername(refreshToken,secretRefresh);
        Optional<UserEntity> user = userRepository.findByUsername(username);
        if(user.isEmpty()){
            throw new NotFoundException("User not found");
        }
        UserEntity userEntity = user.get();
        if(jwtTokenUtil.isTokenExpired(refreshToken,secretRefresh)){
            throw new UnauthorizedException("Refresh token expired or not valid!");
        }
        String accessToken = jwtTokenUtil.generateAccessToken(userEntity);

        return RefreshTokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }
}
