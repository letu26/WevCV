package com.webcv.repository;

import com.webcv.entity.UserEntity;
import com.webcv.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String intput);

    boolean existsByUsername(String input);

    @Query("""
                SELECT DISTINCT u FROM UserEntity u
                JOIN u.roles r
                WHERE (:role IS NULL OR r.name = :role)
                  AND (:status IS NULL OR u.status = :status)
                  AND ( 
                       :keyword IS NULL 
                       OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  )
            """)
    Page<UserEntity> findAllWithFilter(@Param("role") String role, @Param("status")UserStatus status, @Param("keyword") String keyword, Pageable p);
}
