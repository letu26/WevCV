package com.webcv.controller.admin;

import com.webcv.entity.UserEntity;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.request.admin.ApplyUserToProjectRequest;
import com.webcv.request.admin.CreateProjectRequest;
import com.webcv.request.admin.UpdateStatusProjectRequest;
import com.webcv.response.admin.ProjectDetailResponse;
import com.webcv.response.admin.ProjectResponse;
import com.webcv.response.admin.UserIsLeadResponse;
import com.webcv.response.user.BaseResponse;
import com.webcv.services.admin.ManageProjectService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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


    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/project/{id}")
    public ProjectDetailResponse getProjectDetail(@PathVariable Long id){
        return projectService.getProjectDetail(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/project/{id}")
    public BaseResponse updateProject(@PathVariable Long id, @RequestBody CreateProjectRequest req){
        return projectService.updateProject(id, req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/project/{id}/status")
    public BaseResponse updateStatusProject(@PathVariable Long id, @RequestBody UpdateStatusProjectRequest status){
        System.out.println(status);
        return projectService.updateProjectStatus(id, status);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/project/lead")
    public List<UserIsLeadResponse> getUserIsLead(){
        return projectService.getUserIsLead();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/project/{id}/member")
    public BaseResponse applyUserToProject(@PathVariable Long id, @RequestBody ApplyUserToProjectRequest req){
        return projectService.applyLeadToProject(id, req);
    }

}
