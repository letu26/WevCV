package com.webcv.repository;

import com.webcv.entity.CvEntity;
import com.webcv.entity.ProjectEntity;
import com.webcv.entity.UserEntity;
import com.webcv.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends DateCountRepository<ProjectEntity, Long> {

    boolean existsByName(String name);

    @Query("SELECT p.createdAt FROM ProjectEntity p WHERE p.id = :projectId")
    Instant findCreatedAtById(@Param("projectId") Long projectId);

    @Query("SELECT p.updatedAt FROM ProjectEntity p WHERE p.id = :projectId")
    Instant findUpdatedAtById(@Param("projectId") Long projectId);

    List<ProjectEntity> findTop5ByOrderByCreatedAtDesc();

    @Query("""
                SELECT DISTINCT u FROM ProjectEntity u
                WHERE (:status IS NULL OR u.status = :status)
                  AND ( 
                       :keyword IS NULL 
                       OR LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  )
            """)
    Page<ProjectEntity> findAllWithFilter(@Param("status") String status, @Param("keyword") String keyword, Pageable p);


    @Query("SELECT p FROM ProjectEntity p " +
            "LEFT JOIN FETCH p.members m " +
            "LEFT JOIN FETCH m. user " +
            "WHERE p.id = :projectId")
    Optional<ProjectEntity> findProjectDetailById(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(*) " +
            "FROM ProjectEntity p")
    Long getTotalProjects();

    @Query("SELECT COUNT(*) " +
            "FROM ProjectEntity p " +
            "WHERE DAY(p.createdAt) = DAY(:date) " +
            "AND MONTH(p.createdAt) = MONTH(:date) " +
            "AND YEAR(p.createdAt) = YEAR(:date)")
    Long getTotalProjectsByDate(@Param("date") LocalDate date);
}
