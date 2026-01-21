package com.webcv.repository;

import com.webcv.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity,Long> {
    boolean existsByUsername(String username);//kiểm tra user có tồn tại trong db
    Optional<UserEntity> findByUsername(String username); //lấy người dùng theo tên đăng nhập
}
