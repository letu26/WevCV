package com.webcv.response.lead.cvResponse;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private String id;
    private String company;
    private String position;
    private String start;
    private String end;
    private String description;
}