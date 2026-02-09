package com.webcv.response.admin;

import java.util.Date;

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String status;
    private String create_by;

    public ProjectResponse() {
    }

    public ProjectResponse(String name, String description, String status, String create_by) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.create_by = create_by;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreate_by() {
        return create_by;
    }

    public void setCreate_by(String create_by) {
        this.create_by = create_by;
    }
}
