package com.webcv.repository;

import com.webcv.entity.PasswordResetEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordResetEntity, Long> {
    boolean existsByResetToken(String resetToken);
    Optional<PasswordResetEntity> findByUserIdAndUsedFalseAndExpiredAtAfter(Long userId, Instant now);
    Optional<PasswordResetEntity> findByResetTokenAndUsedFalseAndExpiredAtAfter(String resetToken, Instant now);
}
