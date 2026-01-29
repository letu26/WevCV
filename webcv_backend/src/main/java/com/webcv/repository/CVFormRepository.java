package com.webcv.repository;

import com.webcv.entity.CVFormEntity;
import com.webcv.entity.UserEntity;
import com.webcv.enums.FormStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

@Repository
public interface CVFormRepository extends JpaRepository<CVFormEntity, Long> {

    Optional<CVFormEntity> findById(Long id);

    @Query("""
            SELECT f FROM CVFormEntity f
            WHERE (:status IS NULL OR f.status = :status)
              AND (:keyword IS NULL 
                   OR LOWER(f.name) LIKE LOWER(CONCAT('%', :keyword, '%')))
    """)
    Page<CVFormEntity> findAllWithFilter(
            @Param("status") FormStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    boolean existsByNameIgnoreCase(String name);
    boolean existsByCvFormId(Long id);
}
