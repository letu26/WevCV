package com.webcv.request.admin;

public class UpdateStatusProjectRequest {
    private String status;

    public UpdateStatusProjectRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
