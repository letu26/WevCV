package com.webcv.repository;

import com.webcv.entity.ProjectApplicationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ProjectApplicationRepository extends JpaRepository<ProjectApplicationEntity, Long> {

    boolean existsByProjectIdAndCvId(Long projectId, Long cvId);

//    @Modifying
//    @Query("""
//                update ProjectApplicationEntity pa
//                set pa.status = 'REMOVED'
//                where pa.project.id = :projectId
//                and pa.cv.id = :cvId
//            """)
//    void markRemoved(@Param("projectId") Long projectId,
//                     @Param("cvId") Long cvId);

    @Modifying
    @Transactional
    @Query("""
                delete from ProjectApplicationEntity pa
                where pa.project.id = :projectId
                and :userId in (
                    select u.id
                    from pa.cv.users u
                )
            """)
    void markRemoved(@Param("projectId") Long projectId,
                     @Param("userId") Long userId);
}
