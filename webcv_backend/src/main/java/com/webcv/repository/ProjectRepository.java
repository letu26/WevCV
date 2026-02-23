package com.webcv.repository;

import com.webcv.entity.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    boolean existsByName(String name);


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


    @Query("""
                SELECT DISTINCT u FROM ProjectEntity u
            """)
    Page<ProjectEntity> findAllWithPagi(Pageable p);


    @Query("""
        SELECT p
        FROM ProjectEntity p
        JOIN ProjectMemberEntity pm ON pm.project.id = p.id
        WHERE pm.user.id = :userId
        AND pm.role = 'LEAD'
    """)
    Page<ProjectEntity> findProjectsByLead(@Param("userId") Long userId,Pageable p);

}
