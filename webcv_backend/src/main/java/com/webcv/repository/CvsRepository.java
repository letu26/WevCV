package com.webcv.repository;

import com.webcv.entity.CvEntity;
import com.webcv.enums.UserStatus;
import com.webcv.response.user.BaseResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CvsRepository extends JpaRepository<CvEntity, Long> {
    boolean existsById(Long id);

    List<CvEntity> findAllByUsers_IdAndDeletedFalse(Long id);

    Optional<CvEntity> findByIdAndUsers_IdAndDeletedFalse(Long cvId, Long userId);

    Optional<CvEntity> findByIdAndStatusAndDeletedFalse(
            Long id,
            UserStatus status
    );

    Page<CvEntity> findAll(Pageable pageable);

    @Query("""
                SELECT c
                FROM CvEntity c
                WHERE c.deleted = false
                AND (:status IS NULL OR c.status = :status)
                AND (:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    Page<CvEntity> findAllWithFilter(
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}