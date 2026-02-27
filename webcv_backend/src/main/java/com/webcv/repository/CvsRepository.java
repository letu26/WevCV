package com.webcv.repository;

import com.webcv.entity.CvEntity;
import com.webcv.enums.UserStatus;
import com.webcv.response.user.BaseResponse;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CvsRepository extends DateCountRepository<CvEntity, Long> {

    boolean existsById(Long id);
    List<CvEntity> findAllByUsers_IdAndDeletedFalse(Long id);
    Optional<CvEntity> findByIdAndUsers_IdAndDeletedFalse(Long cvId, Long userId);
    List<CvEntity> findTop5ByOrderByCreatedAtDesc();

    @Query("SELECT c.createdAt FROM CvEntity c WHERE c.id = :cvId")
    Instant findCreatedAtById(@Param("cvId") Long cvId);

    @Query("SELECT c.updatedAt FROM CvEntity c WHERE c.id = :cvId")
    Instant findUpdatedAtById(@Param("cvId") Long cvId);

    @Query("""
        SELECT DISTINCT c FROM CvEntity c
        LEFT JOIN c.users u
        WHERE (:deleted IS NULL OR c.deleted = :deleted)
          AND (:status IS NULL OR c.status = :status)
          AND (:userId IS NULL OR u.id = :userId)
          AND (
               :keyword IS NULL
               OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
        """)
    Page<CvEntity> findAllWithFilter(@Param("deleted") Boolean deleted,
                                     @Param("status") UserStatus status,
                                     @Param("userId") Long userId,
                                     @Param("keyword") String keyword,
                                     Pageable pageable);

 /*   @Query("""
    SELECT c.id
    FROM CvEntity c
    WHERE TIMESTAMPDIFF(MINUTE, c.createdAt, NOW()) = (
        SELECT MIN(TIMESTAMPDIFF(MINUTE, c1.createdAt, NOW()))
        FROM CvEntity c1)
    """)
    Long findRecentCvCreated();
*/

    @Query("""
    SELECT c.id
    FROM CvEntity c
    WHERE c.createdAt = (
        SELECT MAX(c1.createdAt)
        FROM CvEntity c1
    )
    """)
    List<Long> findRecentCvCreated();

    @Query("""
    SELECT DATE(c.createdAt) as date, COUNT(c) as total
    FROM CvEntity c
    WHERE c.createdAt BETWEEN :start AND :end
    GROUP BY DATE(c.createdAt)
    ORDER BY DATE(c.createdAt)
    """)
    List<Object[]> countCvsGroupByDate(
            @Param("start") Instant start,
            @Param("end") Instant end
    );


    @Query("SELECT COUNT(*) " +
            "FROM CvEntity c")
    Long getTotalCvs();

    @Query("SELECT COUNT(*) " +
            "FROM CvEntity c " +
            "WHERE DAY(c.createdAt) = DAY(:date) " +
            "AND MONTH(c.createdAt) = MONTH(:date) " +
            "AND YEAR(c.createdAt) = YEAR(:date)")
    Long getTotalCvsByDate(@Param("date") LocalDate date);

}