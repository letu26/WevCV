package com.webcv.response.lead.cvResponse;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityResponse {
    private String id;
    private String organization;
    private String role;
    private String start;
    private String end;
    private String description;
}
