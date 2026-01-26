package com.webcv.request.admin;

import java.util.List;

public class UpdateUserRoleRequest {
    private List<String> roles;

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
