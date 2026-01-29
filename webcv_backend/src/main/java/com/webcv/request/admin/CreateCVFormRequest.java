package com.webcv.request.admin;

public class CreateCVFormRequest {
    private String name;

    private String description;

    private String status; // ACTIVE, INACTIVE, DRAFT

    public CreateCVFormRequest() {

    }

    public CreateCVFormRequest(String name,
                               String description,
                               String status) {
        this.name = name;
        this.description = description;
        this.status = status;
    }

    /**
     * Getter and Setter
     * */
}
