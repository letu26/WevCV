package com.webcv.repository;

import com.webcv.entity.CvEntity;
import com.webcv.enums.FormStatus;
import com.webcv.enums.UserStatus;
import com.webcv.repository.custom.CvsRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CvsRepository extends JpaRepository<CvEntity, Long>, CvsRepositoryCustom {
    boolean existsById(Long id);

    List<CvEntity> findAllByUsers_IdAndDeletedFalse(Long id);

    Optional<CvEntity> findByUsers_IdAndDeletedFalse(Long userId);
    Optional<CvEntity> findByIdAndUsers_IdAndDeletedFalse(Long cvId, Long userId);
    Optional<CvEntity> findByToken(String token);

    Optional<CvEntity> findByIdAndStatusAndDeletedFalse(
            Long id,
            FormStatus status
    );

    Page<CvEntity> findAll(Pageable pageable);

    //list all cac cv ke ca da co trong project noa do
//    @Query("""
//        SELECT c
//        FROM CvEntity c
//        WHERE c.deleted = false
//        AND (:status IS NULL OR c.status = :status)
//        AND (:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
//    """)
//    Page<CvEntity> findAllWithFilter(
//            @Param("status") UserStatus status,
//            @Param("keyword") String keyword,
//            Pageable pageable
//    );

//    khong cho hien cv da co project
@Query("""
    SELECT c
    FROM CvEntity c
    WHERE c.deleted = false
    AND c.status IN (com.webcv.enums.FormStatus.ACTIVE, com.webcv.enums.FormStatus.PENDING)
    AND (:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')))
    AND NOT EXISTS (
        SELECT 1
        FROM ProjectApplicationEntity pa
        WHERE pa.cv.id = c.id
    )
""")
    Page<CvEntity> findAllWithFilter(
            @Param("status") UserStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
