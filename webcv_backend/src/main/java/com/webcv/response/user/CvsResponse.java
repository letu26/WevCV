package com.webcv.response.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CvsResponse{
    private Long id;
    private String title;
    private Object layout;
    private Object blocks;
}