package com.webcv.request.admin;

import java.util.List;

public class CreateUserRequest {

    private String username;
    private String password;
    private List<String> roles;
    private String status;
    private String email;
    private String fullname;

    public CreateUserRequest() {
    }

    public CreateUserRequest(String username, String password, List<String> roles, String status, String email, String fullname) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.status = status;
        this.email = email;
        this.fullname = fullname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
}
