package com.webcv.services.admin;

import com.webcv.controller.admin.ManageAccountController;
import com.webcv.entity.ProjectEntity;
import com.webcv.entity.UserEntity;
import com.webcv.repository.ProjectRepository;
import com.webcv.repository.UserRepository;
import com.webcv.request.admin.CreateProjectRequest;
import com.webcv.response.admin.ProjectResponse;
import com.webcv.response.user.BaseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
public class ManageProjectService {

    private final ProjectRepository project;
    private final UserRepository userRepository;
    public ManageProjectService(ProjectRepository project ,UserRepository userRepository){
        this.project = project;
        this.userRepository = userRepository;
    }

    public BaseResponse createNewProject(UserEntity user, CreateProjectRequest req){

        if(project.existsByName(req.getName())){
            throw new RuntimeException("duplicate project");
        }

        ProjectEntity p = new ProjectEntity();
        p.setCreatedBy(user);
        p.setName(req.getName());
        p.setDescription(req.getDescription());
        p.setStatus("ACTIVE");

        project.save(p);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully Create Project!")
                .build();
    }

    public Page<ProjectResponse> getAllProjects(String status, String keyword, Pageable p){
        Page<ProjectEntity> projectPage = project.findAllWithFilter(status,keyword,p);

        return projectPage.map(pj -> {
            ProjectResponse pro = new ProjectResponse();
            pro.setName(pj.getName());
            pro.setDescription(pj.getDescription());
            pro.setStatus(pj.getStatus());
            pro.setCreate_by(pj.getCreatedBy().getFullname());

            return pro;
        });
    }



}
