package com.webcv.controller.lead;

import com.webcv.entity.UserEntity;
import com.webcv.response.admin.ProjectDetailResponse;
import com.webcv.response.lead.ProjectResponse;
import com.webcv.response.user.BaseResponse;
import com.webcv.services.lead.ProjectOfLeadService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lead")
public class ProjectOfLeadController {

    private final ProjectOfLeadService project;

    public ProjectOfLeadController(ProjectOfLeadService project){
        this.project = project;
    }

    @PreAuthorize("hasRole('LEAD')")
    @GetMapping("/project")
    public Page<ProjectResponse> getProject(Authentication auth, Pageable p){
        UserEntity u = (UserEntity) auth.getPrincipal();
        return project.getPoroject(u.getId(), p);
    }

    @PreAuthorize("hasRole('LEAD')")
    @GetMapping("project/{id}")
    public ProjectDetailResponse getProjectDetail(@PathVariable Long id){
        return project.getProjectDetail(id);
    }

}
