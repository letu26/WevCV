package com.webcv.services.admin;

import com.webcv.entity.ProjectEntity;
import com.webcv.entity.ProjectMemberEntity;
import com.webcv.entity.UserEntity;
import com.webcv.repository.ProjectMemberRepository;
import com.webcv.repository.ProjectRepository;
import com.webcv.repository.UserRepository;
import com.webcv.request.admin.ApplyUserToProjectRequest;
import com.webcv.request.admin.CreateProjectRequest;
import com.webcv.request.admin.UpdateStatusProjectRequest;
import com.webcv.response.admin.MemberResponse;
import com.webcv.response.admin.ProjectDetailResponse;
import com.webcv.response.admin.ProjectResponse;
import com.webcv.response.admin.UserIsLeadResponse;
import com.webcv.response.user.BaseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ManageProjectService {

    private final ProjectRepository project;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public ManageProjectService(ProjectRepository project, ProjectMemberRepository projectMemberRepository, UserRepository userRepository) {
        this.project = project;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    public BaseResponse createNewProject(UserEntity user, CreateProjectRequest req) {

        if (project.existsByName(req.getName())) {
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

    public Page<ProjectResponse> getAllProjects(String status, String keyword, Pageable p) {
        Page<ProjectEntity> projectPage = project.findAllWithFilter(status, keyword, p);

        return projectPage.map(pj -> {
            ProjectResponse pro = new ProjectResponse();
            pro.setName(pj.getName());
            pro.setDescription(pj.getDescription());
            pro.setStatus(pj.getStatus());
            pro.setCreate_by(pj.getCreatedBy()
                    .getFullname());

            return pro;
        });
    }

    public ProjectDetailResponse getProjectDetail(Long id) {
        ProjectEntity pro = new ProjectEntity();
        pro = project.findProjectDetailById(id)
                .orElseThrow();
        ProjectDetailResponse p = new ProjectDetailResponse();
        p.setName(pro.getName());
        p.setDescription(pro.getDescription());
        p.setStatus(pro.getStatus());
        p.setCreate_by(pro.getCreatedBy()
                .getUsername());

        List<MemberResponse> memberResponses = pro.getMembers()
                .stream()
                .map(
                        m -> {
                            MemberResponse mr = new MemberResponse();

                            mr.setEmail(m.getUser()
                                    .getEmail());
                            mr.setFullname(m.getUser()
                                    .getFullname());

                            return mr;
                        })
                .collect(Collectors.toList());
        p.setMembers(memberResponses);

        return p;
    }

    public BaseResponse updateProject(Long id, CreateProjectRequest req) {

        ProjectEntity p = project.findById(id)
                .orElseThrow();

        if (! p.getName()
                .equalsIgnoreCase(req.getName())) {
            if (project.existsByName(req.getName())) {
                throw new RuntimeException("Duplicate name!!!");
            }
        }


        p.setName(req.getName());
        p.setDescription(req.getDescription());

        project.save(p);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully Update Project!")
                .build();

    }

    public BaseResponse updateProjectStatus(Long id, UpdateStatusProjectRequest status) {

        ProjectEntity p = project.findById(id)
                .orElseThrow();

        p.setStatus(status.getStatus());
        project.save(p);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully Update Project Status!")
                .build();

    }

    //lấy danh sách các lead chua có thuộc dự án nào
    public List<UserIsLeadResponse> getUserIsLead() {
        return userRepository.findLeadsWithoutProject()
                .stream()
                .map(user -> UserIsLeadResponse.builder()
                        .fullname(user.getFullname())
                        .email(user.getEmail())
                        .role("LEAD")
                        .id(user.getId())
                        .build())
                .collect(Collectors.toList());
    }

    //    apply user lead vagfo project
    public BaseResponse applyLeadToProject(Long id, ApplyUserToProjectRequest req) {

        ProjectEntity projectEntity = project.findById(id)
                .orElseThrow(() -> new RuntimeException("not found project"));
        UserEntity user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("not found user"));

        ProjectMemberEntity pm = new ProjectMemberEntity();
        pm.setUser(user);
        pm.setProject(projectEntity);
        pm.setRole(req.getRole());

        projectMemberRepository.save(pm);


        return BaseResponse.builder()
                .code("200")
                .message("Successfully Apply User To Project!")
                .build();

    }


}
