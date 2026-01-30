package com.webcv.controller.admin;

import com.webcv.entity.UserEntity;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.request.admin.CreateProjectRequest;
import com.webcv.response.admin.ProjectResponse;
import com.webcv.response.user.BaseResponse;
import com.webcv.services.admin.ManageProjectService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class ManageProjectController {

    private final ManageProjectService projectService;

    public ManageProjectController(ManageProjectService projectService) {
        this.projectService = projectService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/project/create")
    public BaseResponse createNewProject(Authentication auth, @RequestBody CreateProjectRequest req) {
        UserEntity user = (UserEntity) auth.getPrincipal();
        return projectService.createNewProject(user, req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/project")
    public Page<ProjectResponse> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            Pageable p
    ) {
        if(status != null && !status.isBlank()){
            if (!status.equalsIgnoreCase("ACTIVE") && ! status.equalsIgnoreCase("INACTIVE") && ! status.equalsIgnoreCase(
                    "DONE")) {
                throw new BadRequestException("Invalid status: " + status);
            }
        }


        if (keyword != null) {
            keyword = keyword.trim();
            if (keyword.length() < 1) {
                throw new BadRequestException("Keyword too short");
            }
        }

        return projectService.getAllProjects(status, keyword, p);
    }

}
