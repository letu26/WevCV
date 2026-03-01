package com.webcv.response.user;

import com.webcv.enums.FormStatus;
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
    private FormStatus status;
    private String visibility;
}