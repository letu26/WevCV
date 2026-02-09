package com.webcv.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CvsRequest {
    private Long id;

    @NotBlank(message = "title is required!")
    private String title;

    @NotBlank(message = "Layout is required!")
    private String layout;

    @NotBlank(message = "Blocks is required!")
    private String blocks;
}