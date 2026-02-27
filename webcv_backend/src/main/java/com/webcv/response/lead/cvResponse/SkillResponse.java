package com.webcv.response.lead.cvResponse;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillResponse {
    private String id;
    private String name;
    private String description;
}
