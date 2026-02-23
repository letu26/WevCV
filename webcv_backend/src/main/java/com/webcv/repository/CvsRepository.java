package com.webcv.repository;

import com.webcv.entity.CvEntity;
import com.webcv.response.user.BaseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CvsRepository extends JpaRepository<CvEntity, Long> {
    boolean existsById(Long id);
    List<CvEntity> findAllByUsers_IdAndDeletedFalse(Long id);
    Optional<CvEntity> findByIdAndUsers_IdAndDeletedFalse(Long cvId, Long userId);

    Page<CvEntity> findAll(Pageable pageable);
}