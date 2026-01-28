package com.webcv.services.user.Impl;

import com.webcv.entity.RoleEntity;
import com.webcv.entity.UserEntity;
import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.exception.customexception.UnauthorizedException;
import com.webcv.repository.RoleRepository;
import com.webcv.repository.AuthRepository;
import com.webcv.request.user.RegisterRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.LoginResponse;
import com.webcv.response.user.RefreshTokenResponse;
import com.webcv.services.user.IAuthServices;
import com.webcv.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class AuthService implements IAuthServices {

    @Value("${jwt.refresh.secret}")
    private String secretRefresh;

    private final AuthRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public BaseResponse createUser(RegisterRequest registerRequest) {
        String username = registerRequest.getUsername();
        //check username
        if(userRepository.existsByUsername(username)){
            throw new DataIntegrityViolationException("Username already exists");
        }
        if(userRepository.existsByEmail(registerRequest.getEmail())){
            throw new DataIntegrityViolationException("Email already exists");
        }
        RoleEntity role = roleRepository.findByName("USER")
                .orElseThrow(() -> new NotFoundException("Role not found"));

        UserEntity newUser = UserEntity.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .fullname(registerRequest.getFullname())
                .email(registerRequest.getEmail())
                .build();
        newUser.getRoles().add(role);
        userRepository.save(newUser);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully created user!")
                .build();
    }

    @Override
    public LoginResponse login(String username, String password){

        Optional<UserEntity> user = userRepository.findByUsernameAndStatus(username, UserStatus.ACTIVE);
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

        List<String> role = userEntity.getRoles().stream().map(RoleEntity::getName).toList();

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(role)
                .build();
    }

    @Override
    public RefreshTokenResponse refreshToken(String refreshToken) {
        String username = jwtTokenUtil.extractUsername(refreshToken,secretRefresh);
        Optional<UserEntity> user = userRepository.findByUsernameAndStatus(username, UserStatus.ACTIVE);
        if(user.isEmpty()){
            throw new NotFoundException("User not found");
        }
        UserEntity userEntity = user.get();
        Instant changePasswordAt = userEntity.getChangePasswordAt();
        if(changePasswordAt != null) {
            Instant issuedAt = jwtTokenUtil.tokenIssuedAtInstant(refreshToken, secretRefresh);
            if(issuedAt.isBefore(changePasswordAt)){
                throw new UnauthorizedException("REFRESH_TOKEN_INVALID or REFRESH_TOKEN_EXPIRED!");
            }
        }
        if(jwtTokenUtil.isTokenExpired(refreshToken,secretRefresh)){
            throw new UnauthorizedException("RefreshToken expired or not valid!");
        }
        String accessToken = jwtTokenUtil.generateAccessToken(userEntity);

        return RefreshTokenResponse.builder()
                .accessToken(accessToken)
                .build();
    }

    @Override
    public BaseResponse changePass(String oldPassword, String newPassword) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        UserEntity user = userRepository.findByUsernameAndStatus(username, UserStatus.ACTIVE)
                .orElseThrow(()-> new NotFoundException("User not found!"));
        String password = user.getPassword();
        if(!passwordEncoder.matches(oldPassword,password)){
            throw new UnauthorizedException("Wrong password or username!");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setChangePasswordAt(Instant.now());
        userRepository.save(user);
        return BaseResponse.builder()
                .code("200")
                .message("Successfully changed password!")
                .build();
    }
}
