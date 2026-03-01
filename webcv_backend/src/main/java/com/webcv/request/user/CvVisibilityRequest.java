package com.webcv.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CvVisibilityRequest {

    @NotNull(message = "CVid is required!")
    private Long cvId;
    @NotBlank(message = "title is required!")
    private String visibility;
}