package com.webcv.response.admin;

import com.webcv.entity.UserEntity;
import com.webcv.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CvResponse {
    private Long id;
    private String title;
    private String layout;
    private String blocks;
    private Boolean deleted;
    private UserStatus status;
    private List<UserEntity> users;
}
