package com.webcv.services.lead;


import com.webcv.entity.ProjectEntity;
import com.webcv.repository.ProjectRepository;
import com.webcv.response.admin.MemberResponse;
import com.webcv.response.admin.ProjectDetailResponse;
import com.webcv.response.lead.ProjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectOfLeadService {

    private final ProjectRepository projectRepository;

    public ProjectOfLeadService(ProjectRepository projectRepository){
        this.projectRepository = projectRepository;
    }

    public Page<ProjectResponse> getPoroject(Long id, Pageable p){
        Page<ProjectEntity> projectPage = projectRepository.findProjectsByLead(id, p);

        return projectPage.map(pj -> {
            com.webcv.response.lead.ProjectResponse pro = new com.webcv.response.lead.ProjectResponse();
            pro.setId(pj.getId());
            pro.setName(pj.getName());
            pro.setDescription(pj.getDescription());
            pro.setStatus(pj.getStatus());
            pro.setCreate_by(pj.getCreatedBy()
                    .getFullname());

            return pro;
        });
    }

    public ProjectDetailResponse getProjectDetail(Long id) {
        ProjectEntity pro ;
        pro = projectRepository.findProjectDetailById(id)
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
