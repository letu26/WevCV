package com.webcv.services.admin;

import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.request.admin.CreateUserRequest;
import com.webcv.response.admin.AccountResponse;
import com.webcv.entity.RoleEntity;
import com.webcv.entity.UserEntity;
import com.webcv.repository.RoleRepository;
import com.webcv.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
public class ManageAccountService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public ManageAccountService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<AccountResponse> getAllAccount(UserStatus status, String role, String keyword, Pageable p) {
//        List<User> u = userRepository.findAll();
//
//
//
//        return u.stream()
//                //filter status
//                .filter(uu -> status == null || uu.getStatus().name().equalsIgnoreCase(status))
//
//                //filter role
//                .filter(uu -> role == null || uu.getRoles().stream().anyMatch(r -> r.getName().equalsIgnoreCase(role)))
//
//                //filter keyword(search name)
//                .filter(uu -> keyword == null || uu.getUsername().equalsIgnoreCase(keyword))
//
//
//
//                //map dto
//                .map(user -> {
//                    AccountResponse acc = new AccountResponse();
//                    acc.setId(user.getId());
//                    acc.setUsername(user.getUsername());
//                    acc.setStatus(user.getStatus()
//                            .name());
//                    acc.setRoles(user.getRoles()
//                            .stream()
//                            .map(r -> r.getName())
//                            .toList());
//                    return acc;
//                })
//                .toList();
        Page<UserEntity> userPage =
                userRepository.findAllWithFilter(role, status, keyword, p);

        return userPage.map(user -> {
            AccountResponse acc = new AccountResponse();
            acc.setId(user.getId());
            acc.setUsername(user.getUsername());
            acc.setStatus(user.getStatus()
                    .name());
            acc.setRoles(
                    user.getRoles()
                            .stream()
                            .map(r -> r.getName())
                            .toList()
            );
            acc.setEmail(user.getEmail());
            acc.setFullname(user.getFullname());
            return acc;
        });
    }

    @Transactional
    public void updateUserRoles(Long userId, List<String> roleNames) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles()
                .stream()
                .anyMatch(r -> r.getName()
                        .equals("ADMIN"));

        if (isAdmin) {
            throw new BadRequestException("Cannot modify ADMIN account");
        }

        if (roleNames == null || roleNames.isEmpty()) {
            throw new BadRequestException("Role list cannot be empty");
        }

        List<String> normalizedRoles = roleNames.stream()
                .map(String :: toUpperCase)
                .distinct()
                .toList();

        List<RoleEntity> roles = roleRepository.findByNameIn(normalizedRoles);

        if (roles.size() != normalizedRoles.size()) {
            throw new BadRequestException("One or more roles not found");
        }

        user.setRoles(new ArrayList<>(roles));

        userRepository.save(user);
    }

    @Transactional
    public void updateUserStatus(Long userId, String statusStr) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles()
                .stream()
                .anyMatch(r -> r.getName()
                        .equalsIgnoreCase("ADMIN"));

        if (isAdmin) {
            throw new BadRequestException("Cannot change status of ADMIN account");
        }

        if (statusStr == null || statusStr.isBlank()) {
            throw new BadRequestException("Status is required");
        }

        UserStatus newStatus;
        try {
            newStatus = UserStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + statusStr);
        }

        if (user.getStatus() == newStatus) {
            return;
        }

        user.setStatus(newStatus);
        userRepository.save(user);
    }

    @Transactional
    public void createUser(CreateUserRequest req) {

        // ===== 1. Validate basic =====
        if (req.getUsername() == null || req.getUsername()
                .isBlank())
            throw new BadRequestException("Username required");

        if (req.getPassword() == null || req.getPassword()
                .isBlank())
            throw new BadRequestException("Password required");

        if (req.getRoles() == null || req.getRoles()
                .isEmpty())
            throw new BadRequestException("Role required");

        // ===== 2. Unique check =====
        if (userRepository.existsByUsername(req.getUsername()))
            throw new BadRequestException("Username already exists");

        UserStatus status;
        try {
            status = UserStatus.valueOf(req.getStatus()
                    .toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status");
        }

        List<String> roleNames = req.getRoles()
                .stream()
                .map(String :: toUpperCase)
                .distinct()
                .toList();

        if (roleNames.contains("ADMIN")) {
            throw new BadRequestException("Cannot create ADMIN account");
        }

        List<RoleEntity> roles = roleRepository.findByNameIn(roleNames);
        if (roles.size() != roleNames.size()) {
            throw new BadRequestException("Role not found");
        }

        UserEntity user = new UserEntity();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setStatus(status);
        user.setRoles(new ArrayList<>(roles));
        user.setEmail(req.getEmail());
        user.setFullname(req.getFullname());

//        // profile
//        Profile profile = new Profile();
//        profile.setFullName(req.getFullName());
//        profile.setUser(user);
//        user.setProfile(profile);

        userRepository.save(user);
    }


}
