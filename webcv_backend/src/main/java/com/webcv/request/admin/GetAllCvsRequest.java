package com.webcv.request.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetAllCvsRequest {
    private Long lastID;
    private Long size;
    private String status;
    private String keyword;
}