package com.webcv.services.lead;

import com.webcv.entity.*;
import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.mapper.CvsMapper;
import com.webcv.repository.*;
import com.webcv.response.lead.CvDetailResponse;
import com.webcv.response.lead.CvResponse;
import com.webcv.response.user.BaseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ManageCvService {

    private final CvsRepository cvsRepository;
    private final CvsMapper cvsMapper;
    private final ProjectApplicationRepository projectApplicationRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public ManageCvService(CvsRepository cvsRepository, ProjectMemberRepository projectMemberRepository, UserRepository userRepository, ProjectRepository projectRepository, CvsMapper cvsMapper, ProjectApplicationRepository projectApplicationRepository) {
        this.cvsRepository = cvsRepository;
        this.cvsMapper = cvsMapper;
        this.projectApplicationRepository = projectApplicationRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    public Page<CvResponse> getAllCvs(String status, String keyword, Pageable pageable) {

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


    public BaseResponse<List<CvDetailResponse>> getCvbyUserId(Long userId) {
        List<CvEntity> cvByUserId = cvsRepository.findAllByUsers_IdAndDeletedFalse(userId);
        List<CvDetailResponse> cvsResponses = cvByUserId.stream()
                .map(cvsMapper :: toResponseDetail)
                .toList();

        return BaseResponse.<List<CvDetailResponse>>builder()
                .code("200")
                .message("Successfully fetched CV!")
                .data(cvsResponses)
                .build();
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
    public void removeMember(UserEntity user,Long projectId, Long cvId) {

        Long currentUserId = user.getId();

        // 1. Check project + đúng lead
        ProjectEntity project = projectRepository
                .findByIdAndLeadId(projectId, currentUserId)
                .orElseThrow(() ->
                        new RuntimeException("Bạn không phải lead của project này"));

        // 2. Không cho xoá chính lead
        boolean isLead = projectMemberRepository
                .existsByProject_IdAndUser_IdAndRole(projectId, currentUserId, "LEAD");

        if (!isLead) {
            throw new RuntimeException("Không thể xoá lead khỏi project");
        }

        // 3. Check member tồn tại
        ProjectMemberEntity member = projectMemberRepository
                .findByProjectIdAndUserId(projectId, currentUserId)
                .orElseThrow(() ->
                        new RuntimeException("User không thuộc project"));

        // 4. Xoá khỏi project_members
        projectMemberRepository.delete(member);

        // 5. Update trạng thái application
        projectApplicationRepository.markRemoved(projectId, cvId);
    }
}
