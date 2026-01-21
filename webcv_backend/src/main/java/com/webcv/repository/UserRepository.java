package com.webcv.repository;

import com.webcv.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    boolean existsByUsername(String username);//kiểm tra user có tồn tại trong db
    Optional<User> findByUsername(String username); //lấy người dùng theo tên đăng nhập
}
