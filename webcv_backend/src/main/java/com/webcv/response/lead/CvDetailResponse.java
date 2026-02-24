package com.webcv.response.lead;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvDetailResponse {
    private Long id;
    private String title;
    private Object layout;
    private Object blocks;
}