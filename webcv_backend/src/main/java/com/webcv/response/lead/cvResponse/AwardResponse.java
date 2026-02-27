package com.webcv.response.lead.cvResponse;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AwardResponse {
    private String id;
    private String name;
    private String time;
}