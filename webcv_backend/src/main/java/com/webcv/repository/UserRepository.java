package com.webcv.repository;

import com.webcv.entity.UserEntity;
import com.webcv.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String intput);

    boolean existsByUsername(String input);
    boolean existsByEmail(String email);

    @Query("""
                SELECT DISTINCT u FROM UserEntity u
                JOIN u.roles r
                WHERE (:role IS NULL OR r.name = :role)
                  AND (:status IS NULL OR u.status = :status)
                  AND ( 
                       :keyword IS NULL 
                       OR LOWER(u.fullname) LIKE LOWER(CONCAT('%', :keyword, '%'))
                  )
            """)
    Page<UserEntity> findAllWithFilter(@Param("role") String role, @Param("status")UserStatus status, @Param("keyword") String keyword, Pageable p);

    //tim nhung user co role la LEAD va khong thuoc project nao
    @Query("SELECT u FROM UserEntity u " +
            "JOIN u.roles r " +
            "WHERE r.name = 'LEAD' " +
            "AND u.id NOT IN (SELECT pm.user.id FROM ProjectMemberEntity pm)")
    List<UserEntity> findLeadsWithoutProject();
}
