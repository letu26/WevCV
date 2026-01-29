package com.webcv.response.admin;

import java.util.List;

public class AccountResponse {
    private String username;
    private Long id;
    private String status;
    private List<String> roles;
    private String email;
    private String fullname;

    public AccountResponse() {
    }

    public AccountResponse(String username,
                           Long id,
                           String status,
                           List<String> roles,
                           String email,
                           String fullname) {
        this.username = username;
        this.id = id;
        this.status = status;
        this.roles = roles;
        this.email = email;
        this.fullname = fullname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
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
