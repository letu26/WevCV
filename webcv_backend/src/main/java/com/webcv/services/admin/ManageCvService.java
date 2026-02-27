package com.webcv.services.admin;


import com.webcv.entity.CvEntity;
import com.webcv.entity.UserEntity;
import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.BadRequestException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.repository.CvsRepository;
import com.webcv.repository.UserRepository;
import com.webcv.request.user.CvsRequest;
import com.webcv.response.admin.CvResponse;
import com.webcv.response.user.BaseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManageCvService {

    private final CvsRepository cvRepository;
    private final UserRepository userRepository;

    public ManageCvService(CvsRepository cvRepository, UserRepository userRepository) {
        this.cvRepository = cvRepository;
        this.userRepository = userRepository;
    }

    // ==============================
    // CREATE CV
    // ==============================
    @Transactional
    public BaseResponse createCv(CvsRequest req) {

        if (req.getTitle() == null || req.getTitle().isBlank())
            throw new BadRequestException("Title is required");

        CvEntity cv = new CvEntity();
        cv.setTitle(req.getTitle());
        cv.setLayout(req.getLayout());
        cv.setBlocks(req.getBlocks());
        cv.setDeleted(false);
        cv.setStatus(UserStatus.ACTIVE);

        cvRepository.save(cv);

        return BaseResponse.builder()
                .code("201")
                .message("Successfully created CV!")
                .build();
    }


    // ==============================
    // GET ALL WITH FILTER
    // ==============================
    public Page<CvResponse> getAllCv(Boolean deleted,
                                     UserStatus status,
                                     Long userId,
                                     String keyword,
                                     Pageable pageable) {

        Page<CvEntity> page = cvRepository.findAllWithFilter(deleted, status, userId, keyword, pageable);

        return page.map(cv -> {
            CvResponse res = new CvResponse();
            res.setId(cv.getId());
            res.setTitle(cv.getTitle());
            res.setLayout(cv.getLayout());
            res.setBlocks(cv.getBlocks());
            res.setDeleted(cv.getDeleted());
            res.setStatus(cv.getStatus());
            res.setUsers(cv.getUsers());
            return res;
        });
    }


    // ==============================
    // GET DETAIL
    // ==============================
    public CvResponse getCvDetail(Long id) {

        CvEntity cv = cvRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("CV not found"));

        CvResponse res = new CvResponse();
        res.setId(cv.getId());
        res.setTitle(cv.getTitle());
        res.setLayout(cv.getLayout());
        res.setBlocks(cv.getBlocks());
        res.setDeleted(cv.getDeleted());
        res.setStatus(cv.getStatus());
        res.setUsers(cv.getUsers());

        return res;
    }


    // ==============================
    // UPDATE CV
    // ==============================
    @Transactional
    public BaseResponse updateCv(Long id, CvsRequest req) {

        CvEntity cv = cvRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("CV not found"));

        if (req.getTitle() == null || req.getTitle().isBlank())
            throw new BadRequestException("Title is required");

        cv.setTitle(req.getTitle());
        cv.setLayout(req.getLayout());
        cv.setBlocks(req.getBlocks());

        cvRepository.save(cv);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully updated CV!")
                .build();
    }


    // ==============================
    // UPDATE STATUS
    // ==============================
    @Transactional
    public BaseResponse updateCvStatus(Long id, String statusStr) {

        CvEntity cv = cvRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("CV not found"));

        UserStatus newStatus;
        try {
            newStatus = UserStatus.valueOf(statusStr.toUpperCase());
        } catch (Exception e) {
            throw new BadRequestException("Invalid status");
        }

        cv.setStatus(newStatus);
        cvRepository.save(cv);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully updated CV status!")
                .build();
    }


    // ==============================
    // SOFT DELETE CV
    // ==============================
    @Transactional
    public BaseResponse deleteCv(Long id) {

        CvEntity cv = cvRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("CV not found"));

        cv.setDeleted(true);
        cvRepository.save(cv);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully deleted CV!")
                .build();
    }


    // ==============================
    // ASSIGN USER TO CV
    // ==============================
    @Transactional
    public BaseResponse assignUserToCv(Long cvId, Long userId) {

        CvEntity cv = cvRepository.findById(cvId)
                .orElseThrow(() -> new NotFoundException("CV not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        cv.getUsers().add(user);
        cvRepository.save(cv);

        return BaseResponse.builder()
                .code("200")
                .message("Successfully assigned user to CV!")
                .build();
    }
}
