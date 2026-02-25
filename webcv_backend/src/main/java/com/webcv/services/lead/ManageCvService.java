package com.webcv.services.lead;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcv.entity.*;
import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.mapper.CvsMapper;
import com.webcv.repository.*;
import com.webcv.response.lead.CvDetailResponse;
import com.webcv.response.lead.CvResponse;
import com.webcv.response.lead.ProjectResponse;
import com.webcv.response.user.BaseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ManageCvService {

    private final CvsRepository cvsRepository;
    private final CvsMapper cvsMapper;
    private final ProjectApplicationRepository projectApplicationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ObjectMapper objectMapper;

    public ManageCvService(CvsRepository cvsRepository,ObjectMapper objectMapper, ProjectMemberRepository projectMemberRepository, UserRepository userRepository, ProjectRepository projectRepository, CvsMapper cvsMapper, ProjectApplicationRepository projectApplicationRepository) {
        this.cvsRepository = cvsRepository;
        this.cvsMapper = cvsMapper;
        this.projectApplicationRepository = projectApplicationRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.objectMapper = objectMapper;
    }

    public Page<CvResponse> getAllCvs(UserStatus status, String keyword, Pageable pageable) {

        Page<CvEntity> cvPage = cvsRepository.findAllWithFilter(status, keyword, pageable);

        return cvPage.map(cv -> {
            CvResponse res = new CvResponse();
            res.setId(cv.getId());
            res.setUserId(cv.getUsers()
                    .get(0)
                    .getId());
            res.setTitle(cv.getTitle());
            res.setStatus(cv.getStatus());
            res.setCreatedAt(cv.getCreatedAt());
            res.setUpdatedAt(cv.getUpdatedAt());
            System.out.println(cv.getUsers()
                    .get(0)
                    .getFullname());
            if (cv.getUsers() != null && ! cv.getUsers()
                    .isEmpty()) {
                res.setFullName(cv.getUsers()
                        .get(0)
                        .getFullname());
            }

            return res;
        });
    }


//    public BaseResponse<List<CvDetailResponse>> getCvbyUserId(Long userId) {
//        List<CvEntity> cvByUserId = cvsRepository.findAllByUsers_IdAndDeletedFalse(userId);
//        List<CvDetailResponse> cvsResponses = cvByUserId.stream()
//                .map(cvsMapper :: toResponseDetail)
//                .toList();
//
//        return BaseResponse.<List<CvDetailResponse>>builder()
//                .code("200")
//                .message("Successfully fetched CV!")
//                .data(cvsResponses)
//                .build();
//    }

    public BaseResponse<CvDetailResponse> getCvbyUserId(Long userId) {

        CvEntity cv = cvsRepository
                .findByUsers_IdAndDeletedFalse(userId)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        CvDetailResponse response = mapToDetailResponse(cv);

        return BaseResponse.<CvDetailResponse>builder()
                .code("200")
                .message("Successfully fetched CV!")
                .data(response)
                .build();
    }

    private CvDetailResponse mapToDetailResponse(CvEntity cv) {

        try {
            Map<String, Object> blocks =
                    objectMapper.readValue(
                            cv.getBlocks(),
                            new TypeReference<Map<String, Object>>() {}
                    );

            Map<String, Object> profile =
                    (Map<String, Object>) blocks.get("profile");

            // ===== PARSE PROJECTS =====
            List<Map<String, Object>> projectsRaw =
                    (List<Map<String, Object>>) blocks.get("projects");

            List<ProjectResponse> projects = new ArrayList<>();

            if (projectsRaw != null) {
                for (Map<String, Object> p : projectsRaw) {

                    ProjectResponse project = new ProjectResponse();

                    project.setName((String) p.get("name"));
                    project.setDescription((String) p.get("description"));

                    // dùng role làm status tạm
                    project.setStatus((String) p.get("role"));

                    // lấy fullName làm create_by
                    if (profile != null) {
                        project.setCreate_by((String) profile.get("fullName"));
                    }

                    projects.add(project);
                }
            }

            // ===== PARSE SKILLS =====
            Map<String, List<String>> skillsRaw =
                    (Map<String, List<String>>) blocks.get("skills");

            List<String> skills = new ArrayList<>();

            if (skillsRaw != null) {
                skills.addAll(skillsRaw.getOrDefault("technical", List.of()));
                skills.addAll(skillsRaw.getOrDefault("frontend", List.of()));
                skills.addAll(skillsRaw.getOrDefault("softSkills", List.of()));
            }

            return CvDetailResponse.builder()
                    .id(cv.getId())
                    .title(cv.getTitle())

                    .fullName((String) profile.get("fullName"))
                    .email((String) profile.get("email"))
                    .phone((String) profile.get("phone"))
                    .address((String) profile.get("address"))

                    .careerGoal((String) blocks.get("careerGoal"))
                    .additionalInfo((String) blocks.get("additionalInfo"))

                    .projects(projects)
                    .skills(skills)

                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error parsing CV blocks", e);
        }
    }

    @Transactional
    public BaseResponse applyCv(UserEntity user, Long projectId, Long cvId) {

        Long currentUserId = user.getId();

        //  Lấy user hiện tại
        UserEntity currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        //  Check project tồn tại
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new NotFoundException("Project not found"));

        // Check user có phải LEAD của project không
        boolean isLead = projectMemberRepository
                .existsByProject_IdAndUser_IdAndRole(projectId, currentUserId, "LEAD");

        if (! isLead) {
            throw new BadRequestException("You are not lead of this project");
        }

        //  Check CV tồn tại + ACTIVE + not deleted
        CvEntity cv = cvsRepository
                .findByIdAndStatusAndDeletedFalse(cvId, UserStatus.ACTIVE)
                .orElseThrow(() -> new BadRequestException("CV not available"));

        //  Check chưa apply trước đó
        boolean existed = projectApplicationRepository
                .existsByProjectIdAndCvId(projectId, cvId);

        if (existed) {
            throw new BadRequestException("CV already applied to this project");
        }

        //  Tạo application
        ProjectApplicationEntity application = ProjectApplicationEntity.builder()
                .project(project)
                .cv(cv)
                .status("APPROVED")
                .appliedBy(currentUser)
                .build();
        // Lấy user đầu tiên của CV (nếu có)
        List<UserEntity> users = cv.getUsers();

        if (users == null || users.isEmpty()) {
            throw new RuntimeException("CV này chưa gắn với user nào");
        }

        UserEntity userr = users.get(0);

        // Thêm vào project_members nếu chưa tồn tại
        if (! projectMemberRepository
                .existsByProjectIdAndUserId(projectId, userr.getId())) {

            ProjectMemberEntity member =
                    ProjectMemberEntity.builder()
                            .project(project)
                            .user(userr)
                            .role("MEMBER")
                            .build();

            projectMemberRepository.save(member);
        }
        projectApplicationRepository.save(application);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully apply member to project!")
                .build();
    }

    @Transactional
    public void removeMember(UserEntity user,Long projectId, Long targetUserId) {

        Long currentUserId = user.getId();
        System.out.println(currentUserId + "hehe" + targetUserId);
        // 1. Check project + đúng lead
        ProjectEntity project = projectRepository
                .findByIdAndLeadId(projectId, currentUserId)
                .orElseThrow(() ->
                        new RuntimeException("Bạn không phải lead của project này"));

        // 2. Không cho xoá chính lead
        if (currentUserId.equals(targetUserId)) {
            throw new RuntimeException("Không thể xoá chính lead khỏi project");
        }

        // 3. Check member tồn tại
        ProjectMemberEntity member = projectMemberRepository
                .findByProjectIdAndUserId(projectId, targetUserId)
                .orElseThrow(() ->
                        new RuntimeException("User không thuộc project"));
        System.out.println(member.getId());
        // 4. Xoá khỏi project_members
        projectMemberRepository.delete(member);

        // 5. Update trạng thái application
        projectApplicationRepository.markRemoved(projectId, targetUserId);
    }
}
