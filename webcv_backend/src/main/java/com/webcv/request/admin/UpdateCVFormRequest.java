package com.webcv.request.admin;

public class UpdateCVFormRequest {
    @NotBlank
    private String name;

    private String description;

    @NotNull
    private String status;

    public UpdateCVFormRequest() {

    }

    public UpdateCVFormRequest(String name,
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
