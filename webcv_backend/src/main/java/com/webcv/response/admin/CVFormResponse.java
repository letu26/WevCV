package com.webcv.response.admin;

import java.util.*;
import java.io.*;

public class CVFormResponse {
    private Long id;
    private String name;
    private String description;
    private String status;
    private String createdBy;
    private LocalDateTime createdAt;

    public CVFormResponse() {

    }

    public CVFormResponse(Long id,
                          String name,
                          String description,
                          String status,
                          String createdBy,
                          LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.status = status;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    /**
     * Getter and Setter
     * */
}
