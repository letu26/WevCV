package com.webcv.controller.admin;


import com.webcv.enums.UserStatus;
import com.webcv.request.admin.CreateUserRequest;
import com.webcv.request.admin.UpdateUserRoleRequest;
import com.webcv.request.admin.UpdateUserStatusRequest;
import com.webcv.response.admin.AccountResponse;
import com.webcv.entity.UserEntity;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.services.admin.ManageAccountService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
public class ManageAccountController {

    private final ManageAccountService manageAccountService;

    public ManageAccountController(ManageAccountService manageAccountService){
        this.manageAccountService = manageAccountService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/account")
    public Page<AccountResponse> getAllAccount(
            //tạo thêm value param để filter/search
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String keyword,
            Pageable p
    ){
        UserStatus userStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                userStatus = UserStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status: " + status);
            }
        }

        if (role != null && !role.isBlank()) {
            if (!role.equalsIgnoreCase("ADMIN")
                    && !role.equalsIgnoreCase("USER")) {
                throw new BadRequestException("Invalid role: " + role);
            }
            role = role.toUpperCase();
        }

        if (keyword != null) {
            keyword = keyword.trim();
            if (keyword.length() < 2) {
                throw new BadRequestException("Keyword too short");
            }
        }
        return manageAccountService.getAllAccount(userStatus, role, keyword, p);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/account/{userId}/roles")
    public void updateUserRoles(
            @PathVariable Long userId,
            @RequestBody UpdateUserRoleRequest request
    ) {
        manageAccountService.updateUserRoles(userId, request.getRoles());
    }
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/account/{userId}/status")
    public void updateUserStatus(
            @PathVariable Long userId,
            @RequestBody UpdateUserStatusRequest request
    ) {
        manageAccountService.updateUserStatus(userId, request.getStatus());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/account/create")
    public void createUser(@RequestBody CreateUserRequest request){
        manageAccountService.createUser(request);
    }



}
