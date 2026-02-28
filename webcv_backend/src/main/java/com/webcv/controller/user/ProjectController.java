package com.webcv.controller.user;

import com.webcv.entity.UserEntity;
import com.webcv.response.admin.ProjectDetailResponse;
import com.webcv.services.user.Impl.ProjectService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/user")
@RestController
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService){
        this.projectService = projectService;
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/project")
    public ProjectDetailResponse getProject(Authentication auth){
        UserEntity user = (UserEntity) auth.getPrincipal();
        return projectService.getProjectDetail(user.getId());
    }

}
