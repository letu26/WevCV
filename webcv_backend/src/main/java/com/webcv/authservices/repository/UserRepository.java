package com.webcv.authservices.repository;

import com.webcv.authservices.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {
    boolean existsByUsername(String username);//kiểm tra user có tồn tại trong db
}
