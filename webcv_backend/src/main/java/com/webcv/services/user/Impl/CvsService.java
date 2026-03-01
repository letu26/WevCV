package com.webcv.services.user.Impl;

import com.webcv.entity.CvEntity;
import com.webcv.entity.UserEntity;
import com.webcv.enums.FormStatus;
import com.webcv.enums.Visibility;
import com.webcv.exception.customexception.ForbiddenException;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.mapper.CvsMapper;
import com.webcv.repository.AuthRepository;
import com.webcv.repository.CvsRepository;
import com.webcv.request.user.CvVisibilityRequest;
import com.webcv.request.user.CvsRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;
import com.webcv.services.user.ICvServices;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CvsService implements ICvServices {

    @Value("${app.cors.allowed-origins}")
    private String link;

    private final CvsRepository cvsRepository;
    private final CvsMapper cvsMapper;
    private final AuthRepository authRepository;

    @Override
    public BaseResponse<Void> createAndUpdateCv(CvsRequest request, Long userId) {

        Long id = request.getId();
        //update cv
        if (id != null) {
            CvEntity cv = cvsRepository.findById(id)
                    .orElseThrow(() -> new NotFoundException("CV not found"));

            cv.setTitle(request.getTitle());
            cv.setBlocks(request.getBlocks());
            cv.setLayout(request.getLayout());
            cvsRepository.save(cv);

            return BaseResponse.<Void>builder()
                    .code("201")
                    .message("Successfully updated CV!")
                    .build();
        }
        UserEntity user = authRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found!"));


        //create new cv
        CvEntity newCv = CvEntity.builder()
                .title(request.getTitle())
                .blocks(request.getBlocks())
                .layout(request.getLayout())
                .status(FormStatus.PENDING)
                .users(List.of(user))
                .deleted(false)
                .visibility(Visibility.PRIVATE)
                .token(UUID.randomUUID().toString())
                .build();


        cvsRepository.save(newCv);

        return BaseResponse.<Void>builder()
                .code("200")
                .message("Successfully created CV!")
                .build();
    }

    @Override
    public BaseResponse<List<CvsResponse>> getCvbyUserId(Long userId) {
        List<CvEntity> cvByUserId = cvsRepository.findAllByUsers_IdAndDeletedFalse(userId);
        List<CvsResponse> cvsResponses = cvByUserId.stream()
                .map(cvsMapper::toResponse)
                .toList();

        return BaseResponse.<List<CvsResponse>>builder()
                .code("200")
                .message("Successfully fetched CV!")
                .data(cvsResponses)
                .build();
    }

    @Override
    public BaseResponse<Void> deleteCvById(Long id) {
        CvEntity cv = cvsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("CV not found!"));
        cv.setDeleted(true);
        cvsRepository.save(cv);

        return BaseResponse.<Void>builder()
                .code("200")
                .message("Xóa Cv thành công!")
                .build();
    }

    @Override
    public BaseResponse<String> getLinkCvs(Long id) {
        CvEntity cv = cvsRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("CV not found!"));
        cv.setShareExpiredAt(Instant.now().plus(7, ChronoUnit.DAYS));
        cvsRepository.save(cv);
        String token = cv.getToken();
        String linkCv = link + "/share-cv/" + token;
        return  BaseResponse.<String>builder()
                .code("200")
                .message("Successfully create Link CV!")
                .data(linkCv)
                .build();
    }

    @Override
    public BaseResponse<CvsResponse> getCvByToken(String token) {
        CvEntity cv = cvsRepository.findByToken(token)
                .orElseThrow(() -> new NotFoundException("Link invalid"));
        //check visibility
        if(cv.getVisibility() != Visibility.PUBLIC) {
            throw new ForbiddenException("CV is private");
        }
        //check expire
        if(cv.getShareExpiredAt().isBefore(Instant.now())) {
            throw new ForbiddenException("CV is expired");
        }
        CvsResponse cvsResponse = cvsMapper.toResponse(cv);

        return BaseResponse.<CvsResponse>builder()
                .code("200")
                .message("Successfully fetched CV!")
                .data(cvsResponse)
                .build();
    }

    @Override
    public BaseResponse<Void> changeCvVisibility(CvVisibilityRequest request) {
        CvEntity cv = cvsRepository.findById(request.getCvId())
                .orElseThrow(() -> new NotFoundException("CV not found!"));
        cv.setVisibility(Visibility.valueOf(request.getVisibility()));
        cvsRepository.save(cv);
        return BaseResponse.<Void>builder()
                .code("200")
                .message("Successfully updated visibility CV!")
                .build();
    }

    public CvEntity getCvForUser(Long cvId, Long userId) {
        return cvsRepository.findByIdAndUsers_IdAndDeletedFalse(cvId, userId)
                .orElseThrow(() -> new NotFoundException("CV not found"));
    }

    public BaseResponse<List<CvsResponse>> getAllCvs() {
        List<CvEntity> allCvs = cvsRepository.findAll();
        List<CvsResponse> cvsResponses = allCvs.stream()
                .map(cvsMapper::toResponse)
                .toList();
        return BaseResponse.<List<CvsResponse>>builder()
                .code("200")
                .message("Successfully fetched all CV!")
                .data(cvsResponses)
                .build();
    }
}