package com.webcv.repository;

import com.webcv.entity.CvEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CvsRepository extends JpaRepository<CvEntity, Long> {
    boolean existsById(Long id);
    List<CvEntity> findAllByUsers_IdAndDeletedFalse(Long id);
}
