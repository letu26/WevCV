package com.webcv.repository;

import com.webcv.entity.ProjectEntity;
import com.webcv.entity.UserEntity;
import com.webcv.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<ProjectEntity,Long> {

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

}
