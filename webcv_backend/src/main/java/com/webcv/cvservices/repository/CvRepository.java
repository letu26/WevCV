package com.webcv.cvservices.repository;

import com.webcv.cvservices.entity.CvEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CvRepository extends JpaRepository<CvEntity, Integer> {
}
