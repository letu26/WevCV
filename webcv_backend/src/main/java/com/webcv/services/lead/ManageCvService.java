package com.webcv.services.lead;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.webcv.entity.*;
import com.webcv.enums.FormStatus;
import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.mapper.CvsMapper;
import com.webcv.repository.*;
import com.webcv.response.lead.cvResponse.*;
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

            List<Map<String, Object>> blocks =
                    objectMapper.readValue(
                            cv.getBlocks(),
                            new TypeReference<List<Map<String, Object>>>() {}
                    );

            CvDetailResponse.CvDetailResponseBuilder builder =
                    CvDetailResponse.builder()
                            .id(cv.getId())
                            .title(cv.getTitle());

            List<SkillResponse> skills = new ArrayList<>();
            List<EducationResponse> educations = new ArrayList<>();
            List<JobResponse> jobs = new ArrayList<>();
            List<CertificateResponse> certificates = new ArrayList<>();
            List<AwardResponse> awards = new ArrayList<>();
            List<ActivityResponse> activities = new ArrayList<>();

            for (Map<String, Object> block : blocks) {

                String type = (String) block.get("type");
                Map<String, Object> data =
                        (Map<String, Object>) block.get("data");

                if (type == null || data == null) continue;

                switch (type) {

                    // ===== BUSINESS CARD =====
                    case "businesscard":
                        builder.fullName((String) data.get("fullName"));
                        builder.position((String) data.get("position"));
                        break;

                    // ===== AVATAR =====
                    case "avatar":
                        builder.avatar((String) data.get("image"));
                        break;

                    // ===== PROFILE =====
                    case "profile":
                        builder.email((String) data.get("email"));
                        builder.phone((String) data.get("phone"));
                        builder.address((String) data.get("address"));
                        builder.dob((String) data.get("dob"));
                        builder.gender((String) data.get("gender"));
                        break;

                    // ===== CAREER =====
                    case "career":
                        builder.longTerm((String) data.get("longTerm"));
                        builder.shortTerm((String) data.get("shortTerm"));
                        break;

                    // ===== SKILL =====
                    case "skill":
                        List<Map<String, Object>> skillList =
                                (List<Map<String, Object>>) data.get("skills");

                        if (skillList != null) {
                            for (Map<String, Object> s : skillList) {
                                skills.add(
                                        SkillResponse.builder()
                                                .id((String) s.get("id"))
                                                .name((String) s.get("name"))
                                                .description((String) s.get("description"))
                                                .build()
                                );
                            }
                        }
                        break;

                    // ===== EDUCATION =====
                    case "education":
                        List<Map<String, Object>> eduList =
                                (List<Map<String, Object>>) data.get("educations");

                        if (eduList != null) {
                            for (Map<String, Object> e : eduList) {
                                educations.add(
                                        EducationResponse.builder()
                                                .id((String) e.get("id"))
                                                .school((String) e.get("school"))
                                                .major((String) e.get("major"))
                                                .start((String) e.get("start"))
                                                .end((String) e.get("end"))
                                                .description((String) e.get("description"))
                                                .build()
                                );
                            }
                        }
                        break;

                    // ===== EXPERIENCE =====
                    case "experience":
                        List<Map<String, Object>> jobList =
                                (List<Map<String, Object>>) data.get("jobs");

                        if (jobList != null) {
                            for (Map<String, Object> j : jobList) {
                                jobs.add(
                                        JobResponse.builder()
                                                .id((String) j.get("id"))
                                                .company((String) j.get("company"))
                                                .position((String) j.get("position"))
                                                .start((String) j.get("start"))
                                                .end((String) j.get("end"))
                                                .description((String) j.get("description"))
                                                .build()
                                );
                            }
                        }
                        break;

                    // ===== CERTIFICATE =====
                    case "certificate":
                        List<Map<String, Object>> certList =
                                (List<Map<String, Object>>) data.get("certificates");

                        if (certList != null) {
                            for (Map<String, Object> c : certList) {
                                certificates.add(
                                        CertificateResponse.builder()
                                                .id((String) c.get("id"))
                                                .name((String) c.get("name"))
                                                .time((String) c.get("time"))
                                                .build()
                                );
                            }
                        }
                        break;

                    // ===== AWARD =====
                    case "award":
                        List<Map<String, Object>> awardList =
                                (List<Map<String, Object>>) data.get("awards");

                        if (awardList != null) {
                            for (Map<String, Object> a : awardList) {
                                awards.add(
                                        AwardResponse.builder()
                                                .id((String) a.get("id"))
                                                .name((String) a.get("name"))
                                                .time((String) a.get("time"))
                                                .build()
                                );
                            }
                        }
                        break;

                    // ===== ACTIVITY =====
                    case "activity":
                        List<Map<String, Object>> actList =
                                (List<Map<String, Object>>) data.get("activities");

                        if (actList != null) {
                            for (Map<String, Object> a : actList) {
                                activities.add(
                                        ActivityResponse.builder()
                                                .id((String) a.get("id"))
                                                .organization((String) a.get("organization"))
                                                .role((String) a.get("role"))
                                                .start((String) a.get("start"))
                                                .end((String) a.get("end"))
                                                .description((String) a.get("description"))
                                                .build()
                                );
                            }
                        }
                        break;
                }
            }

            builder.skills(skills);
            builder.educations(educations);
            builder.jobs(jobs);
            builder.certificates(certificates);
            builder.awards(awards);
            builder.activities(activities);

            return builder.build();

        } catch (Exception e) {
            e.printStackTrace();
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
        cv.setStatus(FormStatus.APPROVED);
        cvsRepository.save(cv);
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
