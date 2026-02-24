package com.webcv.repository;

import com.webcv.entity.ProjectMemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMemberEntity, Long> {
    boolean existsByProject_IdAndUser_IdAndRole(
            Long projectId,
            Long userId,
            String role
    );

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    void deleteByProjectIdAndUserId(Long projectId, Long userId);

    Optional<ProjectMemberEntity>
    findByProjectIdAndUserId(Long projectId, Long userId);
}
