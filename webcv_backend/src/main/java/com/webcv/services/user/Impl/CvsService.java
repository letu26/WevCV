package com.webcv.services.user.Impl;

import com.webcv.entity.CvEntity;
import com.webcv.entity.UserEntity;
import com.webcv.enums.UserStatus;
import com.webcv.exception.customexception.NotFoundException;
import com.webcv.mapper.CvsMapper;
import com.webcv.repository.AuthRepository;
import com.webcv.repository.CvsRepository;
import com.webcv.request.user.CvsRequest;
import com.webcv.response.user.BaseResponse;
import com.webcv.response.user.CvsResponse;
import com.webcv.services.user.ICvServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CvsService implements ICvServices {

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
                .status(UserStatus.ACTIVE)
                .users(List.of(user))
                .deleted(false)
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

    public CvEntity getCvForUser(Long cvId, Long userId) {
        return cvsRepository.findByIdAndUsers_IdAndDeletedFalse(cvId, userId)
                .orElseThrow(() -> new NotFoundException("CV not found"));
    }

}