package com.webcv.response.admin;

import com.webcv.entity.ProjectMemberEntity;
import com.webcv.entity.UserEntity;

import java.util.List;

public class ProjectDetailResponse {
    private Long id;
    private String name;
    private String description;
    private String status;
    private String create_by;
    private List<MemberResponse> members;

    public ProjectDetailResponse() {
    }

    public ProjectDetailResponse(String status, String name, String description, String create_by, List<MemberResponse> members) {
        this.status = status;
        this.name = name;
        this.description = description;
        this.create_by = create_by;
        this.members = members;
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

    public List<MemberResponse> getMembers() {
        return members;
    }

    public void setMembers(List<MemberResponse> members) {
        this.members = members;
    }
}

