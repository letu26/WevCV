package com.webcv.services.user.Impl;


import com.webcv.entity.ProjectEntity;
import com.webcv.repository.ProjectRepository;
import com.webcv.response.admin.MemberResponse;
import com.webcv.response.admin.ProjectDetailResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository){
        this.projectRepository = projectRepository;
    }

    public ProjectDetailResponse getProjectDetail(Long id) {
        ProjectEntity pro ;
        pro = projectRepository.findProjectsByUserId(id)
                .orElseThrow();
        ProjectDetailResponse p = new ProjectDetailResponse();
        p.setId(pro.getId());
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
                            mr.setId(m.getUser().getId());
                            mr.setRole(m.getRole());
                            return mr;
                        })
                .collect(Collectors.toList());
        p.setMembers(memberResponses);

        return p;
    }

}
