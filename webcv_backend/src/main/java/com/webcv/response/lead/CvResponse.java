package com.webcv.response.lead;

import com.webcv.enums.FormStatus;
import com.webcv.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CvResponse {

    private Long id;
    private Long userId;
    private String title;
    private FormStatus status;
    private String fullName;
    private Instant createdAt;
    private Instant  updatedAt;

}
